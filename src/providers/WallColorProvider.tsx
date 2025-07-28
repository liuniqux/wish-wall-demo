import React, { useState } from 'react';
import { WallColorContext } from '../contexts/WallColorContext';

const WallColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [colorHex, setColorHex] = useState('#202040'); // 默认墙面颜色

    return (
        <WallColorContext.Provider value={{ colorHex, setColorHex }}>
            {children}
        </WallColorContext.Provider>
    );
};

export default WallColorProvider;
