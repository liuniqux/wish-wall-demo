import React, { useState, useEffect, useRef } from 'react';
import { FiSettings } from 'react-icons/fi'; // 添加图标
import { useWallColor } from '../contexts/WallColorContext';
import { useBackgroundSettings } from '../contexts/BackgroundContext';

const SceneSettingsPanel: React.FC = () => {
    const { colorHex, setColorHex } = useWallColor();
    const { backgroundColor, setBackgroundColor, backgroundStyle, setBackgroundStyle } = useBackgroundSettings();

    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // 点击外部区域自动收起面板
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const iconStyle: React.CSSProperties = {
        width: 24,
        height: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18,
        lineHeight: 1,
        textAlign: 'center',
        flexShrink: 0,
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 8,
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                userSelect: 'none',
            }}
            ref={panelRef}
        >
            {/* 主按钮 */}
            <button
                onClick={() => setOpen(!open)}
                aria-label="设置"
                title="设置"
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: open
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(255, 255, 255, 0.1)',
                    border: '1.5px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(12px)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0,
                    lineHeight: 1,
                    boxShadow: open ? '0 0 12px rgba(255,255,255,0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                }}
            >
                <FiSettings
                    size={20}
                    style={{
                        transition: 'transform 0.3s ease, color 0.3s ease',
                        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
                        color: open ? '#61dafb' : '#ffffff',
                    }}
                />
            </button>

            {/* 设置面板 */}
            <div
                style={{
                    marginTop: 8,
                    background: 'rgba(30, 30, 40, 0.85)',
                    padding: '14px 18px',
                    borderRadius: 12,
                    width: 160,
                    color: 'white',
                    fontSize: 14,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                    display: open ? 'flex' : 'none',
                    flexDirection: 'column',
                    gap: 16,
                    userSelect: 'none',
                    transition: 'opacity 0.3s ease',
                }}
            >
                {/* 墙面颜色 */}
                <label
                    title="墙面颜色"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        maxWidth: 'fit-content'
                    }}
                >
                    <span role="img" aria-label="wall" style={iconStyle}>🧱</span>
                    <input
                        type="color"
                        value={colorHex}
                        onChange={(e) => setColorHex(e.target.value)}
                        style={{
                            width: 36,
                            height: 36,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            borderRadius: 6,
                            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                            padding: 0,
                        }}
                    />
                </label>

                {/* 背景颜色 */}
                <label
                    title="背景颜色"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        maxWidth: 'fit-content'
                    }}
                >
                    <span role="img" aria-label="background" style={iconStyle}>🌌</span>
                    <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        style={{
                            width: 36,
                            height: 36,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            borderRadius: 6,
                            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                            padding: 0,
                        }}
                    />
                </label>

                {/* 背景样式 */}
                <label
                    title="背景样式"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                    }}
                >
                    <span role="img" aria-label="style" style={iconStyle}>🎨</span>
                    <select
                        value={backgroundStyle}
                        onChange={(e) =>
                            setBackgroundStyle(e.target.value as 'none' | 'stars' | 'gradient' | 'grid')
                        }
                        style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            background: '#2a2a38',
                            color: 'white',
                            border: '1px solid #444',
                            cursor: 'pointer',
                            fontSize: 14,
                            flexGrow: 1,
                        }}
                    >
                        <option value="none">无</option>
                        <option value="stars">星空</option>
                        <option value="gradient">渐变</option>
                        <option value="grid">网格</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

export default SceneSettingsPanel;
