import {useImageListWithBuffer} from '@/hooks/useImageListWithBuffer';
import {useWallAndGround} from '@/hooks/useWallAndGround';
import {useSceneControl} from '@/hooks/useSceneControl';
import {useLoginForm} from '@/hooks/useLoginForm';
import {useState} from 'react';
import {useLogout} from "@/hooks/useLogout.tsx";

/**
 * useWishWall：许愿墙业务聚合 Hook
 * - 聚合登录表单状态、图片墙管理、摄像机控制、墙体布局等逻辑
 */
export const useWishWall = () => {
    /**
     * 用户登录表单管理
     * 三个行为分别为登录成功 / 注册成功 / 游客登录时调用摄像机动画
     */
    const {
        formMode, setFormMode,
        username, setUsername,
        password, setPassword,
        loginError, setLoginError,
        registerError, setRegisterError,
        loading,
        handleLogin,
        // 执行注册
        handleRegister,
        // 执行访客登录
        handleVisitorLogin,
        resetForm,
    } = useLoginForm(
        () => setLoggedIn(true),
        () => setLoggedIn(true),
        () => setLoggedIn(true),
    );

    /**
     * 全局登录状态控制，用于决定摄像机是否启用下落
     */
    const [isLoggedIn, setLoggedIn] = useState(false);

    const {handleLogout} = useLogout(() => {
        setLoggedIn(false);
    })

    /**
     * 摄像机控制，包括 velocity 和 cameraDropEnabled
     * 登录状态变更时自动触发 enable/disable drop
     */
    const {
        velocity,
        setVelocity,
        cameraDropEnabled,
    } = useSceneControl(isLoggedIn);

    /**
     * 图片上传管理，包括列表、缓存、预览等
     */
    const {
        // 当前展示的图片列表（已上传 + 缓存）
        imageList,
        // 刚刚上传但尚未提交的图片缓存
        newImages,
        // 当前预览中的图片 URL
        previewUrl,
        // 设置预览图片 URL
        setPreviewUrl,
        // 执行图片上传
        handleImageUpload,
        // 执行图片删除
        handleDelete,
        // 执行图片预览
        handlePreview,
        // 设置初始图片列表（从服务器拉取）
        setInitialImages,
    } = useImageListWithBuffer();

    /**
     * 根据图片数量自动计算墙长与地面长
     */
    const {wallLength, groundLength} = useWallAndGround(imageList.length);

    /**
     * 返回统一结构供 WishWall 主组件使用
     */
    return {
        // 登录相关
        isLoggedIn,
        formMode, setFormMode,
        username, setUsername,
        password, setPassword,

        // 统一错误和 setError 映射
        error: formMode === 'login' ? loginError : formMode === 'register' ? registerError : null,
        setError: formMode === 'login' ? setLoginError : formMode === 'register' ? setRegisterError : () => {
        },

        loading,
        handleLogin,
        handleRegister,
        handleVisitorLogin,
        handleLogout,
        resetForm,

        // 摄像机相关
        velocity,
        setVelocity,
        cameraDropEnabled,

        // 图片相关
        imageList,
        newImages,
        previewUrl,
        setPreviewUrl,
        handleImageUpload,
        handleDelete,
        handlePreview,
        setInitialImages,

        // 场景尺寸
        wallLength,
        groundLength,
    };
};
