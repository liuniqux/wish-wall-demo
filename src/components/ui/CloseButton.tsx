import React from 'react';
import {motion} from 'framer-motion';
import {X} from 'lucide-react';

interface CloseButtonProps {
    onClose: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({onClose}) => {
    return (
        <motion.button
            onClick={onClose}
            style={{outline: 'none'}}
            whileTap={{scale: 0.9}}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
        >
            <X className="w-5 h-5 text-white"/>
        </motion.button>
    );
};

export default CloseButton;
