# AI Reverse Study — Web 反爬逆向工程案例集

JSVMP 签名破解、RS6 瑞数反爬、AES-GCM 加密通道实现，含交互式知识图谱可视化。

## 📊 知识图谱

| 项目 | 在线查看 | 节点 |
|------|---------|------|
| QQ音乐 | [图谱](https://qihe-no-study.github.io/ai_reverse_study/qq_music/understand-anything/) | 30 节点 · 25 关系 |
| 维普期刊 | [图谱](https://qihe-no-study.github.io/ai_reverse_study/qikan/understand-anything/) | 14 节点 · 15 关系 |

## 🗂️ 结构

```
ai_reverse_study/
├── README.md
├── qq_music/
│   ├── 逆向文档.md                   # 完整逆向全链路
│   ├── reverse_code/                 # 逆向代码
│   │   ├── env/                      # 环境配置
│   │   ├── fetch/                    # 入口脚本
│   │   ├── code/                     # 辅助代码
│   │   ├── prompt/                   # 任务文档
│   │   └── data/                     # 产出 (gitignore)
│   └── understand-anything/          # 知识图谱
└── qikan/                            # 同上结构
```

## 📋 QQ音乐

| 资源 | 链接 |
|------|------|
| 逆向文档 | [逆向文档.md](qq_music/逆向文档.md) |
| 环境配置 | [env/环境配置.md](qq_music/reverse_code/env/环境配置.md) |
| Python 入口 | [fetch/main.py](qq_music/reverse_code/fetch/main.py) |
| Sign 签名 | [code/sign.js](qq_music/reverse_code/code/sign.js) |

**快速开始：**
```bash
cd qq_music/reverse_code/fetch
pip install requests && python main.py
```

## 📋 维普期刊

| 资源 | 链接 |
|------|------|
| 逆向文档 | [逆向文档.md](qikan/逆向文档.md) |
| 环境配置 | [env/环境配置.md](qikan/reverse_code/env/环境配置.md) |
| Python 入口 | [fetch/fetch_page.py](qikan/reverse_code/fetch/fetch_page.py) |
| sdenv 核心 | [code/sdenv_rs6.js](qikan/reverse_code/code/sdenv_rs6.js) |

**快速开始：**
```bash
cd qikan/reverse_code/env && pnpm install && cd ../fetch
fnm use 24 && python fetch_page.py
```

## 🛠️ 相关工具

| 工具 | 链接 |
|------|------|
| ai_reverse_understand_skill | [GitHub](https://github.com/qihe-no-study/ai_reverse_understand_skill) |
| Understand-Anything | [GitHub](https://github.com/Lum1104/Understand-Anything) |
| darwin-skill | [GitHub](https://github.com/alchaincyf/darwin-skill) |

## ⚠️ 声明

仅用于学习研究，请勿商业用途或侵犯版权。
