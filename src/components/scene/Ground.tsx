import React from 'react';
import {useSpring, a} from '@react-spring/three';

interface GroundProps {
    groundLength: number;
}

const Ground: React.FC<GroundProps> = ({groundLength}) => {
    const safeLength = groundLength && groundLength > 0 ? groundLength : 1;

    const {scaleY, posZ} = useSpring({
        scaleY: safeLength,
        posZ: -safeLength / 2,
        config: {mass: 1, tension: 170, friction: 26},
    });

    return (
        <a.mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position-y={-2.5}
            position-z={posZ}
            scale-y={scaleY}
            receiveShadow
        >
            {/* 固定高度为 1，通过 scaleY 实现动画拉伸 */}
            <planeGeometry args={[30, 1]}/>
            <meshStandardMaterial color="#888"/>
        </a.mesh>
    );
};


export default Ground;
