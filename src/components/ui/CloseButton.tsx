import React from 'react';

// 引入 framer-motion 实现按钮点击动画
import {motion} from 'framer-motion';

// 引入关闭图标组件
import {X} from 'lucide-react';

// 定义 Props 类型：接收一个关闭回调函数
interface CloseButtonProps {
    onClose: () => void;
    className?: string;
}

// 关闭按钮组件，带动画和样式，位于右上角
const CloseButton: React.FC<CloseButtonProps> = ({onClose, className}) => {

    // 合并类名：使用默认样式 + 用户传入的类名
    const buttonClasses = `
        absolute top-4 right-4 z-50
        p-2 rounded-full
        bg-white/10 hover:bg-white/20
        backdrop-blur-md transition-colors
        ${className || ''}
    `.replace(/\s+/g, ' ').trim(); // 移除多余的换行和空格

    return (
        // 使用 motion.button 实现点击时缩放动画（scale: 0.9）
        <motion.button
            // 点击触发传入的关闭方法
            onClick={onClose}
            // 去除点击时的默认轮廓样式
            style={{outline: 'none'}}
            // 添加轻微点击缩放动画
            whileTap={{scale: 0.9}}
            // 样式
            className={buttonClasses}
        >
            {/* 关闭图标，使用 Lucide 的 X 图标，大小为 20px，颜色白色 */}
            <X className="w-5 h-5 text-white"/>
        </motion.button>
    );
};

export default CloseButton;
