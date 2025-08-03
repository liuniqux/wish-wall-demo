import React, {Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {Stars} from '@react-three/drei';
import * as THREE from 'three';

import FloatingImage from '@/components/scene/FloatingImage.tsx';
import Ground from '@/components/scene/Ground.tsx';
import CameraController from '@/components/scene/CameraController.tsx';
import StarryWall from '@/components/scene/StarryWall.tsx';
import CameraResetter from '@/components/scene/CameraResetter.tsx';
import {useBackgroundColor} from '@/contexts/BackgroundColorContext.tsx';
import SceneSettingsPanel from '@/components/ui/SceneSettingsPanel.tsx';

/**
 * 相机初始位置设置
 * STEP_HEIGHT：每一层楼梯高度
 * STEP_COUNT：总台阶数
 * cameraStartY：初始 Y 坐标，确保相机刚好位于最顶层
 * cameraStartZ：初始 Z 坐标
 */
const STEP_HEIGHT = 1;
const STEP_COUNT = 20;
const cameraStartY = -2.5 + STEP_HEIGHT * STEP_COUNT;
const cameraStartZ = 0;

interface SceneContentProps {
    // 当前场景中已存在的图片 URL 列表
    imageList: string[];
    // 新上传的图片 URL 列表
    newImages: string[];
    // 地面长度（用于 Ground）
    groundLength: number;
    // 墙面高度（用于 StarryWall）
    wallLength: number;
    // 相机向下移动的速度向量
    velocity: THREE.Vector3;
    // 是否开启“自动下落”镜头模式
    cameraDropEnabled: boolean;
    // 图片删除回调
    handleDelete: (url: string) => void;
    // 图片点击预览回调
    handlePreview: (url: string) => void;
    // 当前用户是否已登录
    isLoggedIn: boolean;
    // 登出事件处理
    onLogout: () => void;
    // 图片上传事件处理
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * SceneContent 组件负责渲染整个 3D 场景：
 * - 含地面、星空背景、浮动图片、控制器、登录用户的设置面板等。
 */
const SceneContent: React.FC<SceneContentProps> = ({
                                                       imageList,
                                                       newImages,
                                                       groundLength,
                                                       wallLength,
                                                       velocity,
                                                       cameraDropEnabled,
                                                       handleDelete,
                                                       handlePreview,
                                                       isLoggedIn,
                                                       onLogout,
                                                       onUpload,
                                                   }) => {
    const {starryBackgroundColor} = useBackgroundColor(); // 获取背景色上下文

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            {/* 登录用户才展示设置面板（上传、登出） */}
            {isLoggedIn && (
                <SceneSettingsPanel onLogout={onLogout} onUpload={onUpload}/>
            )}

            {/* 主渲染区域 */}
            <Canvas
                camera={{position: [0, cameraStartY, cameraStartZ], fov: 75}}
                style={{backgroundColor: starryBackgroundColor}}
                gl={{localClippingEnabled: true}}
            >
                {/* 星空背景与光照设置 */}
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade/>
                <ambientLight intensity={0.4}/>
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow/>

                {/* 地面与背景墙 */}
                <Ground groundLength={groundLength}/>
                <StarryWall wallLength={wallLength}/>

                {/* 渲染已有图片 */}
                <Suspense fallback={null}>
                    {imageList.map((url, index) => (
                        <FloatingImage
                            key={url}
                            url={url}
                            index={index}
                            onDelete={handleDelete}
                            onPreview={handlePreview}
                        />
                    ))}
                </Suspense>

                {/* 渲染新增图片 */}
                <Suspense fallback={null}>
                    {newImages.map((url, index) => (
                        <FloatingImage
                            key={url}
                            url={url}
                            index={imageList.length + index}
                            onDelete={handleDelete}
                            onPreview={handlePreview}
                        />
                    ))}
                </Suspense>

                {/* 相机控制器，支持自动下落 */}
                <CameraController
                    velocity={velocity}
                    wishCount={imageList.length + newImages.length}
                    enabled={cameraDropEnabled}
                />

                {/* 若未登录，则允许手动重置相机位置 */}
                <CameraResetter enabled={!isLoggedIn}/>
            </Canvas>
        </div>
    );
};

export default SceneContent;
