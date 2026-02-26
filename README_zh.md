<p align="center">
  <img src="resources/logo.png" alt="Open Cowork Logo" width="280" />
</p>

<h1 align="center">🚀 Open Cowork: 你的私人 AI 智能助手桌面应用</h1>

<p align="center">
  • Claude Cowork 的开源实现 • 一键安装
</p>

<p align="center">
  <a href="./README.md">English Docs</a> •
  <a href="#核心特性">核心特性</a> •
  <a href="#演示">演示视频</a> •
  <a href="#下载与安装">下载安装</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#技能库">技能库</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/平台-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/协议-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/Node.js-18+-brightgreen" alt="Node.js" />
</p>

---

## 📖 简介

**Open Cowork** 是 **Claude Cowork** 的开源实现，提供 **Windows**、**macOS** 和 **Linux** 一键安装包，无需任何编程知识。

它为 AI 提供了一个沙盒化的工作环境，可以管理文件、通过内置的 **Skills** 系统生成专业文件（PPTX、DOCX、XLSX等）和 **通过MCP链接桌面APP**（浏览器、Notion等）进行人机协作等等。

> [!WARNING]
> **免责声明**：Open Cowork 仅作为一个 AI 协作工具，请对它的操作保持谨慎。特别是在授权文件修改或删除等操作时，请务必自行审查风险，我们支持了基于VM的sandbox隔离，但是某些操作可能仍存风险。

---

<a id="核心特性"></a>
## ✨ 核心特性

|               | MCP & Skills | 远程控制 | 图形界面操作 |
| ------------- | ------------ | -------------- | ------------- |
| Claude Cowork | ✓            | ✗              | ✗             |
| OpenClaw      | ✓            | ✓              | ✗             |
| OpenCowork    | ✓            | ✓              | ✓             |


- **一键安装，开箱即用**：提供 Windows 和 macOS 预构建安装包，无需配置环境，下载即可开始使用。。
- **灵活模型支持**：支持 **Claude**、**OpenAI 兼容接口**，以及国产大模型 **GLM**、**MiniMax**、**Kimi** 等。使用你的 OpenRouter、Anthropic等API Key，灵活配置。更多模型持续接入中！
- **远程控制**：可以接入**飞书**等协作平台和远程服务，实现工作流自动化和跨平台操作。
- **图形界面操作**：可以控制和操作电脑上的各种桌面 GUI 应用程序。**推荐使用 Gemini-3-Pro 模型**以获得最佳的 GUI 理解和控制效果。
- **智能文件管理**：可以在工作区内读取、写入和整理文件。
- **Skills 系统**：内置 PPTX、DOCX、PDF、XLSX 生成和处理工作流。**支持自定义技能的添加与删除。**
- **MCP外部服务支持**：通过 **MCP Connectors** 连接器集成浏览器、Notion、自定义等应用，扩展 AI 能力。
- **多模态交互输入**：支持直接拖拽文件和图片到输入框，实现无缝的多模态交互。
- **实时追踪**：在 Trace Panel 中观察 AI 推理和工具调用过程。
- **安全可控的工作环境**：所有操作限制在你选择的工作区文件夹内。
- **虚拟机/容器级别安全隔离**：基于 WSL2 (Windows)、Lima (macOS) 与 rootless 容器 (Linux) 的隔离运行环境，所有命令在隔离环境中执行，保障宿主机安全。
- **UI优化**：灵活优美的UI设计、切换系统语言、完善的MCP/Skills/Tools调用展示。
- **Companion 记忆与个人档案**：支持持久化的用户档案与长期记忆，助手可以记住你的称呼、偏好、语气风格与稳定事实，这些数据全部保存在本地。
- **Check-in 循环（定时伙伴）**：可选的定时 “check-in” 循环，会自动总结最近进展、梳理待办，并更新工作区下 `.open-cowork/companion/` 目录中的文件。
- **多通道远程控制**：通过远程网关，将本地能力暴露给飞书、Telegram、Slack 等渠道，基于丰富的远程身份（名称、语言、偏好）实现跨平台对话。

