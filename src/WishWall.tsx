import React, { useCallback, useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import FloatingImage from './components/FloatingImage';
import Ground from './components/Ground';
import CameraController from './components/CameraController';
import StarryWall from './components/StarryWall';
import PreviewModal from './components/PreviewModal';

const STEP_HEIGHT = 0.5;
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
                let { width, height } = img;
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

const WishWall: React.FC = () => {
    const velocity = useState(() => new THREE.Vector3())[0];
    const [imageList, setImageList] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]); // 新图片单独状态
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [wallLength, setWallLength] = useState(10);
    const [groundLength, setGroundLength] = useState(20);

    const updateImageList = useCallback(
        debounce((newUrls: string[]) => {
            setImageList(prev => [...prev, ...newUrls]);
            setNewImages([]); // 清空新图片
        }, 100),
        []
    );

    const updateLengths = useCallback(
        debounce((imageCount: number) => {
            setWallLength(imageCount * 3 + 10);
            setGroundLength(imageCount * 3 + 20);
        }, 200),
        []
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const urls = await Promise.all(
                Array.from(files).map(async file => await resizeImage(file, 1024))
            );
            const preloadPromises = urls.map(
                url =>
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
                updateImageList(urls);
                updateLengths(imageList.length + urls.length);
            } catch (error) {
                console.error('Image preload failed:', error);
            }
        }
    };

    const handleDelete = useCallback((urlToDelete: string) => {
        URL.revokeObjectURL(urlToDelete);
        setImageList(prev => {
            const newList = prev.filter(u => u !== urlToDelete);
            updateLengths(newList.length);
            return newList;
        });
        setNewImages(prev => prev.filter(u => u !== urlToDelete));
        if (previewUrl === urlToDelete) setPreviewUrl(null);
    }, [previewUrl, updateLengths]);

    const handlePreview = useCallback((urlToPreview: string) => {
        setPreviewUrl(urlToPreview);
    }, []);

    useEffect(() => {
        const initialImages = [
            'https://linux.do/uploads/default/original/2X/b/bc9d1a2b4219f9c23dde4bc39fe3fbd8f6a4b13d.jpeg',
        ];
        setImageList(initialImages);
        updateLengths(initialImages.length);
        return () => {
            imageList.forEach(url => URL.revokeObjectURL(url));
            newImages.forEach(url => URL.revokeObjectURL(url));
        };
    }, [updateLengths]);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 1,
                    background: 'rgba(255, 255, 255, 0.85)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                        width: '250px',
                        backgroundColor: '#fff',
                    }}
                />
            </motion.div>

            <Canvas
                camera={{ position: [0, cameraStartY, cameraStartZ], fov: 75 }}
                style={{ backgroundColor: 'black' }}
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
                <CameraController velocity={velocity} wishCount={imageList.length + newImages.length} />
                <OrbitControls enablePan={false} enableZoom={false} />
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