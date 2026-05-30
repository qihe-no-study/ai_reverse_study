# QQ音乐逆向工程 · 知识图谱

QQ音乐 Web 端 (y.qq.com) API 签名逆向分析项目，包含完整的 JSVMP 签名破解、AES-GCM 加密通道实现、歌曲/歌词/评论数据获取，以及交互式知识图谱可视化。

## 📊 交互式知识图谱

| 页面 | 链接 | 说明 |
|------|------|------|
| **知识图谱可视化** | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qq_music/understand-anything/) | 30 节点 · 25 关系 · 7 分层 · 6 导览步骤 |
| **GitHub 仓库** | [qihe-no-study/ai_reverse_study](https://github.com/qihe-no-study/ai_reverse_study) | 源代码与文档 |

图谱功能：节点拖拽 / 缩放 / 搜索高亮 / 点击详情 / 分层浏览 / 流程导览

## 🗂️ 项目结构

```
ai_reverse_study/
├── README.md
└── qq_music/
    ├── code/                          # 逆向工程代码
    │   ├── main.py                    # Python 调度脚本（API 请求入口）
    │   ├── sign.js                    # JSVMP 签名模块（含环境补丁）
    │   ├── sign_server.js             # Node.js 签名 CLI 桥接器
    │   ├── crypto.js                  # AES-GCM 加密通道实现（备用）
    │   ├── jsvmp2_raw.js              # 第二段 JSVMP 字节码
    │   ├── 请求链路.md                 # DOMTRACE 请求链路分析
    │   ├── REPORT.md                  # 逆向工程完整技术报告
    │   └── SKILLS.md                  # 快速参考手册
    └── understand-anything/           # 知识图谱可视化
        ├── index.html                 # 交互式知识图谱页面
        └── vis-network.min.js         # 图渲染引擎（零外部依赖）
```

## 🎯 目标

| 项目 | 内容 |
|------|------|
| 目标页面 | `https://y.qq.com/n/ryqq_v2/songDetail/0004BoFH1kpYFC` |
| 歌曲 | 爱你 (青春离别版) - 高睿 |
| Song MID | 0004BoFH1kpYFC |
| Song ID | 491514351 |
| 完成时间 | 2026-05-06 |

## ✅ 完成功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 歌词获取 | ✅ | LRC 格式，base64 解码 |
| 评论总数 | ✅ | 1243 条 |
| 评论采集 | ✅ | 595 条（游标翻页，24 页） |
| 歌曲 MP3 | ✅ | M500 品质，3.59 MB |
| Sign 签名 | ✅ | JSVMP MD5 变种，Python ↔ Node.js 跨进程 |
| AES-GCM 通道 | ✅ | 加密/解密完整实现（备用） |

## 🏗️ 架构

```
Python (main.py)  ──调用──>  Node.js (sign_server.js)  ──引用──>  sign.js (JSVMP)
     │                              │
     │ subprocess                   │ getSecuritySign(明文body)
     │                              │
     └── requests.post ──> u6.y.qq.com/cgi-bin/musics.fcg?_={ts}&sign={sign}
```

## 🔑 核心 API

| 模块.方法 | 功能 | 状态 |
|-----------|------|------|
| `vkey.GetVkeyServer.CgiGetVkey` | 歌曲播放 URL | ✅ 稳定 |
| `music.musichallSong.PlayLyricInfo.GetPlayLyricInfo` | 歌词（base64 LRC） | ✅ 稳定 |
| `music.globalComment.CommentRead.GetNewCommentList` | 评论列表翻页 | ✅ 稳定 |
| `QQConnectLogin.LoginServer.QQLogin` | Cookie 无浏览器刷新 | ✅ 稳定 |
| `music.vkey.GetEVkey.GetUrl` | 歌曲 URL（新版） | ❌ 持续 104009 |

**统一入口：** `POST https://u6.y.qq.com/cgi-bin/musics.fcg`

## 🔐 Sign 签名机制

| 项目 | 内容 |
|------|------|
| 保护方式 | JSVMP（JS 虚拟机保护）字节码解释器 |
| 核心算法 | `__sign_hash_20200305` — MD5 变种（SHA-1 初始常量） |
| 输入 | 明文 JSON body 字符串 |
| 输出 | `zzb` + 40 字符 hex/alpha 混合哈希 |
| 位置 | vendor.chunk.js offset:38639 |
| 环境补丁 | navigator.userAgent / location.host / window 自引用 |

## 📦 环境要求

| 依赖 | 版本 | 说明 |
|------|------|------|
| Python | 3.x | requests 库 |
| Node.js | v18+ | JSVMP 虚拟机运行环境 |
| Cookie | 有效 musickey | 每 3 天过期，可通过 token 刷新 |

## ⚡ 快速开始

```bash
# 1. 克隆仓库
git clone git@github.com:qihe-no-study/ai_reverse_study.git
cd ai_reverse_study/qq_music/code

# 2. 安装依赖
pip install requests

# 3. 更新 main.py 中的 cookie 配置
# 修改 MUSICKEY 和 COOKIES 变量

# 4. 运行
python main.py
```

## 🔗 相关链接

| 资源 | 链接 |
|------|------|
| 知识图谱 | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qq_music/understand-anything/) |
| 技术报告 | [REPORT.md](qq_music/code/REPORT.md) |
| 请求链路 | [请求链路.md](qq_music/code/请求链路.md) |
| 快速参考 | [SKILLS.md](qq_music/code/SKILLS.md) |
| Sign 实现 | [sign.js](qq_music/code/sign.js) |
| Python 入口 | [main.py](qq_music/code/main.py) |
| 可视化工具 | [Understand-Anything](https://github.com/Lum1104/Understand-Anything) |
| QQ音乐官网 | [y.qq.com](https://y.qq.com/) |

## ⚠️ 声明

本项目仅用于学习和研究目的，请勿用于商业用途或侵犯版权。使用本代码产生的任何后果由使用者自行承担。

## 📊 复杂度评级

**L3: 多层壳 + 环境依赖**

- JSVMP 字节码解释器保护 sign 算法和 cgi 加解密
- 浏览器环境依赖（navigator, location, window）
- AES-GCM + JSVMP 自定义密码双重加密通道
- 双版本 vkey API 的鉴权差异
- QQ OAuth2 token 刷新机制
