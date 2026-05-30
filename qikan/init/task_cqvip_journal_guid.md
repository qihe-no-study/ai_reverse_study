# 维普期刊 JournalGuid — 瑞数（RS）反爬逆向任务

## 1. 激活技能（闸门步骤 — 不可跳过）

> ⚠️ **在读取后续任何章节或执行任何分析动作之前，必须先完成此步骤。**
> **跳过此步 → 后续所有产出无效。**

### 1.1 必须执行的操作

第一步，调用 Skill：

```
Skill: hello_js_reverse_skill
Args: task_cqvip_journal_guid
```

此操作会加载以下约束框架：
- 硬约束 Checklist（CHECK-1 MCP 环境自检 / CHECK-2 经验库速查 / CHECK-3 方案意图声明）
- 四条红线（禁止跳过 Checklist / 禁止跳过经验库 / 禁止 Playwright 过挑战 / 禁止硬编码 Cookie）
- Phase 0-5 标准分析流程
- 经验法则 22 条

### 1.2 完成标志

Skill 激活成功后，AI 必须先在对话中原样复述 **CHECK-1/2/3** 三项并逐项输出执行结果，然后才能进入 Phase 0。

### 1.3 为什么这是闸门

| 场景 | 后果 |
|------|------|
| 跳过 Skill 直接 `launch_browser` 或 `navigate` | 违反红线 1，分析无效 |
| 跳过 CHECK-2 经验库速查 | 可能对已有案例（如瑞数 RS6 sdenv）从零分析，浪费时间 |
| CHECK-3 方案意图不明确 | 可能滑坡到浏览器方案，违反红线 3-4 |

**CHECK-2 已知命中**：`qikan.cqvip.com` → 瑞数 RS6 → 案例 `jsvmp-ruishu6-cookie-412-sdenv.md` → 方案 sdenv 纯 Node.js。

---

## 2. 目标
请求 `https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=index`，获取真实期刊导航页面 HTML 数据。

## 3. 当前防护识别

| 项目 | 详情 |
|------|------|
| **防护产品** | **瑞数 RS6（RuiShu Version 6）** |
| **识别依据** | `$_ts` 全局对象 + `$_ts.nsd` + `$_ts.cd` 混淆载荷 + `r='m'` 属性标记 |
| **服务器** | Tengine/3.1.0 + cqvip lib cache server |
| **状态码** | `412 Precondition Failed` — 首次请求返回 JS 挑战页 |
| **Set-Cookie** | `6HZbKHDjIEcgS=60t_...` (动态 cookie 名/值，每次变化，HttpOnly，10 年过期) |
| **Meta 签名** | `<meta id="FbkwzLN5XOx0" content="..." r='m'>` — 混淆后的签名载荷 |
| **JS 挑战** | `<script r='m'>$_ts=window['$_ts'];...$_ts.nsd=52203;$_ts.cd="qxrErrAl..."</script>` — 混淆后的挑战数据 |
| **TLS 指纹** | curl-cffi (Chrome120 impersonate) 同样返回 412，TLS 指纹**不是**主因 |

### 请求对比
```
requests.get() → 412 (3KB JS 挑战页)
curl-cffi chrome120 → 412 (3KB JS 挑战页)
浏览器正常访问 → 200 (真实页面)
```

### 攻防流程推断
```
首次请求 → 412 + $_ts JS 挑战 + Set-Cookie(初始)
浏览器执行 $_ts JS → 从 meta/nsd/cd 提取数据 → 生成合法 Cookie 值
二次请求(带合法Cookie) → 200 真实页面
```

## 4. 分析路径

### ✅ 已验证方案：sdenv 纯 Node.js（路径 B → 环境伪装）

RS6 的 VM 代码与环境深度绑定，路径 A 算法还原不可行。实际验证通过的方案：

1. Node.js 项目安装 `sdenv`（需 Node >= 20.19.5 + VS Build Tools C++ 编译）
2. `jsdomFromUrl(url)` 自动处理 412 挑战 → VM 执行 → S+T Cookie 生成
3. `dom.cookieJar.getCookieStringSync()` 提取 Cookie
4. Cookie 传递给 Python `requests` → HTTP 200 真实页面

关键要求：
- Node.js v22+ （sdenv v1.1.3 要求 undici ^7）
- VS 2022 Build Tools + C++ 桌面开发组件（node-gyp 编译 canvas/native 模块）
- pnpm 管理依赖
- `.npmrc` 配置 `onlyBuiltDependencies: [canvas, sdenv]`

### 路径 A：算法追踪（不推荐，仅供参考）

RS6 的 `$_ts.cd` 载荷经过三层嵌套 VM 执行，提取纯净算法代价极高。
仅当 sdenv 不可用时才考虑此路径。

## 5. 限制
- **不使用** Playwright / Selenium 等浏览器自动化
- 最终方案：Node.js (sdenv) 生成 Cookie + Python (`requests`) 执行 HTTP 请求

## 6. 产出
- Node.js 实现 RS 逻辑还原（用于验证算法正确性）
- Python 调用完成自动化请求（`requests` 或 `httpx`）
- 完整请求链：生成 Cookie → 带 Cookie 请求 → 200 响应

## 7. 路径
| 类型 | 路径 |
|------|------|
| 提示词文件 | `./init/` |
| 产出代码 | `./code/` |
| 资源文件（页面样本、JS、Cookie 等） | `./code/web_config/` |
| 请求数据（爬取结果） | `./data/` |

## 8. 待确认

- [x] RS 具体版本号 → **RS6**（`$_ts.nsd` + `$_ts.cd` + 226KB 外部 VM JS + `_$e8` 入口）
- [x] `$_ts.cd` 载荷是否需要环境检测 → **是**，需要 `typeof document.all === "undefined"`、canvas.toDataURL 等
- [x] 是否需要处理 302 重定向 / 多轮 Cookie 跳转 → sdenv 自动处理完整 412 挑战流程
- [x] Cookie 校验是否为服务端无状态验证 → **是**，S Cookie（服务端） + T Cookie（客户端 VM 生成），配对校验
- [x] 外部 JS 文件是否存在额外校验 → 226KB VM JS（`/Qikan/Scripts/rs/xxx.js`），sdenv 已完整支持
