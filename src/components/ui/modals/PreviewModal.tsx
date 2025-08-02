import {motion, AnimatePresence} from "framer-motion";
import {useEffect, useState} from "react";
import CloseButton from "@/components/ui/CloseButton.tsx";

interface PreviewModalProps {
    // 要预览的图片 URL，如果为 null 表示不显示
    image: string | null;
    // 关闭弹窗的回调
    onClose: () => void;
}

export default function PreviewModal({image, onClose}: PreviewModalProps) {
    // 控制 modal 内部动画的可见状态
    const [visible, setVisible] = useState(false);

    // 每当传入新的 image 时，触发展示动画
    useEffect(() => {
        if (image) {
            setVisible(true);
        }
    }, [image]);

    // 监听键盘 Esc 键，用于关闭 modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setVisible(false);
            }
        };

        if (image) {
            window.addEventListener("keydown", handleKeyDown);
        }

        // 清理监听器
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [image]);

    // 当动画退出完成时触发真正的 onClose，避免直接闪退
    const handleExitComplete = () => {
        if (!visible) {
            onClose();
        }
    };

    // 手动点击关闭按钮的处理
    const handleClose = () => {
        setVisible(false);
    };

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {image && visible && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                >
                    <motion.div
                        className="relative max-w-4xl w-full max-h-[90vh] p-2"
                        initial={{scale: 0.9, opacity: 0}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.9, opacity: 0}}
                        transition={{duration: 0.3, ease: "easeInOut"}}
                    >
                        {/* 右上角关闭按钮 */}
                        <CloseButton onClose={handleClose}/>

                        {/* 图片内容区域 */}
                        <img
                            src={image}
                            alt="Preview"
                            className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
