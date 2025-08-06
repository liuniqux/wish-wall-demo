import React, {Suspense} from 'react';
import {Stars, Sparkles} from '@react-three/drei';
import {useSceneEnvironment} from '@/contexts/SceneEnvironmentContext.tsx';
import HDRBackgroundLoader from '@/loaders/HDRBackgroundLoader.tsx';

interface SceneEnvironmentProps {
    onHDRLoaded?: () => void;
}

const SceneEnvironment: React.FC<SceneEnvironmentProps> = ({onHDRLoaded}) => {
    const {mode} = useSceneEnvironment();

    if (mode === 'none') return null;

    return (
        <>
            {/* 星空背景与光照设置 */}
            {mode === 'default' && (
                <>
                    <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade/>
                    <Sparkles
                        count={300}
                        scale={[50, 50, 50]}
                        speed={0.5}
                        size={1.5}
                        noise={1}
                    />
                </>
            )}

            {mode === 'hdr' && (
                <Suspense fallback={null}>
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
