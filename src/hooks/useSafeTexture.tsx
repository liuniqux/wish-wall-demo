import { useEffect, useState } from 'react';
import * as THREE from 'three';

function useSafeTexture(url: string, fallbackUrl?: string) {
    const [texture, setTexture] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            tex => {
                if (isMounted) setTexture(tex);
            },
            undefined, // 进度回调不需要
            () => {
                console.error(`图片加载失败: ${url}`);
                if (fallbackUrl) {
                    loader.load(fallbackUrl, tex => {
                        if (isMounted) setTexture(tex);
                    });
                } else {
                    // 如果没有备用图，就用一个纯色纹理
                    const fallback = new THREE.Texture(
                        createFallbackCanvas('#555') // 灰色
                    );
                    fallback.needsUpdate = true;
                    if (isMounted) setTexture(fallback);
                }
            }
        );

        return () => {
            isMounted = false;
        };
    }, [url, fallbackUrl]);

    return texture;
}

// 生成纯色 Canvas 纹理
function createFallbackCanvas(color: string) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
}

export default useSafeTexture;
