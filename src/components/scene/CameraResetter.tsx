import {useFrame, useThree} from '@react-three/fiber';

const STEP_HEIGHT = 1;
const STEP_COUNT = 20;
const cameraStartY = -2.5 + STEP_HEIGHT * STEP_COUNT;

const CameraResetter = ({enabled}: { enabled: boolean }) => {
    const {camera} = useThree();
    useFrame(() => {
        if (!enabled) return;
        const dy = cameraStartY - camera.position.y;
        if (Math.abs(dy) > 0.01) {
            camera.position.y += dy * 0.05;
        }
    });
    return null;
};

export default CameraResetter