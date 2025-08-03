import React from 'react';
import {FiX} from 'react-icons/fi';
import type {BackgroundStyle} from '@/types';
import {useBackgroundColor} from '@/contexts/BackgroundColorContext.tsx';
import {useBackgroundStyle} from '@/contexts/BackgroundStyleContext.tsx';
import {getCenterModalVariants} from '@/utils/animation.tsx';
import CenteredModal from "./CenteredModal.tsx";

interface StyleSettingsModalProps {
    onClose: () => void;

    // 控制是否显示遮罩层的可选参数，默认为 false
    withBackdrop?: boolean;
}

const StyleSettingsModal: React.FC<StyleSettingsModalProps> = ({
                                                                   onClose,
                                                                   withBackdrop = false,
                                                               }) => {
    // 取出颜色相关状态和修改方法（墙面颜色、星空背景色）
    const {
        starryBackgroundColor,
        setStarryBackgroundColor,
        wallColor,
        setWallColor,
        groundColor,
        setGroundColor
    } = useBackgroundColor();

    // 取出背景样式的当前值和修改函数（none、stars、gradient、grid）
    const {backgroundStyle, setBackgroundStyle} = useBackgroundStyle();

    // 图标的统一样式定义
    const iconStyle: React.CSSProperties = {
        width: 24,
        height: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        lineHeight: 1,
        textAlign: 'center',
        flexShrink: 0,
    };

    return (
        <CenteredModal
            // 弹出动画配置
            centerModalVariants={getCenterModalVariants()}
            // 弹框内容宽度与布局
            className="w-60 flex flex-col gap-4 text-sm"
            // 是否显示遮罩层
            showBackdrop={withBackdrop}
        >
            {/* 关闭按钮，位于右上角 */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white/50 hover:text-white"
                aria-label="关闭"
                type="button"
            >
                <FiX size={18}/>
            </button>

            {/* 设置墙面颜色 */}
            <label title="墙面颜色" className="flex items-center gap-2 cursor-pointer max-w-max">
                <span role="img" aria-label="wall" style={iconStyle}>🧱</span>
                <input
                    type="color"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="w-9 h-9 bg-transparent border-none rounded-md shadow-sm p-0 cursor-pointer"
                    style={{boxShadow: '0 0 5px rgba(0,0,0,0.3)'}}
                />
            </label>

            {/* 设置星空背景颜色 */}
            <label title="星空背景颜色" className="flex items-center gap-2 cursor-pointer max-w-max">
                <span role="img" aria-label="starry background" style={iconStyle}>🌌</span>
                <input
                    type="color"
                    value={starryBackgroundColor}
                    onChange={(e) => setStarryBackgroundColor(e.target.value)}
                    className="w-9 h-9 bg-transparent border-none rounded-md shadow-sm p-0 cursor-pointer"
                    style={{boxShadow: '0 0 5px rgba(0,0,0,0.3)'}}
                />
            </label>

            {/* 设置地面颜色 */}
            <label title="地面颜色" className="flex items-center gap-2 cursor-pointer max-w-max">
                <span role="img" aria-label="ground" style={iconStyle}>🪨</span>
                <input
                    type="color"
                    value={groundColor}
                    onChange={(e) => setGroundColor(e.target.value)}
                    className="w-9 h-9 bg-transparent border-none rounded-md shadow-sm p-0 cursor-pointer"
                    style={{ boxShadow: '0 0 5px rgba(0,0,0,0.3)' }}
                />
            </label>

            {/* 设置背景样式类型 */}
            <label title="背景样式" className="flex items-center gap-2 cursor-pointer">
                <span role="img" aria-label="style" style={iconStyle}>🎨</span>
                <select
                    value={backgroundStyle}
                    onChange={(e) => setBackgroundStyle(e.target.value as BackgroundStyle)}
                    className="flex-grow px-2 py-1 rounded-lg bg-[#2a2a38] text-white border border-gray-600 cursor-pointer text-sm"
                >
                    <option value="none">无</option>
                    <option value="stars">星空</option>
                    <option value="gradient">渐变</option>
                    <option value="grid">网格</option>
                </select>
            </label>
        </CenteredModal>
    );
};

export default StyleSettingsModal;
