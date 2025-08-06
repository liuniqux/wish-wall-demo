import React, {useState} from 'react';
import {BackgroundColorContext} from '@/contexts/BackgroundColorContext';

/**
 * 提供背景颜色状态的上下文组件
 * 包含两个颜色状态：
 * - starryBackgroundColor：控制星空背景的颜色
 * - wallColor：控制许愿墙表面主色调
 */
const BackgroundColorProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // 星空背景颜色，默认值为黑色
    const [starryBackgroundColor, setStarryBackgroundColor] = useState('#000000');

    // 墙面主色调，默认颜色为深蓝灰
    const [wallColor, setWallColor] = useState('#202040');

    // 地面颜色，默认灰色地面
    const [groundColor, setGroundColor] = useState('#888888');


    return (
        // 将颜色状态及其修改函数传入上下文中，供后代组件使用
        <BackgroundColorContext.Provider
            value={{
                starryBackgroundColor,
                setStarryBackgroundColor,
                wallColor,
                setWallColor,
                groundColor,
                setGroundColor
            }}
        >
            {children}
        </BackgroundColorContext.Provider>
    );
};

export default BackgroundColorProvider;
