/**
 * resizeImage
 * 压缩图片工具函数，将上传的图片按最大尺寸进行等比缩放，返回 base64 编码的 PNG 图片数据。
 *
 * @param file - 原始图片文件（File 对象）
 * @param maxSize - 图片最大宽高限制（例如 1024 表示宽或高最大为 1024）
 * @returns Promise<string> - 返回压缩后的 base64 格式 PNG 图片字符串
 */
export const resizeImage = (file: File, maxSize: number): Promise<string> => {
    return new Promise((resolve) => {
        // 创建图片对象用于加载图片数据
        const img = new Image();

        // 使用 FileReader 将文件读取为 base64 数据
        const reader = new FileReader();
        reader.onload = (e) => {
            // 设置图片的源为读取结果（base64）
            img.src = e.target?.result as string;

            img.onload = () => {
                // 创建 canvas 用于绘制缩放后的图片
                const canvas = document.createElement('canvas');
                let {width, height} = img;

                /**
                 * 计算缩放后的宽高，保持图片原始比例
                 * 优先限制较大的维度不超过 maxSize
                 */
                if (width > height && width > maxSize) {
                    height = (maxSize / width) * height;
                    width = maxSize;
                } else if (height > maxSize) {
                    width = (maxSize / height) * width;
                    height = maxSize;
                }

                // 设置 canvas 尺寸
                canvas.width = width;
                canvas.height = height;

                // 获取绘图上下文并将图片绘制到 canvas 中
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(img, 0, 0, width, height);

                // 将 canvas 内容导出为 base64 的 PNG 图片字符串
                resolve(canvas.toDataURL('image/png'));
            };
        };

        // 将文件读取为 base64 字符串
        reader.readAsDataURL(file);
    });
};
