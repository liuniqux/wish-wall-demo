import React, {Suspense} from 'react';
import {Stars, Sparkles, Sky} from '@react-three/drei';
import {useSceneEnvironment} from '@/contexts/SceneEnvironmentContext.tsx';
import HDRBackgroundLoader from '@/loaders/HDRBackgroundLoader.tsx';
import type {EnvironmentMode} from "@/types";

interface SceneEnvironmentProps {
    mode: EnvironmentMode;
    onHDRLoaded?: () => void;
}

const SceneEnvironment: React.FC<SceneEnvironmentProps> = ({mode, onHDRLoaded}) => {
    const {lastMode} = useSceneEnvironment();

    if (mode === 'none') return null;

    return (
        <>
            {/* 星空背景与光照设置 */}
            {mode === 'cosmic' && (
                <>
                    <Stars radius={150} count={3000} factor={4} fade />
                    <Sparkles count={500} scale={[100, 100, 100]} size={2} speed={0.3} />
                    <Sky sunPosition={[100, 10, 100]} turbidity={8} />
                </>
            )}

            {mode === 'hdr' && (
                <Suspense fallback={<SceneEnvironment mode={lastMode}/>}>
                    <HDRBackgroundLoader
                        hdrPath="/textures/environment/citrus_orchard_road_puresky_4k.hdr"
                        onLoaded={onHDRLoaded}
                    />
                </Suspense>
            )}

            {mode === 'minimal' && (
                <ambientLight intensity={0.5}/>
            )}
        </>
    );
};

export default SceneEnvironment;
