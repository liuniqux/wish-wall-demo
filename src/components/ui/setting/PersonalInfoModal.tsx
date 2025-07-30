import React from 'react';
import { motion } from 'framer-motion';
import type { Direction } from '../../../types.tsx';
import { FiX } from 'react-icons/fi';
import {getAnimationVariants} from "../../../utils/animation.tsx";

interface PersonalInfoModalProps {
    onClose: () => void;
    direction: Direction;
}

const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({ onClose, direction }) => {

    const variants = getAnimationVariants(direction);

    return (
        <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`absolute z-[20] ${
                direction === 'top' ? 'bottom-14 right-0' :
                    direction === 'left' ? 'right-14 top-0' :
                        direction === 'right' ? 'left-14 top-0' : 'top-14 right-0'
            } bg-[#1e1e28d9] p-4 rounded-lg w-40 text-white text-sm shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col gap-4 select-none cursor-default`}
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white/50 hover:text-black"
                aria-label="关闭"
            >
                <FiX size={16} />
            </button>
            <div className="text-center">
                <p>个人信息设置</p>
                <p className="text-gray-400 text-xs mt-2">（功能待实现）</p>
            </div>
        </motion.div>
    );
};

export default PersonalInfoModal;