import React, {useState, useRef, useEffect} from 'react';
import {FiTrash2, FiEye, FiUpload, FiMove} from 'react-icons/fi';
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
        e.currentTarget.classList.add('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (dragIndex !== index) {
            e.currentTarget.classList.add('border-t-2', 'border-blue-400');
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('border-t-2', 'border-blue-400');
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
        e.currentTarget.classList.remove('border-t-2', 'border-blue-400');
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setDragIndex(null);
        e.currentTarget.classList.remove('opacity-50');
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
            <div className="bg-[#2a2a38] px-3 py-2 rounded-md shadow-sm flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 py-1 px-3 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
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
                <div className="max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={e => handleDragStart(e, index)}
                            onDragOver={e => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={e => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className="flex items-center gap-2 py-1 cursor-move"
                        >
                            <button
                                className="text-gray-400 hover:text-gray-200"
                                aria-label="拖动调整顺序"
                            >
                                <FiMove size={16}/>
                            </button>
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-10 h-10 object-cover rounded"
                            />
                            <span className="text-white/80 text-xs truncate flex-1">{file.name}</span>
                            <button
                                onClick={() => handlePreviewFile(file)}
                                className="text-blue-400 hover:text-blue-600"
                                aria-label="预览文件"
                            >
                                <FiEye size={16}/>
                            </button>
                            <button
                                onClick={() => handleDeleteFile(index)}
                                className="text-red-400 hover:text-red-600"
                                aria-label="删除文件"
                            >
                                <FiTrash2 size={16}/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
            )}
            <button
                onClick={handleConfirmUpload}
                disabled={selectedFiles.length === 0}
                className={`w-full py-2 rounded-md text-sm transition ${
                    selectedFiles.length === 0
                        ? 'bg-gray-600/50 text-white/50 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
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