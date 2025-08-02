// 图片压缩工具（不变）
export const resizeImage = (file: File, maxSize: number): Promise<string> => {
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