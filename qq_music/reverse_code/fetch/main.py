"""
QQ 音乐数据获取脚本
- 歌曲 MP3 下载
- 歌词获取
- 评论数 + 全部评论

依赖: requests
Node.js 用于生成 sign 参数
"""

import json
import subprocess
import time
import base64
import os
import requests

# ========== 配置 ==========
SONG_MID = "0004BoFH1kpYFC"
SONG_ID = 491514351
ALBUM_MID = "0035DC6W4ZpSqf"
UIN = 854594834
GUID = "5274311692"
MUSICKEY = "Q_H_L_63k3NaRKwJb5nFXGEv14zeU3Ns3y5rEnoeTgBsdIJPptEpJAfFa5f3_DxMpb6Wh91QW6r-_0Ol"

COOKIES = {
    "uin": str(UIN),
    "qm_keyst": MUSICKEY,
    "qqmusic_key": MUSICKEY,
    "psrf_qqopenid": "93EBC565433E41E3D6E50F3B8F71F0A4",
    "psrf_qqaccess_token": "82732879A40E347BE2D81345F1060E07",
    "psrf_qqrefresh_token": "D0832428C628CB8B43107002399528F4",
    "tmeLoginType": "2",
    "psrf_musickey_createtime": "1780207672",
    "login_type": "1",
    "euin": "Ne4P7KEPNeoP",
    "psrf_qqunionid": "25B8637202A424F8AFFB199FA46FFA70",
}

HEADERS = {
    "Referer": "https://y.qq.com/",
    "Origin": "https://y.qq.com",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
}

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.join(SCRIPT_DIR, "..")
OUTPUT_DIR = os.path.join(ROOT_DIR, "data")


def hash5381(s: str) -> int:
    h = 5381
    for c in s:
        h += (h << 5) + ord(c)
        h &= 0x7FFFFFFF
    return h

G_TK = hash5381(MUSICKEY)


def get_sign(data_str: str) -> str:
    sign_script = os.path.join(ROOT_DIR, "code", "sign_server.js")
    result = subprocess.run(
        ["node", sign_script, "--sign", data_str],
        capture_output=True, text=True, timeout=10
    )
    if result.returncode != 0:
        raise RuntimeError(f"sign generation failed: {result.stderr}")
    return result.stdout.strip()


def _build_payload(req_data: dict) -> dict:
    comm = {
        "cv": 4747474, "ct": 24, "format": "json",
        "inCharset": "utf-8", "outCharset": "utf-8",
        "notice": 0, "platform": "yqq.json", "needNewCode": 1,
        "uin": UIN, "g_tk_new_20200303": G_TK, "g_tk": G_TK,
    }
    return {"comm": comm, **req_data}


def api_request(req_data: dict, retries=3) -> dict:
    """明文通道: POST musics.fcg (用于歌词/评论等不需要严格鉴权的接口)"""
    payload = _build_payload(req_data)
    data_str = json.dumps(payload, separators=(",", ":"), ensure_ascii=False)
    sign = get_sign(data_str)

    url = f"https://u6.y.qq.com/cgi-bin/musics.fcg?_={int(time.time()*1000)}&sign={sign}"
    headers = {**HEADERS, "Content-Type": "application/x-www-form-urlencoded"}
    for attempt in range(retries):
        try:
            resp = requests.post(url, data=data_str.encode("utf-8"), headers=headers, cookies=COOKIES, timeout=30)
            resp.raise_for_status()
            return resp.json()
        except (requests.ConnectionError, requests.Timeout) as e:
            if attempt < retries - 1:
                wait = (attempt + 1) * 3
                print(f"    [retry] 连接错误，等待 {wait}s 后重试... ({e.__class__.__name__})")
                time.sleep(wait)
            else:
                raise


def get_lyric() -> str:
    """获取歌词（LRC 格式）"""
    print("[*] 获取歌词...")
    result = api_request({
        "req_1": {
            "module": "music.musichallSong.PlayLyricInfo",
            "method": "GetPlayLyricInfo",
            "param": {"songMID": SONG_MID, "songID": SONG_ID}
        }
    })

    if result.get("code") != 0:
        print(f"[!] 歌词请求失败: code={result.get('code')}")
        return ""

    data = result["req_1"]["data"]
    lyric_b64 = data.get("lyric", "")
    if lyric_b64:
        lyric = base64.b64decode(lyric_b64).decode("utf-8")
        lyric_path = os.path.join(OUTPUT_DIR, "lyric.lrc")
        with open(lyric_path, "w", encoding="utf-8") as f:
            f.write(lyric)
        print(f"[+] 歌词已保存: {lyric_path}")
        return lyric
    else:
        print("[!] 未获取到歌词")
        return ""


