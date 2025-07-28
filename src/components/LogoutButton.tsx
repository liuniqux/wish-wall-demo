// LogoutButton.tsx
import React from 'react';
import { FiLogOut } from 'react-icons/fi'; // 你也可以试试 MdLogout

interface LogoutButtonProps {
    onLogout: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    return (
        <button
            onClick={onLogout}
            className="fixed top-5 right-5 z-30 p-2 bg-white/80 hover:bg-white/100 rounded-full shadow transition outline-none focus:outline-none focus:ring-0"
            title="登出"
        >
            <FiLogOut size={20} color="#e53e3e" />
        </button>
    );
};

export default LogoutButton;
