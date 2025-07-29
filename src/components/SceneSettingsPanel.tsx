import React, {useState, useEffect, useRef} from 'react';
import {FiSettings} from 'react-icons/fi';
import {motion} from 'framer-motion';
import {useWallColor} from '../contexts/WallColorContext';
import {useBackgroundSettings} from '../contexts/BackgroundContext';
import type {Direction} from "../types.ts";

const SceneSettingsPanel: React.FC = () => {
    const {colorHex, setColorHex} = useWallColor();
    const {backgroundColor, setBackgroundColor, backgroundStyle, setBackgroundStyle} = useBackgroundSettings();

    const [open, setOpen] = useState(false);
    const [direction, setDirection] = useState<Direction>('bottom');

    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef<{ x: number; y: number } | null>(null);

    // 监听点击外部，自动关闭面板
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 判断面板显示方向
    const updatePanelDirection = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const margin = 80;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (rect.bottom + margin > windowHeight) {
            setDirection('top');
        } else if (rect.top < margin) {
            setDirection('bottom');
        } else if (rect.left < margin) {
            setDirection('right');
        } else if (rect.right + margin > windowWidth) {
            setDirection('left');
        } else {
            setDirection('bottom');
        }
    };

    const getAnimationVariants = (direction: Direction) => {
        switch (direction) {
            case 'top':
                return {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 10 },
                };
            case 'bottom':
                return {
                    initial: { opacity: 0, y: -10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -10 },
                };
            case 'left':
                return {
                    initial: { opacity: 0, x: 10 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 10 },
                };
            case 'right':
                return {
                    initial: { opacity: 0, x: -10 },
                    animate: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -10 },
                };
            default:
                return {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: 10 },
                };
        }
    };

    const variants = getAnimationVariants(direction);


    // 鼠标按下记录拖动起点
    const handleMouseDown = (e: React.MouseEvent) => {
        dragStartPos.current = {x: e.clientX, y: e.clientY};
    };

    // 鼠标抬起判断是否是点击还是拖动
    const handleMouseUp = (e: React.MouseEvent) => {
        if (!dragStartPos.current) return;
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        dragStartPos.current = null;

        // 如果不是拖动，就切换打开状态，并更新方向
        if (distance < 2) {
            updatePanelDirection();
            setOpen((prev) => !prev);
        }
    };

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
            {/* 拖拽约束区域 */}
            <div
                ref={constraintsRef}
                className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[999]"
            />

            <motion.div
                drag={!open}
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                dragMomentum={false}
                ref={panelRef}
                className={`fixed top-5 right-5 z-[100] flex flex-col items-end gap-2 font-sans select-none ${
                    open ? 'cursor-default' : 'cursor-grab'
                }`}
            >
                {/* 设置按钮 */}
                <button
                    ref={buttonRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    aria-label="设置"
                    title="设置"
                    className={`w-11 h-11 rounded-full border backdrop-blur-md flex justify-center items-center p-0 leading-none transition-all duration-300 outline-none focus:outline-none focus:ring-0 
                        ${open ? 'bg-white/15 border-blue-400 shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'bg-white/10 border-white/30'}`}
                    style={{cursor: 'pointer'}}
                >
                    <FiSettings
                        size={20}
                        className={`transition-transform duration-300 ${
                            open ? 'rotate-90 text-[#61dafb]' : 'rotate-0 text-white'
                        }`}
                    />
                </button>

                {/* 设置面板 */}
                <motion.div
                    initial={variants.initial}
                    animate={open ? variants.animate : variants.exit}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{ pointerEvents: open ? 'auto' : 'none' }}
                    className={`absolute ${
                        direction === 'top'
                            ? 'bottom-14 right-0'
                            : direction === 'left'
                                ? 'right-14 top-0'
                                : direction === 'right'
                                    ? 'left-14 top-0'
                                    : 'top-14 right-0'
                    } bg-[#1e1e28d9] p-4 rounded-lg w-40 text-white text-sm shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col gap-4 select-none cursor-default`}
                >

                {/* 墙面颜色 */}
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

                    {/* 背景颜色 */}
                    <label title="背景颜色" className="flex items-center gap-2 cursor-pointer max-w-max">
                        <span role="img" aria-label="background" style={iconStyle}>🌌</span>
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-9 h-9 bg-transparent border-none rounded-md shadow-sm p-0 cursor-pointer"
                            style={{boxShadow: '0 0 5px rgba(0,0,0,0.3)'}}
                        />
                    </label>

                    {/* 背景样式 */}
                    <label title="背景样式" className="flex items-center gap-2 cursor-pointer">
                        <span role="img" aria-label="style" style={iconStyle}>🎨</span>
                        <select
                            value={backgroundStyle}
                            onChange={(e) =>
                                setBackgroundStyle(e.target.value as 'none' | 'stars' | 'gradient' | 'grid')
                            }
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
