import React, { useState } from 'react';
import { BackgroundStyleContext } from '../contexts/BackgroundStyleContext.tsx';
import type {BackgroundStyle} from "../types.tsx";


const BackgroundStyleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('stars');

    return (
        <BackgroundStyleContext.Provider
            value={{
                backgroundStyle,
                setBackgroundStyle,
            }}
        >
            {children}
        </BackgroundStyleContext.Provider>
    );
};

export default BackgroundStyleProvider;
