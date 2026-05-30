"""
qikan.cqvip.com 页面采集 — Python 集成 sdenv
流程: Node.js (sdenv) 生成 Cookie → Python 请求 → 保存结果
"""
import subprocess, sys, os, json

NODE_SCRIPT = os.path.join(os.path.dirname(__file__), "sdenv_rs6.js")
TARGET = "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=index"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

def get_cookies():
    """调用 Node.js sdenv 获取 Cookie"""
    print("[Python] 调用 sdenv 生成 Cookie...")
    result = subprocess.run(
        ["node", NODE_SCRIPT],
        capture_output=True, text=True, timeout=60, cwd=os.path.dirname(__file__),
    )
    cookies = result.stdout.strip()
    if not cookies or "ERROR" in cookies:
        raise RuntimeError(f"sdenv 失败: {result.stderr[:300]}")
    print(f"[Python] Cookie 长度: {len(cookies)}")
    return cookies


def fetch_page(cookies):
    """用 Cookie 请求目标页面"""
    import requests

    cookie_dict = {}
    for item in cookies.split("; "):
        if "=" in item:
            k, v = item.split("=", 1)
            cookie_dict[k] = v

    print(f"[Python] 请求 {TARGET} ...")
    r = requests.get(
        TARGET,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Referer": "https://qikan.cqvip.com/",
        },
        cookies=cookie_dict,
        timeout=30,
    )
    print(f"[Python] 状态: {r.status_code}, 长度: {len(r.text)} 字节")

    if r.status_code == 200 and len(r.text) > 500:
        print(f"[Python] 成功获取真实页面!")
        print(f"  标题: {r.text.split('<title>')[1].split('</title>')[0] if '<title>' in r.text else 'N/A'}")
        return r.text
    else:
        print(f"[Python] 失败: status={r.status_code}, body_len={len(r.text)}")
        return None


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # 获取 Cookie
    cookies = get_cookies()

    # 保存 Cookie
    with open(os.path.join(os.path.dirname(__file__), "web_config", "cookies.txt"), "w") as f:
        f.write(cookies)
    print("[Python] Cookie 已保存到 web_config/cookies.txt")

    # 请求页面
    html = fetch_page(cookies)
    if html:
        path = os.path.join(OUT_DIR, "journal_guid.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"[Python] 页面已保存到 {path}")
        return True
    return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
