import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

import FloatingImage from './FloatingImage.tsx';
import Ground from './Ground.tsx';
import CameraController from './CameraController.tsx';
import StarryWall from './StarryWall.tsx';
import CameraResetter from './CameraResetter.tsx';
import { useBackgroundColor } from '../../contexts/BackgroundColorContext.tsx';
import SceneSettingsPanel from "../ui/SceneSettingsPanel.tsx";

const STEP_HEIGHT = 1;
const STEP_COUNT = 20;
const cameraStartY = -2.5 + STEP_HEIGHT * STEP_COUNT;
const cameraStartZ = 0;

interface SceneContentProps {
    imageList: string[];
    newImages: string[];
    groundLength: number;
    wallLength: number;
    velocity: THREE.Vector3;
    cameraDropEnabled: boolean;
    handleDelete: (url: string) => void;
    handlePreview: (url: string) => void;
    isLoggedIn: boolean;
    onLogout: () => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

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
    const { starryBackgroundColor } = useBackgroundColor();

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {isLoggedIn && (
                <SceneSettingsPanel
                    onLogout={onLogout}
                    onUpload={onUpload}
                />
            )}

            <Canvas
                camera={{ position: [0, cameraStartY, cameraStartZ], fov: 75 }}
                style={{ backgroundColor: starryBackgroundColor }}
                gl={{ localClippingEnabled: true }}
            >
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                <Ground groundLength={groundLength} />
                <StarryWall height={wallLength} />

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

                <CameraController
                    velocity={velocity}
                    wishCount={imageList.length + newImages.length}
                    enabled={cameraDropEnabled}
                />
                <CameraResetter enabled={!isLoggedIn} />
            </Canvas>
        </div>
    );
};

export default SceneContent;
