import {createContext, useContext} from 'react';
import type {EnvironmentComponent, EnvironmentMode} from "@/types";

interface SceneEnvironmentContextProps {
    // 本次背景环境
    mode: EnvironmentMode;

    // hdr背景下文件地址
    hdrUrl: string;

    // 宇宙组件背景下，激活的组件列表
    components: EnvironmentComponent[];

    // 上次背景环境
    lastMode: EnvironmentMode;

    // 操作方法：模式相关
    switchMode: (newMode: EnvironmentMode) => void;
    revertToLastMode: () => void;

    // 操作方法：HDR相关
    setHDR: (url: string) => void;
    clearHDR: () => void;

    // 操作方法：组件相关
    addComponent: (component: EnvironmentComponent) => void;
    removeComponent: (component: EnvironmentComponent) => void;
    clearComponents: () => void;
}

export const SceneEnvironmentContext = createContext<SceneEnvironmentContextProps | undefined>(undefined);


export const useSceneEnvironment = (): SceneEnvironmentContextProps => {
    const context = useContext(SceneEnvironmentContext);
    if (!context) throw new Error('useSceneEnvironment must be used within a SceneEnvironmentProvider');
    return context;
};
