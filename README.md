WishWall 许愿墙 · 3D 漂浮贴纸展示平台
一个使用 React + TypeScript + Vite + @react-three/fiber 构建的 3D 虚拟展示空间，支持用户通过登录或游客模式上传图片，图片以漂浮贴纸形式展示在具有星空背景和流星墙的虚拟长廊中。用户可放大、下载或删除贴纸，并通过键盘控制摄像机移动，体验沉浸式浏览。
✨ 特性 Features

📷 多图上传：支持多文件上传，自动压缩图片（最大边 1024px），支持拖拽排序和预览。
🌠 漂浮贴纸：图片左右交错贴在墙面，带上下浮动和轻微摆动动画。
🌫️ 星空背景：支持动态切换背景样式（无、星空、渐变、网格），墙面使用自定义 Shader 实现流星效果。
🎮 摄像机控制：键盘操控（前后移动、左右旋转、跳跃），登录后启用自动下落，未登录时重置高度。
🔍 交互操作：每张图片支持放大预览、下载、删除（悬浮按钮）。
📏 动态场景：根据图片数量自动调整长廊和地面长度。
🎨 样式设置：可通过设置面板调整墙面颜色、星空背景颜色和背景样式。
📆 性能优化：使用 THREE.TextureLoader 预加载图片，启用 clippingPlanes 裁剪，防抖上传逻辑避免频繁更新。
🖥️ 响应式 UI：包含可拖拽的设置面板（动态调整弹出方向）和动画模态框（Framer Motion）。

🖼️ 组件结构
WishWall
├── AuthForm                   ← 登录/注册/游客模式表单
├── BackgroundStyleProvider    ← 背景样式上下文
│   └── BackgroundColorProvider ← 背景颜色上下文
│       └── SceneContent       ← 3D 场景核心组件
│           ├── CameraController  ← 控制摄像机移动（键盘控制）
│           ├── CameraResetter    ← 重置未登录时的摄像机高度
│           ├── Ground            ← 长廊地面
│           ├── StarryWall        ← 左右墙面带流星特效
│           ├── FloatingImage[]   ← 漂浮贴纸，贴在墙上、自动浮动
│           └── OrbitControls     ← 鼠标视角控制（禁用缩放/平移）
├── PreviewModal               ← 图片放大预览模态框
└── SceneSettingsPanel         ← 可拖拽设置面板
├── StyleSettingsModal     ← 设置墙面/背景颜色和样式
├── PersonalInfoModal      ← 个人信息设置（待实现）
└── UploadModal            ← 图片上传模态框

⌨️ 控制方式（键盘）

↑ / W：向前移动
↓ / S：向后移动
← / →：左右旋转视角
空格：跳跃（带重力回落）
Shift + ↑/↓：加速前后移动
Esc：关闭模态框

📁 项目目录结构
src/
├── assets/                     # 静态资源
│   └── images/                # 初始图片等
├── components/                # React 组件
│   ├── auth/                  # 认证相关
│   │   └── AuthForm.tsx
│   ├── scene/                 # 3D 场景组件
│   │   ├── CameraController.tsx
│   │   ├── CameraResetter.tsx
│   │   ├── FloatingImage.tsx
│   │   ├── Ground.tsx
│   │   ├── SceneContent.tsx
│   │   └── StarryWall.tsx
│   ├── ui/                    # 用户界面组件
│   │   ├── modals/            # 模态框
│   │   │   ├── CenteredModal.tsx
│   │   │   ├── PersonalInfoModal.tsx
│   │   │   ├── StyleSettingsModal.tsx
│   │   │   ├── UploadModal.tsx
│   │   │   └── PreviewModal.tsx
│   │   ├── CloseButton.tsx
│   │   └── SceneSettingsPanel.tsx
├── contexts/                  # React 上下文定义
│   ├── BackgroundColorContext.tsx
│   └── BackgroundStyleContext.tsx
├── hooks/                     # 自定义钩子
│   ├── useAuth.ts
│   ├── useCameraDrop.ts
│   ├── useImageListWithBuffer.ts
│   ├── usePanelDrag.ts
│   ├── useWallAndCamera.ts
│   └── useWishWall.ts
├── providers/                 # 上下文提供者
│   ├── BackgroundColorProvider.tsx
│   └── BackgroundStyleProvider.tsx
├── types/                     # TypeScript 类型定义
│   └── index.tsx
├── utils/                     # 工具函数
│   ├── animation.tsx
│   └── image.tsx
├── pages/                     # 页面级组件
│   └── WishWall.tsx
├── services/                  # API 服务（待扩展）
├── tests/                     # 测试文件（待扩展）
├── App.tsx                    # 应用根组件（可选）
└── index.tsx                  # 项目入口

