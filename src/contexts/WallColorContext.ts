import { createContext, useContext } from 'react';

export type WallColorContextType = {
    colorHex: string;
    setColorHex: (hex: string) => void;
};

export const WallColorContext = createContext<WallColorContextType | undefined>(undefined);

export const useWallColor = (): WallColorContextType => {
    const context = useContext(WallColorContext);
    if (!context) {
        throw new Error('useWallColor must be used within a WallColorProvider');
    }
    return context;
};
