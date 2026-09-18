"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { STUDIO_PALETTE as P } from "../data/studio-content";
import { useStudioStore } from "../store/studio-store";

const AFTERNOON_SUN = new THREE.Color("#fff2d6");
const GOLDEN_SUN = new THREE.Color("#ffb066");
const AFTERNOON_AMBIENT = new THREE.Color("#fff4e2");
const GOLDEN_AMBIENT = new THREE.Color("#ffd7a1");

const SUN_POS_AFTERNOON = new THREE.Vector3(9, 10, -2);
const SUN_POS_GOLDEN = new THREE.Vector3(11, 4.5, -3.5);

const DAY_BG = new THREE.Color("#f4ddbd");
const NIGHT_BG = new THREE.Color("#141c26");

/** 夜晚必须亮起的室内灯（隐藏光源，本体不可见） */
const NIGHT_LAMPS: {
  pos: [number, number, number];
  color: string;
  intensity: number;
  distance: number;
}[] = [
  // 落地灯（光源放在灯罩中心，向四周柔和散开）
  { pos: [-1.9, 1.42, 1.8], color: "#ffd9a0", intensity: 1.1, distance: 5.4 },
  // 吊灯 1（五层书架前）
  { pos: [-3.4, 2.62, -2.5], color: "#ffcf95", intensity: 1.15, distance: 5.8 },
  // 吊灯 2（狗上方偏左）
  { pos: [3.0, 2.48, 0.7], color: "#ffcf95", intensity: 1.15, distance: 5.8 },
  // 桌面台灯
  { pos: [1.75, 1.12, -3.42], color: "#ffd9a0", intensity: 0.85, distance: 3.4 },
  // 电脑上方的黄铜吊灯
  { pos: [3.1, 2.55, -3.6], color: "#ffd2a0", intensity: 0.95, distance: 3.8 },
];

/**
 * 统一昼夜灯光：
 * - 白天：右上方阳光（带阴影）+ 环境光 + 天窗自然光 + 屏幕光；
 * - 夜晚：阳光 / 环境光大幅降低，室内灯具（落地灯 / 两个吊灯 / 台灯 / 电脑上方灯 / 屏幕）亮起；
 * - 切换用约 1.2s 的平滑过渡，环境光、方向光、灯具强度同步变化。
 */
export default function StudioLighting({
  performance,
}: {
  performance: "high" | "low";
}) {
  const lightProgress = useStudioStore((s) => s.lightProgress);
  const dayNight = useStudioStore((s) => s.dayNight);
  const scene = useThree((s) => s.scene);

  const sunRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const skyRef = useRef<THREE.PointLight>(null);
  const screenRef = useRef<THREE.PointLight>(null);
  const lampRefs = useRef<(THREE.PointLight | null)[]>([]);
  const nightRef = useRef(0);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const p = THREE.MathUtils.clamp(lightProgress, 0, 1);

    // 昼夜平滑过渡（约 1.2s）
    const target = dayNight === "night" ? 1 : 0;
    nightRef.current = THREE.MathUtils.damp(nightRef.current, target, 2.2, delta);
    const n = nightRef.current;

    if (sunRef.current) {
      sunRef.current.color.lerpColors(AFTERNOON_SUN, GOLDEN_SUN, p);
      sunRef.current.position.lerpVectors(SUN_POS_AFTERNOON, SUN_POS_GOLDEN, p);
      // 白天更强（右上方斜射，强化投影），夜晚几乎关闭
      const daySun = THREE.MathUtils.lerp(2.4, 2.9, p);
      sunRef.current.intensity = daySun * (1 - n) + 0.05 * n;
    }
    if (ambientRef.current) {
      ambientRef.current.color.lerpColors(AFTERNOON_AMBIENT, GOLDEN_AMBIENT, p);
      const dayAmb = THREE.MathUtils.lerp(0.7, 0.58, p);
      ambientRef.current.intensity = dayAmb * (1 - n) + 0.13 * n;
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = 0.55 * (1 - n) + 0.08 * n;
    }
    if (skyRef.current) {
      const daySky = THREE.MathUtils.lerp(1.1, 1.5, p) + Math.sin(t * 0.6) * 0.06;
      skyRef.current.intensity = daySky * (1 - n) + 0.12 * n;
    }
    if (screenRef.current) {
      // 屏幕光：白天微弱、夜晚更明显但克制
      screenRef.current.intensity = 0.35 * (1 - n) + 0.55 * n;
    }

    // 夜晚室内灯具：隐藏在灯具内部的点光源
    lampRefs.current.forEach((lamp, i) => {
      if (lamp) lamp.intensity = NIGHT_LAMPS[i].intensity * n;
    });

    // 背景 / 雾随昼夜变暗
    if (scene.background instanceof THREE.Color) {
      scene.background.lerpColors(DAY_BG, NIGHT_BG, n);
    }
    if (scene.fog) {
      scene.fog.color.copy(scene.background as THREE.Color);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} color="#fff4e2" intensity={0.7} />
      <hemisphereLight
        ref={hemiRef}
        color="#fff6e6"
        groundColor={P.woodDark}
        intensity={0.55}
      />

      {/* 金色阳光：从右上方斜射进来（投影方向一致） */}
      <directionalLight
        ref={sunRef}
        position={[9, 10, -2]}
        color="#fff2d6"
        intensity={2.4}
        castShadow={performance === "high"}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0012}
      />

      {/* 天窗洒下来的自然光（非灯具） */}
      <pointLight
        ref={skyRef}
        position={[0, 3.1, -0.5]}
        color="#ffe9c4"
        intensity={1.1}
        distance={16}
        decay={2}
      />

      {/* 显示器屏幕光（非灯具） */}
      <pointLight
        ref={screenRef}
        position={[2.9, 1.5, -3.1]}
        color={P.screen}
        intensity={0.35}
        distance={3.4}
        decay={2}
      />

      {/* 夜晚室内灯具：隐藏点光源，本体不可见，强度由昼夜过渡控制 */}
      {NIGHT_LAMPS.map((lamp, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            lampRefs.current[i] = el;
          }}
          position={lamp.pos}
          color={lamp.color}
          intensity={0}
          distance={lamp.distance}
          decay={2}
        />
      ))}
    </>
  );
}
