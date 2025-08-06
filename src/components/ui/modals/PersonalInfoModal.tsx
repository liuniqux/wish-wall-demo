import React from 'react';

// 引入通用弹窗容器组件
import CenteredModal from '@/components/ui/modals/CenteredModal.tsx';
import {getCenterModalVariants} from "@/utils/animation.tsx";
import CloseButton from "@/components/ui/CloseButton.tsx";

/**
 * PersonalInfoModalProps 定义了弹窗组件所需的 props 类型
 */
interface PersonalInfoModalProps {
    // 关闭弹窗时调用的回调函数
    onClose: () => void;
}

/**
 * PersonalInfoModal 是一个用于展示“个人信息设置”的弹窗组件
 * 当前仅显示提示内容，功能尚未实现
 */
const PersonalInfoModal: React.FC<PersonalInfoModalProps> = ({onClose}) => {
    return (
        // 使用 CenteredModal 包裹内容，实现统一样式和居中布局
        <CenteredModal className="w-80 max-w-full flex flex-col gap-4 text-sm"
                       centerModalVariants={getCenterModalVariants()}>

            {/* 关闭按钮，位于右上角 */}
            <CloseButton onClose={onClose}/>

            {/* 主体内容区域，居中展示标题与占位提示 */}
            <div className="text-center">
                <p>个人信息设置</p>
                <p className="text-gray-400 text-xs mt-2">（功能待实现）</p>
            </div>

        </CenteredModal>
    );
};

export default PersonalInfoModal;
