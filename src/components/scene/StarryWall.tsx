import React, {useRef} from 'react';
import {extend, useFrame} from '@react-three/fiber';
import {shaderMaterial} from '@react-three/drei';
import * as THREE from 'three';
import {useSpring, a} from '@react-spring/three';
import {useBackgroundColor} from '@/contexts/BackgroundColorContext.tsx';

/**
 * ⭐ 自定义 ShaderMaterial：用于生成流星划过的动态星空墙面。
 */
const StarfieldMaterial = shaderMaterial(
    {
        time: 0,
        // 控制流星运动方向
        direction: new THREE.Vector2(1.0, 0.0),
        // 每面墙的随机偏移，避免同步
        offset: Math.random() * 100,
        // 默认背景颜色
        baseColor: new THREE.Color(0x202040),
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

    // 生成伪随机值（用于星星位置扰动）
    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
    }

    // 流星亮度函数
    float meteor(vec2 uv, vec2 origin, float speed, float size, float tail) {
      vec2 pos = origin + direction * mod(time * speed + offset, 1.5);
      vec2 diff = uv - pos;
      // 流星头部
      float core = smoothstep(size, 0.0, length(diff));
      // 尾部拖影
      float trail = exp(-dot(diff, direction) * tail);
      return core * trail;
    }

    void main() {
      float brightness = 0.0;
      // 多个流星叠加
      brightness += meteor(vUv, vec2(0.2, 0.3), 0.4, 0.005, 6.0);
      brightness += meteor(vUv, vec2(0.5, 0.7), 0.3, 0.004, 8.0);
      brightness += meteor(vUv, vec2(0.7, 0.5), 0.6, 0.006, 10.0);
      brightness += meteor(vUv, vec2(0.3, 0.8), 0.5, 0.004, 7.0);
      brightness += meteor(vUv, vec2(0.9, 0.2), 0.45, 0.005, 9.0);

      // 叠加亮度到底色
      vec3 color = baseColor + vec3(brightness);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// 注册材质为 JSX 标签 <starfieldMaterial />
extend({StarfieldMaterial});

/**
 * 🌌 StarryWall 组件：展示动态流星墙体，带有动画过渡。
 */
const StarryWall: React.FC<{ wallLength: number }> = ({wallLength}) => {
    const leftRef = useRef<THREE.ShaderMaterial>(null);
    const rightRef = useRef<THREE.ShaderMaterial>(null);

    // 读取上下文中的墙体颜色
    const {wallColor} = useBackgroundColor();
    const baseColor = new THREE.Color(wallColor);

    // 使用 spring 动画平滑插值 wallLength
    const {animatedLength} = useSpring({
        animatedLength: wallLength,
        config: {tension: 80, friction: 30},
    });

    // 更新 Shader 中的时间和背景颜色
    useFrame(({clock}) => {
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
            {/* 左侧墙体 - 从左到右流星 */}
            <a.mesh
                position={animatedLength.to(len => [-6, 0, -len / 2])}
                rotation={[0, Math.PI / 2, 0]}
            >
                <boxGeometry args={[wallLength, 5, 0.3]}/>
                <starfieldMaterial
                    ref={leftRef}
                    attach="material"
                    uniforms-direction-value={new THREE.Vector2(1.0, 0.0)}
                    uniforms-offset-value={Math.random() * 100}
                />
            </a.mesh>

            {/* 右侧墙体 - 从右向左流星 */}
            <a.mesh
                position={animatedLength.to(len => [6, 0, -len / 2])}
                rotation={[0, -Math.PI / 2, 0]}
            >
                <boxGeometry args={[wallLength, 5, 0.3]}/>
                <starfieldMaterial
                    ref={rightRef}
                    attach="material"
                    uniforms-direction-value={new THREE.Vector2(-1.0, 0.0)}
                    uniforms-offset-value={Math.random() * 100}
                />
            </a.mesh>
        </group>
    );
};

export default StarryWall;
