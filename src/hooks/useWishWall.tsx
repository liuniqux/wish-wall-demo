import {useEffect, useMemo, useState, useRef} from 'react';
import * as THREE from 'three';
import debounce from 'lodash/debounce';
import type {FormMode} from '../types';

// 定义 useWishWall 的返回值类型
interface WishWallState {
    isLoggedIn: boolean;
    formMode: FormMode;
    setFormMode: (mode: FormMode) => void;
    username: string;
    setUsername: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    error: string | null;
    setError: (val: string | null) => void;
    velocity: THREE.Vector3;
    imageList: string[];
    newImages: string[];
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void; // 显式声明 setPreviewUrl
    wallLength: number;
    groundLength: number;
    cameraDropEnabled: boolean;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDelete: (url: string) => void;
    handlePreview: (url: string) => void;
    handleLogin: () => void;
    handleRegister: () => void;
    handleVisitorLogin: () => void;
    handleLogout: () => void;
}

export const useWishWall = (): WishWallState => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formMode, setFormMode] = useState<FormMode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const velocity = useRef(new THREE.Vector3());
    const [imageList, setImageList] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [wallLength, setWallLength] = useState(10);
    const [groundLength, setGroundLength] = useState(20);
    const [cameraDropEnabled, setCameraDropEnabled] = useState(false);

    const debouncedUpdateImageList = useMemo(
        () => debounce((newUrls: string[]) => {
            setImageList((prev) => [...prev, ...newUrls]);
            setNewImages([]);
        }, 100),
        []
    );

    const debouncedUpdateLengths = useMemo(
        () => debounce((count: number) => {
            setWallLength(count * 3 + 10);
            setGroundLength(count * 3 + 20);
        }, 200),
        []
    );

    useEffect(() => {
        return () => {
            debouncedUpdateImageList.cancel();
            debouncedUpdateLengths.cancel();
        };
    }, [debouncedUpdateImageList, debouncedUpdateLengths]);

    useEffect(() => {
        debouncedUpdateLengths(imageList.length);
    }, [imageList, debouncedUpdateLengths]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const urls = await Promise.all(
                Array.from(files).map(async (file) => await resizeImage(file, 1024))
            );
            const preloadPromises = urls.map(
                (url) =>
                    new Promise<void>((resolve, reject) => {
                        const img = new Image();
                        img.src = url;
                        img.onload = () => resolve();
                        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                    })
            );
            try {
                await Promise.all(preloadPromises);
                setNewImages(urls);
                debouncedUpdateImageList(urls);
            } catch (error) {
                console.error('Image preload failed:', error);
            }
        }
    };

    const handleDelete = (urlToDelete: string) => {
        URL.revokeObjectURL(urlToDelete);
        setImageList((prev) => prev.filter((u) => u !== urlToDelete));
        setNewImages((prev) => prev.filter((u) => u !== urlToDelete));
        if (previewUrl === urlToDelete) setPreviewUrl(null);
    };

    const handlePreview = (urlToPreview: string) => {
        setPreviewUrl(urlToPreview);
    };

    useEffect(() => {
        const initialImages = [
            'https://linux.do/uploads/default/original/2X/b/bc9d1a2b4219f9c23dde4bc39fe3fbd8f6a4b13d.jpeg',
        ];
        setImageList(initialImages);
        setWallLength(initialImages.length * 3 + 10);
        setGroundLength(initialImages.length * 3 + 20);
    }, []);

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
    };
};

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