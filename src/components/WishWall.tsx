import React, {useEffect} from "react";

// 引入自定义 Hook，封装了登录状态、表单数据、图片列表及事件处理等逻辑
import {useWishWall} from '../hooks/useWishWall';

// 登录 / 注册 / 游客模式表单组件
import AuthForm from './auth/AuthForm.tsx';

// 三维场景核心组件，展示图片墙和地面
import SceneContent from './scene/SceneContent.tsx';

// 图片预览弹窗组件，支持点击放大查看
import PreviewModal from './ui/PreviewModal.tsx';

// 背景颜色状态提供器，用于在全局范围内控制背景渐变色
import BackgroundColorProvider from '../providers/BackgroundColorProvider.tsx';

// 背景风格状态提供器，用于管理背景类型（如星空、线条、网格等）
import BackgroundStyleProvider from '../providers/BackgroundStyleProvider.tsx';

const WishWall: React.FC = () => {
    // 从 useWishWall 中解构出所有用于状态管理和交互处理的变量及函数
    const {
        // 当前是否已登录
        isLoggedIn,
        // 当前表单模式（login / register / upload）
        formMode,
        // 切换表单模式
        setFormMode,

        // 用户名输入框的绑定值
        username,
        // 设置用户名
        setUsername,
        // 密码输入框的绑定值
        password,
        // 设置密码
        setPassword,
        // 表单错误提示信息
        error,
        // 设置错误提示
        setError,

        // 控制图片漂浮速度的向量（用于 3D 动画）
        velocity,
        // 所有上传过的图片列表
        imageList,
        // 当前用户上传的图片列表（用于动画区分）
        newImages,
        // 当前被点击查看大图的图片 URL
        previewUrl,
        // 设置预览 URL（用于打开 / 关闭图片预览）
        setPreviewUrl,

        // 图片墙的长度（决定显示多少图片）
        wallLength,
        // 地面长度（决定场景范围）
        groundLength,
        // 摄像机是否允许自动下落（用于展示动画）
        cameraDropEnabled,

        // 初始图片
        setInitialImages,
        // 上传图片处理函数
        handleImageUpload,
        // 删除图片处理函数
        handleDelete,
        // 点击预览图片函数
        handlePreview,
        // 登录处理函数
        handleLogin,
        // 注册处理函数
        handleRegister,
        // 游客登录处理函数
        handleVisitorLogin,
        // 登出处理函数
        handleLogout
    } = useWishWall();

    useEffect(() => {
        const initialImages = [
            'https://linux.do/uploads/default/original/2X/b/bc9d1a2b4219f9c23dde4bc39fe3fbd8f6a4b13d.jpeg',
        ];
        setInitialImages(initialImages);
    }, [setInitialImages]);

    return (
        <div className="w-screen h-screen">
            {/* 如果未登录或当前表单模式不是“上传”，则显示登录/注册/游客访问表单 */}
            {(!isLoggedIn || formMode !== 'upload') && (
                <AuthForm
                    formMode={formMode}
                    setFormMode={setFormMode}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    error={error}
                    setError={setError}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onVisitorLogin={handleVisitorLogin}
                />
            )}

            {/* 背景风格与颜色使用 Provider 管理状态，可全局响应切换 */}
            <BackgroundStyleProvider>
                <BackgroundColorProvider>
                    <SceneContent
                        imageList={imageList}
                        newImages={newImages}
                        groundLength={groundLength}
                        wallLength={wallLength}
                        velocity={velocity}
                        cameraDropEnabled={cameraDropEnabled}
                        handleDelete={handleDelete}
                        handlePreview={handlePreview}
                        isLoggedIn={isLoggedIn}
                        onLogout={handleLogout}
                        onUpload={handleImageUpload}
                    />
                </BackgroundColorProvider>
            </BackgroundStyleProvider>

            {/* 如果设置了预览图片，则显示预览弹窗 */}
            {previewUrl && (
                <PreviewModal
                    image={previewUrl}
                    onClose={() => setPreviewUrl(null)}
                />
            )}
        </div>
    );
};

export default WishWall;
