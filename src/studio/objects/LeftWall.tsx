"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import InteractiveObject from "./InteractiveObject";
import WallMural from "./WallMural";
import { Box, Cyl, Sphere } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";
import {
  FOCUS_TAGS,
  SKILL_STRING,
  SKILL_TAGS,
  stringPoint,
  tagDrop,
  tagRotation,
  type FocusTagDef,
  type SkillTagDef,
} from "../data/skills";

/**
 * LEFT WALL — 五层落地书架 + 地球仪 + 世界地图 + 标签绳（技能）
 * 书架靠里贴墙（1.5 × 3.0）；地图在书架前方、明显放大；标签绳在上方，带自然下垂。 */
const WALL_X = -5;

export default function LeftWall() {
  return (
    <group>
      <Bookcase />
      <WallMural />
      <LabelString />
      <Blackboard />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 左墙绿色小黑板：标签绳下方、树绘左方的空白区域。
 * 上方正中一颗钉子，两条绳分别连到黑板左右上角（倒 V 悬挂）；无交互。
 */
function Blackboard() {
  const texture = useMemo(() => makeBlackboardTexture(), []);
  const helloTexture = useMemo(() => makeHelloTexture(), []);
  const helloMat = useRef<THREE.MeshBasicMaterial>(null);
  /** -1 = idle；>= 0 = 已播放时间（秒） */
  const animRef = useRef(-1);
  const x = -4.96;
  // 标签绳下方、树绘叶簇（该处叶簇下沿约 y2.11）之下、底部草花之上的空白墙面。
  // z 取 1.4：位于树干朝前的“左方”，且处于 U 型浏览右端可见范围内。
  const z = 1.4;
  const y = 1.6;
  const w = 0.72;
  const h = 0.5;
  const frame = 0.035;
  const nailY = y + h / 2 + 0.22;

  // Hello 时间线：淡入 1.0s → 停留 0.6s → 淡出 1.5s
  const FADE_IN = 1.0;
  const HOLD = 0.6;
  const FADE_OUT = 1.5;
  const TOTAL = FADE_IN + HOLD + FADE_OUT;

  useFrame((_, delta) => {
    if (!helloMat.current || animRef.current < 0) return;
    animRef.current += delta;
    const t = animRef.current;
    let o: number;
    if (t < FADE_IN) o = t / FADE_IN;
    else if (t < FADE_IN + HOLD) o = 1;
    else if (t < TOTAL) o = 1 - (t - FADE_IN - HOLD) / FADE_OUT;
    else {
      o = 0;
      animRef.current = -1;
    }
    helloMat.current.opacity = Math.max(0, Math.min(1, o));
  });

  // 连续点击：只重置当前动画，不叠加
  const trigger = () => {
    animRef.current = 0;
    if (helloMat.current) helloMat.current.opacity = 0;
  };

  const ropes = [-1, 1].map((s) => {
    const topZ = z + s * (w / 2 - 0.05);
    const dy = nailY - (y + h / 2); // > 0（钉子高于板顶）
    const dz = topZ - z;
    const len = Math.hypot(dy, dz);
    return {
      len,
      // 绳子方向为「钉子 → 上角」：竖直分量朝下（-dy），故取 -dy。
      // 之前误用 atan2(dz, dy) 导致绳子镜像、看起来上下颠倒。
      angle: Math.atan2(dz, -dy),
      midY: (nailY + (y + h / 2)) / 2,
      midZ: (z + topZ) / 2,
    };
  });

  return (
    <group>
      {/* 钉子 */}
      <mesh position={[x, nailY, z]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.017, 0.017, 0.03, 12]} />
        <meshStandardMaterial color="#8f8f8f" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* 两条吊绳（倒 V） */}
      {ropes.map((r, i) => (
        <mesh key={i} position={[x, r.midY, r.midZ]} rotation={[r.angle, 0, 0]}>
          <cylinderGeometry args={[0.008, 0.008, r.len, 6]} />
          <meshStandardMaterial color="#A9845A" roughness={0.95} />
        </mesh>
      ))}
      {/* 木框 + 黑板面（独立 InteractiveObject：只覆盖黑板，不覆盖旁边墙绘） */}
      <group position={[x, y, z]} rotation={[0, Math.PI / 2, 0]}>
        <InteractiveObject id="blackboard" mode="action" onActivate={trigger}>
          <mesh position={[0, 0, 0.014]}>
            <planeGeometry args={[w, h]} />
            <meshStandardMaterial
              map={texture ?? undefined}
              color={texture ? "#ffffff" : "#2C4A3A"}
              roughness={0.9}
            />
          </mesh>
          {(
            [
              { p: [0, h / 2 + frame / 2, 0.012], s: [w + frame * 2, frame, 0.03] },
              { p: [0, -h / 2 - frame / 2, 0.012], s: [w + frame * 2, frame, 0.03] },
              { p: [-w / 2 - frame / 2, 0, 0.012], s: [frame, h, 0.03] },
              { p: [w / 2 + frame / 2, 0, 0.012], s: [frame, h, 0.03] },
            ] as { p: [number, number, number]; s: [number, number, number] }[]
          ).map((b, i) => (
            <mesh key={i} position={b.p} castShadow>
              <boxGeometry args={b.s} />
              <meshStandardMaterial color="#6B4A33" roughness={0.7} />
            </mesh>
          ))}
          {/* 点击后中央缓慢浮现的粉笔字 Hello（约黑板宽度 55%） */}
          <mesh position={[0, 0.01, 0.02]}>
            <planeGeometry args={[0.4, 0.22]} />
            <meshBasicMaterial
              ref={helloMat}
              map={helloTexture ?? undefined}
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </InteractiveObject>
      </group>
    </group>
  );
}

