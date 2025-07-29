import React, {useState} from 'react';
import { BackgroundColorContext } from '../contexts/BackgroundColorContext';


const BackgroundColorProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [starryBackgroundColor, setStarryBackgroundColor] = useState('#000000'); // 新增
    const [colorHex, setColorHex] = useState('#202040'); // 默认墙面颜色

    return (
        <BackgroundColorContext.Provider
            value={{
                starryBackgroundColor, setStarryBackgroundColor, colorHex, setColorHex
            }}
        >
            {children}
        </BackgroundColorContext.Provider>
    );
};

export default BackgroundColorProvider;