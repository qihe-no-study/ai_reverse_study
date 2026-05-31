"""
qikan.cqvip.com 页面采集 — Python 集成 sdenv
流程: Node.js (sdenv) 生成 Cookie → Python 请求 → 返回结果
"""
import subprocess, sys, os

SCRIPT_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.join(SCRIPT_DIR, "..")
NODE_SCRIPT = os.path.join(ROOT_DIR, "code", "sdenv_rs6.js")
NODE_MODULES = os.path.join(ROOT_DIR, "env", "node_modules")


def get_cookies() -> dict:
    """调用 Node.js sdenv 获取 Cookie，返回解析后的 dict"""
    print("[Python] 调用 sdenv 生成 Cookie...")
    env = os.environ.copy()
    env["NODE_PATH"] = NODE_MODULES

    result = subprocess.run(
        ["node", NODE_SCRIPT],
        capture_output=True, text=True, timeout=60,
        cwd=ROOT_DIR, env=env,
    )
    raw = result.stdout.strip()
    if not raw or "ERROR" in raw:
        raise RuntimeError(f"sdenv 失败: {result.stderr[:300]}")

    # 解析 Cookie 字符串为 dict
    cookie_dict = {}
    for item in raw.split("; "):
        if "=" in item:
            k, v = item.split("=", 1)
            cookie_dict[k] = v

    print(f"[Python] Cookie 解析完成: {len(cookie_dict)} 项, {len(raw)} 字符")
    return cookie_dict


def fetch_page(url: str, cookies: dict) -> str | None:
    """带 Cookie 请求目标 URL，返回 HTML 或 None"""
    import requests

    print(f"[Python] 请求 {url} ...")
    r = requests.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Referer": "https://qikan.cqvip.com/",
        },
        cookies=cookies,
        timeout=30,
    )
    print(f"[Python] 状态: {r.status_code}, 长度: {len(r.text)} 字节")

    if r.status_code == 200 and len(r.text) > 500:
        print(f"[Python] 成功获取真实页面!")
        title = r.text.split("<title>")[1].split("</title>")[0] if "<title>" in r.text else "N/A"
        print(f"  标题: {title}")
        return r.text
    else:
        print(f"[Python] 失败: status={r.status_code}, body_len={len(r.text)}")
        return None


if __name__ == "__main__":
    TARGET = "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=index"
    OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

    os.makedirs(OUT_DIR, exist_ok=True)

    cookies = get_cookies()
    html = fetch_page(TARGET, cookies)

    if html:
        path = os.path.join(OUT_DIR, "journal_guid.html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"[Python] 页面已保存到 {path}")
        sys.exit(0)
    else:
        sys.exit(1)
