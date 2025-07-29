import React from 'react';
import {FiSettings} from 'react-icons/fi';
import {motion} from 'framer-motion';
import type {BackgroundStyle, Direction} from "../../types.tsx";
import {usePanelDrag} from "../../hooks/usePanelDrag.tsx";
import {useBackgroundColor} from "../../contexts/BackgroundColorContext.tsx";
import {useBackgroundSettings} from "../../contexts/BackgroundContext.tsx";

const SceneSettingsPanel: React.FC = () => {
    const {
        colorHex,
        setColorHex,
        starryBackgroundColor,
        setStarryBackgroundColor,
    } = useBackgroundColor();

    const {
        backgroundStyle,
        setBackgroundStyle,
    } = useBackgroundSettings();

    const {
        open,
        direction,
        panelRef,
        buttonRef,
        constraintsRef,
        handleMouseDown,
        handleMouseUp,
        handleDragEnd
    } = usePanelDrag();

    const getAnimationVariants = (direction: Direction) => {
        switch (direction) {
            case 'top':
                return {initial: {opacity: 0, y: 10}, animate: {opacity: 1, y: 0}, exit: {opacity: 0, y: 10}};
            case 'bottom':
                return {initial: {opacity: 0, y: -10}, animate: {opacity: 1, y: 0}, exit: {opacity: 0, y: -10}};
            case 'left':
                return {initial: {opacity: 0, x: 10}, animate: {opacity: 1, x: 0}, exit: {opacity: 0, x: 10}};
            case 'right':
                return {initial: {opacity: 0, x: -10}, animate: {opacity: 1, x: 0}, exit: {opacity: 0, x: -10}};
            default:
                return {initial: {opacity: 0, y: 10}, animate: {opacity: 1, y: 0}, exit: {opacity: 0, y: 10}};
        }
    };

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
        <>
            <div ref={constraintsRef} className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[999]"/>
            <motion.div
                drag={!open}
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                ref={panelRef}
                className={`fixed top-5 right-5 z-[100] flex flex-col items-end gap-2 font-sans select-none ${open ? 'cursor-default' : 'cursor-grab'}`}
            >
                <button
                    ref={buttonRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    aria-label="设置"
                    title="设置"
                    className={`group w-11 h-11 rounded-full border backdrop-blur-md flex justify-center items-center p-0 leading-none transition-all duration-300 outline-none focus:outline-none focus:ring-0 
                        ${open ? 'bg-white/15 border-blue-400 shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'bg-white/10 border-white/30'}
                        hover:bg-white/20 hover:border-blue-200`}
                    style={{cursor: 'pointer'}}
                >
                    <FiSettings
                        size={20}
                        className={`transition-all duration-300 ${open ? 'rotate-90 text-[#61dafb]' : 'rotate-0 text-white/30'} group-hover:text-blue-200`}
                    />
                </button>
                <motion.div
                    initial={variants.initial}
                    animate={open ? variants.animate : variants.exit}
                    transition={{duration: 0.25, ease: 'easeOut'}}
                    style={{pointerEvents: open ? 'auto' : 'none'}}
                    className={`absolute ${
                        direction === 'top' ? 'bottom-14 right-0' :
                            direction === 'left' ? 'right-14 top-0' :
                                direction === 'right' ? 'left-14 top-0' : 'top-14 right-0'
                    } bg-[#1e1e28d9] p-4 rounded-lg w-40 text-white text-sm shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col gap-4 select-none cursor-default`}
                >
                    <label title="墙面颜色" className="flex items-center gap-2 cursor-pointer max-w-max">
                        <span role="img" aria-label="wall" style={iconStyle}>🧱</span>
                        <input
                            type="color"
                            value={colorHex}
                            onChange={(e) => setColorHex(e.target.value)}
                            className="w-9 h-9 bg-transparent border-none rounded-md shadow-sm p-0 cursor-pointer"
                            style={{boxShadow: '0 0 5px rgba(0,0,0,0.3)'}}
                        />
                    </label>
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
            </motion.div>
        </>
    );
};

export default SceneSettingsPanel;