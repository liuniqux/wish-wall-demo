import {createContext, useContext} from 'react';
import type {EnvironmentMode} from "@/types";

interface SceneEnvironmentContextProps {
    mode: EnvironmentMode;
    setMode: (mode: EnvironmentMode) => void;
}

export const SceneEnvironmentContext = createContext<SceneEnvironmentContextProps | undefined>(undefined);



export const useSceneEnvironment = (): SceneEnvironmentContextProps => {
    const context = useContext(SceneEnvironmentContext);
    if (!context) throw new Error('useSceneEnvironment must be used within a SceneEnvironmentProvider');
    return context;
};
