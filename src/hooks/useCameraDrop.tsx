import { useState } from 'react';

/**
 * 管理相机下落状态的 Hook。
 * 统一由此控制，避免重复状态定义。
 */
export const useCameraDrop = () => {
    const [cameraDropEnabled, setCameraDropEnabled] = useState(false);

    const enableDrop = () => setCameraDropEnabled(true);
    const disableDrop = () => setCameraDropEnabled(false);

    return {
        cameraDropEnabled,
        enableDrop,
        disableDrop
    };
};
