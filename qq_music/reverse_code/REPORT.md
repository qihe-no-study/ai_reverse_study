# QQ 音乐逆向工程报告

## 项目概述

| 项目 | 内容 |
|---|---|
| 目标页面 | https://y.qq.com/n/ryqq_v2/songDetail/0004BoFH1kpYFC |
| 歌曲 | 爱你 (青春离别版) - 高睿 |
| Song MID | 0004BoFH1kpYFC |
| Song ID | 491514351 |
| 完成时间 | 2026-05-06 |

## 完成情况

| 功能 | 状态 | 说明 |
|---|---|---|
| 歌词获取 | OK | LRC 格式，base64 解码，保存为 lyric.lrc |
| 评论总数 | OK | 1243 条 |
| 全部评论获取 | OK | 595 条（服务端实际返回量），24 页翻页 |
| 歌曲 MP3 下载 | OK | M500 品质 MP3，3.59 MB，保存为 爱你_高睿.mp3 |

## 架构

```
Python (main.py)  ──调用──>  Node.js (sign_server.js)  ──引用──>  sign.js (JSVMP)
     │                              │
     │ subprocess                   │ getSecuritySign(明文body)
     │                              │
     └── requests.post ──> u6.y.qq.com/cgi-bin/musics.fcg?_={ts}&sign={sign}
```

### 文件清单

| 文件 | 用途 |
|---|---|
| `main.py` | Python 调度脚本，负责所有 API 请求、数据解析、文件保存 |
| `sign.js` | 从 vendor.chunk.js 提取的 JSVMP 签名模块（含环境补丁） |
| `sign_server.js` | Node.js CLI 包装器，接收明文 JSON 返回 sign 值 |
| `crypto.js` | JSVMP cgiEncrypt/cgiDecrypt 模块（加密通道用，备选） |
| `jsvmp2_raw.js` | 第二段 JSVMP 字节码（crypto.js 的依赖） |
| `lyric.lrc` | 输出：歌词文件 |
| `comments.json` | 输出：评论数据 |
| `爱你_高睿.mp3` | 输出：歌曲文件 |

## 核心 API

统一接口：`POST https://u6.y.qq.com/cgi-bin/musics.fcg`

Query 参数：
- `_` = 毫秒级时间戳
- `sign` = JSVMP 生成的签名（输入为明文 JSON body）

Body：紧凑 JSON（`separators=(",",":")`)，UTF-8 编码

### 公共参数 (comm)

```json
{
  "cv": 4747474,
  "ct": 24,
  "format": "json",
  "inCharset": "utf-8",
  "outCharset": "utf-8",
  "notice": 0,
  "platform": "yqq.json",
  "needNewCode": 1,
  "uin": 854594834,
  "g_tk_new_20200303": "<hash5381(qqmusic_key)>",
  "g_tk": "<hash5381(qqmusic_key)>"
}
```

### 业务接口

| 模块 | 方法 | 用途 |
|---|---|---|
| `music.musichallSong.PlayLyricInfo` | `GetPlayLyricInfo` | 歌词（base64 LRC） |
| `music.globalComment.CommentRead` | `GetNewCommentList` | 评论列表（翻页） |
| `vkey.GetVkeyServer` | `CgiGetVkey` | 歌曲播放 URL |

### 歌曲下载关键点

GetVkey 接口有两个版本，行为完全不同：

| 模块.方法 | 状态 | 说明 |
|---|---|---|
| `music.vkey.GetEVkey.GetUrl` | 104009 invalidq | 新版接口，即使 cookie 有效也持续返回鉴权失败 |
| `vkey.GetVkeyServer.CgiGetVkey` | 正常 | 经典接口，传入 `filename` 参数，稳定返回 vkey |

`CgiGetVkey` 需要在 param 中指定 `filename` 数组，格式为 `{品质前缀}{songmid}.{ext}`：