🗂️ 关键文件说明



文件 / 目录
描述



pages/WishWall.tsx
主页面组件，协调认证、3D 场景和模态框


components/scene/FloatingImage.tsx
漂浮贴纸，包含浮动动画、交互按钮


components/scene/Ground.tsx
长廊地面，提供视觉参照


components/scene/StarryWall.tsx
左右墙面，使用 Shader 实现流星效果


components/scene/CameraController.tsx
摄像机移动逻辑，支持键盘控制和跳跃


components/scene/CameraResetter.tsx
重置未登录时的摄像机高度


components/ui/modals/UploadModal.tsx
图片上传模态框，支持多文件和拖拽排序


components/ui/modals/PreviewModal.tsx
图片放大预览模态框


components/ui/modals/StyleSettingsModal.tsx
设置墙面颜色、背景样式模态框


components/ui/modals/PersonalInfoModal.tsx
个人信息设置模态框（待实现）


components/ui/SceneSettingsPanel.tsx
可拖拽设置面板，包含样式、上传等选项


utils/image.tsx
图片压缩工具，限制最大边长 1024px


utils/animation.tsx
Framer Motion 动画变体配置


hooks/useWishWall.ts
核心钩子，整合认证、图片、场景逻辑


🛠️ 技术栈

React + TypeScript
Three.js + @react-three/fiber（3D 渲染）
@react-three/drei（辅助组件：Html, Stars, OrbitControls 等）
Framer Motion（UI 动画）
lodash/debounce（图片上传防抖）
Lucide React（图标库，用于关闭按钮等）
Vite（构建工具）

📦 安装与运行
# 克隆项目
git clone https://github.com/liuniqux/wish-wall-demo.git

# 进入项目目录
cd wishwall

# 安装依赖
npm install

# 启动开发模式
npm run dev

# 构建生产版本
npm run build

注意：

项目使用 Vite 构建，确保 Node.js 版本 >= 18。
路径别名 @ 映射到 src 目录，配置在 tsconfig.app.json 和 vite.config.ts 中。

🧹 待扩展功能建议

图片管理：支持拖拽调整图片顺序，添加标签或文字说明。
后端集成：使用服务端存储图片和用户数据（参考 xAI API: https://x.ai/api）。
音效支持：为跳跃、上传、删除等操作添加音效，增加背景音乐。
用户功能：实现 PersonalInfoModal 的用户资料编辑，添加头像上传。
移动端适配：优化设置面板拖拽为长按/滑动，支持触控浏览 3D 场景。
测试覆盖：添加单元测试（建议使用 Vitest），覆盖钩子和组件逻辑。

⚙️ 配置说明

路径别名：@ 映射到 src 目录，简化导入（如 @/hooks/useWishWall）。
TypeScript：严格模式，tsconfig.app.json 用于应用代码，tsconfig.node.json 用于 Vite 配置。
Framer Motion：为模态框和设置面板提供平滑动画。
性能优化：图片上传使用防抖，释放对象 URL 避免内存泄漏。

📝 开发注意事项

确保 @react-three/fiber 和 @react-three/drei 导入正确（不带 /），以避免与 @ 别名冲突。
静态资源（如初始图片）建议存放于 src/assets/images/，通过 @/assets/images/xxx.jpg 导入。
开发时运行 tsc --noEmit 检查类型错误，npm run build 验证生产构建。


© 2025 WishWall Project. Enjoy your journey through the starry corridor ✨