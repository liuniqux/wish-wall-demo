import React from 'react';
import { motion, type TargetAndTransition } from 'framer-motion';

/**
 * 定义 CenteredModal 组件的属性类型
 */
interface CenteredModalProps {
    // 弹窗内容区域
    children: React.ReactNode;

    // 自定义类名，可用于外部扩展样式
    className?: string;

    // 弹窗的动画配置：初始态、进入态、退出态
    animationVariants?: {
        initial: TargetAndTransition;
        animate: TargetAndTransition;
        exit: TargetAndTransition;
    };

    // 是否显示背景遮罩层，默认开启
    showBackdrop?: boolean;
}

/**
 * 默认的动画变体，用于控制弹窗出现与关闭时的过渡效果
 */
const defaultVariants: NonNullable<CenteredModalProps['animationVariants']> = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
};

/**
 * CenteredModal 是一个居中的通用弹窗容器组件
 * 提供基础的动画过渡、遮罩背景、点击拦截等功能
 */
const CenteredModal: React.FC<CenteredModalProps> = ({
                                                         children,
                                                         className = '',
                                                         animationVariants = defaultVariants,
                                                         showBackdrop = true,
                                                     }) => {
    return (
        <div
            className={`fixed inset-0 z-[20] flex items-center justify-center ${
                showBackdrop ? 'bg-black/20' : ''
            }`}
        >
            <motion.div
                initial={animationVariants.initial}
                animate={animationVariants.animate}
                exit={animationVariants.exit}
                transition={{ duration: 0.25, ease: 'easeOut' }}
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
