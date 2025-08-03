import * as THREE from 'three';
import {useRef} from 'react';

import {useAuth} from '@/hooks/useAuth';
import {useImageListWithBuffer} from '@/hooks/useImageListWithBuffer';
import {useWallAndCamera} from '@/hooks/useWallAndCamera';
import {useCameraDrop} from '@/hooks/useCameraDrop';

/**
 * useWishWall 是许愿墙的业务逻辑统一管理 Hook，
 * 负责整合用户登录、图片管理、墙面布局、摄像机逻辑等多个子模块的状态与操作。
 */
export const useWishWall = () => {
    /**
     * 用于记录摄像机下落时的速度（物理模拟），
     * 通过 useRef 创建一个可变引用，避免组件重渲染。
     */
    const velocity = useRef(new THREE.Vector3());

    /**
     * 摄像机“下落动画”状态控制：
     * cameraDropEnabled - 当前是否启用摄像机下落效果
     * enableDrop / disableDrop - 显式启用或禁用摄像机下落
     */
    const {
        cameraDropEnabled,
        enableDrop,
        disableDrop,
    } = useCameraDrop();

    /**
     * 用户认证状态与方法，通过 useAuth 管理。
     * 提供登录、注册、访客登录、退出等功能。
     * 登录状态变更时，触发摄像机动画控制（如启用下落）。
     */
    const {
        // 当前登录状态
        isLoggedIn,
        // 当前表单模式（登录或注册）
        formMode,
        // 设置表单模式
        setFormMode,
        // 用户名输入值
        username,
        // 设置用户名
        setUsername,
        // 密码输入值
        password,
        // 设置密码
        setPassword,
        // 当前表单错误信息
        error,
        // 设置错误信息
        setError,
        // 执行登录
        handleLogin,
        // 执行注册
        handleRegister,
        // 执行访客登录
        handleVisitorLogin,
        // 执行登出
        handleLogout,
    } = useAuth({
        // 登录状态变化后的回调，用于触发摄像机动画
        onLoginChange: (loggedIn) => {
            if (loggedIn) {
                enableDrop();
            } else {
                disableDrop();
            }
        }
    });

    /**
     * 图片墙图片管理逻辑，使用带有缓冲区的 Hook 管理 imageList 与 newImages。
     * 支持上传、删除、预览、初始设置等操作。
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
     * 根据图片数量动态计算墙面长度与地面长度。
     * 保证图片分布合理、摄像机视角自然。
     */
    const {
        // 墙面长度
        wallLength,
        // 地面长度
        groundLength,
    } = useWallAndCamera(imageList.length);

    /**
     * 返回统一的数据结构，供 WishWall 主组件使用。
     * 所有 UI 层面所需的状态和操作均从此 Hook 获取。
     */
    return {
        isLoggedIn,
        formMode,
        setFormMode,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,

        // 摄像机速度向量
        velocity: velocity.current,
        imageList,
        newImages,
        previewUrl,
        setPreviewUrl,
        wallLength,
        groundLength,
        cameraDropEnabled,

        handleImageUpload,
        handleDelete,
        handlePreview,
        handleLogin,
        handleRegister,
        handleVisitorLogin,
        handleLogout,
        setInitialImages,
    };
};
