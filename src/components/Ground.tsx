import React from 'react';

interface GroundProps {
    groundLength: number;
}

const Ground: React.FC<GroundProps> = ({ groundLength }) => (
    <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2.5, -groundLength / 2]}
        receiveShadow
    >
        <planeGeometry args={[30, groundLength]} />
        <meshStandardMaterial color="#888" />
    </mesh>
);

export default Ground;