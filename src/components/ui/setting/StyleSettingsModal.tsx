import React from 'react';
import { motion } from 'framer-motion';
import type { BackgroundStyle, Direction } from '../../../types.tsx';
import { FiX } from 'react-icons/fi';
import {useBackgroundColor} from "../../../contexts/BackgroundColorContext.tsx";
import {useBackgroundStyle} from "../../../contexts/BackgroundStyleContext.tsx";
import {getAnimationVariants} from "../../../utils/animation.tsx";

interface StyleSettingsModalProps {
    onClose: () => void;
    direction: Direction;
}

const StyleSettingsModal: React.FC<StyleSettingsModalProps> = ({ onClose, direction }) => {
    const { starryBackgroundColor, setStarryBackgroundColor, colorHex, setColorHex } = useBackgroundColor();
    const { backgroundStyle, setBackgroundStyle } = useBackgroundStyle();

    const variants = getAnimationVariants(direction);

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
        <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`absolute  z-[20] ${
                direction === 'top' ? 'bottom-14 right-0' :
                    direction === 'left' ? 'right-14 top-0' :
                        direction === 'right' ? 'left-14 top-0' : 'top-14 right-0'
            } bg-[#1e1e28d9] p-4 rounded-lg w-40 text-white text-sm shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col gap-4 select-none cursor-default`}
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white/50 hover:text-white"
                aria-label="关闭"
            >
                <FiX size={16} />
            </button>
            <label title="墙面颜色" className="flex items-center gap-2 cursor-pointer max-w-max">
                <span role="img" aria-label="wall" style={iconStyle}>🧱</span>
                <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-9 h-9 bg-transparent border-none rounded-md shadow-sm p-0 cursor-pointer"
                    style={{ boxShadow: '0 0 5px rgba(0,0,0,0.3)' }}
                />
            </label>
            <label title="星空背景颜色" className="flex items-center gap-2 cursor-pointer max-w-max">
                <span role="img" aria-label="starry background" style={iconStyle}>🌌</span>
                <input
                    type="color"
                    value={starryBackgroundColor}
                    onChange={(e) => setStarryBackgroundColor(e.target.value)}
                    className="w-9 h-9 bg-transparent border-none rounded-md shadow-sm p-0 cursor-pointer"
                    style={{ boxShadow: '0 0 5px rgba(0,0,0,0.3)' }}
                />
            </label>
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
        </motion.div>
    );
};

export default StyleSettingsModal;