"use client";

import AcademicPoster from "../objects/AcademicPoster";
import CameraStation from "../objects/CameraStation";
import CeilingFan from "../objects/CeilingFan";
import DeskStation from "../objects/DeskStation";
import HangingLights from "../objects/HangingLights";
import LeftWall from "../objects/LeftWall";
import LivingZone from "../objects/LivingZone";
import { AbyssinianCat, Corgi } from "../objects/Pets";
import PhotoWall from "../objects/PhotoWall";
import WindowZone from "../objects/WindowZone";

/**
 * PHASE 2.8 空间 zoning：
 *   BACK    — 13 独立相框 + 矮书架 / 工作桌 + 学术海报 / 相机
 *   LEFT    — 五层书架 + 地球仪 + 世界地图 + 标签绳
 *   CENTER  — 圆毯 · 茶几 · 两把椅子 · 落地灯
 *   RIGHT   — 两扇圆拱窗 + 两张窗下沙发 + Monstera
 *   CEILING — 藤编吊灯 · 串灯
 *
 * 已删除：TV、Workbench、Studio 内 Mailbox。
 */
export default function StudioObjects() {
  return (
    <group>
      {/* BACK — 创作 / 展示 / 工作 */}
      <PhotoWall />
      <DeskStation />
      <AcademicPoster />
      <CameraStation />

      {/* LEFT — 书架 / 地图 / 标签绳 */}
      <LeftWall />

      {/* CENTER — 生活区 */}
      <LivingZone />

      {/* 生活化角色：猫蜷缩睡在左侧沙发（客厅左椅）；柯基可点击绕地毯跑一圈。
       * 左侧坐垫顶面（世界 y = 0.545×0.8 − 0.064 = 0.372）；猫腹部底面即其 group 原点，
       * 故 group Y 取 0.372 贴合坐垫。猫整体缩小 30%（scale 0.70）以完整落在
       * 坐垫可用面（扶手间 0.48 宽 × 靠背前 0.395 深）内；rotationY 与沙发一致（≈1.47），
       * 使猫身长轴沿坐垫纵深方向，避免压到两侧扶手；X/Z 居中于坐垫可用区域。 */}
      <AbyssinianCat position={[-0.97, 0.372, 0.97]} rotationY={1.47} scale={0.7} />
      <Corgi position={[3.6, 0, 0.6]} rotationY={-0.1} />

      {/* RIGHT — 窗区 */}
      <WindowZone />

      {/* 吊灯 / 串灯 */}
      <HangingLights />

      {/* 屋顶横梁上的复古木质吊扇（持续缓慢旋转） */}
      <CeilingFan />
    </group>
  );
}
