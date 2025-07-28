import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import CloseButton from "./CloseButton.tsx";

interface PreviewModalProps {
    image: string | null;
    onClose: () => void;
}

export default function PreviewModal({ image, onClose }: PreviewModalProps) {
    const [visible, setVisible] = useState(false);

    // 当 image 变化时设置显示状态
    useEffect(() => {
        if (image) {
            setVisible(true);
        }
    }, [image]);

    // 按 Esc 关闭
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setVisible(false);
            }
        };

        if (image) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [image]);

    // 动画退出后真正触发 onClose
    const handleExitComplete = () => {
        if (!visible) {
            onClose();
        }
    };

    // 点击关闭按钮
    const handleClose = () => {
        setVisible(false);
    };

    return (
        <AnimatePresence onExitComplete={handleExitComplete}>
            {image && visible && (
                <motion.div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative max-w-4xl w-full max-h-[90vh] p-2"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {/* 关闭按钮 */}
                        <CloseButton onClose={handleClose} />

                        {/* 图片预览 */}
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
