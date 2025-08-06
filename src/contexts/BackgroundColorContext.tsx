import {createContext, useContext} from 'react';

// 定义背景颜色上下文接口，包含当前颜色和对应的更新函数
interface BackgroundColorContext {
    // 当前背景颜色的
    wallColor: string;
    // 用于更新背景颜色的函数
    setWallColor: (hex: string) => void;

    // 星辰背景颜色
    starryBackgroundColor: string;
    // 用于更新星辰背景颜色的函数
    setStarryBackgroundColor: (hex: string) => void;

    // 地面颜色
    groundColor: string;
    // 用于更新地面颜色的函数
    setGroundColor: (hex: string) => void;
}

// 创建上下文，默认值为 null，需由提供者组件赋值
export const BackgroundColorContext = createContext<BackgroundColorContext | null>(null);

// 自定义 Hook，方便组件中直接使用背景颜色上下文
export const useBackgroundColor = () => {
    // 从上下文中获取当前背景颜色状态及修改函数
    const context = useContext(BackgroundColorContext);
    // 如果在上下文提供者之外调用，抛出错误提醒开发者
    if (!context) {
        throw new Error('useBackgroundColor must be used within a BackgroundProvider');
    }
    // 返回上下文内容
    return context;
};
