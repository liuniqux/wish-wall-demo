import * as THREE from 'three';
import {useRef, useState} from 'react';
import {useAuth} from '@/hooks/useAuth';
import {useImageListWithBuffer} from '@/hooks/useImageListWithBuffer';
import {useWallAndCamera} from '@/hooks/useWallAndCamera';

export const useWishWall = () => {
    const velocity = useRef(new THREE.Vector3());
    const [cameraDropEnabled, setCameraDropEnabled] = useState(false);

    // 传入登录状态变化的回调
    const {
        isLoggedIn,
        formMode,
        setFormMode,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,
        handleLogin,
        handleRegister,
        handleVisitorLogin,
        handleLogout,
    } = useAuth({
        onLoginChange: (loggedIn) => {
            setCameraDropEnabled(loggedIn);
        },
    });

    const {
        imageList,
        newImages,
        previewUrl,
        setPreviewUrl,
        handleImageUpload,
        handleDelete,
        handlePreview,
        setInitialImages,
    } = useImageListWithBuffer();

    const {
        wallLength,
        groundLength,
    } = useWallAndCamera(imageList.length);

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