def get_comments(page_size=25) -> tuple:
    """获取评论总数和所有评论（翻页）"""
    all_comments = []
    total_count = 0

    print("[*] 获取评论...")
    last_seq = ""
    page = 0
    while True:
        page += 1
        result = api_request({
            "req_1": {
                "module": "music.globalComment.CommentRead",
                "method": "GetNewCommentList",
                "param": {
                    "BizType": 1,
                    "BizId": str(SONG_ID),
                    "LastCommentSeqNo": last_seq,
                    "PageSize": page_size,
                }
            }
        })
        if result.get("code") != 0 or result["req_1"].get("code") != 0:
            print(f"[!] 评论第 {page} 页请求失败")
            break

        data = result["req_1"]["data"]
        if page == 1:
            total_count = data.get("TotalCmNum", 0)
            print(f"[+] 评论总数: {total_count}")

        comment_list = data.get("CommentList", {})
        comments = comment_list.get("Comments", [])
        if not comments:
            break

        for c in comments:
            all_comments.append({
                "nick": c.get("Nick", ""),
                "content": c.get("Content", ""),
                "praise_count": c.get("PraiseNum", 0),
                "time": c.get("PubTime", 0),
                "seq_no": c.get("SeqNo", ""),
            })

        has_more = comment_list.get("HasMore", 0)
        if comments:
            last_seq = comments[-1].get("SeqNo", "")

        print(f"    第 {page} 页: {len(comments)} 条, 累计: {len(all_comments)} 条")

        if not has_more or not last_seq:
            break

        time.sleep(1.0)

    print(f"[+] 评论获取完成: {len(all_comments)} 条")
    return total_count, all_comments


def get_song_url() -> str:
    """获取歌曲播放 URL"""
    print("[*] 获取歌曲播放 URL...")

    filename = f"M500{SONG_MID}.mp3"
    result = api_request({
        "req_1": {
            "module": "vkey.GetVkeyServer",
            "method": "CgiGetVkey",
            "param": {
                "guid": GUID,
                "songmid": [SONG_MID],
                "songtype": [0],
                "uin": str(UIN),
                "loginflag": 1,
                "platform": "20",
                "filename": [filename],
            }
        }
    })

    if result.get("code") != 0:
        print(f"[!] CgiGetVkey 请求失败: code={result.get('code')}")
        return ""

    req_data = result.get("req_1", {})
    if req_data.get("code") != 0:
        print(f"[!] CgiGetVkey 业务失败: code={req_data.get('code')}")
        return ""

    data = req_data.get("data", {})
    sip = data.get("sip", [])
    midurlinfo = data.get("midurlinfo", [])

    if midurlinfo:
        info = midurlinfo[0]
        purl = info.get("purl", "")
        fname = info.get("filename", "")
        print(f"    filename: {fname}")

        if purl and sip:
            full_url = sip[0] + purl
            print(f"[+] 歌曲 URL 获取成功")
            return full_url
        else:
            print(f"[!] purl 为空, retcode={data.get('retcode')}, msg={data.get('msg', '')}")

    return ""


def download_song(url: str) -> str:
    """下载歌曲到本地"""
    if not url:
        return ""
    print("[*] 下载歌曲...")
    ext = ".mp3" if ".mp3" in url else ".m4a" if ".m4a" in url else ".mp3"
    filename = f"爱你_高睿{ext}"
    filepath = os.path.join(OUTPUT_DIR, filename)

    resp = requests.get(url, headers={"User-Agent": HEADERS["User-Agent"], "Referer": "https://y.qq.com/"}, stream=True, timeout=60)
    resp.raise_for_status()

    total = int(resp.headers.get("Content-Length", 0))
    downloaded = 0
    with open(filepath, "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192):
            f.write(chunk)
            downloaded += len(chunk)
            if total:
                pct = downloaded / total * 100
                print(f"\r    下载进度: {pct:.1f}% ({downloaded}/{total})", end="", flush=True)
    print()
    print(f"[+] 歌曲已保存: {filepath} ({downloaded} bytes)")
    return filepath


def main():
    print("=" * 60)
    print("QQ 音乐数据获取脚本")
    print(f"歌曲: 爱你 (青春离别版) - 高睿")
    print(f"Song MID: {SONG_MID}")
    print("=" * 60)

    results = {}

    # 1. 歌词
    lyric = get_lyric()
    results["lyric"] = bool(lyric)
    print()

    # 2. 评论
    comment_count, comments = get_comments()
    results["comment_count"] = comment_count
    results["comments_fetched"] = len(comments)
    comments_path = os.path.join(OUTPUT_DIR, "comments.json")
    with open(comments_path, "w", encoding="utf-8") as f:
        json.dump({
            "song_mid": SONG_MID,
            "song_name": "爱你 (青春离别版)",
            "singer": "高睿",
            "total_count": comment_count,
            "fetched_count": len(comments),
            "comments": comments,
        }, f, ensure_ascii=False, indent=2)
    print(f"[+] 评论已保存: {comments_path}")
    print()

    # 4. 歌曲下载
    song_url = get_song_url()
    song_path = download_song(song_url)
    results["song_downloaded"] = bool(song_path)
    print()

    # 汇总
    print("=" * 60)
    print("result:")
    print(f"  lyric: {'OK' if results['lyric'] else 'FAIL'}")
    print(f"  comment_count: {results['comment_count']}")
    print(f"  comments_fetched: {results['comments_fetched']}")
    print(f"  song_download: {'OK ' + song_path if results['song_downloaded'] else 'FAIL (VIP or cookie expired)'}")
    print("=" * 60)


if __name__ == "__main__":
    main()