/** 黑板粉笔字「Hello」贴图（透明底，白色粉笔感，手写体） */
function makeHelloTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 256;
  const H = 140;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#F4F1E8";
  ctx.font = 'italic 82px "Segoe Script", "Bradley Hand", "Comic Sans MS", cursive';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = "rgba(255,255,255,0.4)";
  ctx.shadowBlur = 6;
  ctx.fillText("Hello", W / 2, H / 2 + 4);
  ctx.shadowBlur = 0;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** 绿色小黑板贴图：墨绿底 + 轻微粉笔材质（无文字，保持空白） */
function makeBlackboardTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 512;
  const H = 356;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#2C4A3A";
  ctx.fillRect(0, 0, W, H);
  // 粉笔灰 / 擦拭痕迹，增加真实材质感（不含任何文字）
  for (let i = 0; i < 2400; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, W - 10, H - 10);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ------------------------------------------------------------------ */
/** 五层落地书架：1.5 宽 × 3.0 高 × 0.4 深，约 60% 填书 */
function Bookcase() {
  const books = useMemo(() => {
    const colors = [
      P.woodDark, P.green, "#F2EDE4", P.brick, "#B8892F", "#6B7A8F",
      "#4c7148", P.deepBrown, "#8E6A45", "#A85D43", "#7A3B52", "#5F7A8A",
    ];
    return [0, 1, 2, 3, 4].flatMap((tier) => {
      const y = 0.07 + tier * 0.58;
      const list: { z: number; h: number; t: number; depth: number; lean: number; color: string }[] = [];
      let cursor = -0.6;
      const seed = tier * 7;
      while (cursor < 0.54) {
        const r = (seed + Math.round(cursor * 100)) % 10;
        if (r < 2) {
          cursor += 0.09; // 少量空位，避免像样板
          continue;
        }
        const h = 0.28 + (r % 5) * 0.03; // 0.28-0.40 不同高度
        const t = 0.045 + (r % 3) * 0.018; // 0.045-0.081 不同厚度
        const depth = 0.18 + (r % 3) * 0.02; // 书宽（进深）
        const lean = r === 5 ? 0.18 : r === 8 ? -0.14 : 0;
        list.push({
          z: cursor,
          h,
          t,
          depth,
          lean,
          color: colors[(tier * 3 + Math.round(cursor * 20)) % colors.length],
        });
        cursor += t + 0.014 + (lean ? 0.02 : 0);
      }
      return list.map((b) => ({ ...b, y, tier }));
    });
  }, []);

  // 装饰位（花朵 / 绿植）：为它们腾出空间，避免与书穿模
  const staticBooks = books.filter((b) => {
    if ((b.tier === 0 || b.tier === 2) && Math.abs(b.z) < 0.06) return false; // 蓝色书
    return !SHELF_DECOR.some((d) => d.tier === b.tier && Math.abs(d.z - b.z) < 0.15);
  });

  return (
    // 向技能绳方向（+z）移动，与照片墙下书架拉开间隔（room §8 / wall §38-39）
    // 拦截点击：书架挡在树绘前方，点击书架不应触发后面的树木交互
    <group
      position={[-4.75, 0, -2.6]}
      onClick={(e) => e.stopPropagation()}
      onPointerOver={(e) => e.stopPropagation()}
    >
      <Box args={[0.4, 3.0, 0.05]} position={[0, 1.5, -0.725]} color={P.deepBrown} roughness={0.72} />
      <Box args={[0.4, 3.0, 0.05]} position={[0, 1.5, 0.725]} color={P.deepBrown} roughness={0.72} />
      {[0.05, 0.63, 1.21, 1.79, 2.37, 2.95].map((y, i) => (
        <Box key={i} args={[0.4, 0.05, 1.5]} position={[0, y, 0]} color={P.deepBrown} roughness={0.72} />
      ))}
      {/* 开放式书架：无背板，直接看到墙面（room §25） */}

      {staticBooks.map((b, i) => (
        <Box
          key={i}
          args={[b.depth, b.h, b.t]}
          position={[0.03, b.y + b.h / 2, b.z]}
          rotation={[b.lean, 0, 0]}
          color={b.color}
          roughness={0.86}
        />
      ))}

      {/* 花朵 / 绿植：分散在不同层，增加生活感 */}
      {SHELF_DECOR.map((d, i) =>
        d.kind === "plant" ? (
          <ShelfPlant key={i} y={0.07 + d.tier * 0.58} z={d.z} pot={d.pot} />
        ) : (
          <ShelfFlower key={i} y={0.07 + d.tier * 0.58} z={d.z} pot={d.pot} />
        ),
      )}

      {/* 两本蓝色书：各自独立 InteractiveObject（第一次聚焦，第二次打开 Overlay） */}
      <BlueBook id="book-blue-01" shelfY={0.07} />
      <BlueBook id="book-blue-02" shelfY={1.23} />

      <Globe />
    </group>
  );
}

