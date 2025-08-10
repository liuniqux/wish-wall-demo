import React, { useEffect } from 'react';
import { Environment, useProgress } from '@react-three/drei';

interface HDRBackgroundLoaderProps {
    /** .hdr 文件路径（必须放在 public 目录内） */
    hdrPath: string;

    /** 可选：加载完成后的回调 */
    onLoaded?: () => void;

    /** 可选：加载中展示的备用内容 */
    fallback?: React.ReactNode;
}

/**
 * HDR 背景异步加载器：
 * - 加载 .hdr 文件作为环境光与背景
 * - 加载过程中显示 fallback（或默认提示）
 * - 加载完成后触发回调
 */
const HDRBackgroundLoader: React.FC<HDRBackgroundLoaderProps> = ({
                                                                     hdrPath,
                                                                     onLoaded,
                                                                 }) => {
    const { loaded, total } = useProgress();
    const isReady = loaded === total;

    useEffect(() => {
        if (isReady && onLoaded) {
            onLoaded();
        }
    }, [isReady, onLoaded]);

    return (
        <>
            {isReady && (
                <Environment files={hdrPath} background />
            )}
        </>
    );
};

export default HDRBackgroundLoader;
