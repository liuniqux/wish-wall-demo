import React from 'react';
import { motion } from 'framer-motion';

interface UploadFormProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onLogout: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload, onLogout }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-5 left-5 z-20 bg-white bg-opacity-90 p-4 rounded-xl shadow-md flex items-center gap-3"
        >
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={onUpload}
                className="px-3 py-2 border border-gray-300 rounded-md text-base bg-white cursor-pointer"
                style={{ width: 250 }}
            />
            <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
            >
                登出
            </button>
        </motion.div>
    );
};

export default UploadForm;
