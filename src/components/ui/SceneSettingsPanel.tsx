// 引入 React 及其 Hook
import React, {useState} from 'react';

// 引入用于图标按钮的 Icon 组件
import {FiSettings, FiLogOut, FiUpload, FiUser} from 'react-icons/fi';

// 引入动画库
import {AnimatePresence, motion} from 'framer-motion';

// 引入自定义拖动逻辑 Hook
import {usePanelDrag} from '@/hooks/usePanelDrag';

// 引入弹窗组件：样式设置、个人信息、上传表单
import StyleSettingsModal from '@/components/ui/modals/StyleSettingsModal';
import PersonalInfoModal from '@/components/ui/modals/PersonalInfoModal';
import UploadModal from '@/components/ui/modals/UploadModal.tsx';

// 动画工具函数：根据方向生成不同的进入/退出动画
import {getAnimationVariants} from "@/utils/animation.tsx";

// 引入定义好的类型
import type {ActiveModel} from "@/types";

// Props 类型定义，传入登出函数和上传回调
interface SceneSettingsPanelProps {
    onLogout: () => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 设置面板主组件
const SceneSettingsPanel: React.FC<SceneSettingsPanelProps> = ({onLogout, onUpload}) => {

    // 使用自定义 Hook 获取拖动面板的状态和操作函数
    const {
        // 是否展开面板
        open,
        // 设置展开状态
        setOpen,
        // 面板展开方向（用于动画）
        direction,
        // 面板 DOM 引用
        panelRef,
        // 设置按钮 DOM 引用
        buttonRef,
        // 拖动约束区域 DOM 引用
        constraintsRef,
        // 按下按钮时的处理函数
        handleMouseDown,
        // 松开按钮时的处理函数
        handleMouseUp,
        // 拖动结束时的处理函数
        handleDragEnd
    } = usePanelDrag();

    // 当前激活的弹窗类型（样式、个人信息、上传）
    const [activeModal, setActiveModal] = useState<ActiveModel>(null);

    // 获取对应方向的动画配置
    const variants = getAnimationVariants(direction);

    // 点击菜单项时触发，设置激活弹窗并关闭面板
    const handleMenuClick = (modal: ActiveModel) => {
        setActiveModal(modal);
        setOpen(false);
    };

    return (
        <>
            {/* 拖动约束区域：用于限制拖动的最大范围（全屏） */}
            <div
                ref={constraintsRef}
                className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[30]"
            />

            {/* 设置按钮和菜单面板 */}
            <motion.div
                // 面板未展开时允许拖动
                drag={!open}
                // 设置拖动约束区域
                dragConstraints={constraintsRef}
                // 拖动弹性
                dragElastic={0.2}
                // 拖动后无惯性滑动
                dragMomentum={false}
                // 拖动结束处理逻辑
                onDragEnd={handleDragEnd}
                // 当前面板 DOM 引用
                ref={panelRef}
                className={`fixed top-5 right-5 z-[10] flex flex-col items-end gap-2 font-sans select-none ${open ? 'cursor-pointer' : 'cursor-grab'}`}
            >
                {/* 设置按钮（齿轮图标） */}
                <button
                    ref={buttonRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    aria-label="设置"
                    title="设置"
                    className={`group w-11 h-11 rounded-full border backdrop-blur-md flex justify-center items-center p-0 leading-none transition-all duration-300 outline-none focus:outline-none focus:ring-0 
                        ${open ? 'bg-white/15 cursor-pointer border-blue-400 shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'bg-white/10 cursor-grab border-white/30'}
                        hover:bg-white/20 hover:border-blue-200`}
                >
                    <FiSettings
                        size={20}
                        className={`transition-all duration-300 ${open ? 'rotate-90 text-[#61dafb]' : 'rotate-0 text-white/30'} group-hover:text-blue-200`}
                    />
                </button>

                {/* 设置弹出的菜单面板（样式/信息/上传/退出） */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={variants.initial}
                            animate={variants.animate}
                            exit={variants.exit}
                            transition={{duration: 0.25, ease: 'easeOut'}}
                            style={{pointerEvents: open ? 'auto' : 'none'}}
                            className={`absolute ${
                                direction === 'top' ? 'bottom-14 right-0' :
                                    direction === 'left' ? 'right-14 top-0' :
                                        direction === 'right' ? 'left-14 top-0' :
                                            'top-14 right-0'
                            } bg-[#0a0f1a] bg-opacity-90 p-3 rounded-lg w-44 text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex flex-col gap-2 select-none cursor-default border border-[#2a3449] backdrop-blur-md`}
                        >
                            {/* 样式设置 */}
                            <button
                                onClick={() => handleMenuClick('style')}
                                className="px-3 py-2.5 rounded bg-[#1a2235] hover:bg-[#242e49] text-left text-white flex items-center gap-2 transition-colors"
                            >
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <FiSettings size={16}/>
                                </div>
                                样式
                            </button>

                            {/* 个人信息设置 */}
                            <button
                                onClick={() => handleMenuClick('personal')}
                                className="px-3 py-2.5 rounded bg-[#1a2235] hover:bg-[#242e49] text-left text-white flex items-center gap-2 transition-colors"
                            >
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <FiUser size={16}/>
                                </div>
                                个人信息
                            </button>

                            {/* 上传图片按钮 */}
                            <button
                                onClick={() => handleMenuClick('upload')}
                                className="px-3 py-2.5 rounded bg-[#1a2235] hover:bg-[#242e49] text-left text-white flex items-center gap-2 transition-colors"
                            >
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <FiUpload size={16} color="#3b82f6"/>
                                </div>
                                上传
                            </button>

                            {/* 退出登录按钮 */}
                            <button
                                onClick={onLogout}
                                className="px-3 py-2.5 rounded bg-[#1a2235] hover:bg-[#242e49] text-left text-white flex items-center gap-2 transition-colors"
                            >
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <FiLogOut size={16} color="#e53e3e"/>
                                </div>
                                退出
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* 根据当前激活的 modal 类型显示对应弹窗组件 */}
            <AnimatePresence>
                {activeModal === 'style' && (
                    <StyleSettingsModal onClose={() => setActiveModal(null)}/>
                )}
                {activeModal === 'personal' && (
                    <PersonalInfoModal onClose={() => setActiveModal(null)}/>
                )}
                {activeModal === 'upload' && (
                    <UploadModal
                        onUpload={(e) => {
                            onUpload(e);
                        }}
                        onClose={() => setActiveModal(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

// 导出组件
export default SceneSettingsPanel;
