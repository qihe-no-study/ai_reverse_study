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
├── README.md / 环境配置.md / requirements.txt
├── qq_music/
│   ├── 逆向流程说明.md
│   ├── reverse_code/                   # 逆向代码
│   └── understand-anything/            # 知识图谱
└── qikan/
    ├── 逆向流程说明.md
    ├── reverse_code/                   # 逆向代码
    │   ├── data/                       # 爬取结果
    │   └── init/                       # 任务规格书
    └── understand-anything/            # 知识图谱
```

## 📋 项目索引

### QQ音乐

| 资源 | 链接 |
|------|------|
| **逆向流程说明** | [qq_music/逆向流程说明.md](qq_music/逆向流程说明.md) |
| 知识图谱 | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qq_music/understand-anything/) |
| 技术报告 | [REPORT.md](qq_music/reverse_code/REPORT.md) |
| 请求链路 | [请求链路.md](qq_music/reverse_code/请求链路.md) |
| 快速参考 | [SKILLS.md](qq_music/reverse_code/SKILLS.md) |
| Sign 实现 | [sign.js](qq_music/reverse_code/code/sign.js) |
| Python 入口 | [main.py](qq_music/reverse_code/fetch/main.py) |

### 维普期刊

| 资源 | 链接 |
|------|------|
| **逆向流程说明** | [qikan/逆向流程说明.md](qikan/逆向流程说明.md) |
| 知识图谱 | [在线查看](https://qihe-no-study.github.io/ai_reverse_study/qikan/understand-anything/) |
| 任务规格书 | [task_cqvip_journal_guid.md](qikan/reverse_code/prompt/task_cqvip_journal_guid.md) |
| Python 入口 | [fetch_page.py](qikan/reverse_code/fetch/fetch_page.py) |
| sdenv 核心 | [sdenv_rs6.js](qikan/reverse_code/code/sdenv_rs6.js) |
| 爬取结果 | [journal_guid.html](qikan/reverse_code/data/journal_guid.html) |

## 📦 环境要求

| 依赖 | 版本 | 适用项目 |
|------|------|---------|
| Python | 3.x | QQ音乐 / 维普期刊 |
| Node.js | v18+ / v20.19.5+ | QQ音乐 / 维普期刊 |
| sdenv | latest | 维普期刊（需 VS2022 Build Tools） |
| pnpm | latest | 维普期刊 |

## ⚡ 快速开始

```bash
git clone git@github.com:qihe-no-study/ai_reverse_study.git
cd ai_reverse_study

# QQ音乐
cd qq_music/reverse_code && pip install requests && python main.py

# 维普期刊
cd qikan/reverse_code cd qikan/reverse_code/fetch && pnpm install ../ && python fetch_page.pycd qikan/reverse_code/fetch && pnpm install ../ && python fetch_page.py pnpm install cd qikan/reverse_code/fetch && pnpm install ../ && python fetch_page.pycd qikan/reverse_code/fetch && pnpm install ../ && python fetch_page.py cd fetch cd qikan/reverse_code/fetch && pnpm install ../ && python fetch_page.pycd qikan/reverse_code/fetch && pnpm install ../ && python fetch_page.py python fetch_page.py
```

## 🛠️ 相关工具

| 工具 | 链接 | 说明 |
|------|------|------|
| ai_reverse_understand_skill | [GitHub](https://github.com/qihe-no-study/ai_reverse_understand_skill) | 知识图谱自动生成 Skill |
| Understand-Anything | [GitHub](https://github.com/Lum1104/Understand-Anything) | 知识图谱可视化框架 |
| darwin-skill | [GitHub](https://github.com/alchaincyf/darwin-skill) | Skill 自动优化系统 |

## ⚠️ 声明

本项目仅用于学习和研究目的，请勿用于商业用途或侵犯版权。使用本代码产生的任何后果由使用者自行承担。
