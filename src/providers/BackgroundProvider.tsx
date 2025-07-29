import React, { useState } from 'react';
import { BackgroundContext } from '../contexts/BackgroundContext.tsx';
import type {BackgroundStyle} from "../types.tsx";


const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('stars');

    return (
        <BackgroundContext.Provider
            value={{
                backgroundColor,
                setBackgroundColor,
                backgroundStyle,
                setBackgroundStyle,
            }}
        >
            {children}
        </BackgroundContext.Provider>
    );
};

export default BackgroundProvider;
