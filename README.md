# 🐍 Snake Game

一个基于 React + TypeScript + Canvas 的经典贪吃蛇游戏，采用暗色主题设计，支持键盘操控与动态难度递增。

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ 功能特性

- 🎮 **键盘操控** — 方向键或 WASD 控制蛇的移动方向
- ⏸️ **暂停/继续** — 空格键一键暂停与恢复
- 🏆 **最高分记录** — 基于 localStorage 持久化存储历史最高分
- ⚡ **动态加速** — 随着得分增加，蛇的移动速度逐步提升
- 🎨 **精美视觉** — Canvas 绘制，蛇身渐变色、食物脉冲发光、蛇头眼睛跟随方向
- 📱 **暗色主题** — Slate 深色系 UI，护眼舒适

---

## 🎯 游戏规则

| 规则 | 说明 |
|------|------|
| 移动 | 使用 **方向键** 或 **WASD** 控制蛇的移动方向 |
| 吃食物 | 蛇头碰到红色食物得 **10 分**，蛇身增长一节 |
| 撞墙死亡 | 蛇头撞到画布边界，游戏结束 |
| 撞自己死亡 | 蛇头撞到自身任意一节，游戏结束 |
| 加速机制 | 每得 50 分，移动速度提升一档，最快速度 60ms/步 |
| 暂停 | 游戏中按 **空格键** 暂停/继续 |

---

## 🖼️ 游戏界面

游戏包含以下界面状态：

- **待机界面** — 显示游戏标题和操作提示，点击 Start Game 开始
- **游戏进行中** — Canvas 渲染蛇、食物、网格，顶部显示分数
- **暂停状态** — 蛇停止移动，显示 PAUSED 提示
- **游戏结束** — 显示最终得分，可点击 Play Again 重新开始

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [React](https://react.dev/) | 18.3 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.5 | 类型安全 |
| [Vite](https://vitejs.dev/) | 5.3 | 构建工具 |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | 样式框架 |
| [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | — | 游戏画面渲染 |

---

## 📁 项目结构

```
snake-game/
├── index.html                  # HTML 入口
├── package.json                # 项目配置与依赖
├── vite.config.ts              # Vite 构建配置
├── tsconfig.json               # TypeScript 编译配置
├── tailwind.config.js          # Tailwind CSS 配置
├── postcss.config.js           # PostCSS 配置
└── src/
    ├── main.tsx                # React 应用入口
    ├── App.tsx                 # 根组件，组装游戏各模块
    ├── index.css               # 全局样式
    ├── types/
    │   └── game.ts             # 游戏类型定义与常量
    ├── hooks/
    │   └── useSnakeGame.ts     # 核心游戏逻辑 Hook
    └── components/
        ├── GameBoard.tsx       # Canvas 画布渲染（蛇、食物、网格）
        ├── GameOverlay.tsx     # 待机/游戏结束遮罩层
        ├── GameControls.tsx    # 控制按钮（开始/暂停/重置）
        └── ScoreBoard.tsx      # 分数与最高分显示
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/shssun/snake-game.git
cd snake-game

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

浏览器打开 `http://localhost:5173` 即可开始游戏。

### 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

### 预览生产版本

```bash
npm run preview
```

---

## 🎮 操作说明

| 按键 | 功能 |
|------|------|
| `↑` / `W` | 向上移动 |
| `↓` / `S` | 向下移动 |
| `←` / `A` | 向左移动 |
| `→` / `D` | 向右移动 |
| `Space` | 开始游戏 / 暂停 / 继续 |

---

## ⚙️ 游戏参数

参数定义在 `src/types/game.ts` 中，可根据需要调整：

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `GRID_SIZE` | 20 | 网格数量（20×20） |
| `CELL_SIZE` | 25 | 每格像素大小 |
| `CANVAS_SIZE` | 500 | 画布尺寸（GRID_SIZE × CELL_SIZE） |
| `INITIAL_SPEED` | 150 | 初始移动间隔（毫秒） |
| `SPEED_INCREMENT` | 2 | 每档加速减少的毫秒数 |
| `MIN_SPEED` | 60 | 最快移动间隔（毫秒） |

---

## 🏗️ 核心架构

### 游戏状态管理

使用 React Hook `useSnakeGame` 集中管理游戏状态，包括：

- **蛇身坐标** — `snake: Position[]`
- **食物位置** — `food: Position`
- **移动方向** — `direction` / `nextDirection`（双缓冲防止快速按键导致的反向穿身）
- **游戏状态** — `status: IDLE | PLAYING | PAUSED | GAME_OVER`
- **分数系统** — `score`（当前分） + `highScore`（最高分，localStorage 持久化）
- **速度控制** — `speed`（动态调整移动间隔）

### 渲染机制

- 使用 HTML5 Canvas 逐帧绘制游戏画面
- `GameBoard` 组件通过 `useEffect` 监听 `gameState` 变化自动重绘
- 蛇身采用**翡翠绿→青色渐变**，蛇头带发光效果和方向感知的眼睛
- 食物带**脉冲发光动画**，增强视觉反馈

---

## 📄 许可证

[MIT](LICENSE)
