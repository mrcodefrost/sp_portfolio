"use client";

import { useId } from "react";
import { Box, Filters, frame, P, pts, ring, type V3 } from "./IsoControls";

// Uplink hive tower drawn as an isometric figure (ISO-GLOW vocabulary: hairlines, one accent on whatever is live).
// Four tapering tiers, one per form field: each tier's window banks and rim light as its field validates.
// When all four are lit the pods, bridge arms, floor ring and crown core come alive; while a message is going
// out light climbs the corner ribs and runs down the arms, and a beam fires from the crown.
// Paint order is the only depth sort: back to front (smaller x + y first, lower z first).
// Styles come from <IsoStyle /> in IsoControls.

const PLATE_W = 150;
const PLATE_D = 100;
const CX = 75;
const CY = 50;
const PLATE_H = 8;

// tiers bottom to top: [size, z0, z1]; each sits on a slightly wider collar
const TIERS: [number, number, number][] = [
  [56, 8, 38],
  [44, 38, 66],
  [34, 66, 90],
  [24, 90, 110],
];
const COLLAR_H = 3;
const CROWN_Z = 110;
const CORE_Z = 126;
const BEAM_TOP = 156;
const ARM_Z = 14;

const FRAME = frame(
  [[0, 0, 0], [PLATE_W, 0, 0], [0, PLATE_D, 0], [PLATE_W, PLATE_D, 0], [CX, CY, BEAM_TOP]],
  8
);

const path = (list: V3[]) =>
  "M" + list.map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(2)).join(",")).join(" L");

type Wins = { lit: boolean; uid: string };

// window banks on the two visible faces of a tier (front: y = y1, side: x = x1)
function Windows({ s, z0, z1, lit, uid }: { s: number } & { z0: number; z1: number } & Wins) {
  const x0 = CX - s / 2;
  const x1 = CX + s / 2;
  const y0 = CY - s / 2;
  const y1 = CY + s / 2;
  const k = s >= 40 ? 3 : 2;
  const wz0 = z0 + COLLAR_H + 5;
  const wz1 = z1 - 6;
  const cls = `glass ${lit ? "hot" : ""}`;
  const filter = lit ? `url(#${uid}-soft)` : undefined;
  return (
    <>
      {Array.from({ length: k }, (_, j) => {
        const a = x0 + ((j + 1) * s) / (k + 1);
        const b = y0 + ((j + 1) * s) / (k + 1);
        return (
          <g key={j}>
            <polygon className={cls} filter={filter} points={pts([[a - 3, y1, wz0], [a + 3, y1, wz0], [a + 3, y1, wz1], [a - 3, y1, wz1]])} />
            <polygon className={cls} filter={filter} points={pts([[x1, b - 3, wz0], [x1, b + 3, wz0], [x1, b + 3, wz1], [x1, b - 3, wz1]])} />
          </g>
        );
      })}
    </>
  );
}

// a pod at the end of a bridge arm, with a lit port on each visible face
function Pod({ x, y, armed, uid }: { x: number; y: number; armed: boolean; uid: string }) {
  const w = 14;
  const h = 16;
  const cls = `glass ${armed ? "hot" : ""}`;
  const filter = armed ? `url(#${uid}-soft)` : undefined;
  return (
    <g>
      <Box x={x} y={y} z={PLATE_H} w={w} d={w} h={h} />
      <polygon className={cls} filter={filter} points={pts([[x + w, y + 4, PLATE_H + 5], [x + w, y + w - 4, PLATE_H + 5], [x + w, y + w - 4, PLATE_H + h - 4], [x + w, y + 4, PLATE_H + h - 4]])} />
      <polygon className={cls} filter={filter} points={pts([[x + 4, y + w, PLATE_H + 5], [x + w - 4, y + w, PLATE_H + 5], [x + w - 4, y + w, PLATE_H + h - 4], [x + 4, y + w, PLATE_H + h - 4]])} />
    </g>
  );
}

