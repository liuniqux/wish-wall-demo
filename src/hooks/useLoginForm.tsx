import { useState } from 'react';
import type { FormMode } from '@/types';

export const useLoginForm = (
    onLogin: () => void,
    onRegister: () => void,
    visitorLogin: () => void
) => {
    const [formMode, setFormMode] = useState<FormMode>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // 登录
    const handleLogin = async () => {
        if (loading) return;

        setLoading(true);
        setLoginError(null);

        try {
            // 模拟登录逻辑
            if (username === 'user' && password === '123456') {
                onLogin();
            } else {
                setLoginError('用户名或密码错误');
            }
        } finally {
            setLoading(false);
        }
    };

    // 注册
    const handleRegister = async () => {
        if (loading) return;

        setLoading(true);
        setRegisterError(null);

        try {
            if (username && password) {
                onRegister();
            } else {
                setRegisterError('请输入用户名和密码');
            }
        } finally {
            setLoading(false);
        }
    };

    // 游客登录
    const handleVisitorLogin = () => {
        visitorLogin();
    };

    // 重置表单
    const resetForm = () => {
        setUsername('');
        setPassword('');
        setLoginError(null);
        setRegisterError(null);
        setLoading(false);
    };

    return {
        formMode, setFormMode,
        username, setUsername,
        password, setPassword,
        loginError, setLoginError,
        registerError, setRegisterError,
        loading,
        handleLogin,
        handleRegister,
        handleVisitorLogin,
        resetForm,
    };
};
