# WishWall 许愿墙 · 3D 漂泊贴纸展示平台

一个使用 **React + Three.js + @react-three/fiber** 构建的 3D 虚拟展示空间，支持用户上传图片，这些图片将以漂泊贴纸的形式展示在一个具有星空背景和流星墙的虚拟长廊中，并可进行放大、下载和删除操作。同时支持键盘控制摄像机移动（前后移动与跳跃），模拟人物行走浏览的沉淀感。

## ✨ 特性 Features

- 📷 支持多图上传并自动压缩尺寸（最大边 1024px）
- 🌠 贴纸左右交错贴在两边墙面，自动上下浮动，并带轻微摆动动画
- 🌫️ 星空背景 + 自定义 Shader 流星墙（`StarryWall`）
- 🎮 摄像机支持键盘操控：前进、后退、左右转向与跳跃（空格）
- 🔍 每张图片支持放大预览、下载、删除操作（悬浮按钮）
- 📏 自动根据图片数量调整长廊长度与地面尺寸
- 📆 所有贴图使用 `THREE.TextureLoader` 预加载，并启用 `clippingPlanes` 裁剪

## 🖼️ 组件结构

```
WishWall
├── Canvas
│   ├── CameraController        ← 控制摄像机移动（键盘控制）
│   ├── Ground                  ← 长廊地面
│   ├── StarryWall              ← 左右墙面带流星特效
│   ├── FloatingImage[]         ← 漂泊贴纸，贴在墙上、自动上下浮动
│   └── OrbitControls           ← 允许鼠标查看但禁用缩放和平移
└── input[type=file]            ← 上传图片（自动压缩）
    └── PreviewModal                ← 图片点击放大预览
```

## ⌨️ 控制方式（键盘）

- `↑ / W`：向前移动
- `↓ / S`：向后移动
- `← / →`：左右旋转视角
- `空格`：跳跃（支持重力回落）
- `Shift + ↑/↓`：加速前后移动

## 📁 关键文件说明

| 文件 / 目录                       | 描述                                     |
| --------------------------------- | ---------------------------------------- |
| `WishWall.tsx`                    | 主组件，渲染整个许愿墙场景               |
| `components/FloatingImage.tsx`    | 展示单张图片贴纸，包含浮动逻辑、按钮控制 |
| `components/Ground.tsx`           | 地面平面，用于视觉参照                   |
| `components/CameraController.tsx` | 摄像机控制逻辑，支持跳跃、重力、移动限制 |
| `components/PreviewModal.tsx`     | 点击图片后弹出的放大预览组件             |
| `components/StarryWall.tsx`       | 左右墙体上的流星 Shader 效果             |
| `resizeImage()`                   | 上传图片压缩到指定最大边长               |
| `updateLengths()`                 | 根据图片数量动态更新场景长度             |

## 🛠️ 技术栏

- **React**
- **Three.js** + `@react-three/fiber`
- `@react-three/drei`（用于 `Html`, `Stars`, `OrbitControls` 等辅助组件）
- `framer-motion`（UI 动画）
- `lodash/debounce`（图片上传防抖）
- `react-icons`（控制按钮图标）

## 📦 安装与运行

```bash
# 安装依赖
npm install

# 启动开发模式
npm run dev

# 或构建生产版本
npm run build
```

确保使用了支持 Vite 或 Create React App 的项目架构。

## 🧹 待扩展功能建议

- 图片顺序可拖动调整
- 墙面贴纸增加标签/文字说明
- 使用服务端储存图片与状态
- 音效与背景音乐支持
- 用户头像 + 游览轨迹记录

------

© 2025 WishWall Project. Enjoy your journey through the starry corridor ✨
