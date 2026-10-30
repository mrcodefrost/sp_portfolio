"use client";

import { useEffect, useId, useRef, useState } from "react";

// Reactor and lance controls drawn as small interactive isometric figures (hairline style, one accent colour
// on whatever is live, pressable parts that sink), following the ISO-GLOW figure vocabulary.

const C = Math.cos(Math.PI / 6);
const S = 0.5;
export type V3 = [number, number, number];

export const P = (x: number, y: number, z: number): [number, number] => [(x - y) * C, (x + y) * S - z];
export const f = (n: number) => n.toFixed(2);
export const pts = (list: V3[]) => list.map(([x, y, z]) => P(x, y, z).map(f).join(",")).join(" ");
const plane = (o: V3, u: V3, v: V3) => {
  const a = P(...o);
  const uu = P(...u);
  const vv = P(...v);
  return `matrix(${f(uu[0])} ${f(uu[1])} ${f(vv[0])} ${f(vv[1])} ${f(a[0])} ${f(a[1])})`;
};
const TOP = (x: number, y: number, z: number) => plane([x, y, z], [1, 0, 0], [0, 1, 0]);
export const rad = (deg: number) => (deg * Math.PI) / 180;
export const ring = (cx: number, cy: number, z: number, r: number, a0: number, a1: number, n: number): V3[] =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z];
  });

// viewBox that frames the extreme corners of a figure, as the ISO-GLOW kernel does
export function frame(points: V3[], pad = 10) {
  const xs = points.map((p) => P(...p)[0]);
  const ys = points.map((p) => P(...p)[1]);
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  return { viewBox: `${f(x0)} ${f(y0)} ${f(Math.max(...xs) + pad - x0)} ${f(Math.max(...ys) + pad - y0)}`, w: Math.max(...xs) + pad - x0, h: Math.max(...ys) + pad - y0 };
}

export function Box({ x, y, z, w, d, h, cls }: { x: number; y: number; z: number; w: number; d: number; h: number; cls?: string }) {
  return (
    <g className={cls}>
      <polygon className="face" points={pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} />
      <polygon className="face" points={pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} />
      <polygon className="face top" points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} />
    </g>
  );
}

const CSS = `
.isoc{--body:#150f3f;--deck:#251b7a;--recess:#0a0620;--line:#8b6cff;--detail:#4b3a9a;--glass:#0e0a2a;--glass-on:#0f4a5e;--accent:#22d3ee;--accent-hi:#a5f3fc;--ink:#cbd5e1;overflow:visible}
.isoc .face{fill:var(--body);stroke:var(--line);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;transition:fill .4s,stroke .4s}
.isoc .face.top{fill:var(--deck)}
.isoc .face.recess{fill:var(--recess)}
.isoc .detail{fill:none;stroke:var(--detail);stroke-width:1;vector-effect:non-scaling-stroke}
.isoc .glass{fill:var(--glass);stroke:var(--detail);stroke-width:1;vector-effect:non-scaling-stroke;transition:fill .3s,stroke .3s}
.isoc .glass.hot{fill:var(--glass-on);stroke:var(--accent)}
.isoc .halo{fill:var(--accent);opacity:0;transition:opacity .4s}
.isoc .halo.hot{opacity:.22}
.isoc .led{fill:var(--detail);transition:fill .2s}
.isoc .led.hot{fill:var(--accent)}
.isoc .wire{fill:none;stroke:var(--detail);stroke-width:1.2;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round;transition:stroke .4s}
.isoc .wire.hot{stroke:var(--accent)}
.isoc .lever{fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round;vector-effect:non-scaling-stroke;transition:stroke .3s}
.isoc .lever.hot{stroke:var(--accent-hi)}
.isoc .knob{fill:var(--body);stroke:var(--line);stroke-width:1;vector-effect:non-scaling-stroke;transition:fill .3s,stroke .3s}
.isoc .knob.hot{fill:var(--accent);stroke:var(--accent-hi)}
.isoc .cap-top.hot{fill:var(--accent-hi);stroke:var(--accent)}
.isoc .cap-wall.hot{fill:var(--accent);stroke:var(--accent-hi)}
.isoc .pulse{fill:none;stroke:var(--accent-hi);stroke-width:2.4;stroke-linecap:round;vector-effect:non-scaling-stroke;stroke-dasharray:14 86;stroke-dashoffset:14;opacity:0}
.isoc .pulse.go{animation:isoc-flow .7s linear}
.isoc .pulse.loop{animation:isoc-flow 1.1s linear infinite}
@keyframes isoc-flow{0%{stroke-dashoffset:14;opacity:1}90%{opacity:1}100%{stroke-dashoffset:-86;opacity:0}}
.isoc-btn{cursor:pointer}
.isoc-btn:disabled{cursor:not-allowed}
.isoc-btn:hover:not(:disabled) .face.top{stroke:var(--ink)}
@media (prefers-reduced-motion:reduce){.isoc .face,.isoc .glass,.isoc .halo,.isoc .wire,.isoc .lever,.isoc .knob{transition:none}.isoc .pulse.go,.isoc .pulse.loop{animation:none}}
`;

