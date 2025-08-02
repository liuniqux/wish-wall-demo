import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {useFrame, useLoader} from '@react-three/fiber';
import {Html} from '@react-three/drei';
import {FaDownload, FaSearchPlus, FaTrash} from 'react-icons/fa';

// 墙面偏移值，决定图片左右分布的距离
const WALL_OFFSET = 5.82;

// 每张许愿卡之间的 Z 轴间隔
const SINGLE_WISH_LENGTH = 3;

// 单张图片的高度单位（世界坐标）
const planeHeight = 1;

// 视口的垂直高度
const viewportHeight = 5.2;

// 最大和最小 Y 坐标（用于回到顶部和底部重置）
const maxY = viewportHeight / 2 + planeHeight / 2;
const minY = -viewportHeight / 2 - planeHeight / 2;

// 可见范围阈值，用于裁剪判断
const MAX_VISIBLE_Y = 2.5;

// 全局偏移（使图像整体后移一点，避免靠近摄像机过近）
const GLOBAL_WALL_OFFSET = 5;

// Props 接口定义
interface FloatingImageProps {
    url: string;
    index: number;
    onDelete: (url: string) => void;
    onPreview?: (url: string) => void;
    onDownload?: (url: string) => void;
    swayOffset?: number;
}

/**
 * 单张漂浮图像组件
 * - 自动沿 Y 轴缓慢下落，到达底部后重置到顶部，实现无限循环效果
 * - 鼠标悬停时暂停下落并显示操作面板
 * - 支持下载、预览、删除功能
 */
const FloatingImage: React.FC<FloatingImageProps> = React.memo(({url, index, onDelete, onPreview}) => {
    const ref = useRef<THREE.Group>(null);

    // 加载图片纹理
    const texture = useLoader(THREE.TextureLoader, url);

    // 图像在画布中的宽高比例（初始为 [2, 1]，随后根据实际图像设置）
    const [dimensions, setDimensions] = useState<[number, number]>([2, 1]);

    // 悬停状态：分别检测画布区域和 HTML 面板区域是否悬停
    const [hoveredCanvas, setHoveredCanvas] = useState(false);
    const [hoveredHtml, setHoveredHtml] = useState(false);
    const hovered = hoveredCanvas || hoveredHtml;

    // 图片可视性状态（用于判断是否显示操作按钮）
    const [visible, setVisible] = useState(true);

    // 高度单位常量
    const heightUnits = 1.2;

    // 相位偏移值（使不同图片摇摆不同步）
    const phase = React.useMemo(() => Math.random() * Math.PI * 2, []);

    // 设置纹理宽高和过滤器，仅在初始加载时执行一次
    useEffect(() => {
        if (texture.image) {
            const {width, height} = texture.image;
            const ratio = width / height;
            const widthUnits = ratio * heightUnits;
            setDimensions([widthUnits, heightUnits]);
        }

        texture.minFilter = THREE.LinearMipMapLinearFilter;
        texture.magFilter = THREE.LinearFilter;

        return () => {
            texture.dispose();
        };
    }, [texture]);

    // 根据 index 计算每张图像的位置与朝向
    const x = index % 2 === 0 ? -WALL_OFFSET + 0.01 : WALL_OFFSET - 0.01;
    const y = maxY;
    const z = -index * SINGLE_WISH_LENGTH - SINGLE_WISH_LENGTH / 2 - GLOBAL_WALL_OFFSET;
    const rotationY = x < 0 ? Math.PI / 2 : -Math.PI / 2;
    const wallOffset = x < 0 ? x + 0.0001 : x - 0.0001;

    // 设置裁剪平面用于控制 mesh 可见区域
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), MAX_VISIBLE_Y);

    // 内部引用记录动画时间和当前角度（用于控制摇晃）
    const localTimeRef = useRef(0);
    const currentAngleRef = useRef(0);

    // 每帧更新位置和状态
    useFrame((_, delta) => {
        if (!ref.current) return;

        if (!hovered) {
            // 非悬停时：缓慢向下移动 + 轻微摇摆
            ref.current.position.y -= delta * 0.1;

            if (ref.current.position.y < minY) {
                ref.current.position.y = maxY;
            }

            localTimeRef.current += delta;
            const angle = 0.05 * Math.cos(localTimeRef.current * 2 + phase);
            currentAngleRef.current = angle;
            ref.current.rotation.x = angle;
        } else {
            // 悬停状态时：保持当前角度，暂停动画
            ref.current.rotation.x = currentAngleRef.current;
        }

        const yPos = ref.current.position.y;
        const fullyInsideWall =
            yPos + heightUnits / 2 + 0.1 <= maxY && yPos - heightUnits / 2 - 0.1 >= minY;
        setVisible(fullyInsideWall);
    });

    /**
     * 下载图片处理逻辑（通过 fetch + Blob 下载图片资源）
     */
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

    // 返回完整的图像 + 操作按钮组件结构
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
                        className="
                                    absolute top-1/2 left-1/2
                                    flex gap-3
                                    bg-black bg-opacity-60
                                    px-3 py-1.5
                                    rounded-lg
                                    -translate-x-1/2 -translate-y-1/2
                                    z-10
                                    select-none
                                    items-center justify-center
                                  "
                    >
                        <FaSearchPlus
                            tabIndex={-1}
                            onMouseDown={e => e.preventDefault()}
                            onClick={e => {
                                e.stopPropagation();
                                setHoveredHtml(false);
                                onPreview?.(url);
                            }}
                            className="
                                        text-blue-500
                                        cursor-pointer
                                        text-xl
                                        select-none
                                        hover:text-blue-400
                                      "
                            title="放大"
                        />
                        <FaDownload
                            tabIndex={-1}
                            onMouseDown={e => e.preventDefault()}
                            onClick={async e => {
                                e.stopPropagation();
                                setHoveredHtml(false);
                                await handleDownload(url);
                            }}
                            className="
                                        text-green-500
                                        cursor-pointer
                                        text-xl
                                        select-none
                                        hover:text-green-400
                                      "
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
                            className="
                                        text-red-500
                                        cursor-pointer
                                        text-xl
                                        select-none
                                        hover:text-red-400
                                      "
                            title="删除"
                        />
                    </div>
                </Html>
            )}
        </group>
    );
});

export default FloatingImage;
