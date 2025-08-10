import React from 'react';
import type {EnvironmentMode} from '@/types';
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
    // 颜色相关的状态和方法
    const {
        starryBackgroundColor,
        setStarryBackgroundColor,
        wallColor,
        setWallColor,
        groundColor,
        setGroundColor
    } = useBackgroundColor();

    // 背景样式相关的状态和方法
    const {mode, switchMode} = useSceneEnvironment();

    return (
        <CenteredModal
            centerModalVariants={getCenterModalVariants()}
            className="w-80 p-6 bg-[#1f2937] rounded-xl text-white shadow-2xl"
            showBackdrop={withBackdrop}
        >
            {/* 标题栏 */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold">场景设置</h2>
                <CloseButton onClose={onClose}/>
            </div>

            {/* 设置项容器 */}
            <div className="space-y-4">
                {/* 墙面颜色设置 */}
                <SettingItem
                    label="墙面颜色"
                    emoji="🧱"
                    description="调整墙壁的颜色"
                >
                    <ColorInput value={wallColor} onChange={setWallColor}/>
                </SettingItem>

                {/* 星空背景色设置 */}
                <SettingItem
                    label="默认背景"
                    emoji="🌌"
                    description="调整默认背景颜色"
                >
                    <ColorInput value={starryBackgroundColor} onChange={setStarryBackgroundColor}/>
                </SettingItem>

                {/* 地面颜色设置 */}
                <SettingItem
                    label="地面颜色"
                    emoji="🪨"
                    description="调整地板的颜色"
                >
                    <ColorInput value={groundColor} onChange={setGroundColor}/>
                </SettingItem>

                {/* 背景样式设置 */}
                <SettingItem
                    label="背景样式"
                    emoji="🎨"
                    description="选择场景背景类型"
                >
                    <select
                        value={mode}
                        onChange={(e) => {
                            switchMode(e.target.value as EnvironmentMode);
                            onClose();
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#374151] border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer text-sm"
                    >
                        <option value="none">无背景</option>
                        <option value="cosmic">星空效果</option>
                        <option value="hdr">HDR全景</option>
                        <option value="minimal">简约环境</option>
                    </select>
                </SettingItem>
            </div>
        </CenteredModal>
    );
};

// 设置项组件 - 封装设置项的统一样式
const SettingItem: React.FC<{
    label: string;
    emoji: string;
    description?: string;
    children: React.ReactNode;
}> = ({label, emoji, description, children}) => (
    <div className="border border-[#374151] rounded-lg p-3 hover:border-blue-500 hover:bg-[#374151]/50 transition-all">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center text-lg">
                {emoji}
            </div>
            <div>
                <h3 className="font-medium text-sm">{label}</h3>
                {description && <p className="text-xs text-gray-400">{description}</p>}
            </div>
        </div>
        {children}
    </div>
);

// 颜色选择器组件 - 封装的样式
const ColorInput: React.FC<{
    value: string;
    onChange: (color: string) => void;
}> = ({value, onChange}) => (
    <div className="flex items-center gap-2">
        <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 bg-transparent border border-gray-600 rounded-lg shadow-sm cursor-pointer p-0"
        />
        <span className="text-xs text-gray-400">{value.toUpperCase()}</span>
    </div>
);

export default StyleSettingsModal;