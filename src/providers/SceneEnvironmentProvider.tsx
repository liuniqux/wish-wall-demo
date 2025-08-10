import React, {useState} from 'react';
import type {EnvironmentComponent, EnvironmentMode} from "@/types";
import {SceneEnvironmentContext} from "@/contexts/SceneEnvironmentContext";

/**
 * 提供环境背景状态的上下文组件
 * 包含两个背景状态：
 * - mode：本次背景
 * - lastMode：上次背景
 */
const SceneEnvironmentProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // 背景渲染模式
    const [mode, setMode] = useState<EnvironmentMode>('cosmic');
    // 上次背景渲染模式
    const [lastMode, setLastMode] = useState<EnvironmentMode>('cosmic');
    // 宇宙组件背景下，激活的组件列表
    const [components, setComponents] = useState<EnvironmentComponent[]>([]);
    // hdr背景下，渲染的文件url
    const [hdrUrl, setHdrUrl] = useState<string>('');

    // 模式操作
    const modeOperations = {
        // 切换模式处理
        switchMode: (newMode: EnvironmentMode) => {
            setLastMode(mode);
            setMode(newMode);
        },
        // 切换至上次模式
        revertToLastMode: () => {
            setMode(lastMode);
            setLastMode(mode);
        }
    };

    // HDR 操作
    const hdrOperations = {
        // 设置HDR文件地址
        setHDR: (url: string) => {
            setHdrUrl(url);
            modeOperations.switchMode('hdr');
        },
        // 清空HDR文件地址
        clearHDR: () => {
            setHdrUrl('');
            modeOperations.revertToLastMode();
        }
    };

    // 组件操作
    const componentOperations = {
        // 添加组件处理
        addComponent: (component: EnvironmentComponent) => {
            setComponents(prev => [...prev, component]);
        },
        // 移除组件处理
        removeComponent: (component: EnvironmentComponent) => {
            setComponents(prev => prev.filter(c => c !== component));
        },
        // 清空组件处理
        clearComponents: () => {
            setComponents([]);
        }
    };

    return (
        <SceneEnvironmentContext.Provider
            value={{
                // 状态值
                mode,
                lastMode,
                components,
                hdrUrl,

                // 操作方法
                ...modeOperations,
                ...hdrOperations,
                ...componentOperations,
            }}>
            {children}
        </SceneEnvironmentContext.Provider>
    );
};

export default SceneEnvironmentProvider;
