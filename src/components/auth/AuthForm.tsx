import React from 'react';
import { motion } from 'framer-motion';

import type {FormMode} from '../../types.tsx';

interface AuthFormProps {
    formMode: FormMode;
    setFormMode: (mode: FormMode) => void;
    username: string;
    setUsername: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
    error: string | null;
    setError: (val: string | null) => void;
    onLogin: () => void;
    onRegister: () => void;
    onVisitorLogin: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
                                               formMode,
                                               setFormMode,
                                               username,
                                               setUsername,
                                               password,
                                               setPassword,
                                               error,
                                               setError,
                                               onLogin,
                                               onRegister,
                                               onVisitorLogin,
                                           }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-20 pointer-events-auto bg-black bg-opacity-40"
        >
            <div className="w-80 p-5 bg-white bg-opacity-95 rounded-lg shadow-lg flex flex-col gap-4">
                <div className="flex justify-center gap-3">
                    {(['login', 'register', 'visitor'] as FormMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => {
                                setFormMode(mode);
                                setError(null);
                            }}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold transition
                ${
                                formMode === mode
                                    ? 'border-2 border-blue-500 bg-blue-100 text-blue-700'
                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }
              `}
                        >
                            {mode === 'login' ? '登录' : mode === 'register' ? '注册' : '游客登录'}
                        </button>
                    ))}
                </div>

                {(formMode === 'login' || formMode === 'register') && (
                    <>
                        <input
                            type="text"
                            placeholder="用户名"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            placeholder="密码"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </>
                )}

                {error && <div className="text-red-600 text-center text-sm font-medium">{error}</div>}

                {formMode === 'login' && (
                    <button
                        onClick={onLogin}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition"
                    >
                        登录
                    </button>
                )}
                {formMode === 'register' && (
                    <button
                        onClick={onRegister}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition"
                    >
                        注册
                    </button>
                )}
                {formMode === 'visitor' && (
                    <button
                        onClick={onVisitorLogin}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition"
                    >
                        以游客身份登录
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default AuthForm;
