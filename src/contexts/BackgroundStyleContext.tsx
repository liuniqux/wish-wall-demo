import { createContext, useContext } from 'react';
import type {BackgroundStyle} from "../types.tsx";

interface BackgroundStyleContext {
    backgroundStyle: BackgroundStyle;
    setBackgroundStyle: (style: BackgroundStyle) => void;
}

export const BackgroundStyleContext = createContext<BackgroundStyleContext | null>(null);

export const useBackgroundStyle = () => {
    const context = useContext(BackgroundStyleContext);
    if (!context) {
        throw new Error('useBackgroundStyle must be used within a BackgroundProvider');
    }
    return context;
};
