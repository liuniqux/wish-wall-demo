import React, { useState } from 'react';

interface Props {
    onLogin: () => void;
    onRegister: () => void;
    onGuestLogin: () => void;
}

const LoginRegister: React.FC<Props> = ({ onLogin, onRegister, onGuestLogin }) => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="absolute top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 backdrop-blur-md shadow-xl rounded-lg p-8 w-[320px]">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                {mode === 'login' ? '登录' : '注册'}
            </h2>

            <input
                type="text"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
                onClick={mode === 'login' ? onLogin : onRegister}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
                {mode === 'login' ? '登录' : '注册'}
            </button>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="underline">
                    {mode === 'login' ? '没有账号？注册' : '已有账号？登录'}
                </button>
                <button
                    onClick={onGuestLogin}
                    className="text-blue-500 hover:text-blue-700 transition underline"
                >
                    游客登录
                </button>
            </div>
        </div>
    );
};

export default LoginRegister;
