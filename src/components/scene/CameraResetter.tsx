import {useFrame, useThree} from '@react-three/fiber';

// 每个台阶的高度（单位：世界坐标单位）
const STEP_HEIGHT = 1;

// 台阶总数
const STEP_COUNT = 20;

// 相机初始 Y 坐标（对应于最顶层台阶的位置）
const cameraStartY = -2.5 + STEP_HEIGHT * STEP_COUNT;

interface CameraResetterProps {
    enabled: boolean;
}

/**
 * CameraResetter 组件用于在启用时将相机的 Y 轴位置缓慢重置为初始高度。
 * 这在用户跳跃或其他移动行为后希望“归位”相机高度时非常有用。
 * 使用 useFrame 每帧检测相机当前位置并进行插值调整。
 */
const CameraResetter = ({enabled}: CameraResetterProps) => {
    // 从 useThree 获取当前场景中的相机对象
    const {camera} = useThree();

    // 每一帧执行的位置重置逻辑
    useFrame(() => {
        // 若未启用功能，直接跳过
        if (!enabled) return;

        // 计算当前 Y 位置与目标位置之间的差值
        const dy = cameraStartY - camera.position.y;

        // 若差值足够大，则进行缓动调整
        if (Math.abs(dy) > 0.01) {
            // 使用 5% 的差值速度进行线性插值，使移动显得平滑自然
            camera.position.y += dy * 0.05;
        }
    });

    // 该组件本身无需渲染任何可见内容
    return null;
};

export default CameraResetter;
