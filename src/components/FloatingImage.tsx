import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {useFrame, useLoader} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import {FaDownload, FaSearchPlus, FaTrash} from 'react-icons/fa';

const WALL_OFFSET = 5.82;
const SINGLE_WISH_LENGTH = 3;
const planeHeight = 1;
const viewportHeight = 5.2;
const maxY = viewportHeight / 2 + planeHeight / 2;
const minY = -viewportHeight / 2 - planeHeight / 2;
const MAX_VISIBLE_Y = 2.5;
const GLOBAL_WALL_OFFSET = 5;

interface FloatingImageProps {
    url: string;
    index: number;
    onDelete: (url: string) => void;
    onPreview?: (url: string) => void;
    onDownload?: (url: string) => void;
    swayOffset?: number;
}

const FloatingImage: React.FC<FloatingImageProps> = React.memo(({url, index, onDelete, onPreview}) => {
        const ref = useRef<THREE.Group>(null);
        const texture = useLoader(THREE.TextureLoader, url);
        const [dimensions, setDimensions] = useState<[number, number]>([2, 1]);

        const [hoveredCanvas, setHoveredCanvas] = useState(false);
        const [hoveredHtml, setHoveredHtml] = useState(false);
        const hovered = hoveredCanvas || hoveredHtml;
        const heightUnits = 1.2;

        const [visible, setVisible] = useState(true);

        // 这里生成随机相位偏移，只在组件挂载时生成一次
        const phase = React.useMemo(() => Math.random() * Math.PI * 2, []);

        useEffect(() => {
            if (texture.image) {
                const {width, height} = texture.image;
                const ratio = width / height;
                const heightUnits = 1.2;
                const widthUnits = ratio * heightUnits;
                setDimensions([widthUnits, heightUnits]);
            }
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            return () => {
                texture.dispose();
            };
        }, [texture]);

        const x = index % 2 === 0 ? -WALL_OFFSET + 0.01 : WALL_OFFSET - 0.01;
        const y = maxY;
        const z = -index * SINGLE_WISH_LENGTH - SINGLE_WISH_LENGTH / 2 - GLOBAL_WALL_OFFSET;
        const rotationY = x < 0 ? Math.PI / 2 : -Math.PI / 2;
        const wallOffset = x < 0 ? x + 0.0001 : x - 0.0001;

        const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), MAX_VISIBLE_Y);


        const localTimeRef = useRef(0);
        const currentAngleRef = useRef(0);

        useFrame((_, delta) => {
            if (!ref.current) return;

            if (!hovered) {
                // 未悬停时，位置下降 + 旋转摇晃
                ref.current.position.y -= delta * 0.1;
                if (ref.current.position.y < minY) {
                    ref.current.position.y = maxY;
                }
                localTimeRef.current += delta;
                const angle = 0.05 * Math.cos(localTimeRef.current * 2 + phase);
                currentAngleRef.current = angle;
                ref.current.rotation.x = angle;
            } else {
                // 悬停时，保持当前位置和当前角度
                // 位置不变，不做操作
                ref.current.rotation.x = currentAngleRef.current;
            }

            // 更新是否可见状态
            const y = ref.current.position.y;
            const fullyInsideWall = y + heightUnits / 2 + 0.1 <= maxY && y - heightUnits / 2 - 0.1 >= minY;
            setVisible(fullyInsideWall);
        });


        const handleDownload = async (url: string) => {
            try {
                const response = await fetch(url, {mode: 'cors'});
                if (!response.ok) {
                    console.error('下载失败，HTTP状态码:', response.status);
                    alert('下载失败，请稍后再试');
                    return;
                }
                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = url.split('/').pop() || 'downloaded_image';
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('下载图片失败:', error);
                alert('下载失败，请稍后再试');
            }
        };

        return (
            <group
                ref={ref}
                position={[wallOffset, y, z]}
                rotation={[0, rotationY, 0]}
                frustumCulled={false}
                onPointerOver={() => setHoveredCanvas(true)}
                onPointerOut={() => setHoveredCanvas(false)}
            >
                <mesh position={[0, 0, -0.01]}>
                    <planeGeometry args={dimensions}/>
                    <meshBasicMaterial
                        map={texture}
                        transparent={false}
                        depthWrite={true}
                        clippingPlanes={[clippingPlane]}
                    />
                </mesh>

                {hovered && visible && (
                    <Html
                        center
                        transform
                        scale={0.3}
                        position={[0, 0, 0]}
                        style={{pointerEvents: 'auto'}}
                    >
                        <div
                            onMouseEnter={() => setHoveredHtml(true)}
                            onMouseLeave={() => setHoveredHtml(false)}
                            onMouseDown={e => e.preventDefault()}
                            style={{
                                display: 'flex',
                                gap: '12px',
                                background: 'rgba(0, 0, 0, 0.65)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                transform: 'translate(-50%, -50%)',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                zIndex: 1,
                                userSelect: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FaSearchPlus
                                tabIndex={-1}
                                onMouseDown={e => e.preventDefault()}
                                onClick={e => {
                                    e.stopPropagation();
                                    setHoveredHtml(false);
                                    onPreview?.(url);
                                }}
                                style={{
                                    color: '#1890ff',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    userSelect: 'none',
                                }}
                                title="放大"
                            />
                            <FaDownload
                                tabIndex={-1}
                                onMouseDown={e => e.preventDefault()}
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setHoveredHtml(false);
                                    await handleDownload(url);
                                }}
                                style={{
                                    color: '#52c41a',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    userSelect: 'none',
                                }}
                                title="下载"
                            />
                            <FaTrash
                                tabIndex={-1}
                                onMouseDown={e => e.preventDefault()}
                                onClick={e => {
                                    e.stopPropagation();
                                    setHoveredHtml(false);
                                    onDelete(url);
                                }}
                                style={{
                                    color: '#ff4d4f',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                    userSelect: 'none',
                                }}
                                title="删除"
                            />
                        </div>
                    </Html>
                )}
            </group>
        );
    }
);

export default FloatingImage;