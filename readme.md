<p align="center">
  <img src="resources/logo.png" alt="Open Cowork Logo" width="280" />
</p>

<h1 align="center">🚀 Open Cowork: Your Personal AI Agent Desktop App</h1>

<p align="center">
  • Open Source Claude Cowork • One-Click Install 
</p>

<p align="center">
  <a href="./README_zh.md">中文文档</a> •
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Downloads</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#skills">Skills Library</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
  <img src="https://img.shields.io/badge/Node.js-18+-brightgreen" alt="Node.js" />
</p>

---

## 📖 Introduction

**Open Cowork** is an open-source implementation of **Claude Cowork**, with one-click installers for **Windows**, **macOS**, and **Linux**—no coding required.

It provides a sandboxed workspace where AI can manage files, generate professional outputs (PPTX, DOCX, XLSX, etc.) through our built-in **Skills** system, and **connect to desktop apps via MCP** (browser, Notion, etc.) for better collaboration.

> [!WARNING]
> **Disclaimer**: Open Cowork is an AI collaboration tool. Please exercise caution with its operations, especially when authorizing file modifications or deletions. We support VM-based sandbox isolation, but some operations may still carry risks.

---

<a id="features"></a>
## ✨ Key Features

|               | MCP & Skills | Remote Control | GUI Operation |
| ------------- | ------------ | -------------- | ------------- |
| Claude Cowork | ✓            | ✗              | ✗             |
| OpenClaw      | ✓            | ✓              | ✗             |
| OpenCowork    | ✓            | ✓              | ✓             |

- **One-Click Install, Ready to Use**: Pre-built installers for Windows, macOS, and Linux, no environment setup needed—just download and start using.
- **Flexible Model Support**: Supports **Claude**, **OpenAI-compatible APIs**, and Chinese models like **GLM**, **MiniMax**, **Kimi**. Use your OpenRouter, Anthropic, or other API keys with flexible configuration. More models coming soon!
- **Remote Control**: Connect to collaboration platforms like **Feishu (Lark)** and other remote services to automate workflows and cross-platform operations.
- **GUI Operation**: Control and interact with various desktop GUI applications on your computer. **Recommended model: Gemini-3-Pro** for optimal GUI understanding and control.
- **Smart File Management**: Read, write, and organize files within your workspace.
- **Skills System**: Built-in workflows for PPTX, DOCX, PDF, XLSX generation and processing. **Supports custom skill creation and deletion.**
- **MCP External Service Support**: Integrate browser, Notion, custom apps and more through **MCP Connectors** to extend AI capabilities.
- **Multimodal Input**: Drag & drop files and images directly into the chat input for seamless multimodal interaction.
- **Real-time Trace**: Watch AI reasoning and tool execution in the Trace Panel.
- **Secure Workspace**: All operations confined to your chosen workspace folder.
- **Strong Isolation by Platform**: WSL2 (Windows), Lima (macOS), and rootless container sandbox (Linux) for isolated command execution.
- **UI Enhancements**: Beautiful and flexible UI design, system language switching, comprehensive MCP/Skills/Tools call display.
- **Companion Memory & Profile**: Persistent user profile and long-term memory so the agent can remember your name, preferences, tone, and stable facts across sessions—always stored locally on your machine.
- **Check-in Loop (Scheduled Companion)**: Optional scheduled “check-in” that summarizes recent work, tracks loose ends, and updates workspace companion files under `.open-cowork/companion/` without you having to ask.
- **Multi-channel Remote Control**: Remote gateway with Feishu (Lark), Telegram, Slack and more, using rich remote identities (name, language, preferences) so you can talk to the same companion from multiple channels.

<a id="demo"></a>



## 🎬 Demo

See Open Cowork in action:

### 1. Folder Organization & Cleanup 📂
https://github.com/user-attachments/assets/dbeb0337-2d19-4b5d-a438-5220f2a87ca7

### 2. Generate PPT from Files 📊
https://github.com/user-attachments/assets/30299ded-0260-468f-b11d-d282bb9c97f2

### 3. Generate XLSX Spreadsheets 📉
https://github.com/user-attachments/assets/f57b9106-4b2c-4747-aecd-a07f78af5dfc

### 4. GUI Operation🖥
https://github.com/user-attachments/assets/75542c76-210f-414d-8182-1da988c148f2

### 5. Remote control with Feishu(Lark) 🤖
https://github.com/user-attachments/assets/05a703de-c0f5-407b-9a43-18b6a172fd74

---

<a id="installation"></a>
## 📦 Installation

### Option 1: Download Installer (Recommended)

