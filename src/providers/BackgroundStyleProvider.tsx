import React, {useState} from 'react';
import {BackgroundStyleContext} from '@/contexts/BackgroundStyleContext.tsx';
import type {BackgroundStyle} from '@/types';

/**
 * BackgroundStyleProvider 是一个 React 组件，
 * 用于通过 Context 向整个应用提供“背景风格”的状态管理。
 *
 * 背景风格可用于控制页面的视觉主题（如星空、纯色背景等），
 * 子组件可以通过 useContext(BackgroundStyleContext) 获取当前值或进行修改。
 */
const BackgroundStyleProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    // 当前背景风格状态，默认值为 'stars'（星空背景）
    const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('stars');

    return (
        // 将背景风格及其更新函数通过 Context 传递给子组件
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
