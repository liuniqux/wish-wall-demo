import React, {useState, useRef, useEffect} from 'react';
import {FiTrash2, FiEye, FiUpload, FiMove, FiAlertCircle} from 'react-icons/fi';
import PreviewModal from './PreviewModal.tsx';

interface UploadFormProps {
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({onUpload}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(files)]);
            setError(null);
        }
    };

    const handleDeleteFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePreviewFile = (file: File) => {
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleConfirmUpload = () => {
        if (selectedFiles.length === 0) {
            setError('请选择至少一个文件');
            return;
        }

        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));
        const fileList = dataTransfer.files;

        const event = {
            target: {files: fileList},
        } as React.ChangeEvent<HTMLInputElement>;

        onUpload(event);
        setSelectedFiles([]);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDragIndex(index);
        e.dataTransfer.setData('text/plain', index.toString());
        e.currentTarget.classList.add('opacity-60', 'bg-blue-500/20');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (dragIndex !== index) {
            e.currentTarget.classList.add('border-2', 'border-blue-400', 'rounded-md');
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('border-2', 'border-blue-400', 'rounded-md');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
        e.preventDefault();
        const draggedIndex = Number(e.dataTransfer.getData('text/plain'));
        if (draggedIndex !== dropIndex) {
            const newFiles = [...selectedFiles];
            const [draggedFile] = newFiles.splice(draggedIndex, 1);
            newFiles.splice(dropIndex, 0, draggedFile);
            setSelectedFiles(newFiles);
        }
        setDragIndex(null);
        e.currentTarget.classList.remove('border-2', 'border-blue-400', 'rounded-md');
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setDragIndex(null);
        e.currentTarget.classList.remove('opacity-60', 'bg-blue-500/20');
    };

    // 清理 URL.createObjectURL
    useEffect(() => {
        return () => {
            selectedFiles.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [selectedFiles, previewUrl]);

    return (
        <div className="flex flex-col gap-4">
            <div
                className="bg-[#2a2a38]/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 border border-white/10">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 py-1.5 px-4 text-sm bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <FiUpload size={16}/>
                    上传图片
                </button>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
            {selectedFiles.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-xl bg-[#252530]/50 p-2 border border-white/10">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={e => handleDragStart(e, index)}
                            onDragOver={e => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={e => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-150 cursor-move"
                        >
                            <button
                                className="text-gray-300 hover:text-gray-100 transition"
                                aria-label="拖动调整顺序"
                            >
                                <FiMove size={16}/>
                            </button>
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-12 h-12 object-cover rounded-md shadow-sm"
                            />
                            <span className="text-white/90 text-sm truncate flex-1">{file.name}</span>
                            <button
                                onClick={() => handlePreviewFile(file)}
                                className="text-blue-400 hover:text-blue-300 transition"
                                aria-label="预览文件"
                            >
                                <FiEye size={16}/>
                            </button>
                            <button
                                onClick={() => handleDeleteFile(index)}
                                className="text-red-400 hover:text-red-300 transition"
                                aria-label="删除文件"
                            >
                                <FiTrash2 size={16}/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {error && (
                <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs">
                    <FiAlertCircle size={14}/>
                    <span>{error}</span>
                </div>
            )}
            <button
                onClick={handleConfirmUpload}
                disabled={selectedFiles.length === 0}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedFiles.length === 0
                        ? 'bg-gray-600/30 text-white/40 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md'
                }`}
            >
                确定
            </button>
            {previewUrl && (
                <PreviewModal
                    image={previewUrl}
                    onClose={() => setPreviewUrl(null)}
                />
            )}
        </div>
    );
};

export default UploadForm;