export function Filters({ id }: { id: string }) {
  return (
    <defs>
      <filter id={`${id}-glow`} filterUnits="userSpaceOnUse" x="-400" y="-400" width="900" height="900">
        <feGaussianBlur stdDeviation="3.2" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${id}-soft`} filterUnits="userSpaceOnUse" x="-400" y="-400" width="900" height="900">
        <feGaussianBlur stdDeviation="1.8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id={`${id}-bloom`} filterUnits="userSpaceOnUse" x="-400" y="-400" width="900" height="900">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
  );
}

export function Caption({ title }: { title: string }) {
  return (
    <span className="mt-1.5 block text-center font-mono text-[10px] font-semibold uppercase tracking-widest text-gray-300">{title}</span>
  );
}

// ---------- reactor: a lever switch on a base plate. Lever up-right is on, down-left is off ----------

const LEVER_LEN = 24;
const LEVER_ANGLE = 34;
const PIVOT: V3 = [35, 24, 7];
const REACTOR_FRAME = frame([[0, 0, 0], [70, 0, 0], [0, 48, 0], [70, 48, 0], [35, 24, 38]]);

export function ReactorSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const uid = `isoc-r${useId().replace(/:/g, "")}`;
  const [angle, setAngle] = useState(on ? LEVER_ANGLE : -LEVER_ANGLE);
  const angleRef = useRef(angle);

  // swing the lever to its new position over a fixed time, so it finishes at any frame rate
  useEffect(() => {
    const target = on ? LEVER_ANGLE : -LEVER_ANGLE;
    const from = angleRef.current;
    const t0 = performance.now();
    let raf = 0;
    const step = () => {
      const u = Math.min(1, (performance.now() - t0) / 380);
      const cur = from + (target - from) * (1 - Math.pow(1 - u, 3));
      angleRef.current = cur;
      setAngle(cur);
      if (u < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  const a = rad(angle);
  const tip: V3 = [PIVOT[0] + Math.sin(a) * LEVER_LEN, PIVOT[1], PIVOT[2] + Math.cos(a) * LEVER_LEN];
  const [kx, ky] = P(...tip);
  const hot = on ? "hot" : "";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={on ? "Shut down the reactor" : "Start the reactor"}
      onClick={onToggle}
      className="isoc-btn flex flex-col items-center rounded-md focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-300/60"
    >
      <svg viewBox={REACTOR_FRAME.viewBox} className="isoc h-[3.325rem] w-auto" aria-hidden="true">
        <Filters id={uid} />
        <ellipse className={`halo ${hot}`} cx={P(35, 24, 0)[0]} cy={P(35, 24, 0)[1] + 2} rx={44} ry={22} filter={`url(#${uid}-bloom)`} />
        <Box x={0} y={0} z={0} w={70} d={48} h={7} />
        {/* slot the lever travels in */}
        <polygon className={`glass ${hot}`} points={pts([[12, 20, 7], [58, 20, 7], [58, 28, 7], [12, 28, 7]])} filter={on ? `url(#${uid}-soft)` : undefined} />
        <polyline className="detail" points={pts([[12, 30, 7], [12, 34, 7]])} />
        <polyline className="detail" points={pts([[58, 30, 7], [58, 34, 7]])} />
        {/* status led */}
        <polygon className={`led ${hot}`} points={pts([[8, 38, 7], [16, 38, 7], [16, 42, 7], [8, 42, 7]])} filter={on ? `url(#${uid}-glow)` : undefined} />
        {/* lever */}
        <g filter={on ? `url(#${uid}-soft)` : undefined}>
          <polyline className={`lever ${hot}`} points={pts([PIVOT, tip])} />
          <circle className={`knob ${hot}`} cx={kx} cy={ky} r={5} />
        </g>
        <circle className="knob" cx={P(...PIVOT)[0]} cy={P(...PIVOT)[1]} r={2.6} />
      </svg>
      <Caption title="Reactor" />
    </button>
  );
}

// ---------- lance: a round push button on a base plate. It sinks when pressed and a pulse races round its ring ----------

const FIRE_FRAME = frame([[0, 0, 0], [60, 0, 0], [0, 60, 0], [60, 60, 0], [30, 30, 22]]);
const CAP_R = 16;
const RING_R = 24;
const RING_PATH = (() => {
  const p = ring(30, 30, 8, RING_R, 0, 360, 72).map(([x, y, z]) => P(x, y, z));
  return "M" + p.map(([x, y]) => `${f(x)},${f(y)}`).join(" L") + " Z";
})();

export function FireButton({ ready, onFire, label = "Fire the ion lance", caption = "Ion lance" }: { ready: boolean; onFire: () => void; label?: string; caption?: string }) {
  const uid = `isoc-f${useId().replace(/:/g, "")}`;
  const [down, setDown] = useState(false);
  const [flash, setFlash] = useState(0);

  const sunk = down || !ready;
  const zTop = sunk ? 12 : 18;
  const hot = ready ? "hot" : "";
  const bottom = ring(30, 30, 8, CAP_R, -45, 135, 30);
  const top = ring(30, 30, zTop, CAP_R, -45, 135, 30).reverse();
  const press = () => {
    if (!ready) return;
    setFlash((n) => n + 1);
    onFire();
  };

  return (
    <button
      type="button"
      disabled={!ready}
      aria-label={label}
      onClick={press}
      onPointerDown={() => setDown(true)}
      onPointerUp={() => setDown(false)}
      onPointerLeave={() => setDown(false)}
      onPointerCancel={() => setDown(false)}
      className="isoc-btn flex flex-col items-center rounded-md focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-300/60"
    >
      <svg viewBox={FIRE_FRAME.viewBox} className="isoc h-[3.325rem] w-auto" aria-hidden="true">
        <Filters id={uid} />
        <ellipse className={`halo ${hot}`} cx={P(30, 30, 0)[0]} cy={P(30, 30, 0)[1] + 2} rx={38} ry={20} filter={`url(#${uid}-bloom)`} />
        <Box x={0} y={0} z={0} w={60} d={60} h={8} />
        {/* ring round the cap: lit while the lance is ready, a pulse races round it when fired */}
        <path className={`wire ${hot}`} d={RING_PATH} filter={ready ? `url(#${uid}-soft)` : undefined} />
        <path key={flash} className={`pulse ${flash ? "go" : ""}`} d={RING_PATH} pathLength={100} filter={`url(#${uid}-glow)`} />
        {/* the cap */}
        <g filter={ready ? `url(#${uid}-glow)` : undefined}>
          <polygon className={`face cap-wall ${hot}`} points={pts([...bottom, ...top])} />
          <polygon className={`face top cap-top ${hot}`} points={pts(ring(30, 30, zTop, CAP_R, 0, 360, 48))} />
          <g transform={TOP(30, 30, zTop)} className="reticle" style={{ opacity: 1 }}>
            <circle cx={0} cy={0} r={7} fill="none" stroke={ready ? "var(--body)" : "var(--detail)"} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
            <circle cx={0} cy={0} r={1.6} fill={ready ? "var(--body)" : "var(--detail)"} />
            <path d="M-12 0H-4M4 0H12M0-12V-4M0 4V12" fill="none" stroke={ready ? "var(--body)" : "var(--detail)"} strokeWidth={1.4} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </g>
        </g>
      </svg>
      <Caption title={caption} />
    </button>
  );
}

export function IsoStyle() {
  return <style>{CSS}</style>;
}