<a id="演示"></a>
## 🎬 演示

观看 Open Cowork 实战演示 ：

### 1. 文件夹收纳整理 📂
https://github.com/user-attachments/assets/dbeb0337-2d19-4b5d-a438-5220f2a87ca7

### 2. 从文件生成 PPT 📊
https://github.com/user-attachments/assets/30299ded-0260-468f-b11d-d282bb9c97f2

### 3. 从文件生成 XLSX 表格 📉
https://github.com/user-attachments/assets/f57b9106-4b2c-4747-aecd-a07f78af5dfc

---

<a id="下载与安装"></a>
## 📦 下载与安装

### 方式一：下载安装包（推荐）

请访问我们的 [Release 页面](https://github.com/OpenCoworkAI/open-cowork/releases) 下载最新版本。

| 平台 | 文件类型 |
|------|----------|
| **Windows** | `.exe` |
| **macOS** (Apple Silicon) | `.dmg` |

### 方式二：源码编译

适合想要贡献代码或进行二次开发的开发者：

```bash
git clone https://github.com/OpenCoworkAI/open-cowork.git
cd open-cowork
npm install
npm run rebuild
npm run dev
```

构建安装包：`npm run build`

### 安全配置：🔒 沙盒支持

Open Cowork 提供**多级沙盒保护**，确保系统安全：

| 级别 | 平台 | 技术 | 说明 |
|------|------|------|------|
| **基础** | 全平台 | 路径守卫 | 文件操作限制在工作区文件夹内 |
| **增强** | Windows | WSL2 | 命令在隔离的 Linux 虚拟机中执行 |
| **增强** | macOS | Lima | 命令在隔离的 Linux 虚拟机中执行 |
| **增强** | Linux | Rootless Podman/Docker | 命令在 rootless 容器中执行 |

- **Windows (WSL2)**：检测到 WSL2 后，所有 Bash 命令自动路由到 Linux 虚拟机，工作区双向同步。
- **macOS (Lima)**：安装 [Lima](https://lima-vm.io/) (`brew install lima`) 后，命令在挂载了 `/Users` 的 Ubuntu 虚拟机中运行。
- **回退模式**：如果没有可用的虚拟机，命令将在本机执行，受路径限制保护。

**配置方法（可选、推荐）**

- **Windows**：如已安装 WSL2，会自动检测。[安装 WSL2](https://docs.microsoft.com/zh-cn/windows/wsl/install)

- **macOS**：
如已安装 lima，会自动检测。lima安装指令如下：
```bash
brew install lima
# Open Cowork 会自动创建和管理 'claude-sandbox' 虚拟机
```

- **Linux (Ubuntu / KDE neon 等)**：
需要安装 rootless 容器运行时（推荐 **Podman**，可兼容 Docker）以及 GUI 操作相关工具：

```bash
sudo apt update
sudo apt install -y podman xdotool x11-utils imagemagick grim slurp wl-clipboard
# 可选检查：
npm run preflight:linux
npm run smoke:linux:sandbox
npm run smoke:linux:gui
```

#### Linux 提示（Ubuntu / KDE neon）

- Linux 上默认优先使用 **rootless 容器**（Podman 为首选，Docker 为后备），在不可用时退回到本机 + 路径守卫模式。
- KDE neon / Ubuntu 环境下，上述工具用于 **GUI Operation**（截图、点击、键盘输入等），建议一并安装。
- 使用 `npm run preflight:linux` 可检查容器与 GUI 依赖是否就绪，`npm run smoke:linux:sandbox` 与 `npm run smoke:linux:gui` 可做基础冒烟测试。

---

<a id="快速开始"></a>
## 🚀 快速开始

### 1. 获取 API Key
你需要一个 API Key 来驱动 Agent。我们支持 **OpenRouter**、**Anthropic** 以及多家高性价比的**国产大模型**。

| 服务商 | 获取 Key / Coding Plan | Base URL (必填) | 推荐模型 Model |
|-------|------------------------|-----------------|---------------|
| **OpenRouter** | [OpenRouter](https://openrouter.ai/) | `https://openrouter.ai/api` | `claude-4-5-sonnet` |
| **Anthropic** | [Anthropic Console](https://console.anthropic.com/) | 默认 | `claude-4-5-sonnet` |
| **智谱 AI** | [GLM Coding Plan](https://bigmodel.cn/glm-coding) (⚡️国产特惠) | `https://open.bigmodel.cn/api/anthropic` | `glm-4.7`, `glm-4.6` |
| **MiniMax** | [MiniMax Coding Plan](https://platform.minimaxi.com/subscribe/coding-plan) | `https://api.minimaxi.com/anthropic` | `minimax-m2` |
| **Kimi** | [Kimi Coding Plan](https://www.kimi.com/membership/pricing) | `https://api.kimi.com/coding/` | `kimi-k2` |

### 2. 配置应用
1. 打开应用，点击左下角 ⚙️ **设置**。
2. 填入你的 **API Key**。
3. **关键步骤**：根据上表修改 **Base URL** (如使用智谱/MiniMax等)。
4. 输入想要使用的 **Model** 名称。

### 3. 开始协作
1. **选择工作区**：选择一个文件夹，授权 Claude 在其中工作。
2. **输入指令**：
   > "读取当前文件夹下的 financial_report.csv，并帮我生成一份包含 5 页幻灯片的 PPT 总结报告。"

### 📝 重要提示

1.  **macOS 安装问题**：安装后若打不开，提示隐私安全问题，请前往 **系统设置 > 隐私与安全性** 进行授权（点击“仍要打开”）。若仍被拦截，可运行：

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Open Cowork.app"
```
2.  **网络连接**：对于 `WebSearch` 等联网工具，可能需要开启代理软件的“虚拟网卡 (TUN模式)”功能才能正常访问。
3. **Notion连接器使用**: 除了设置Notion token之外，还需要在根页面添加连接。更多指引请看https://www.notion.com/help/add-and-manage-connections-with-the-api。

---

## 🧠 Companion 记忆与 Check-in 循环

Open Cowork 内置可选的 **Companion Memory** 系统，可以在不增加任何额外云端服务的前提下，帮助助手在本地记住“你是谁”和“你在做什么”。

### 用户档案（设置 → Profile）

- 打开 **Settings → Profile**（设置 → 个人档案）可以告诉助手：
  - **User name**：短用户名（例如 `futur3`）
  - **Display name**：在界面中显示的称呼
  - **Persona**：你希望助手采用的语气 / 角色
  - **Preferred language** 与 **时区**
  - **Style preferences**：例如 “简洁”、“实用”、“多举例”等
- 这些信息会使用本地加密存储，仅用于保持多轮对话中的语气和上下文一致。

### 启用 Companion 记忆

- 打开 **Settings → Companion Memory**（设置 → Companion 记忆）。
- 勾选 **“Enable Companion Memory”**：
  - 每轮对话结束后，系统会自动提取**稳定且有用的事实**（偏好、长期目标、约束条件等）并写入长期记忆；
  - 每次运行前，会检索**相关记忆**并追加到内部提示词中，使回答在不同会话之间保持连贯。
- 你可以随时关闭该开关，回到完全无记忆的“纯工具”模式。

### Check-in 循环（定时伙伴）

- **Check-in Loop** 是一个可选的定时 “心跳”，会：
  - 读取最近的用户活动；
  - 将摘要和“未完事项”写入 `.open-cowork/companion/companion-memory.md`；
  - 追加结构化记录到 `.open-cowork/companion/checkins.jsonl`。
- 启用方式：
  - 在 **Settings → Companion Memory** 页面中打开 **“Enable Check-in Loop”**；
  - 配置：
    - **Check-in schedule (cron)**：如 `0 */6 * * *` 表示每 6 小时一次；
    - **Timeout (ms)**：单次 check-in 任务允许的最长执行时间。
- 在同一页面可以看到 **最近的 Check-in 列表**，包含时间、摘要和下一步建议。

### 手动控制

- 可以点击 **“Run check-in now”** 手动触发一次 Check-in，适合在一天结束时对当前项目做快照总结。
- 若想停止自动更新：
  - 关闭 **“Enable Check-in Loop”** 或直接关闭 **Companion Memory** 即可。

---

## 🌐 远程控制与多通道身份

Open Cowork 可以通过本地 **远程网关** 将你的 Agent 暴露给 **飞书**、**Telegram**、**Slack** 等聊天平台，或者自定义 WebSocket 客户端，让你在手机或其他终端继续与同一个助手协作。

### 启用远程控制

- 打开 **Settings → Remote Control**（设置 → 远程控制）：
  - 打开或关闭远程网关；
  - 选择 **端口** 与 **绑定地址**：
    - `127.0.0.1`：仅本机访问（最安全）；
    - `0.0.0.0`：需要配合公网隧道（如 ngrok、Cloudflare Tunnel 等）使用。
  - 配置 **认证模式**（token / allowlist / pairing）。

### 支持的渠道（Feishu / Telegram / Slack）

- 在同一页面可以分别配置各个渠道：
  - **Feishu (飞书)**：App ID / Secret、Webhook 或 WebSocket 模式；
  - **Telegram**：从 `@BotFather` 获取 Bot Token，可选 Webhook 地址；
  - **Slack**：Bot Token、Signing Secret，可选 App-level Token。
- 新增渠道都通过 **feature flag** 控制，你可以完全关闭远程控制，或只启用自己信任的渠道。

### 远程身份（Remote Identities）

- 每个远程用户（例如你的 Telegram 账号、某个 Slack 用户）都会映射为一个 **Remote Identity**：
  - 记录 `channelType`、`userId`、显示名称、偏好语言、最后活跃时间等；
  - 帮助助手在不同渠道自动使用合适的语言与 persona 回复。
- 在 **Remote Control** 页面可以：
  - 查看已配对用户与待审批配对请求；
  - 显式 **批准** 或 **撤销** 某个远程身份的访问权限。

### 安全建议

- 仅在本地使用时，建议将网关绑定到 **`127.0.0.1`**。
- 若通过公网隧道暴露网关，请务必：
  - 使用足够强的 **访问 Token** 或 allowlist 模式；
  - 一旦怀疑 Token 泄露，及时进行更换或关闭网关。

---

<a id="技能库"></a>
## 🧰 技能库

Open Cowork 内置技能位于 `.claude/skills/`，并支持用户自行添加/自定义技能，包含：
- `pptx`：PowerPoint 生成
- `docx`：Word 文档处理
- `pdf`：PDF 处理与表单
- `xlsx`：Excel 电子表格支持
- `skill-creator`：技能开发工具包

---

## 🏗️ 架构概览

```
open-cowork/
├── src/
│   ├── main/                    # Electron 主进程 (Node.js)
│   │   ├── index.ts             # 主入口文件
│   │   ├── claude/              # Agent SDK 与运行器
│   │   │   └── agent-runner.ts  # AI 代理执行逻辑
│   │   ├── config/              # 配置管理
│   │   │   └── config-store.ts  # 持久化设置存储
│   │   ├── db/                  # 数据库层
│   │   │   └── database.ts      # SQLite/数据持久化
│   │   ├── ipc/                 # IPC 处理器
│   │   ├── memory/              # 内存管理
│   │   │   └── memory-manager.ts
│   │   ├── sandbox/             # 安全与路径解析
│   │   │   └── path-resolver.ts # 沙盒化文件访问
│   │   ├── session/             # 会话管理
│   │   │   └── session-manager.ts
│   │   ├── skills/              # 技能加载与管理
│   │   │   └── skills-manager.ts
│   │   └── tools/               # 工具执行
│   │       └── tool-executor.ts # 工具调用处理
│   ├── preload/                 # Electron 预加载脚本
│   │   └── index.ts             # 上下文桥接设置
│   └── renderer/                # 前端 UI (React + Tailwind)
│       ├── App.tsx              # 根组件
│       ├── main.tsx             # React 入口
│       ├── components/          # UI 组件
│       │   ├── ChatView.tsx     # 主聊天界面
│       │   ├── ConfigModal.tsx  # 设置对话框
│       │   ├── ContextPanel.tsx # 文件上下文显示
│       │   ├── MessageCard.tsx  # 聊天消息组件
│       │   ├── PermissionDialog.tsx
│       │   ├── Sidebar.tsx      # 导航侧边栏
│       │   ├── Titlebar.tsx     # 自定义窗口标题栏
│       │   ├── TracePanel.tsx   # AI 推理追踪
│       │   └── WelcomeView.tsx  # 引导页面
│       ├── hooks/               # 自定义 React Hooks
│       │   └── useIPC.ts        # IPC 通信 Hook
│       ├── store/               # 状态管理
│       │   └── index.ts
│       ├── styles/              # CSS 样式
│       │   └── globals.css
│       ├── types/               # TypeScript 类型
│       │   └── index.ts
│       └── utils/               # 工具函数
├── .claude/
│   └── skills/                  # 默认技能定义
│       ├── pptx/                # PowerPoint 生成
│       ├── docx/                # Word 文档处理
│       ├── pdf/                 # PDF 处理与表单
│       ├── xlsx/                # Excel 电子表格支持
│       └── skill-creator/       # 技能开发工具包
├── resources/                   # 静态资源 (图标、图片)
├── electron-builder.yml         # 构建配置
├── vite.config.ts               # Vite 打包配置
└── package.json                 # 依赖与脚本
```

---

## 🗺️ 路线图

- [x] **核心**：稳定的 Windows & macOS 安装包
- [x] **安全**：完整的文件系统沙盒
- [x] **技能**：支持 PPTX, DOCX, PDF, XLSX + 自定义技能管理
- [x] **虚拟机/容器沙盒**：WSL2 (Windows)、Lima (macOS) 与 rootless 容器 (Linux) 隔离支持
- [x] **MCP Connectors**：支持自定义连接器集成外部服务
- [x] **丰富输入**：聊天框支持文件上传和图片输入
- [x] **多模型**：OpenAI 兼容接口支持（持续迭代中）
- [x] **界面优化**：UI 增强，支持中英文切换
- [x] **Companion 记忆与 Check-in 循环**：支持个性化档案、长期记忆以及定时工作区 Check-in。
- [x] **远程身份与多通道远程控制**：支持丰富的 Remote Identity 与飞书 / Telegram / Slack 等多渠道（通过 feature flag 控制）。
- [ ] **云端与多设备同步**：可选的 Companion 记忆与档案跨设备同步能力。
- [ ] **全新特征**：敬请期待！

---

## 🛠️ 贡献指南

欢迎任何形式的贡献！无论是新技能、UI 修复还是安全改进：

1. Fork 本仓库。
2. 创建分支 (`git checkout -b feature/NewSkill`)。
3. 提交 PR。

---

## 💬 加入社群

欢迎扫码加入微信群交流：

<p align="center">
  <img src="resources/WeChat.jpg" alt="微信交流群" width="200" />
</p>

---

## 📄 许可证

MIT © Open Cowork Team

---

<p align="center">
  Made with ❤️ by the Open Cowork Team with the help of opus4.5
</p>
