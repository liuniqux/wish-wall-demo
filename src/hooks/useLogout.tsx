import {useCallback} from 'react';

/**
 * 提供统一的退出登录逻辑
 * @param onLoggedOut - 退出后回调函数（例如设置登录态为 false）
 */
export function useLogout(onLoggedOut?: () => void) {

    const handleLogout = useCallback(() => {
        // 清理本地存储（可按需拓展）
        localStorage.removeItem('token');
        sessionStorage.clear();

        // 执行传入的回调逻辑（如 setIsLoggedIn(false)）
        onLoggedOut?.();

        // 预留扩展点（如跳转、动画重置、消息提示等）
    }, [onLoggedOut]);

    return {handleLogout};
}
