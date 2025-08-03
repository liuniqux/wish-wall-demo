import {useState, useEffect} from 'react';
import type {FormMode} from '@/types';

/**
 * useAuth 是一个用于管理用户身份认证逻辑的自定义 Hook
 * 提供了登录、注册、游客访问、登出等功能，并维护相关状态
 */
interface UseAuthProps {
    // 当登录状态变化时触发的回调（可选）
    onLoginChange?: (loggedIn: boolean) => void;
}

/**
 * 自定义 Hook：useAuth
 * 封装了用户认证相关的状态与操作
 */
export const useAuth = ({onLoginChange}: UseAuthProps = {}) => {
    // 用户是否已登录
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 当前显示的表单模式（登录、注册、上传等）
    const [formMode, setFormMode] = useState<FormMode>('login');

    // 用户输入的用户名
    const [username, setUsername] = useState('');

    // 用户输入的密码
    const [password, setPassword] = useState('');

    // 错误提示信息，如登录失败等
    const [error, setError] = useState<string | null>(null);

    /**
     * 副作用：当 isLoggedIn 变化时触发外部回调
     * 用于通知外部组件登录状态的改变（例如显示/隐藏菜单、切换路由等）
     */
    useEffect(() => {
        if (onLoginChange) {
            onLoginChange(isLoggedIn);
        }
    }, [isLoggedIn, onLoginChange]);

    /**
     * 处理登录逻辑
     * 当前为模拟登录，仅匹配固定用户名密码
     */
    const handleLogin = () => {
        if (username === 'user' && password === '123456') {
            // 清除错误提示
            setError(null);
            // 设置登录状态
            setIsLoggedIn(true);
        } else {
            // 设置错误提示
            setError('用户名或密码错误');
        }
    };

    /**
     * 处理注册逻辑
     * 当前仅检查用户名和密码非空，未与后端交互
     */
    const handleRegister = () => {
        if (username && password) {
            setError(null);
            setIsLoggedIn(true);
        } else {
            setError('请输入用户名和密码');
        }
    };

    /**
     * 处理游客登录逻辑
     * 无需用户名密码，直接进入上传状态
     */
    const handleVisitorLogin = () => {
        setIsLoggedIn(true);
    };

    /**
     * 处理登出逻辑
     * 清空所有状态，返回登录界面
     */
    const handleLogout = () => {
        // 设置为未登录
        setIsLoggedIn(false);
        // 切换回登录模式
        setFormMode('login');
        // 清空用户名
        setUsername('');
        // 清空密码
        setPassword('');
        // 清空错误信息
        setError(null);
    };

    // 将所有状态和操作暴露出去，供组件调用
    return {
        isLoggedIn,
        formMode,
        setFormMode,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,
        handleLogin,
        handleRegister,
        handleVisitorLogin,
        handleLogout,
    };
};
