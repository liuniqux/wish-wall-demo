import {useEffect, useRef, useState} from 'react';
import type {Direction} from '../types';

export const usePanelDrag = () => {
    const [open, setOpen] = useState(false);
    const [direction, setDirection] = useState<Direction>('bottom');
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const dragStartPos = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const updateDirection = () => {
            const newDirection = getPanelDirection();
            setDirection(newDirection);
        };
        window.addEventListener('resize', updateDirection);
        return () => window.removeEventListener('resize', updateDirection);
    }, []);

    const getPanelDirection = (): Direction => {
        if (!buttonRef.current) return 'bottom';
        const rect = buttonRef.current.getBoundingClientRect();
        const margin = 80;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        if (rect.bottom + margin > windowHeight) {
            return 'top';
        } else if (rect.top < margin) {
            return 'bottom';
        } else if (rect.left < margin) {
            return 'right';
        } else if (rect.right + margin > windowWidth) {
            return 'left';
        } else {
            return 'bottom';
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        dragStartPos.current = {x: e.clientX, y: e.clientY};
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!dragStartPos.current) return;
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        dragStartPos.current = null;

        if (distance < 2) {
            const newDirection = getPanelDirection();
            setDirection(newDirection);
            setOpen((prev) => !prev);
        }
    };

    const handleDragEnd = () => {
        const newDirection = getPanelDirection();
        setDirection(newDirection);
    };

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