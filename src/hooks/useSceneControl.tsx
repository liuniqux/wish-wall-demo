import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useCameraDrop } from '@/hooks/useCameraDrop';

/**
 * useSceneControl：用于处理 3D 场景相关的控制状态
 * - 摄像机 velocity 向量
 * - 是否启用摄像机自动下落
 */
export const useSceneControl = (isLoggedIn: boolean) => {
    const velocity = useRef(new THREE.Vector3());

    const {
        cameraDropEnabled,
        enableDrop,
        disableDrop,
    } = useCameraDrop();

    // 登录状态变更后，控制摄像机是否下落
    useEffect(() => {
        if (isLoggedIn) {
            enableDrop();
        } else {
            disableDrop();
        }
    }, [isLoggedIn, enableDrop, disableDrop]);

    const setVelocity = useCallback((v: THREE.Vector3) => {
        velocity.current.copy(v);
    }, []);

    return {
        velocity: velocity.current,
        setVelocity,
        cameraDropEnabled,
    };
};
