import React from 'react';

interface GroundProps {
    // 地面的长度（沿 Z 轴的延展长度）
    groundLength: number;
}

/**
 * Ground 组件用于渲染一个接收阴影的水平地面，
 * 其位置和大小可以根据传入的 groundLength 动态调整。
 * 地面使用标准材质进行简单着色处理。
 */
const Ground: React.FC<GroundProps> = ({groundLength}) => (
    <mesh
        // 将网格绕 X 轴旋转 -90 度，使其成为水平面
        rotation={[-Math.PI / 2, 0, 0]}
        // 设置网格位置，使其位于摄像机下方 -2.5 处，并使其中心沿 Z 轴偏移 groundLength 的一半
        position={[0, -2.5, -groundLength / 2]}
        // 开启接收阴影功能
        receiveShadow
    >
        {/* 创建一个平面几何体，宽度为 30，高度为传入的 groundLength */}
        <planeGeometry args={[30, groundLength]}/>

        {/* 应用标准材质并设置为灰色 */}
        <meshStandardMaterial color="#888"/>
    </mesh>
);

export default Ground;
