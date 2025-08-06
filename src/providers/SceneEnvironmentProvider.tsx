import React, {useState} from 'react';
import type {EnvironmentMode} from "@/types";
import { SceneEnvironmentContext } from "@/contexts/SceneEnvironmentContext";

/**
 * 提供背景颜色状态的上下文组件
 * 包含两个颜色状态：
 * - starryBackgroundColor：控制星空背景的颜色
 * - wallColor：控制许愿墙表面主色调
 */
const SceneEnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [mode, setMode] = useState<EnvironmentMode>('default');

    return (
        <SceneEnvironmentContext.Provider value={{mode, setMode}}>
            {children}
        </SceneEnvironmentContext.Provider>
    );
};

export default SceneEnvironmentProvider;
