import React from 'react';
import {motion, type TargetAndTransition} from 'framer-motion';
import {getCenterModalVariants} from "@/utils/animation.tsx";

/**
 * 定义 CenteredModal 组件的属性类型
 */
interface CenteredModalProps {
    // 弹窗内容区域
    children: React.ReactNode;

    // 自定义类名，可用于外部扩展样式
    className?: string;

    // 弹窗的动画配置：初始态、进入态、退出态
    centerModalVariants?: {
        initial: TargetAndTransition;
        animate: TargetAndTransition;
        exit: TargetAndTransition;
    };

    // 是否显示背景遮罩层，默认开启
    showBackdrop?: boolean;
}

/**
 * CenteredModal 是一个居中的通用弹窗容器组件
 * 提供基础的动画过渡、遮罩背景、点击拦截等功能
 */
const CenteredModal: React.FC<CenteredModalProps> = ({
                                                         children,
                                                         className = '',
                                                         centerModalVariants = getCenterModalVariants(),
                                                         showBackdrop = true,
                                                     }) => {
    return (
        <div
            className={`fixed inset-0 z-[20] flex items-center justify-center ${
                showBackdrop ? 'bg-black/20' : ''
            }`}
        >
            <motion.div
                initial={centerModalVariants.initial}
                animate={centerModalVariants.animate}
                exit={centerModalVariants.exit}
                transition={{duration: 0.25, ease: 'easeOut'}}
                // 阻止点击事件冒泡，防止点击内容区域时关闭弹窗
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-[#1e1e28d9] rounded-lg p-4 text-white shadow-lg cursor-default select-none ${className}`}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default CenteredModal;
