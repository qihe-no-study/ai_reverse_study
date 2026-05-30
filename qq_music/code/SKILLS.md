# QQ Music API Reverse Engineering

## Skill: qq-music-api

### 适用场景

逆向 QQ 音乐 Web 端 API（y.qq.com），获取歌曲音频、歌词、评论等数据。

### 技术栈

- **Sign 生成**: Node.js (JSVMP 字节码解释器)
- **请求调度**: Python + requests
- **加密通道**: AES-128-GCM + JSVMP cgiDecrypt（备选，已实现）

### 快速开始

```bash
cd qq_music/job
pip install requests
python main.py
```

前置条件：
1. Node.js v18+
2. 有效的 QQ 音乐 cookie（从浏览器 DevTools 导出，或通过 token 刷新获取）
3. 更新 `main.py` 中的 MUSICKEY 和 COOKIES

### API 入口

```
POST https://u6.y.qq.com/cgi-bin/musics.fcg?_={timestamp}&sign={sign}
```

### Sign 生成

```javascript
const { getSecuritySign } = require('./sign.js');
const sign = getSecuritySign(jsonBodyString);
// 返回: "zzb" + 40字符哈希
```

sign 算法是 JSVMP 保护的 MD5 变种，输入为**明文 JSON body**（未加密前的字符串）。

### Cookie 刷新（无需浏览器登录）

musickey 每 3 天过期（`keyExpiresIn: 259200`），但可以用 access_token + refresh_token 自动刷新：

```python
payload = {
    "comm": {"g_tk": 5381, "platform": "yqq", "ct": 24, "cv": 0},
    "req": {
        "module": "QQConnectLogin.LoginServer",
        "method": "QQLogin",
        "param": {
            "openid": "<psrf_qqopenid>",
            "access_token": "<psrf_qqaccess_token>",
            "refresh_token": "<psrf_qqrefresh_token>",
            "musicid": <uin>
        }
    }
}
# POST to https://u.y.qq.com/cgi-bin/musicu.fcg
# 返回新的 musickey + musickeyCreateTime
```

access_token 有效期约 60 天，在此期间可以无限次刷新 musickey。

### g_tk 计算

```python
def hash5381(skey):
    h = 5381
    for c in skey:
        h += (h << 5) + ord(c)
    return h & 0x7FFFFFFF

g_tk = hash5381(qqmusic_key_value)
```

**更换 musickey 后必须重新计算 g_tk。**

### 关键参数

| 参数 | 获取方式 |
|---|---|
| `song_mid` | URL 路径 `/songDetail/{mid}` |
| `song_id` | SSR 数据 `__INITIAL_DATA__.detail.id` |
| `guid` | cookie `pgv_pvid` 或固定值 |
| `g_tk` | `hash5381(qqmusic_key)` |

### 已知 API 模块

| 模块.方法 | 功能 | 状态 |
|---|---|---|
| `vkey.GetVkeyServer.CgiGetVkey` | 歌曲播放 URL | 稳定，需要 filename 参数 |
| `music.musichallSong.PlayLyricInfo.GetPlayLyricInfo` | 歌词（base64 LRC） | 稳定 |
| `music.globalComment.CommentRead.GetNewCommentList` | 评论列表翻页 | 稳定 |
| `music.musichallAlbum.AlbumInfoServer.GetAlbumDetail` | 专辑详情 | 稳定 |
| `music.vkey.GetEVkey.GetUrl` | 歌曲播放 URL（新版） | **不可用**，持续返回 104009 |
| `QQConnectLogin.LoginServer.QQLogin` | Token 刷新 | 用 access_token 换新 musickey |

### 歌曲品质与 filename 格式

`CgiGetVkey` 需要 `filename` 参数，格式：`{前缀}{songmid}.{ext}`

| 前缀 | 品质 | 扩展名 | 要求 |
|---|---|---|---|
| `C400` | M4A 128k | .m4a | 免费 |
| `M500` | MP3 128k | .mp3 | 免费 |
| `M800` | MP3 320k | .mp3 | 绿钻 VIP |
| `F000` | FLAC 无损 | .flac | 超级会员 |

### 常见错误

| 错误码 | 含义 | 解法 |
|---|---|---|
| `104009 invalidq` | vkey 鉴权失败 | 使用 `CgiGetVkey` 而非 `GetEVkey`；或刷新 musickey |
| `fnameHitCache_404` | 音质不可用 | 降级音质（如 M800 → M500） |
| `ConnectionResetError 10054` | 请求频率过高 | 增加翻页间隔至 1 秒以上 |

### 环境补丁要点

JSVMP 会检测以下全局属性：
- `navigator.userAgent` → 必须是 Chrome UA
- `location.host` → 必须是 `y.qq.com`
- `window` → 必须自引用

Node.js v24+ 的全局 `navigator` 会干扰，需用独立对象作用域。

### AES-GCM 加密通道（已实现，备用）

浏览器使用 `encoding=ag-1` 参数启用加密：
- 算法: AES-128-GCM
- 密钥: `bd305f10d0ff74b6ef54dab835b5e1cf`
- 请求: 明文 JSON → AES-GCM encrypt → base64 → POST body
- **响应解密不是 AES-GCM**，而是 JSVMP 自定义同步密码（`__cgiDecrypt`）
- 实现文件: `crypto.js` + `jsvmp2_raw.js`

当前使用明文通道 + `CgiGetVkey` 即可完成所有功能。

### 扩展

换歌曲时修改：
```python
SONG_MID = "新的songMid"
SONG_ID = 新的songId  # 从页面SSR数据获取
```

songMid 在 URL 路径中，songId 可以从页面 SSR 数据 `window.__INITIAL_DATA__` 中提取。