/** 书架花朵 / 绿植的位置（避开蓝色书与顶端地球仪） */
const SHELF_DECOR: { tier: number; z: number; kind: "plant" | "flower"; pot: string }[] = [
  { tier: 0, z: -0.55, kind: "flower", pot: P.pot },
  { tier: 1, z: -0.52, kind: "plant", pot: "#F2EDE4" },
  { tier: 2, z: 0.5, kind: "plant", pot: P.green },
  { tier: 3, z: 0.54, kind: "flower", pot: P.pot },
  { tier: 4, z: -0.55, kind: "plant", pot: "#c07a4a" },
  { tier: 4, z: 0.14, kind: "flower", pot: "#F2EDE4" },
];

/* ------------------------------------------------------------------ */
/** 书架小绿植 */
function ShelfPlant({ y, z, pot }: { y: number; z: number; pot: string }) {
  return (
    <group position={[0.03, y, z]}>
      <Cyl args={[0.055, 0.045, 0.1, 12]} position={[0, 0.05, 0]} color={pot} roughness={0.85} />
      <Sphere radius={0.07} position={[0, 0.13, 0]} color={P.plant} roughness={0.9} />
      <Sphere radius={0.045} position={[0.03, 0.17, 0.012]} color={P.plantDark} roughness={0.9} />
      <Sphere radius={0.035} position={[-0.03, 0.16, -0.02]} color="#6b9a63" roughness={0.9} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 书架小花 */
function ShelfFlower({ y, z, pot }: { y: number; z: number; pot: string }) {
  return (
    <group position={[0.03, y, z]}>
      <Cyl args={[0.04, 0.034, 0.08, 12]} position={[0, 0.04, 0]} color={pot} roughness={0.85} />
      <Cyl args={[0.006, 0.006, 0.15, 6]} position={[0, 0.15, 0]} color="#5f8a52" roughness={0.9} />
      <Sphere radius={0.034} position={[0, 0.235, 0]} color="#E7BFC6" roughness={0.9} />
      <Sphere radius={0.02} position={[0.026, 0.205, 0.018]} color="#E7BFC6" roughness={0.9} />
      <Sphere radius={0.018} position={[-0.02, 0.215, -0.014]} color="#E9C15A" roughness={0.9} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 蓝色书（与书架同一位置体系）。
 * 按需求：点击只做 Camera Director 聚焦，不弹任何 Info Overlay（focus-only）。
 */
function BlueBook({ id, shelfY }: { id: "book-blue-01" | "book-blue-02"; shelfY: number }) {
  const h = 0.34;
  return (
    <group position={[0.03, shelfY + h / 2, 0]}>
      <InteractiveObject id={id} mode="focus">
        <Box args={[0.22, h, 0.06]} color="#3F6FA8" roughness={0.82} />
      </InteractiveObject>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 地球仪：纯装饰，无交互（点击不发生任何动作） */
function Globe() {
  return (
    <group position={[0, 3.02, 0.5]}>
      <Cyl args={[0.05, 0.06, 0.02, 16]} position={[0, 0.01, 0]} color="#3a2f27" roughness={0.6} />
      {/* 黄铜支架 */}
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.13, 0.008, 8, 24, Math.PI * 1.4]} />
        <meshStandardMaterial color={P.brass} roughness={0.4} metalness={0.7} />
      </mesh>
      <Sphere radius={0.115} position={[0, 0.14, 0]} color={P.plant} roughness={0.75} />
      <Sphere radius={0.05} position={[0.03, 0.18, 0.04]} color="#6f8fa8" roughness={0.7} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 技能绳：自然下垂的绳子（纯装饰）+ 标签。
 * · 靠五层书架一侧的 4 个标签 = 信息技能标签（聚焦 + Skill Overlay）
 * · 其余 6 个标签 = 可点击聚焦，但不显示文字、不打开 Overlay
 * 绳子本身没有交互。 */
function LabelString() {
  const ropeCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        Array.from({ length: SKILL_STRING.segs + 1 }, (_, i) =>
          new THREE.Vector3(...stringPoint(i / SKILL_STRING.segs)),
        ),
      ),
    [],
  );
  const ropeGeometry = useMemo(
    () => new THREE.TubeGeometry(ropeCurve, 160, 0.014, 8, false),
    [ropeCurve],
  );
  const ropeMaterial = useMemo(() => {
    const map = makeRopeTexture();
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: map ?? undefined,
      roughness: 0.95,
      metalness: 0,
    });
  }, []);

  return (
    // 拦截点击：标签绳位于树绘前方，点击绳子不应触发后面的树木交互
    <group
      onClick={(e) => e.stopPropagation()}
      onPointerOver={(e) => e.stopPropagation()}
    >
      {/* 真实麻绳质感（TubeGeometry + 程序化麻绳贴图，无交互） */}
      <mesh geometry={ropeGeometry} material={ropeMaterial} castShadow={false} />

      {/* 靠近五层书架一侧的 4 个信息技能标签：各自独立 InteractiveObject */}
      {SKILL_TAGS.map((tag) => (
        <SkillTag key={tag.id} tag={tag} />
      ))}

      {/* 其余 6 个标签：可点击聚焦，但不显示文字、不打开 Overlay */}
      {FOCUS_TAGS.map((tag) => (
        <FocusTag key={tag.id} tag={tag} />
      ))}
    </group>
  );
}

/** 程序化麻绳贴图（斜向纤维 + 高重复 -> 拧绳质感） */
function makeRopeTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 64;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#A9845A";
  ctx.fillRect(0, 0, S, S);
  for (let i = -S; i < S * 2; i += 4) {
    ctx.strokeStyle = i % 8 === 0 ? "rgba(90,60,35,0.5)" : "rgba(214,186,146,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + S * 0.5, S);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(120, 1);
  return tex;
}

function FocusTag({ tag }: { tag: FocusTagDef }) {
  const [x, y, z] = stringPoint(tag.t);
  const drop = tagDrop(tag.t);
  return (
    <group position={[x, y - 0.02 - drop, z]} rotation={[tagRotation(tag.t), 0, 0]}>
      <InteractiveObject id={tag.id} mode="focus">
        <TagContent label="" bg={tag.bg} drop={drop} showText={false} />
      </InteractiveObject>
    </group>
  );
}

function SkillTag({ tag }: { tag: SkillTagDef }) {
  const [x, y, z] = stringPoint(tag.t);
  const drop = tagDrop(tag.t);
  return (
    <group position={[x, y - 0.02 - drop, z]} rotation={[tagRotation(tag.t), 0, 0]}>
      <InteractiveObject id={tag.id}>
        <TagContent label={tag.label} bg={tag.bg} drop={drop} />
      </InteractiveObject>
    </group>
  );
}

/** 较大的山形夹轮廓（所有标签统一使用） */
const MOUNTAIN_CLIP = (() => {
  const s = new THREE.Shape();
  s.moveTo(-0.08, 0);
  s.lineTo(0, 0.12);
  s.lineTo(0.08, 0);
  s.closePath();
  return s;
})();

/** 标签内容：挂绳 + 较大的山形夹 + 放大的标签纸（相对挂点定位） */
function TagContent({
  label,
  bg,
  drop,
  showText = true,
}: {
  label: string;
  bg: string;
  drop: number;
  showText?: boolean;
}) {
  const texture = useMemo(
    () => makeTagTexture(showText ? label : "", bg),
    [showText, label, bg],
  );
  return (
    <>
      {/* 挂绳（绳子 → 夹子） */}
      <Box args={[0.012, drop, 0.012]} position={[0, drop / 2 + 0.01, 0]} color="#8a6a4a" roughness={0.9} castShadow={false} />
      {/* 较大的山形夹（朝向不变） */}
      <mesh position={[0, -0.02, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <extrudeGeometry args={[MOUNTAIN_CLIP, { depth: 0.035, bevelEnabled: false }]} />
        <meshStandardMaterial color={P.woodDark} roughness={0.5} metalness={0.15} />
      </mesh>
      {/* 放大的标签纸：朝向房间（+x），文字不再镜像 */}
      <mesh position={[0, -0.14, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.46, 0.26]} />
        <meshStandardMaterial map={texture ?? undefined} color={texture ? "#ffffff" : bg} roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function makeTagTexture(label: string, bg: string): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 300;
  const H = 168;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(120,110,95,0.35)";
  ctx.lineWidth = 5;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  ctx.fillStyle = "#3a2f27";
  ctx.font = "bold 42px Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, W / 2, H / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
