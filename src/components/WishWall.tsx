import React, {Suspense, useEffect, useMemo, useState} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber';
import {OrbitControls, Stars} from '@react-three/drei';
import * as THREE from 'three';
import debounce from 'lodash/debounce';

import FloatingImage from './FloatingImage.tsx';
import Ground from './Ground.tsx';
import CameraController from './CameraController.tsx';
import StarryWall from './StarryWall.tsx';
import PreviewModal from './PreviewModal.tsx';

import AuthForm from './AuthForm.tsx';
import UploadForm from './UploadForm.tsx';
import type {FormMode} from '../types';

const STEP_HEIGHT = 1;
const STEP_COUNT = 20;
const cameraStartY = -2.5 + STEP_HEIGHT * STEP_COUNT;
const cameraStartZ = 0;

const resizeImage = (file: File, maxSize: number): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let {width, height} = img;
                if (width > height && width > maxSize) {
                    height = (maxSize / width) * height;
                    width = maxSize;
                } else if (height > maxSize) {
                    width = (maxSize / height) * width;
                    height = maxSize;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/png'));
            };
        };
        reader.readAsDataURL(file);
    });
};

const CameraResetter = ({enabled}: { enabled: boolean }) => {
    const {camera} = useThree();
    useFrame(() => {
        if (!enabled) return;
        const dy = cameraStartY - camera.position.y;
        if (Math.abs(dy) > 0.01) {
            camera.position.y += dy * 0.05;
        }
    });
    return null;
};

const WishWall: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formMode, setFormMode] = useState<FormMode>('login');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const velocity = useState(() => new THREE.Vector3())[0];
    const [imageList, setImageList] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [wallLength, setWallLength] = useState(10);
    const [groundLength, setGroundLength] = useState(20);
    const [cameraDropEnabled, setCameraDropEnabled] = useState(false);

    // 防抖更新图片列表，只创建一次
    const debouncedUpdateImageList = useMemo(() =>
            debounce((newUrls: string[]) => {
                setImageList(prev => [...prev, ...newUrls]);
                setNewImages([]);
            }, 100),
        []);

    // 防抖更新墙体和地面长度，只创建一次
    const debouncedUpdateLengths = useMemo(() =>
            debounce((count: number) => {
                setWallLength(count * 3 + 10);
                setGroundLength(count * 3 + 20);
            }, 200),
        []);

    // 组件卸载时取消防抖
    useEffect(() => {
        return () => {
            debouncedUpdateImageList.cancel();
            debouncedUpdateLengths.cancel();
        };
    }, [debouncedUpdateImageList, debouncedUpdateLengths]);

    // 监听图片列表变化，更新墙和地面长度
    useEffect(() => {
        debouncedUpdateLengths(imageList.length);
    }, [imageList, debouncedUpdateLengths]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const urls = await Promise.all(
                Array.from(files).map(async file => await resizeImage(file, 1024))
            );

            const preloadPromises = urls.map(url =>
                new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                })
            );

            try {
                await Promise.all(preloadPromises);
                setNewImages(urls); // 先渲染新图片
                debouncedUpdateImageList(urls); // 异步合并图片列表
            } catch (error) {
                console.error('Image preload failed:', error);
            }
        }
    };

    const handleDelete = (urlToDelete: string) => {
        URL.revokeObjectURL(urlToDelete);
        setImageList((prev) => {
            return prev.filter((u) => u !== urlToDelete);
        });
        setNewImages((prev) => prev.filter((u) => u !== urlToDelete));
        if (previewUrl === urlToDelete) setPreviewUrl(null);
    };

    const handlePreview = (urlToPreview: string) => {
        setPreviewUrl(urlToPreview);
    };

    // 初始化图片和长度，只执行一次
    useEffect(() => {
        const initialImages = [
            'https://linux.do/uploads/default/original/2X/b/bc9d1a2b4219f9c23dde4bc39fe3fbd8f6a4b13d.jpeg',
        ];
        setImageList(initialImages);
        setWallLength(initialImages.length * 3 + 10);
        setGroundLength(initialImages.length * 3 + 20);
    }, []);

    // 清理 URL 对象，在 imageList 或 newImages 变化或组件卸载时执行
    useEffect(() => {
        return () => {
            imageList.forEach((url) => URL.revokeObjectURL(url));
            newImages.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imageList, newImages]);


    const handleLogin = () => {
        if (username === 'user' && password === '123456') {
            setError(null);
            setIsLoggedIn(true);
            setFormMode('upload');
            setCameraDropEnabled(false);
        } else {
            setError('用户名或密码错误');
        }
    };

    const handleRegister = () => {
        if (username && password) {
            setError(null);
            setIsLoggedIn(true);
            setFormMode('upload');
            setCameraDropEnabled(false);
        } else {
            setError('请输入用户名和密码');
        }
    };

    const handleVisitorLogin = () => {
        setIsLoggedIn(true);
        setFormMode('upload');
        setCameraDropEnabled(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setFormMode('login');
        setCameraDropEnabled(false);
        setUsername('');
        setPassword('');
        setError(null);
    };

    return (
        <div className="w-screen h-screen">
            {!isLoggedIn || formMode !== 'upload' ? (
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
            ) : (
                <UploadForm
                    onUpload={handleImageUpload}
                    onLogout={handleLogout}
                />
            )}

            <Canvas
                camera={{position: [0, cameraStartY, cameraStartZ], fov: 75}}
                style={{backgroundColor: 'black'}}
                gl={{localClippingEnabled: true}}
            >
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade/>
                <ambientLight intensity={0.4}/>
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow/>
                <Ground groundLength={groundLength}/>
                <StarryWall height={wallLength}/>
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
                <CameraResetter enabled={!isLoggedIn}/>
                <OrbitControls enablePan={false} enableZoom={false}/>
            </Canvas>

            {previewUrl && (
                <PreviewModal
                    visible={!!previewUrl}
                    imageUrl={previewUrl}
                    onClose={() => setPreviewUrl(null)}
                />
            )}
        </div>
    );
};

export default WishWall;
