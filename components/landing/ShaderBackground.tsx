"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const GradientMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#000000"),
    uColor2: new THREE.Color("#1a202c"),
    uColor3: new THREE.Color("#ea580c"),
    uColor4: new THREE.Color("#1e3a8a"),
  },

  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    varying vec2 vUv;


    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      

      float time = uTime * 0.2;
      

      float n1 = snoise(uv * 3.0 + time);
      float n2 = snoise(uv * 2.0 - time * 0.5);
      float n3 = snoise(uv * 5.0 + time * 0.8);


      vec3 color = mix(uColor1, uColor2, smoothstep(-1.0, 1.0, n1));
      color = mix(color, uColor3, smoothstep(0.0, 0.8, n2 * n1));
      color = mix(color, uColor4, smoothstep(0.0, 0.9, n3 * n2));
      

      float dist = distance(uv, vec2(0.5));
      color *= smoothstep(0.8, 0.2, dist);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
);

extend({ GradientMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gradientMaterial: any;
    }
  }
}

function GradientMesh() {
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh position={[0, 0, 0]} scale={[10, 10, 1]}>
      <planeGeometry args={[2, 2]} />

      <gradientMaterial ref={materialRef} />
    </mesh>
  );
}

export function ShaderBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <GradientMesh />
      </Canvas>
    </div>
  );
}
