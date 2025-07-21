import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';

const SINGLE_WISH_LENGTH = 3;

interface CameraControllerProps {
    velocity: THREE.Vector3;
    wishCount: number;
}

const CORRIDOR_WIDTH = 6 - 0.5 / 2 - 0.1;

const CameraController: React.FC<CameraControllerProps> = ({velocity, wishCount}) => {
    const jumpSpeed = 8;
    const gravity = 20;
    const floorY = 0;

    const vy = useRef(0);
    const jumping = useRef(false);
    const direction = useRef(new THREE.Vector3(0, 0, -1));
    const angle = useRef(0);

    const keys = useRef<{ [key: string]: boolean }>({});

    useFrame((state, delta) => {
        const cam = state.camera;

        // 最远前进距离
        const zMin = -wishCount * SINGLE_WISH_LENGTH - 5;

        // 最远后退距离
        const zMax = 0;

        const rotationSpeed = 1.5;
        if (keys.current['ArrowLeft']) angle.current += rotationSpeed * delta;
        if (keys.current['ArrowRight']) angle.current -= rotationSpeed * delta;

        const rotatedDir = direction.current.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle.current);
        const move = rotatedDir.clone().multiplyScalar(velocity.z * delta);
        cam.position.add(move);

        cam.position.x = Math.max(-CORRIDOR_WIDTH, Math.min(CORRIDOR_WIDTH, cam.position.x));
        // if (cam.position.z > 5) cam.position.z = -SEGMENTS * 10 + 5;

        cam.position.z = Math.max(zMin, Math.min(zMax, cam.position.z));

        vy.current -= gravity * delta;
        cam.position.y += vy.current * delta;
        if (cam.position.y <= floorY) {
            cam.position.y = floorY;
            vy.current = 0;
            jumping.current = false;
        }

        cam.lookAt(cam.position.clone().add(rotatedDir));
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((document.activeElement as HTMLElement)?.tagName === 'INPUT') return;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
            keys.current[e.key] = true;

            if (e.key === ' ' && !jumping.current) {
                jumping.current = true;
                vy.current = jumpSpeed;
            }

            const baseSpeed = e.shiftKey ? 12 : 5;
            velocity.z = (keys.current['ArrowUp'] ? baseSpeed : 0) - (keys.current['ArrowDown'] ? baseSpeed : 0);
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys.current[e.key] = false;
            const baseSpeed = e.shiftKey ? 12 : 5;
            velocity.z = (keys.current['ArrowUp'] ? baseSpeed : 0) - (keys.current['ArrowDown'] ? baseSpeed : 0);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [velocity]);

    return null;
};

export default CameraController;