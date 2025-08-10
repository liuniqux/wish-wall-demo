import React, {useState, useEffect} from 'react';
import type {EnvironmentMode} from '@/types';
import {motion, AnimatePresence} from 'framer-motion';
import {FiChevronDown, FiCheck} from 'react-icons/fi';

import {useBackgroundColor} from '@/contexts/BackgroundColorContext.tsx';
import {getCenterModalVariants} from '@/utils/animation.tsx';
import CenteredModal from "./CenteredModal.tsx";
import CloseButton from "@/components/ui/CloseButton.tsx";
import {useSceneEnvironment} from "@/contexts/SceneEnvironmentContext.tsx";

interface StyleSettingsModalProps {
    onClose: () => void;
    withBackdrop?: boolean;
}

const StyleSettingsModal: React.FC<StyleSettingsModalProps> = ({
                                                                   onClose,
                                                                   withBackdrop = false,
                                                               }) => {
    // 状态管理
    const {
        wallColor,
        setWallColor,
        starryBackgroundColor,
        setStarryBackgroundColor,
        groundColor,
        setGroundColor
    } = useBackgroundColor();
    const {mode, switchMode} = useSceneEnvironment();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // 关闭下拉框逻辑
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isDropdownOpen && !(e.target as Element).closest('.dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <CenteredModal
            centerModalVariants={getCenterModalVariants()}
            className="w-[360px] p-4 bg-[rgba(21,26,36,0.8)] rounded-xl text-white shadow-2xl border border-[rgba(44,50,70,0.7)]"
            showBackdrop={withBackdrop}
        >
            {/* 紧凑型标题栏 */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    场景设置
                </h2>
                <CloseButton
                    onClose={onClose}
                    className="bg-[#1e2434] hover:bg-[#2a3149] rounded-full p-1"
                />
            </div>

            {/* 紧凑的设置项容器 */}
            <div className="space-y-3">
                {/* 墙面颜色设置 */}
                <SettingItem label="墙面颜色" emoji="🧱" description="调整墙壁的颜色">
                    <div className="flex items-center gap-2">
                        <ColorInput value={wallColor} onChange={setWallColor}/>
                        <div
                            className="h-8 w-14 rounded-md border border-[rgba(60,67,88,0.7)]"
                            style={{backgroundColor: wallColor}}
                        />
                    </div>
                </SettingItem>

                {/* 默认背景设置 */}
                <SettingItem label="默认背景" emoji="🌌" description="调整默认背景颜色">
                    <div className="flex items-center gap-2">
                        <ColorInput value={starryBackgroundColor} onChange={setStarryBackgroundColor}/>
                        <div
                            className="h-8 w-14 rounded-md border border-[#3c4358]"
                            style={{backgroundColor: starryBackgroundColor}}
                        />
                    </div>
                </SettingItem>

                {/* 地面颜色设置 */}
                <SettingItem label="地面颜色" emoji="🪨" description="调整地板的颜色">
                    <div className="flex items-center gap-2">
                        <ColorInput value={groundColor} onChange={setGroundColor}/>
                        <div
                            className="h-8 w-14 rounded-md border border-[#3c4358]"
                            style={{backgroundColor: groundColor}}
                        />
                    </div>
                </SettingItem>

                {/* 背景样式设置 */}
                <SettingItem label="背景样式" emoji="🎨" description="选择场景背景类型">
                    <div className="dropdown-container relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            onBlur={() => setIsDropdownOpen(false)}
                            className={`w-full px-3 py-2 flex items-center justify-between rounded-lg bg-[#1a1a32] focus:outline-none
                ${isDropdownOpen ? 'border-blue-500 bg-[#21283b]' : 'border-transparent bg-[#1a1f2d]'} 
                border-2 backdrop-blur-md text-sm transition-all duration-200 hover:bg-[#21283b]`}
                        >
                            <div className="flex items-center gap-2">
                <span className={`rounded p-1 ${mode === 'cosmic' ? 'bg-blue-900/40' : 'bg-transparent'}`}>
                  {mode === 'cosmic' ? '🌌' : mode === 'hdr' ? '🖼️' : mode === 'minimal' ? '🌿' : '🚫'}
                </span>
                                <span className="text-gray-200 font-medium">{modeToText(mode)}</span>
                            </div>
                            <motion.div animate={{rotate: isDropdownOpen ? 180 : 0}}>
                                <FiChevronDown size={16} className="text-blue-400"/>
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{opacity: 0, y: -5}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -5}}
                                    transition={{duration: 0.15, ease: "easeOut"}}
                                    className="absolute mt-1 w-full z-10 rounded-lg overflow-hidden"
                                >
                                    <div
                                        className="bg-[rgba(26,31,45,0.5)] backdrop-blur-xl border border-blue-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-lg">
                                        {dropdownOptions.map(option => (
                                            <button
                                                key={option.value}
                                                className={`w-full text-left px-3 py-2 text-sm cursor-pointer transition-all flex items-center 
                          ${mode === option.value
                                                    ? 'bg-[rgba(0,0,0,0.3)] text-blue-300'
                                                    : 'text-gray-300 bg-[rgba(33,40,59,0.5)] hover:bg-[rgba(33,40,59,0.7)]'}`}
                                                onClick={() => {
                                                    switchMode(option.value as EnvironmentMode);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base">{option.icon}</span>
                                                    <span>{option.label}</span>
                                                </div>
                                                {mode === option.value && (
                                                    <div className="ml-auto text-blue-400">
                                                        <FiCheck size={16}/>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </SettingItem>
            </div>
        </CenteredModal>
    );
};

// 设置项组件 - 优化版（更紧凑）
const SettingItem: React.FC<{
    label: string;
    emoji: string;
    description?: string;
    children: React.ReactNode;
}> = ({label, emoji, description, children}) => (
    <div className="rounded-lg p-2.5 bg-[#1a1f2d] border border-[#2c3246] hover:border-blue-500/40 transition-all">
        <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#252c40] flex items-center justify-center text-base">
                {emoji}
            </div>
            <div>
                <h3 className="font-medium text-sm">{label}</h3>
                {description && <p className="text-xs text-gray-400 opacity-80 leading-none">{description}</p>}
            </div>
        </div>
        <div className="ml-9">{children}</div>
    </div>
);

// 下拉框选项配置
const dropdownOptions = [
    {value: 'cosmic', label: '星空效果', icon: '🌌'},
    {value: 'none', label: '无背景', icon: '🚫'},
    {value: 'hdr', label: 'HDR全景', icon: '🖼️'},
    {value: 'minimal', label: '简约环境', icon: '🌿'},
];

// 模式到文本的映射
const modeToText = (mode: EnvironmentMode) => {
    const option = dropdownOptions.find(opt => opt.value === mode);
    return option ? option.label : '无背景';
};

// 紧凑型颜色选择器组件
const ColorInput: React.FC<{
    value: string;
    onChange?: (color: string) => void;
    disabled?: boolean;
}> = ({value, onChange, disabled = false}) => (
    <div className="relative flex items-center gap-2">
        <input
            type="color"
            value={value}
            onChange={e => onChange?.(e.target.value)}
            disabled={disabled}
            className={`w-8 h-8 border-2 border-[#3c4358] rounded cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="flex flex-col text-xs">
            <span className="text-gray-400 opacity-80">颜色</span>
            <span className="font-mono tracking-tight text-blue-400">{value.toUpperCase()}</span>
        </div>
    </div>
);

export default StyleSettingsModal;