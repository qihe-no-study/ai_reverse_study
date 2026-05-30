# AI Reverse Study — Web 反爬逆向工程案例集

Web API 签名逆向分析项目合集，包含 JSVMP 签名破解、RS6 瑞数反爬、AES-GCM 加密通道实现，以及交互式知识图谱可视化。

## 📊 交互式知识图谱

| 项目 | 图谱链接 | 节点 | 说明 |
|------|---------|------|------|
| **QQ音乐** | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qq_music/understand-anything/) | 30 节点 · 25 关系 | JSVMP签名 + AES-GCM + API对接 |
| **维普期刊** | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qikan/understand-anything/) | 14 节点 · 15 关系 | RS6瑞数 + sdenv + 412挑战 |

图谱功能：节点拖拽 / 缩放 / 搜索高亮 / 点击详情 / 分层浏览 / 流程导览

## 🗂️ 项目结构

```
ai_reverse_study/
├── README.md
├── qq_music/                           # QQ音乐逆向
│   ├── code/                           # 核心代码
│   │   ├── main.py                     # Python 调度脚本
│   │   ├── sign.js                     # JSVMP 签名模块
│   │   ├── sign_server.js              # Node.js CLI 桥接器
│   │   ├── crypto.js                   # AES-GCM 加密通道
│   │   ├── jsvmp2_raw.js               # 第二段 JSVMP 字节码
│   │   ├── REPORT.md                   # 技术报告
│   │   ├── SKILLS.md                   # 快速参考
│   │   └── 请求链路.md                  # 请求链路分析
│   └── understand-anything/            # 知识图谱
│       ├── index.html
│       ├── knowledge-graph.json
│       └── vis-network.min.js
└── qikan/                              # 维普期刊逆向
    ├── code/
    │   ├── fetch_page.py               # Python 调度
    │   ├── sdenv_rs6.js                # sdenv RS6 核心
    │   └── web_config/                 # 配置与证据
    ├── data/                           # 爬取结果
    │   └── journal_guid.html
    ├── init/                           # 任务规格书
    │   └── task_cqvip_journal_guid.md
    └── understand-anything/            # 知识图谱
        ├── index.html
        ├── knowledge-graph.json
        └── vis-network.min.js
```

---

## 🎵 QQ音乐 — JSVMP 签名破解

| 项目 | 内容 |
|------|------|
| 目标页面 | `https://y.qq.com/n/ryqq_v2/songDetail/0004BoFH1kpYFC` |
| 防护机制 | JSVMP 虚拟机保护（MD5 变种签名）+ AES-GCM 加密通道 |
| 复杂度 | L3: 多层壳 + 环境依赖 |
| 关键发现 | GetEVkey 持续 104009 → 切换 CgiGetVkey |

### 完成功能

| 功能 | 状态 | 说明 |
|------|------|------|
| 歌词获取 | ✅ | LRC 格式，base64 解码 |
| 评论采集 | ✅ | 595 条，游标翻页 |
| 歌曲下载 | ✅ | M500 品质 MP3 |
| Sign 签名 | ✅ | JSVMP MD5 变种，子进程通信 |

### 架构

```
Python(main.py) → subprocess → Node.js(sign_server.js) → sign.js(JSVMP) → sign
                                                                    ↓
Python ← requests ← musics.fcg?sign={sign} ← POST ← 明文JSON body
```

### 🔗 QQ音乐相关链接

| 资源 | 链接 |
|------|------|
| 知识图谱 | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qq_music/understand-anything/) |
| 技术报告 | [REPORT.md](qq_music/code/REPORT.md) |
| 请求链路 | [请求链路.md](qq_music/code/请求链路.md) |
| 快速参考 | [SKILLS.md](qq_music/code/SKILLS.md) |
| Sign 实现 | [sign.js](qq_music/code/sign.js) |
| Python 入口 | [main.py](qq_music/code/main.py) |

---

## 📖 维普期刊 — RS6 瑞数反爬

| 项目 | 内容 |
|------|------|
| 目标页面 | `https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=index` |
| 防护机制 | 瑞数 RS6（412 JS 挑战 + $_ts VM + S+T Cookie 对） |
| 复杂度 | L3: 虚拟机保护 + 环境依赖 |
| 关键发现 | sdenv 自动处理完整 412 → Cookie → 200 流程 |

### 完成功能

| 功能 | 状态 | 说明 |
|------|------|------|
| Cookie 生成 | ✅ | sdenv 环境伪装 + VM 字节码执行 |
| 真实页面获取 | ✅ | HTTP 200 + 完整 HTML |
| 无浏览器自动化 | ✅ | jsdom + requests，符合红线要求 |

### 架构

```
Python(fetch_page.py) → subprocess → Node.js(sdenv_rs6.js) → sdenv
                                                                  ↓
                                                         jsdomFromUrl()
                                                                  ↓
                                                         412 挑战 → VM 执行
                                                                  ↓
Python ← stdout Cookie ← S+T Cookie对 ← cookieJar.getCookieStringSync()
   ↓
requests.get(Cookie) → HTTP 200 → data/journal_guid.html
```

### 🔗 维普期刊相关链接

| 资源 | 链接 |
|------|------|
| 知识图谱 | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qikan/understand-anything/) |
| 任务规格书 | [task_cqvip_journal_guid.md](qikan/init/task_cqvip_journal_guid.md) |
| Python 入口 | [fetch_page.py](qikan/code/fetch_page.py) |
| sdenv 核心 | [sdenv_rs6.js](qikan/code/sdenv_rs6.js) |
| 412 挑战样本 | [412_challenge.html](qikan/code/web_config/412_challenge.html) |
| 爬取结果 | [journal_guid.html](qikan/data/journal_guid.html) |

---

## 📦 环境要求

| 依赖 | 版本 | 说明 |
|------|------|------|
| Python | 3.x | QQ音乐: requests / 维普: requests |
| Node.js | v18+ (QQ音乐) / v20.19.5+ (维普) | JSVMP / sdenv |
| sdenv | latest | 维普项目专用，需 VS2022 Build Tools |
| pnpm | latest | 维普项目包管理 |

## ⚡ 快速开始

```bash
# 克隆仓库
git clone git@github.com:qihe-no-study/ai_reverse_study.git
cd ai_reverse_study

# QQ音乐
cd qq_music/code
pip install requests
python main.py

# 维普期刊
cd qikan/code
pnpm install
python fetch_page.py
```

## 🛠️ 相关工具

| 工具 | 链接 | 说明 |
|------|------|------|
| ai_reverse_understand_skill | [GitHub](https://github.com/qihe-no-study/ai_reverse_understand_skill) | 交互式知识图谱自动生成 Skill |
| Understand-Anything | [GitHub](https://github.com/Lum1104/Understand-Anything) | 知识图谱可视化框架 |
| darwin-skill | [GitHub](https://github.com/alchaincyf/darwin-skill) | Skill 自动优化系统 |

## ⚠️ 声明

本项目仅用于学习和研究目的，请勿用于商业用途或侵犯版权。使用本代码产生的任何后果由使用者自行承担。
