import React from 'react';
import {motion} from 'framer-motion';

import type {FormMode} from '../../types.tsx';

interface AuthFormProps {
    // 当前表单模式：登录、注册或游客登录
    formMode: FormMode;
    // 切换表单模式的函数
    setFormMode: (mode: FormMode) => void;
    // 用户名输入值
    username: string;
    // 更新用户名的函数
    setUsername: (val: string) => void;
    // 密码输入值
    password: string;
    // 更新密码的函数
    setPassword: (val: string) => void;
    // 错误信息，显示在表单中
    error: string | null;
    // 设置错误信息的函数
    setError: (val: string | null) => void;
    // 登录操作回调
    onLogin: () => void;
    // 注册操作回调
    onRegister: () => void;
    // 游客登录操作回调
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
        // 使用framer-motion包装，实现初始及过渡动画
        <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="fixed inset-0 flex items-center justify-center z-20 pointer-events-auto bg-black bg-opacity-40"
        >
            {/* 表单容器，带白色半透明背景及圆角阴影 */}
            <div className="w-80 p-5 bg-white bg-opacity-95 rounded-lg shadow-lg flex flex-col gap-4">
                {/* 模式切换按钮组 */}
                <div className="flex justify-center gap-3">
                    {(['login', 'register', 'visitor'] as FormMode[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => {
                                // 切换表单模式
                                setFormMode(mode);
                                // 切换时清除错误信息
                                setError(null);
                            }}
                            className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${
                                formMode === mode
                                    // 当前激活状态样式
                                    ? 'border-2 border-blue-500 bg-blue-100 text-blue-700'
                                    // 未激活样式
                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {/* 根据模式显示按钮文字 */}
                            {mode === 'login' ? '登录' : mode === 'register' ? '注册' : '游客登录'}
                        </button>
                    ))}
                </div>

                {/* 仅登录和注册模式下显示用户名和密码输入框 */}
                {(formMode === 'login' || formMode === 'register') && (
                    <>
                        <input
                            type="text"
                            placeholder="用户名"
                            value={username}
                            // 实时更新用户名
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            placeholder="密码"
                            value={password}
                            // 实时更新密码
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </>
                )}

                {/* 错误信息展示区，显示文本红色字体 */}
                {error && (
                    <div className="text-red-600 text-center text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* 根据不同模式显示对应提交按钮 */}
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
