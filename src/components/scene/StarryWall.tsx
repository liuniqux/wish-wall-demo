import React, { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import {useBackgroundColor} from "../../contexts/BackgroundColorContext.tsx"; // ⬅️ 读取 context

// ⭐ 自定义 Shader Material
const StarfieldMaterial = shaderMaterial(
    {
        time: 0,
        direction: new THREE.Vector2(1.0, 0.0), // 默认从左往右
        offset: Math.random() * 100,
        baseColor: new THREE.Color(0x202040), // 初始底色
    },
    // 顶点着色器
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // 片元着色器
    `
    precision highp float;
    uniform float time;
    uniform vec2 direction;
    uniform float offset;
    uniform vec3 baseColor;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
    }

    float meteor(vec2 uv, vec2 origin, float speed, float size, float tail) {
      vec2 pos = origin + direction * mod(time * speed + offset, 1.5);
      vec2 diff = uv - pos;
      float core = smoothstep(size, 0.0, length(diff));
      float trail = exp(-dot(diff, direction) * tail);
      return core * trail;
    }

    void main() {
      float brightness = 0.0;
      brightness += meteor(vUv, vec2(0.2, 0.3), 0.4, 0.005, 6.0);
      brightness += meteor(vUv, vec2(0.5, 0.7), 0.3, 0.004, 8.0);
      brightness += meteor(vUv, vec2(0.7, 0.5), 0.6, 0.006, 10.0);
      brightness += meteor(vUv, vec2(0.3, 0.8), 0.5, 0.004, 7.0);
      brightness += meteor(vUv, vec2(0.9, 0.2), 0.45, 0.005, 9.0);

      vec3 color = baseColor + vec3(brightness);  // 底色+流星光
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// 注册材质
extend({ StarfieldMaterial });

const StarryWall: React.FC<{ height: number }> = ({ height }) => {
    const leftRef = useRef<THREE.ShaderMaterial>(null);
    const rightRef = useRef<THREE.ShaderMaterial>(null);
    const { colorHex } = useBackgroundColor(); // ⬅️ 使用颜色上下文
    const baseColor = new THREE.Color(colorHex);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (leftRef.current) {
            leftRef.current.uniforms.time.value = t;
            leftRef.current.uniforms.baseColor.value = baseColor;
        }
        if (rightRef.current) {
            rightRef.current.uniforms.time.value = t;
            rightRef.current.uniforms.baseColor.value = baseColor;
        }
    });

    return (
        <group>
            {/* 左侧墙：流星从左 → 右 */}
            <mesh position={[-6, 0, -height / 2]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[height, 5, 0.3]} />
                <starfieldMaterial
                    ref={leftRef}
                    attach="material"
                    uniforms-direction-value={new THREE.Vector2(1.0, 0.0)}
                    uniforms-offset-value={Math.random() * 100}
                />
            </mesh>

            {/* 右侧墙：流星从右 → 左 */}
            <mesh position={[6, 0, -height / 2]} rotation={[0, -Math.PI / 2, 0]}>
                <boxGeometry args={[height, 5, 0.3]} />
                <starfieldMaterial
                    ref={rightRef}
                    attach="material"
                    uniforms-direction-value={new THREE.Vector2(-1.0, 0.0)}
                    uniforms-offset-value={Math.random() * 100}
                />
            </mesh>
        </group>
    );
};

export default StarryWall;
