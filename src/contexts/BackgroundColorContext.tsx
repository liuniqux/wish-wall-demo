import { createContext, useContext } from 'react';

interface BackgroundColorContext {
    colorHex: string;
    setColorHex: (hex: string) => void;
    starryBackgroundColor: string;
    setStarryBackgroundColor: (hex: string) => void;
}

export const BackgroundColorContext = createContext<BackgroundColorContext | null>(null);

export const useBackgroundColor = () => {
    const context = useContext(BackgroundColorContext);
    if (!context) {
        throw new Error('useBackgroundSettings must be used within a BackgroundProvider');
    }
    return context;
};