| 前缀 | 品质 | 扩展名 | 状态 |
|---|---|---|---|
| `C400` | M4A 128kbps | .m4a | 可用 |
| `M500` | MP3 128kbps | .mp3 | 可用 |
| `M800` | MP3 320kbps | .mp3 | 需要 VIP |
| `F000` | FLAC 无损 | .flac | 需要 VIP |

## Sign 生成机制

### 算法

JSVMP（JS 虚拟机保护）字节码解释器，内部核心是：
- `__sign_hash_20200305`：标准 MD5 实现
- 输入：明文 JSON body 字符串
- 输出：`zzb` + 40 字符 hex/alpha 混合哈希（Node.js 环境前缀为 `zzb`，浏览器为 `zzc`，服务端均接受）

### 环境补丁

JSVMP 运行时访问以下浏览器 API：

| 属性 | 补丁值 |
|---|---|
| `window` | 指向 `n` 自身（循环引用） |
| `navigator.userAgent` | Chrome/147 UA 字符串 |
| `location.host` | `"y.qq.com"` |
| `location.hostname` | `"y.qq.com"` |
| `location.href` | `"https://y.qq.com/"` |
| `RegExp` | 原生 RegExp |

关键：Node.js v24+ 内置了全局 `navigator` 对象，且不可覆盖。因此 sign.js 使用独立的 `n` 对象替代 `globalThis`。

## AES-GCM 加密通道（备选）

浏览器实际使用 `encoding=ag-1` 加密通道，已完整实现但当前方案不需要：

| 项目 | 内容 |
|---|---|
| 算法 | AES-128-GCM |
| 密钥 | `bd305f10d0ff74b6ef54dab835b5e1cf` (16字节) |
| 请求加密 | JSON → AES-GCM encrypt → base64 → POST body |
| 响应解密 | **不是** AES-GCM，而是 JSVMP 自定义同步密码（`__cgiDecrypt`） |
| 实现 | crypto.js + jsvmp2_raw.js |

## 注意事项

### 1. g_tk 必须和 musickey 对应

```python
def hash5381(skey):
    h = 5381
    for c in skey:
        h += (h << 5) + ord(c)
    return h & 0x7FFFFFFF
```

输入为 cookie 中的 `qqmusic_key` 值，**更换 cookie 后必须重新计算**。

### 2. Cookie 有效期与刷新

- `keyExpiresIn: 259200`（3天），musickey 每 3 天过期
- `psrf_access_token_expiresAt` 约 60 天过期
- 可通过 `QQConnectLogin.LoginServer.QQLogin` 接口用 `access_token` + `refresh_token` + `openid` 换新 musickey，无需重新登录浏览器
- 请求示例：
  ```json
  {
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
  ```

### 3. 评论翻页

- `GetNewCommentList` 使用 `LastCommentSeqNo` 游标翻页
- 翻页间隔 >= 1 秒，避免 ConnectionResetError
- 服务端实际返回 595 条（总数 1243）

### 4. 请求频率

- 评论翻页：1 秒/页
- 重试机制：3 次，间隔 3s / 6s / 9s
- 过快请求会导致 TCP 连接被服务端重置

### 5. Node.js 版本兼容性

- Node.js v24+ 有全局 `navigator` 对象，会干扰 JSVMP
- sign.js 使用独立作用域的 `n` 对象规避此问题
- 兼容 Node.js v18+

### 6. API 模块选择

**必须使用 `vkey.GetVkeyServer.CgiGetVkey`，不要用 `music.vkey.GetEVkey.GetUrl`。** 后者即使 cookie 完全有效也会返回 104009。浏览器使用的是后者但走加密通道，未加密环境下只有前者可靠。

## 复杂度评估

**L3: 多层壳 + 环境依赖**

- JSVMP 字节码解释器保护 sign 算法和 cgi 加解密
- 浏览器环境依赖（navigator, location, window）
- AES-GCM + JSVMP 自定义密码双重加密通道
- 双版本 vkey API 的鉴权差异
- QQ OAuth2 token 刷新机制
