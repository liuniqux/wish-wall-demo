import { useState, useEffect } from 'react';
import type { FormMode } from '@/types';

interface UseAuthProps {
    onLoginChange?: (loggedIn: boolean) => void; // 外部传入的登录状态变化回调
}

export const useAuth = ({ onLoginChange }: UseAuthProps = {}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [formMode, setFormMode] = useState<FormMode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // 监听登录状态变化，触发回调
    useEffect(() => {
        if (onLoginChange) {
            onLoginChange(isLoggedIn);
        }
    }, [isLoggedIn, onLoginChange]);

    const handleLogin = () => {
        if (username === 'user' && password === '123456') {
            setError(null);
            setIsLoggedIn(true);
            setFormMode('upload');
        } else {
            setError('用户名或密码错误');
        }
    };

    const handleRegister = () => {
        if (username && password) {
            setError(null);
            setIsLoggedIn(true);
            setFormMode('upload');
        } else {
            setError('请输入用户名和密码');
        }
    };

    const handleVisitorLogin = () => {
        setIsLoggedIn(true);
        setFormMode('upload');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setFormMode('login');
        setUsername('');
        setPassword('');
        setError(null);
    };

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
