import { useState, useMemo, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { resizeImage } from '@/utils/image.tsx';

interface UseImageListWithBufferReturn {
    imageList: string[];
    newImages: string[];
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDelete: (url: string) => void;
    handlePreview: (url: string) => void;
    setInitialImages: (urls: string[]) => void;
}

export const useImageListWithBuffer = (): UseImageListWithBufferReturn => {
    const [imageList, setImageList] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const debouncedUpdateImageList = useMemo(() =>
        debounce((newUrls: string[]) => {
            setImageList((prev) => [...prev, ...newUrls]);
            setNewImages([]);
        }, 100), []
    );

    useEffect(() => {
        return () => {
            debouncedUpdateImageList.cancel();
        };
    }, [debouncedUpdateImageList]);

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            try {
                const urls = await Promise.all(
                    Array.from(files).map(file => resizeImage(file, 1024))
                );
                await Promise.all(urls.map(url => new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
                })));
                setNewImages(urls);
                debouncedUpdateImageList(urls);
            } catch (error) {
                console.error('Image preload failed:', error);
            }
        }
    }, [debouncedUpdateImageList]);

    const handleDelete = useCallback((urlToDelete: string) => {
        URL.revokeObjectURL(urlToDelete);
        setImageList(prev => prev.filter(u => u !== urlToDelete));
        setNewImages(prev => prev.filter(u => u !== urlToDelete));
        if (previewUrl === urlToDelete) setPreviewUrl(null);
    }, [previewUrl]);

    const handlePreview = useCallback((urlToPreview: string) => {
        setPreviewUrl(urlToPreview);
    }, []);

    // 关键改造点：用 useCallback 包裹，避免引用变动导致无限循环
    const setInitialImages = useCallback((urls: string[]) => {
        setImageList(urls);
        setNewImages([]);
    }, []);

    return {
        imageList,
        newImages,
        previewUrl,
        setPreviewUrl,
        handleImageUpload,
        handleDelete,
        handlePreview,
        setInitialImages,
    };
};
