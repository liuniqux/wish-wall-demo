import { createContext, useContext } from 'react';
import type {BackgroundStyle} from "../types.tsx";

interface BackgroundSettingsContext {
    backgroundColor: string;
    setBackgroundColor: (color: string) => void;
    backgroundStyle: BackgroundStyle;
    setBackgroundStyle: (style: BackgroundStyle) => void;
}

export const BackgroundContext = createContext<BackgroundSettingsContext | null>(null);

export const useBackgroundSettings = () => {
    const context = useContext(BackgroundContext);
    if (!context) {
        throw new Error('useBackgroundSettings must be used within a BackgroundProvider');
    }
    return context;
};
