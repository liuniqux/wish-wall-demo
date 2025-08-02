import React, {useEffect, useRef} from 'react';
import * as THREE from 'three';
import {useFrame} from '@react-three/fiber';

// 每个愿望图像在墙上的纵向长度（单位距离）
const SINGLE_WISH_LENGTH = 3;

// 定义走廊的最大宽度边界，用于限制摄像机在X轴上的移动范围
const CORRIDOR_WIDTH = 6 - 0.5 / 2 - 0.1;

interface CameraControllerProps {
    // 摄像机在Z轴上的移动速度，由外部控制
    velocity: THREE.Vector3;
    // 当前墙上显示的愿望数量，用于计算最远可前进距离
    wishCount: number;
    // 是否启用跳跃和重力行为
    enabled: boolean;
}

/**
 * 摄像机控制组件
 * 通过键盘事件控制摄像机在3D场景中的移动、旋转和跳跃。
 * 摄像机前后移动由 ArrowUp/ArrowDown 控制，左右旋转由 ArrowLeft/ArrowRight 控制，空格跳跃。
 */
const CameraController: React.FC<CameraControllerProps> = ({velocity, wishCount, enabled}) => {
    // 向上跳跃初速度
    const jumpSpeed = 8;
    // 向下的重力加速度
    const gravity = 20;
    // 地面高度
    const floorY = 0;

    // 垂直方向的速度（Y轴）
    const vy = useRef(0);
    // 是否正在跳跃
    const jumping = useRef(false);
    // 摄像头默认朝向
    const direction = useRef(new THREE.Vector3(0, 0, -1));
    // 当前旋转角度（水平绕Y轴）
    const angle = useRef(0);

    // 储存按键状态，例如 { ArrowUp: true, ArrowLeft: false }
    const keys = useRef<{ [key: string]: boolean }>({});

    // 每一帧调用一次，用于更新摄像头位置与方向
    useFrame((state, delta) => {
        const cam = state.camera;

        // 根据愿望数量，计算摄像机可前进的最远距离（负方向）
        const zMin = -wishCount * SINGLE_WISH_LENGTH - 5;
        // 可后退到的最远距离（Z=0）
        const zMax = 0;

        // 摄像机旋转速度（左右方向）
        const rotationSpeed = 1.5;
        if (keys.current['ArrowLeft']) angle.current += rotationSpeed * delta;
        if (keys.current['ArrowRight']) angle.current -= rotationSpeed * delta;

        // 根据当前角度，旋转摄像头朝向方向
        const rotatedDir = direction.current.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), angle.current);

        // 沿旋转方向移动摄像机
        const move = rotatedDir.clone().multiplyScalar(velocity.z * delta);
        cam.position.add(move);

        // 限制摄像机X轴位置在走廊范围内
        cam.position.x = Math.max(-CORRIDOR_WIDTH, Math.min(CORRIDOR_WIDTH, cam.position.x));

        // 限制摄像机Z轴位置在允许范围内
        cam.position.z = Math.max(zMin, Math.min(zMax, cam.position.z));

        // 如果跳跃启用，则应用重力和跳跃逻辑
        if (enabled) {
            // 施加重力
            vy.current -= gravity * delta;
            // 更新垂直位置
            cam.position.y += vy.current * delta;

            if (cam.position.y <= floorY) {
                cam.position.y = floorY;
                vy.current = 0;
                jumping.current = false;
            }
        }

        // 摄像机始终朝向其移动方向
        cam.lookAt(cam.position.clone().add(rotatedDir));
    });

    // 处理键盘按下事件
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // 避免在输入框内控制摄像机
            if ((document.activeElement as HTMLElement)?.tagName === 'INPUT') return;

            // 阻止默认箭头滚动行为
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }

            keys.current[e.key] = true;

            // 空格键跳跃逻辑
            if (e.key === ' ' && !jumping.current) {
                jumping.current = true;
                vy.current = jumpSpeed;
            }

            // 设置前后移动速度，Shift 加速
            const baseSpeed = e.shiftKey ? 12 : 5;
            velocity.z = (keys.current['ArrowUp'] ? baseSpeed : 0)
                - (keys.current['ArrowDown'] ? baseSpeed : 0);
        };

        // 处理键盘释放事件
        const handleKeyUp = (e: KeyboardEvent) => {
            keys.current[e.key] = false;

            const baseSpeed = e.shiftKey ? 12 : 5;
            velocity.z = (keys.current['ArrowUp'] ? baseSpeed : 0)
                - (keys.current['ArrowDown'] ? baseSpeed : 0);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [velocity]);

    // 该组件仅用于控制摄像机，因此不渲染任何内容
    return null;
};

export default CameraController;
