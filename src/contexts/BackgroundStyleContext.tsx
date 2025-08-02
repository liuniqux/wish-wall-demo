import {createContext, useContext} from 'react';
// 引入类型定义 BackgroundStyle，用于指定背景样式的类型
import type {BackgroundStyle} from "../types.tsx";

// 定义背景样式上下文接口，包含当前样式及修改函数
interface BackgroundStyleContext {
    // 当前背景样式状态
    backgroundStyle: BackgroundStyle;
    // 用于更新背景样式的函数
    setBackgroundStyle: (style: BackgroundStyle) => void;
}

// 创建上下文，默认值为 null，确保必须由提供者包裹后才能使用
export const BackgroundStyleContext = createContext<BackgroundStyleContext | null>(null);

// 自定义 Hook，方便组件内部调用并安全获取上下文
export const useBackgroundStyle = () => {
    // 通过 useContext 获取上下文对象
    const context = useContext(BackgroundStyleContext);
    // 如果不在提供者内部使用，则抛出错误提醒开发者
    if (!context) {
        throw new Error('useBackgroundStyle must be used within a BackgroundProvider');
    }
    // 返回上下文值
    return context;
};
