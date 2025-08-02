import React, {useEffect, useRef, useState} from 'react';
import {FiAlertCircle, FiEye, FiMove, FiTrash2, FiUpload, FiX} from 'react-icons/fi';
import PreviewModal from '../PreviewModal.tsx';
import {getCenterModalVariants} from "../../../utils/animation.tsx";
import CenteredModal from "../common/CenteredModal.tsx";

// 上传表单组件 Props，提供关闭与上传回调
interface UploadFormProps {
    onClose: () => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({onUpload, onClose}) => {
    // 当前已选择的文件列表
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    // 当前需要预览的图片 URL（由 createObjectURL 创建）
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // 上传校验错误提示
    const [error, setError] = useState<string | null>(null);

    // 文件选择 input 的引用，用于程序性点击
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 拖拽排序的起始索引
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    // 每个 File 对应的临时 Object URL，确保在组件销毁时释放资源
    const [fileObjectURLs, setFileObjectURLs] = useState<{ [key: string]: string }>({});

    // 文件选择变更，更新文件列表和 URL 映射
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);

            // 为每个文件创建 URL
            const newURLs: { [key: string]: string } = {};
            newFiles.forEach(file => {
                newURLs[file.name + file.size] = URL.createObjectURL(file);
            });

            // 合并文件与 URL
            setSelectedFiles(prev => [...prev, ...newFiles]);
            setFileObjectURLs(prev => ({...prev, ...newURLs}));
            setError(null);
        }
    };

    // 删除指定索引的文件，同时释放其 URL
    const handleDeleteFile = (index: number) => {
        setSelectedFiles(prev => {
            const removed = prev[index];
            const key = removed.name + removed.size;
            const url = fileObjectURLs[key];
            if (url) URL.revokeObjectURL(url); // 清理资源
            return prev.filter((_, i) => i !== index);
        });

        setFileObjectURLs(prev => {
            const copy = {...prev};
            const removed = selectedFiles[index];
            delete copy[removed.name + removed.size];
            return copy;
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // 点击文件预览按钮，展示预览弹窗
    const handlePreviewFile = (file: File) => {
        const key = file.name + file.size;
        setPreviewUrl(fileObjectURLs[key]);
    };

    // 确定上传：模拟 input change 事件传给外部
    const handleConfirmUpload = () => {
        if (selectedFiles.length === 0) {
            setError('请选择至少一个文件');
            return;
        }

        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));

        const event = {
            target: {files: dataTransfer.files},
        } as React.ChangeEvent<HTMLInputElement>;

        onUpload(event);

        // 清空状态与 URL 资源
        selectedFiles.forEach(file => {
            const key = file.name + file.size;
            const url = fileObjectURLs[key];
            if (url) URL.revokeObjectURL(url);
        });

        setSelectedFiles([]);
        setFileObjectURLs({});
        setError(null);

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // 拖拽开始
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDragIndex(index);
        e.dataTransfer.setData('text/plain', index.toString());
        e.currentTarget.classList.add('opacity-60', 'bg-blue-500/20');
    };

    // 拖拽悬停目标添加样式
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (dragIndex !== index) {
            e.currentTarget.classList.add('border-2', 'border-blue-400', 'rounded-md');
        }
    };

    // 拖拽离开去除高亮
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('border-2', 'border-blue-400', 'rounded-md');
    };

    // 拖拽放下，重新排序 selectedFiles
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

    // 拖拽结束：去除拖拽样式
    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        setDragIndex(null);
        e.currentTarget.classList.remove('opacity-60', 'bg-blue-500/20');
    };

    // 卸载组件时释放所有创建的 URL
    useEffect(() => {
        return () => {
            Object.values(fileObjectURLs).forEach((url) => URL.revokeObjectURL(url));
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [fileObjectURLs, previewUrl]);

    return (
        <CenteredModal
            animationVariants={getCenterModalVariants()}
            className="w-60 flex flex-col gap-4 text-sm relative"
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-white/50 hover:text-white"
                aria-label="关闭"
                type="button"
            >
                <FiX size={18}/>
            </button>

            <div className="flex flex-col gap-4">
                {/* 上传文件按钮区域 */}
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

                {/* 拖拽排序 + 删除 + 预览 */}
                {selectedFiles.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-xl bg-[#252530]/50 p-2 border border-white/10">
                        {selectedFiles.map((file, index) => {
                            const key = file.name + file.size;
                            const url = fileObjectURLs[key];
                            return (
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
                                    <button className="text-gray-300 hover:text-gray-100 transition">
                                        <FiMove size={16}/>
                                    </button>
                                    <img
                                        src={url}
                                        alt={file.name}
                                        className="w-12 h-12 object-cover rounded-md shadow-sm"
                                    />
                                    <span className="text-white/90 text-sm truncate flex-1">{file.name}</span>
                                    <button onClick={() => handlePreviewFile(file)}
                                            className="text-blue-400 hover:text-blue-300 transition">
                                        <FiEye size={16}/>
                                    </button>
                                    <button onClick={() => handleDeleteFile(index)}
                                            className="text-red-400 hover:text-red-300 transition">
                                        <FiTrash2 size={16}/>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 错误提示信息 */}
                {error && (
                    <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs">
                        <FiAlertCircle size={14}/>
                        <span>{error}</span>
                    </div>
                )}

                {/* 操作按钮区域 */}
                <div className="flex gap-4 mt-2">
                    <button
                        onClick={onClose}
                        type="button"
                        className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-600/30 text-white/70 hover:text-white hover:bg-gray-700 cursor-pointer"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirmUpload}
                        disabled={selectedFiles.length === 0}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedFiles.length === 0
                                ? 'bg-gray-600/30 text-white/40 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 shadow-sm hover:shadow-md'
                        }`}
                    >
                        确定
                    </button>
                </div>

                {/* 图片预览弹窗 */}
                {previewUrl && (
                    <PreviewModal image={previewUrl} onClose={() => setPreviewUrl(null)}/>
                )}
            </div>
        </CenteredModal>
    );
};

export default UploadForm;
