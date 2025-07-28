import React from 'react';
import {motion} from 'framer-motion';

interface UploadFormProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({onUpload}) => {
    return (
        <motion.div
            initial={{opacity: 0, y: -10}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="absolute top-5 left-5 z-20 flex items-center gap-4"
        >
            {/* 上传部分 */}
            <div className="bg-white/80 backdrop-blur-md px-3 py-2 rounded-md shadow-sm flex items-center">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onUpload}
                    className="text-sm text-gray-700 cursor-pointer file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:bg-indigo-600 file:text-white file:rounded hover:file:bg-indigo-700 transition"
                />
            </div>
        </motion.div>
    );
};

export default UploadForm;