// bridge arm: a low bar from the tower to a pod, with a light strip along its top
function Arm({ x, y, w, d, armed }: { x: number; y: number; w: number; d: number; armed: boolean }) {
  const long = w > d;
  const strip: V3[] = long
    ? [[x + 1, y + d / 2 - 0.8, ARM_Z + 6], [x + w - 1, y + d / 2 - 0.8, ARM_Z + 6], [x + w - 1, y + d / 2 + 0.8, ARM_Z + 6], [x + 1, y + d / 2 + 0.8, ARM_Z + 6]]
    : [[x + w / 2 - 0.8, y + 1, ARM_Z + 6], [x + w / 2 + 0.8, y + 1, ARM_Z + 6], [x + w / 2 + 0.8, y + d - 1, ARM_Z + 6], [x + w / 2 - 0.8, y + d - 1, ARM_Z + 6]];
  return (
    <g>
      <Box x={x} y={y} z={PLATE_H} w={w} d={d} h={ARM_Z + 6 - PLATE_H} />
      <polygon className={`led ${armed ? "hot" : ""}`} points={pts(strip)} />
    </g>
  );
}

export default function CommsBeacon({ filled, sending }: { filled: boolean[]; sending: boolean }) {
  const uid = `isoc-b${useId().replace(/:/g, "")}`;
  const armed = filled.every(Boolean);
  const hot = armed ? "hot" : "";
  const glow = (on: boolean) => (on ? `url(#${uid}-glow)` : undefined);
  const soft = (on: boolean) => (on ? `url(#${uid}-soft)` : undefined);

  const t0 = TIERS[0][0] / 2;
  const [cox, coy] = P(CX, CY, CORE_Z);
  const [bx, by] = P(CX, CY, BEAM_TOP);
  const beam = `${cox.toFixed(2)},${coy.toFixed(2)} ${bx.toFixed(2)},${by.toFixed(2)}`;

  // front corner of the tower, tier by tier, for the climbing pulse
  const climb: V3[] = TIERS.flatMap(([s, z0, z1]) => [[CX + s / 2, CY + s / 2, z0] as V3, [CX + s / 2, CY + s / 2, z1] as V3]);

  // arms and pods: [armX, armY, armW, armD, podX, podY]
  const armsBack: [number, number, number, number, number, number][] = [
    [CX - t0 - 22, CY - 3, 22, 6, CX - t0 - 36, CY - 7], // -x
    [CX - 3, CY - t0 - 8, 6, 8, CX - 7, CY - t0 - 22], // -y
  ];
  const armsFront: [number, number, number, number, number, number][] = [
    [CX + t0, CY - 3, 22, 6, CX + t0 + 22, CY - 7], // +x
    [CX - 3, CY + t0, 6, 8, CX - 7, CY + t0 + 8], // +y
  ];

  return (
    <svg
      viewBox={FRAME.viewBox}
      className="isoc h-auto w-full max-w-76"
      role="img"
      aria-label={`Uplink hive tower. ${filled.filter(Boolean).length} of ${filled.length} fields ready.`}
    >
      <Filters id={uid} />
      <ellipse className={`halo ${hot}`} cx={P(CX, CY, 0)[0]} cy={P(CX, CY, 0)[1] + 2} rx={84} ry={40} filter={`url(#${uid}-bloom)`} />
      <Box x={0} y={0} z={0} w={PLATE_W} d={PLATE_D} h={PLATE_H} />

      {/* floor ring and deck hairlines */}
      <path className={`wire ${hot}`} d={path(ring(CX, CY, PLATE_H, 66, 0, 360, 90)) + " Z"} filter={soft(armed)} />
      <polyline className="detail" points={pts([[8, 8, PLATE_H], [PLATE_W - 8, 8, PLATE_H], [PLATE_W - 8, PLATE_D - 8, PLATE_H]])} />

      {/* back arms and pods */}
      {armsBack.map(([ax, ay, aw, ad, px, py]) => (
        <g key={`b${ax}`}>
          <Arm x={ax} y={ay} w={aw} d={ad} armed={armed} />
          <Pod x={px} y={py} armed={armed} uid={uid} />
        </g>
      ))}

      {/* tiers, bottom to top */}
      {TIERS.map(([s, z0, z1], i) => {
        const lit = filled[i];
        const x1 = CX + s / 2;
        const y1 = CY + s / 2;
        const x0 = CX - s / 2;
        const y0 = CY - s / 2;
        const top = z1;
        return (
          <g key={s}>
            <Box x={CX - s / 2 - 3} y={CY - s / 2 - 3} z={z0} w={s + 6} d={s + 6} h={COLLAR_H} />
            <Box x={x0} y={y0} z={z0 + COLLAR_H} w={s} d={s} h={z1 - z0 - COLLAR_H} />
            {/* horizontal ribs */}
            {[0.38, 0.7].map((f) => {
              const z = z0 + COLLAR_H + (z1 - z0 - COLLAR_H) * f;
              return <polyline key={f} className="detail" points={pts([[x0, y1, z], [x1, y1, z], [x1, y0, z]])} />;
            })}
            <Windows s={s} z0={z0} z1={z1} lit={lit} uid={uid} />
            {/* corner buttress */}
            <Box x={x1 - 3} y={y1 - 3} z={z0 + COLLAR_H} w={6} d={6} h={z1 - z0 - COLLAR_H} />
            {/* lit rim */}
            <polyline className={`wire ${lit ? "hot" : ""}`} points={pts([[x0, y1, top], [x1, y1, top], [x1, y0, top]])} filter={soft(lit)} />
          </g>
        );
      })}

      {/* crown: base, four prongs around the core */}
      <Box x={CX - 7} y={CY - 7} z={CROWN_Z} w={14} d={14} h={5} />
      <Box x={CX - 9} y={CY - 9} z={CROWN_Z + 5} w={3.5} d={3.5} h={18} />
      <Box x={CX + 5.5} y={CY - 9} z={CROWN_Z + 5} w={3.5} d={3.5} h={18} />
      <Box x={CX - 9} y={CY + 5.5} z={CROWN_Z + 5} w={3.5} d={3.5} h={18} />
      <g filter={glow(armed)}>
        <polygon
          className={`knob ${hot}`}
          points={`${cox},${coy - 6} ${cox + 5},${coy} ${cox},${coy + 6} ${cox - 5},${coy}`}
        />
      </g>
      <Box x={CX + 5.5} y={CY + 5.5} z={CROWN_Z + 5} w={3.5} d={3.5} h={18} />

      {/* front arms and pods */}
      {armsFront.map(([ax, ay, aw, ad, px, py]) => (
        <g key={`f${ax}`}>
          <Arm x={ax} y={ay} w={aw} d={ad} armed={armed} />
          <Pod x={px} y={py} armed={armed} uid={uid} />
        </g>
      ))}

      {/* beam out of the crown, and light climbing the tower while transmitting */}
      <polyline className={`wire ${sending ? "hot" : ""}`} points={beam} strokeDasharray="2 3" />
      {sending && (
        <>
          <polyline className="pulse loop" points={beam} pathLength={100} filter={glow(true)} />
          <path className="pulse loop" d={path(climb)} pathLength={100} filter={glow(true)} />
          <path className="pulse loop" d={path([[CX + t0, CY, ARM_Z + 6], [CX + t0 + 28, CY, ARM_Z + 6]])} pathLength={100} style={{ animationDelay: "0.3s" }} filter={glow(true)} />
          <path className="pulse loop" d={path([[CX, CY + t0, ARM_Z + 6], [CX, CY + t0 + 14, ARM_Z + 6]])} pathLength={100} style={{ animationDelay: "0.6s" }} filter={glow(true)} />
        </>
      )}
    </svg>
  );
}