Get the latest version from our [Releases Page](https://github.com/OpenCoworkAI/open-cowork/releases).

| Platform | File Type |
|----------|-----------|
| **Windows** | `.exe` |
| **macOS** (Apple Silicon) | `.dmg` |
| **Linux** | `.AppImage`, `.deb`, `.rpm` |

### Option 2: Build from Source

For developers who want to contribute or modify the codebase:

```bash
git clone https://github.com/OpenCoworkAI/open-cowork.git
cd open-cowork
npm install
npm run rebuild
npm run dev
```

To build installers locally:
- `npm run build` (current platform default)
- `npm run build:linux` (Linux AppImage + .deb + .rpm)

### Security Configuration: 🔒 Sandbox Support

Open Cowork provides **multi-level sandbox protection** to keep your system safe:

| Level | Platform | Technology | Description |
|-------|----------|------------|-------------|
| **Basic** | All | Path Guard | File operations restricted to workspace folder |
| **Enhanced** | Windows | WSL2 | Commands execute in isolated Linux VM |
| **Enhanced** | macOS | Lima | Commands execute in isolated Linux VM |
| **Enhanced** | Linux | Rootless Podman/Docker | Commands execute in isolated rootless container |

- **Windows (WSL2)**: When WSL2 is detected, all Bash commands are automatically routed to a Linux VM. The workspace is synced bidirectionally.
- **macOS (Lima)**: When [Lima](https://lima-vm.io/) is installed (`brew install lima`), commands run in an Ubuntu VM with `/Users` mounted.
- **Linux (Rootless Container)**: When Podman rootless (recommended) or Docker rootless is available, commands run in an isolated container with the workspace bind-mounted.
- **Fallback**: If no VM is available, commands run natively with path-based restrictions.

**Setup (Optional, Recommended)**

- **Windows**: WSL2 is auto-detected if installed. [Install WSL2](https://docs.microsoft.com/en-us/windows/wsl/install)

- **macOS**:
Lima is auto-detected if installed. Install command:
```bash
brew install lima
# Open Cowork will automatically create and manage a 'claude-sandbox' VM
```

- **Linux (Ubuntu/KDE neon)**:
```bash
sudo apt update
sudo apt install -y podman xdotool x11-utils imagemagick grim slurp wl-clipboard
# Optional checks:
npm run preflight:linux
npm run smoke:linux:sandbox
npm run smoke:linux:gui
```

#### Linux notes (Ubuntu / KDE neon)

- On Linux, Open Cowork prefers **rootless containers** (Podman first, Docker as fallback) for sandbox isolation and transparently falls back to native mode with Path Guard if no container runtime is available.
- On KDE neon / Ubuntu, the extra tools `xdotool`, `x11-utils`, `imagemagick`, `grim`, `slurp`, `wl-clipboard` are required for **GUI Operation** (screenshots, clicks, keyboard input) on X11/Wayland.
- You can use the provided commands:
  - `npm run preflight:linux` to check container + GUI prerequisites.
  - `npm run smoke:linux:sandbox` and `npm run smoke:linux:gui` for basic sandbox/GUI smoke tests.

---

<a id="quick-start"></a>
## 🚀 Quick Start Guide

### 1. Get an API Key
You need an API key to power the agent. We support **OpenRouter**, **Anthropic**, and various cost-effective **Chinese Models**.

| Provider | Get Key / Coding Plan | Base URL (Required) | Recommended Model |
|----------|-----------------------|---------------------|-------------------|
| **OpenRouter** | [OpenRouter](https://openrouter.ai/) | `https://openrouter.ai/api` | `claude-4-5-sonnet` |
| **Anthropic** | [Anthropic Console](https://console.anthropic.com/) | (Default) | `claude-4-5-sonnet` |
| **Zhipu AI (GLM)** | [GLM Coding Plan](https://bigmodel.cn/glm-coding) (⚡️Chinese Deal) | `https://open.bigmodel.cn/api/anthropic` | `glm-4.7`, `glm-4.6` |
| **MiniMax** | [MiniMax Coding Plan](https://platform.minimaxi.com/subscribe/coding-plan) | `https://api.minimaxi.com/anthropic` | `minimax-m2` |
| **Kimi** | [Kimi Coding Plan](https://www.kimi.com/membership/pricing) | `https://api.kimi.com/coding/` | `kimi-k2` |

### 2. Configure
1. Open the app and click the ⚙️ **Settings** icon in the bottom left.
2. Paste your **API Key**.
3. **Crucial**: Set the **Base URL** according to the table above (especially for Zhipu/MiniMax, etc.).
4. Enter the **Model** name you want to use.

### 3. Start Coworking
1. **Select a Workspace**: Choose a folder where Claude is allowed to work.
2. **Enter a Prompt**:
   > "Read the financial_report.csv in this folder and create a PowerPoint summary with 5 slides."

### 📝 Important Notes

1.  **macOS Installation**: If you see a security warning when opening the app, go to **System Settings > Privacy & Security** and click **Open Anyway**. If it is still blocked, run:

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Open Cowork.app"
```
2.  **Network Access**: For tools like `WebSearch`, you may need to enable "Virtual Network Interface" (TUN Mode) in your proxy settings to ensure connectivity.
3. **Notion Connector**: Besides setting the integration token, you also need to add connections in a root page. See https://www.notion.com/help/add-and-manage-connections-with-the-api for more details.
---

## 🧠 Companion Memory & Check-in Loop

Open Cowork includes an optional **Companion Memory** system that lets the agent remember who you are and what matters to you across sessions—without sending anything to extra backend services beyond your chosen model provider.

### User Profile (Settings → Profile)

- Open **Settings → Profile** to tell the companion:
  - **User name** (short handle like `futur3`)
  - **Display name** (how you want to be addressed in UI)
  - **Persona** (tone/style the assistant should adopt)
  - **Preferred language** and **timezone**
  - **Style preferences** (e.g. “concise”, “practical”, “include examples”)
- This information is stored **locally** using encrypted app storage and is used to keep tone and context consistent across sessions.

### Enabling Companion Memory

- Go to **Settings → Companion Memory**.
- Turn on **“Enable Companion Memory”**:
  - the agent will automatically extract and save **stable, useful facts** about you and your work (preferences, ongoing goals, constraints),
  - before each run it retrieves **relevant memory** and adds it to the internal prompt so replies stay coherent over time.
- You can switch this off at any time if you prefer stateless sessions.

### Check-in Loop (scheduled companion)

- The **Check-in Loop** is an optional scheduled “heartbeat” that:
  - reads your most recent activity in the app,
  - writes summaries and loose ends to `.open-cowork/companion/companion-memory.md`,
  - appends structured entries to `.open-cowork/companion/checkins.jsonl`.
- To enable it:
  - open **Settings → Companion Memory** and toggle **“Enable Check-in Loop”**,
  - adjust:
    - **Check-in schedule (cron)** – e.g. `0 */6 * * *` for every 6 hours,
    - **Timeout (ms)** – maximum time allowed for a single check-in job.
- Recent runs are visible in the **“Recent check-ins”** list in the same tab, with timestamp, summary, and next action.

### Manual control

- At any time you can click **“Run check-in now”** to trigger a manual check-in for the current workspace—useful at the end of a day to snapshot status.
- To stop automated updates:
  - disable **“Enable Check-in Loop”** or turn off **Companion Memory** entirely from the same settings tab.

---

## 🌐 Remote Control & Multi-channel Identities

Open Cowork can expose your local agent through a **remote gateway**, so you can talk to the same companion from chat platforms like **Feishu (Lark)**, **Telegram**, and **Slack**, or from custom WebSocket clients.

### Enabling Remote Control

- Open **Settings → Remote Control**:
  - toggle the **remote gateway** on or off,
  - choose a **port** and **bind address**:
    - `127.0.0.1` for local-only usage (safest),
    - `0.0.0.0` if you plan to expose it via a tunnel (ngrok, Cloudflare, etc.).
  - pick an **auth mode** (token / allowlist / pairing).

### Channels (Feishu, Telegram, Slack)

- In the same tab you can configure individual channels:
  - **Feishu (Lark)** – app ID/secret, webhook or WebSocket mode.
  - **Telegram** – bot token from `@BotFather`, optional webhook URL.
  - **Slack** – bot token, signing secret, optional app-level token.
- Additional channels are guarded by **feature flags**, so you can keep remote control entirely off or only enable the specific channels you trust.

### Remote identities

- Each remote user (for example, your Telegram account or a Slack user) is mapped to a **Remote Identity**:
  - tracks `channelType`, `userId`, display name, preferred language, and last activity,
  - lets the companion respond with the right persona and language on each channel.
- From **Remote Control** settings you can:
  - review **paired users** and **pending pairings**,
  - explicitly **approve** or **revoke** access for any identity.

### Security tips

- For local-only usage, keep the gateway bound to **`127.0.0.1`**.
- If you expose the gateway to the internet via a tunnel, always:
  - use a **strong authentication token** or allowlist mode,
  - rotate tokens if they may have leaked.

---

<a id="skills"></a>
## 🧰 Skills Library

Open Cowork ships with built-in skills under `.claude/skills/`, and supports user-added or custom skills, including:
- `pptx` for PowerPoint generation
- `docx` for Word document processing
- `pdf` for PDF handling and forms
- `xlsx` for Excel spreadsheet support
- `skill-creator` for creating custom skills

---

## 🏗️ Architecture

```
open-cowork/
├── src/
│   ├── main/                    # Electron Main Process (Node.js)
│   │   ├── index.ts             # Main entry point
│   │   ├── claude/              # Agent SDK & Runner
│   │   │   └── agent-runner.ts  # AI agent execution logic
│   │   ├── config/              # Configuration management
│   │   │   └── config-store.ts  # Persistent settings storage
│   │   ├── db/                  # Database layer
│   │   │   └── database.ts      # SQLite/data persistence
│   │   ├── ipc/                 # IPC handlers
│   │   ├── memory/              # Memory management
│   │   │   └── memory-manager.ts
│   │   ├── sandbox/             # Security & Path Resolution
│   │   │   └── path-resolver.ts # Sandboxed file access
│   │   ├── session/             # Session management
│   │   │   └── session-manager.ts
│   │   ├── skills/              # Skill Loader & Manager
│   │   │   └── skills-manager.ts
│   │   └── tools/               # Tool execution
│   │       └── tool-executor.ts # Tool call handling
│   ├── preload/                 # Electron preload scripts
│   │   └── index.ts             # Context bridge setup
│   └── renderer/                # Frontend UI (React + Tailwind)
│       ├── App.tsx              # Root component
│       ├── main.tsx             # React entry point
│       ├── components/          # UI Components
│       │   ├── ChatView.tsx     # Main chat interface
│       │   ├── ConfigModal.tsx  # Settings dialog
│       │   ├── ContextPanel.tsx # File context display
│       │   ├── MessageCard.tsx  # Chat message component
│       │   ├── PermissionDialog.tsx
│       │   ├── Sidebar.tsx      # Navigation sidebar
│       │   ├── Titlebar.tsx     # Custom window titlebar
│       │   ├── TracePanel.tsx   # AI reasoning trace
│       │   └── WelcomeView.tsx  # Onboarding screen
│       ├── hooks/               # Custom React hooks
│       │   └── useIPC.ts        # IPC communication hook
│       ├── store/               # State management
│       │   └── index.ts
│       ├── styles/              # CSS styles
│       │   └── globals.css
│       ├── types/               # TypeScript types
│       │   └── index.ts
│       └── utils/               # Utility functions
├── .claude/
│   └── skills/                  # Default Skill Definitions
│       ├── pptx/                # PowerPoint generation
│       ├── docx/                # Word document processing
│       ├── pdf/                 # PDF handling & forms
│       ├── xlsx/                # Excel spreadsheet support
│       └── skill-creator/       # Skill development toolkit
├── resources/                   # Static Assets (icons, images)
├── electron-builder.yml         # Build configuration
├── vite.config.ts               # Vite bundler config
└── package.json                 # Dependencies & scripts
```

---

## 🗺️ Roadmap

- [x] **Core**: Stable Windows & macOS Installers
- [x] **Security**: Full Filesystem Sandboxing
- [x] **Skills**: PPTX, DOCX, PDF, XLSX Support + Custom Skill Management
- [x] **Isolated Sandbox**: WSL2 (Windows), Lima (macOS), rootless container runtime (Linux)
- [x] **MCP Connectors**: Custom connector support for external service integration
- [x] **Rich Input**: File upload and image input in chat
- [x] **Multi-Model**: OpenAI-compatible API support (iterating)
- [x] **UI/UX**: Enhanced interface with English/Chinese localization
- [x] **Companion Memory & Check-in Loop**: Persistent user profile, long-term memory, and scheduled workspace check-ins.
- [x] **Remote Identities & Multi-channel Remote**: Rich remote identities plus Feishu/Telegram/Slack channel support behind feature flags.
- [ ] **Cloud & Multi-device Sync**: Optional sync of companion memory and profiles across devices.
- [ ] **New Features**: Stay tuned!

---

## 🛠️ Contributing

We welcome contributions! Whether it's a new Skill, a UI fix, or a security improvement:

1. Fork the repo.
2. Create a branch (`git checkout -b feature/NewSkill`).
3. Submit a PR.

---

## 💬 Community

Join our WeChat group for support and discussion:

<p align="center">
  <img src="resources/WeChat.jpg" alt="WeChat Group" width="200" />
</p>

---

## 📄 License

MIT © Open Cowork Team

---

<p align="center">
  Made with ❤️
</p>
