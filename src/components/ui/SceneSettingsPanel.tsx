import React, {useState, useEffect} from 'react';
import {FiSettings, FiLogOut, FiUpload, FiX} from 'react-icons/fi';
import {AnimatePresence, motion} from 'framer-motion';
import {usePanelDrag} from '../../hooks/usePanelDrag';
import StyleSettingsModal from './setting/StyleSettingsModal.tsx';
import PersonalInfoModal from './setting/PersonalInfoModal.tsx';
import UploadForm from '../ui/UploadForm.tsx';
import {getAnimationVariants} from "../../utils/animation.tsx";

interface SceneSettingsPanelProps {
    onLogout: () => void;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SceneSettingsPanel: React.FC<SceneSettingsPanelProps> = ({onLogout, onUpload}) => {
    const {
        open,
        direction,
        panelRef,
        buttonRef,
        constraintsRef,
        handleMouseDown,
        handleMouseUp,
        handleDragEnd
    } = usePanelDrag();
    const [activeModal, setActiveModal] = useState<'style' | 'personal' | 'upload' | null>(null);

    // 调试：确认模态窗口状态
    useEffect(() => {
        console.log('Active modal:', activeModal);
    }, [activeModal]);

    const variants = getAnimationVariants(direction);

    return (
        <>
            <div ref={constraintsRef} className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-[30]"/>
            <motion.div
                drag={!open}
                dragConstraints={constraintsRef}
                dragElastic={0.2}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
                ref={panelRef}
                className={`fixed top-5 right-5 z-[10] flex flex-col items-end gap-2 font-sans select-none ${open ? 'cursor-pointer' : 'cursor-grab'}`}
            >
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
                                        direction === 'right' ? 'left-14 top-0' : 'top-14 right-0'
                            } bg-[#1e1e28d9] p-4 rounded-lg w-40 text-white text-sm shadow-[0_8px_20px_rgba(0,0,0,0.6)] flex flex-col gap-2 select-none cursor-default`}
                        >
                            <button
                                onClick={() => setActiveModal('style')}
                                className="px-2 py-1 rounded hover:bg-white/10 text-left text-white"
                            >
                                样式
                            </button>
                            <button
                                onClick={() => setActiveModal('personal')}
                                className="px-2 py-1 rounded hover:bg-white/10 text-left text-white"
                            >
                                个人信息
                            </button>
                            <button
                                onClick={() => setActiveModal('upload')}
                                className="px-2 py-1 rounded hover:bg-blue-500/20 text-left text-white flex items-center gap-2"
                            >
                                <FiUpload size={16} color="#3b82f6"/>
                                上传
                            </button>
                            <button
                                onClick={onLogout}
                                className="px-2 py-1 rounded hover:bg-red-500/20 text-left text-white flex items-center gap-2"
                            >
                                <FiLogOut size={16} color="#e53e3e"/>
                                退出
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <AnimatePresence>
                {activeModal === 'style' && (
                    <StyleSettingsModal onClose={() => setActiveModal(null)} direction={direction}/>
                )}
                {activeModal === 'personal' && (
                    <PersonalInfoModal onClose={() => setActiveModal(null)} direction={direction}/>
                )}
                {activeModal === 'upload' && (
                    <motion.div
                        initial={variants.initial}
                        animate={variants.animate}
                        exit={variants.exit}
                        transition={{duration: 0.3, ease: 'easeOut'}}
                        className={`absolute z-[20] ${
                            direction === 'top' ? 'bottom-14 right-0' :
                                direction === 'left' ? 'right-14 top-0' :
                                    direction === 'right' ? 'left-14 top-0' : 'top-14 right-0'
                        } bg-gradient-to-br from-[#1e1e28] to-[#2a2a38] p-6 rounded-2xl w-96 text-white text-sm shadow-[0_8px_24px_rgba(0,0,0,0.8)] flex flex-col gap-4 select-none cursor-default border border-white/10`}
                    >
                        <button
                            onClick={() => setActiveModal(null)}
                            className="absolute top-3 right-3 text-white/50 hover:text-white transition"
                            aria-label="关闭"
                        >
                            <FiX size={18}/>
                        </button>
                        <h3 className="text-white font-semibold text-base">上传图片</h3>
                        <UploadForm onUpload={(e) => {
                            onUpload(e);
                            setActiveModal(null);
                        }}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SceneSettingsPanel;