import {useEffect, useRef, useState} from 'react';
import type {Direction} from '../types';

// 自定义 Hook，管理一个可拖拽面板的打开状态、位置方向及拖拽相关事件
export const usePanelDrag = () => {
    // open: 控制面板展开或收起状态
    const [open, setOpen] = useState(false);

    // direction: 面板弹出方向（top, bottom, left, right）
    const [direction, setDirection] = useState<Direction>('bottom');

    // panelRef: 面板容器的 DOM 引用，用于事件判断
    const panelRef = useRef<HTMLDivElement>(null);

    // buttonRef: 触发面板打开的按钮 DOM 引用，用于计算弹出方向
    const buttonRef = useRef<HTMLButtonElement>(null);

    // constraintsRef: 拖拽约束区域的 DOM 引用，通常用于限制拖拽范围
    const constraintsRef = useRef<HTMLDivElement>(null);

    // dragStartPos: 记录鼠标按下时的位置，用于判断是否拖拽或点击
    const dragStartPos = useRef<{ x: number; y: number } | null>(null);

    // 监听文档点击事件，实现点击面板外关闭面板功能
    useEffect(() => {
        // 点击事件回调，判断点击是否在面板外
        const handleClickOutside = (e: MouseEvent) => {
            // 若点击目标不包含在面板内，则关闭面板
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        // 清理事件监听，防止内存泄漏
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 监听窗口尺寸变化，动态更新面板弹出方向
    useEffect(() => {
        const updateDirection = () => {
            // 根据按钮位置计算合适的弹出方向
            const newDirection = getPanelDirection();
            setDirection(newDirection);
        };
        window.addEventListener('resize', updateDirection);

        // 卸载时移除监听
        return () => window.removeEventListener('resize', updateDirection);
    }, []);

    // 根据按钮的屏幕位置计算面板弹出方向的辅助函数
    const getPanelDirection = (): Direction => {
        // 如果按钮尚未渲染，默认弹出方向为底部
        if (!buttonRef.current) return 'bottom';

        // 获取按钮元素的视口位置和尺寸信息
        const rect = buttonRef.current.getBoundingClientRect();

        // 预留距离，用于判断是否贴近边缘
        const margin = 80;

        // 当前窗口宽高
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 判断按钮位置，决定弹出方向
        if (rect.bottom + margin > windowHeight) {
            // 按钮靠近底部边缘，面板弹出到上方
            return 'top';
        } else if (rect.top < margin) {
            // 按钮靠近顶部边缘，面板弹出到底部
            return 'bottom';
        } else if (rect.left < margin) {
            // 靠近左边缘，面板弹出到右侧
            return 'right';
        } else if (rect.right + margin > windowWidth) {
            // 靠近右边缘，面板弹出到左侧
            return 'left';
        } else {
            // 默认弹出到底部
            return 'bottom';
        }
    };

    // 鼠标按下事件处理，记录起始位置
    const handleMouseDown = (e: React.MouseEvent) => {
        dragStartPos.current = {x: e.clientX, y: e.clientY};
    };

    // 鼠标抬起事件处理，根据移动距离判断是点击还是拖拽
    const handleMouseUp = (e: React.MouseEvent) => {
        // 没有起始点则直接返回
        if (!dragStartPos.current) return;

        // 计算鼠标移动距离
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 清空起始点记录
        dragStartPos.current = null;

        // 若移动距离小于阈值（2px），判定为点击
        if (distance < 2) {
            // 点击时更新方向并切换面板展开状态
            const newDirection = getPanelDirection();
            setDirection(newDirection);
            setOpen((prev) => !prev);
        }
        // 超过阈值则不做处理（拖拽行为由 motion 组件控制）
    };

    // 拖拽结束事件，重新计算面板方向
    const handleDragEnd = () => {
        const newDirection = getPanelDirection();
        setDirection(newDirection);
    };

    // 返回 Hook 的状态和事件处理函数
    return {
        open,
        setOpen,
        direction,
        panelRef,
        buttonRef,
        constraintsRef,
        handleMouseDown,
        handleMouseUp,
        handleDragEnd,
    };
};
