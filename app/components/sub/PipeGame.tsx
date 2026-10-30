"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Box, Filters, IsoStyle, frame, P, pts, ring, type V3 } from "./IsoControls";

// "Reroute": the 404 puzzle, drawn as an ISO-GLOW figure (hairlines, one accent on whatever is live).
// Tap a tile to turn it a quarter. Connect the generator (back corner) to the dead page (front corner):
// every tile the signal reaches lights up and the current flows along the pipes.
// Puzzles are generated from a seed, so the first one is the same on server and client and every puzzle
// is solvable by construction (a random route is laid first, then decoys fill the rest, then all is scrambled).

const N = 5;
const T = 18;
const SIZE = N * T;
const PLATE_H = 4;
const GOAL = N * N - 1;
const SEED = 7;
const MIN_ROUTE = 11;
const MAX_ROUTE = 17;
const FRAME = frame([[0, 0, 0], [SIZE, 0, 0], [0, SIZE, 0], [SIZE, SIZE, 0], [SIZE / 2, SIZE / 2, 14]], 10);

// connection bits: 0 = +x, 1 = +y, 2 = -x, 3 = -y (tile index = j * N + i)
const DIRS: [number, number][] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const rot = (m: number) => ((m << 1) | (m >> 3)) & 15;
const rotN = (m: number, n: number) => Array.from({ length: n }).reduce<number>((acc) => rot(acc), m);

type Tile = { mask: number; locked: boolean };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shuffle = <T,>(list: T[], rnd: () => number) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
};

const neighbours = (idx: number) => {
  const i = idx % N;
  const j = Math.floor(idx / N);
  return DIRS.flatMap(([di, dj], d) => {
    const ni = i + di;
    const nj = j + dj;
    return ni >= 0 && nj >= 0 && ni < N && nj < N ? [{ d, idx: nj * N + ni }] : [];
  });
};

// randomised walk from the generator to the dead page that never revisits a tile
function findRoute(rnd: () => number): number[] {
  const seen = new Array<boolean>(N * N).fill(false);
  const route = [0];
  seen[0] = true;
  let budget = 20000;
  const dfs = (cur: number): boolean => {
    if (--budget < 0) return false;
    if (cur === GOAL) return route.length >= MIN_ROUTE;
    for (const nb of shuffle(neighbours(cur), rnd)) {
      if (seen[nb.idx]) continue;
      if (nb.idx === GOAL && route.length + 1 < MIN_ROUTE) continue;
      if (route.length + 1 > MAX_ROUTE && nb.idx !== GOAL) continue;
      seen[nb.idx] = true;
      route.push(nb.idx);
      if (dfs(nb.idx)) return true;
      route.pop();
      seen[nb.idx] = false;
    }
    return false;
  };
  if (dfs(0)) return route;
  // fallback: along the back edge then down the side
  return [0, 1, 2, 3, 4, 9, 14, 19, 24];
}

const DECOYS = [0, 5, 5, 10, 10, 3, 3, 3, 7, 15]; // empty, straights, elbows, tees, cross

function litTiles(tiles: Tile[]): boolean[] {
  const lit = new Array<boolean>(N * N).fill(false);
  const queue = [0];
  lit[0] = true;
  while (queue.length) {
    const cur = queue.pop() as number;
    for (const nb of neighbours(cur)) {
      if (lit[nb.idx]) continue;
      if (tiles[cur].mask & (1 << nb.d) && tiles[nb.idx].mask & (1 << ((nb.d + 2) % 4))) {
        lit[nb.idx] = true;
        queue.push(nb.idx);
      }
    }
  }
  return lit;
}

function makePuzzle(seed: number): Tile[] {
  const rnd = mulberry32(seed);
  const route = findRoute(rnd);
  const onRoute = new Set(route);
  const tiles: Tile[] = Array.from({ length: N * N }, (_, idx) => {
    if (onRoute.has(idx)) return { mask: 0, locked: false };
    return { mask: rotN(DECOYS[Math.floor(rnd() * DECOYS.length)], Math.floor(rnd() * 4)), locked: false };
  });
  route.forEach((idx, k) => {
    let mask = 0;
    for (const nb of neighbours(idx)) {
      if (nb.idx === route[k - 1] || nb.idx === route[k + 1]) mask |= 1 << nb.d;
    }
    tiles[idx] = { mask, locked: k === 0 || k === route.length - 1 };
  });
  // scramble the route tiles; make sure the puzzle doesn't start solved
  route.forEach((idx) => {
    if (!tiles[idx].locked) tiles[idx] = { ...tiles[idx], mask: rotN(tiles[idx].mask, Math.floor(rnd() * 4)) };
  });
  const free = route.filter((idx) => !tiles[idx].locked);
  for (let guard = 0; litTiles(tiles)[GOAL] && guard < 12 && free.length; guard++) {
    const idx = free[guard % free.length];
    tiles[idx] = { ...tiles[idx], mask: rot(tiles[idx].mask) };
  }
  return tiles;
}

const CSS = `
.pipe{fill:none;stroke:var(--detail);stroke-width:3.2;stroke-linecap:round;vector-effect:non-scaling-stroke;transition:stroke .3s}
.pipe.hot{stroke:color-mix(in srgb,var(--accent) 55%,var(--body))}
.pipe-flow{fill:none;stroke:var(--accent-hi);stroke-width:1.4;stroke-linecap:round;vector-effect:non-scaling-stroke;stroke-dasharray:3 9;animation:pipe-flow 1s linear infinite}
@keyframes pipe-flow{to{stroke-dashoffset:-12}}
.pipe-tile{fill:transparent;pointer-events:all;cursor:pointer;transition:fill .2s;outline:none}
.pipe-tile.lit{fill:color-mix(in srgb,var(--accent) 7%,transparent)}
.pipe-tile:not(.locked):hover,.pipe-tile:focus-visible{fill:color-mix(in srgb,var(--accent) 18%,transparent)}
.pipe-tile.locked{cursor:default}
@media (prefers-reduced-motion:reduce){.pipe-flow{animation:none}}
`;


// ---------- reward: a piece of advanced tech recovered when the link is restored ----------

const TECHS = [
  { name: "Warp Coil", rarity: "Rare", blurb: "Three nested field rings that fold the space ahead of a hull. Tuned for short, gentle jumps." },
  { name: "Quantum Core", rarity: "Epic", blurb: "A crystal held in superposition, relaying a signal to every place it could have been at once." },
  { name: "Plasma Lance", rarity: "Uncommon", blurb: "A slim emitter that throws a bolt of contained star-stuff. Cools faster than it looks." },
  { name: "Gravity Anchor", rarity: "Rare", blurb: "Four posts and a spinning well. Parks a ship, a moon, or an argument." },
  { name: "Cloak Emitter", rarity: "Epic", blurb: "Stacked field plates that bend light round a vessel. You are almost certainly not looking at it." },
  { name: "Neural Spire", rarity: "Legendary", blurb: "A mast of thinking light. It has been listening to this 404 for a long time." },
  { name: "Signal Lantern", rarity: "Common", blurb: "A humble beacon on a post. Every lost traveller has been grateful for one of these." },
  { name: "Ion Thruster", rarity: "Common", blurb: "Three tapering stages and a patient push. Slow to start, impossible to argue with." },
  { name: "Void Compass", rarity: "Uncommon", blurb: "Its needle ignores north. It points at whatever is missing, which here is your page." },
  { name: "Chrono Hourglass", rarity: "Rare", blurb: "The sand falls both ways. Shake it twice and you will have loaded this page yesterday." },
  { name: "Dyson Seed", rarity: "Mythic", blurb: "Three rings round a spark. Given a few million years, it becomes a sun's worth of shelves." },
  { name: "Stellar Forge", rarity: "Legendary", blurb: "A crucible that smelts starlight into alloys. The chimney has been smoking since the 404 began." },
  { name: "Echo Prism", rarity: "Uncommon", blurb: "Sends one message through and gets three answers back. Two of them are probably spam." },
];

const RARITY_STYLE: Record<string, string> = {
  Common: "border-gray-400/40 text-gray-300",
  Uncommon: "border-emerald-300/40 text-emerald-200",
  Rare: "border-cyan-300/50 text-cyan-200",
  Epic: "border-purple-300/50 text-purple-200",
  Legendary: "border-amber-300/60 text-amber-200",
  Mythic: "border-rose-300/60 bg-rose-400/10 text-rose-200",
};

const STORE_KEY = "daksh-404-tech";
const ART_FRAME = frame([[0, 0, 0], [40, 0, 0], [0, 40, 0], [40, 40, 0], [20, 20, 50]], 8);
const orbit = (r: number, z: number): string =>
  "M" + ring(20, 20, z, r, 0, 360, 48).map(([x, y, zz]) => P(x, y, zz).map((n) => n.toFixed(2)).join(",")).join(" L") + " Z";
const pathOf = (list: V3[]) =>
  "M" + list.map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(2)).join(",")).join(" L") + " Z";
const arcPts = (r: number, cz: number, plane: "xz" | "yz"): V3[] =>
  Array.from({ length: 49 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    return plane === "xz" ? [20 + r * Math.cos(a), 20, cz + r * Math.sin(a)] : [20, 20 + r * Math.cos(a), cz + r * Math.sin(a)];
  });
const xy = (x: number, y: number, z: number) => P(x, y, z).map((n) => n.toFixed(2)).join(",");

function Artifact({ kind, uid, className = "w-36", lit = true }: { kind: number; uid: string; className?: string; lit?: boolean }) {
  const soft = `url(#${uid}-soft)`;
  const glow = `url(#${uid}-glow)`;
  const knobAt = (x: number, y: number, z: number, r = 2.4) => {
    const [px, py] = P(x, y, z);
    return <circle key={`${x}-${y}-${z}`} className="knob hot" cx={px} cy={py} r={r} filter={glow} />;
  };
  return (
    <svg viewBox={ART_FRAME.viewBox} className={`isoc h-auto shrink-0 ${className}`} role="img" aria-label={lit ? `${TECHS[kind].name}, recovered` : "Unrecovered tech"}>
      <Filters id={uid} />
      <ellipse className="halo hot" cx={P(20, 20, 0)[0]} cy={P(20, 20, 0)[1] + 2} rx={34} ry={17} filter={`url(#${uid}-bloom)`} />
      <Box x={0} y={0} z={0} w={40} d={40} h={4} />
      <path className="wire hot" d={orbit(17, 4)} filter={soft} />
      {kind === 0 && (
        <g>
          <Box x={18} y={18} z={4} w={4} d={4} h={32} />
          {[14, 24, 34].map((z) => <path key={z} className="wire hot" d={orbit(11, z)} filter={soft} />)}
          {knobAt(20, 20, 54, 2.6)}
        </g>
      )}
      {kind === 1 && (
        <g>
          <Box x={18} y={18} z={4} w={4} d={4} h={10} />
          <polygon className="glass hot" filter={glow} points={`${xy(20, 20, 46)} ${xy(29, 20, 30)} ${xy(20, 29, 30)} ${xy(11, 20, 30)}`} />
          <polygon className="glass hot" points={`${xy(29, 20, 30)} ${xy(20, 29, 30)} ${xy(20, 20, 18)}`} />
          <path className="wire hot" d={orbit(14, 30)} filter={soft} />
        </g>
      )}
      {kind === 2 && (
        <g>
          <Box x={15} y={15} z={4} w={10} d={10} h={8} />
          <Box x={18} y={18} z={12} w={4} d={4} h={26} />
          <Box x={12} y={18} z={12} w={3} d={4} h={10} />
          <Box x={25} y={18} z={12} w={3} d={4} h={10} />
          {knobAt(20, 20, 40, 2.8)}
        </g>
      )}
      {kind === 3 && (
        <g>
          {[14, 10, 6].map((r, i) => <path key={r} className="wire hot" d={orbit(r, 7 + i)} filter={soft} />)}
          {[[5, 5], [29, 5], [5, 29], [29, 29]].map(([x, y]) => <Box key={`${x}${y}`} x={x} y={y} z={4} w={6} d={6} h={12} />)}
          {knobAt(20, 20, 12, 3)}
        </g>
      )}
      {kind === 4 && (
        <g>
          {[[32, 4, 6], [24, 10, 6], [16, 16, 6], [8, 22, 6]].map(([s, z, h]) => (
            <g key={s}>
              <Box x={20 - s / 2} y={20 - s / 2} z={z} w={s} d={s} h={h} />
              <polyline className="wire hot" points={pts([[20 - s / 2, 20 + s / 2, z + h], [20 + s / 2, 20 + s / 2, z + h], [20 + s / 2, 20 - s / 2, z + h]])} filter={soft} />
            </g>
          ))}
          {knobAt(20, 20, 32, 2.6)}
        </g>
      )}
      {kind === 5 && (
        <g>
          <Box x={18} y={18} z={4} w={4} d={4} h={34} />
          {[0, 120, 240].map((a, i) => knobAt(20 + 10 * Math.cos((a * Math.PI) / 180), 20 + 10 * Math.sin((a * Math.PI) / 180), 18 + i * 8, 2.4))}
          {knobAt(20, 20, 42, 3)}
        </g>
      )}
      {kind === 6 && (
        <g>
          <Box x={18} y={18} z={4} w={4} d={4} h={22} />
          <Box x={14} y={14} z={26} w={12} d={12} h={11} />
          <polygon className="glass hot" filter={glow} points={pts([[16, 26, 28], [24, 26, 28], [24, 26, 35], [16, 26, 35]])} />
          <polygon className="glass hot" filter={glow} points={pts([[26, 16, 28], [26, 24, 28], [26, 24, 35], [26, 16, 35]])} />
          {knobAt(20, 20, 41, 2.2)}
        </g>
      )}
      {kind === 7 && (
        <g>
          <Box x={11} y={11} z={4} w={18} d={18} h={8} />
          <Box x={14} y={14} z={12} w={12} d={12} h={6} />
          <Box x={16} y={16} z={18} w={8} d={8} h={5} />
          <polyline className="wire hot" points={pts([[20, 20, 23], [20, 20, 48]])} strokeDasharray="2 3" filter={soft} />
          {knobAt(20, 20, 48, 2.4)}
        </g>
      )}
      {kind === 8 && (
        <g>
          <Box x={12} y={12} z={4} w={16} d={16} h={5} />
          <path className="wire hot" d={orbit(13, 9)} filter={soft} />
          {[[20, 8], [20, 32], [8, 20], [32, 20]].map(([x, y]) => (
            <polyline key={`${x}${y}`} className="detail" points={pts([[x, y, 9], [20 + (x - 20) * 0.8, 20 + (y - 20) * 0.8, 9]])} />
          ))}
          <polyline className="lever hot" points={pts([[20, 20, 10], [28, 12, 10]])} />
          {knobAt(28, 12, 10, 2.2)}
          {knobAt(20, 20, 10, 1.8)}
        </g>
      )}
      {kind === 9 && (
        <g>
          {[[9, 9], [28, 9], [9, 28], [28, 28]].map(([x, y]) => <Box key={`${x}${y}`} x={x} y={y} z={4} w={3} d={3} h={36} />)}
          <Box x={7} y={7} z={40} w={26} d={26} h={2} />
          <polygon className="glass hot" filter={soft} points={pts([[12, 32, 38], [28, 32, 38], [20, 32, 22]])} />
          <polygon className="glass" points={pts([[12, 32, 6], [28, 32, 6], [20, 32, 22]])} />
          <polyline className="detail" points={pts([[20, 32, 22], [20, 32, 8]])} />
          {knobAt(20, 32, 22, 1.8)}
        </g>
      )}
      {kind === 10 && (
        <g>
          <Box x={18} y={18} z={4} w={4} d={4} h={9} />
          <path className="wire hot" d={pathOf(arcPts(14, 26, "xz"))} filter={soft} />
          <path className="wire hot" d={pathOf(arcPts(14, 26, "yz"))} filter={soft} />
          <path className="wire hot" d={orbit(14, 26)} filter={soft} />
          {knobAt(20, 20, 26, 4)}
        </g>
      )}
      {kind === 11 && (
        <g>
          <Box x={6} y={10} z={4} w={28} d={20} h={8} />
          <polygon className="glass hot" filter={glow} points={pts([[12, 14, 12], [28, 14, 12], [28, 26, 12], [12, 26, 12]])} />
          <Box x={26} y={12} z={12} w={6} d={6} h={22} />
          {knobAt(29, 15, 38, 1.6)}
          {knobAt(31, 17, 44, 1.3)}
          {knobAt(28, 14, 48, 1.1)}
        </g>
      )}
      {kind === 12 && (
        <g>
          <Box x={14} y={14} z={4} w={12} d={12} h={3} />
          <polygon className="glass hot" filter={glow} points={pts([[13, 26, 7], [27, 26, 7], [20, 26, 32]])} />
          <polyline className="wire hot" points={pts([[20, 26, 32], [6, 34, 44]])} strokeDasharray="2 3" filter={soft} />
          <polyline className="wire hot" points={pts([[20, 26, 32], [20, 38, 46]])} strokeDasharray="2 3" filter={soft} />
          <polyline className="wire hot" points={pts([[20, 26, 32], [34, 34, 44]])} strokeDasharray="2 3" filter={soft} />
          {knobAt(20, 26, 32, 1.8)}
        </g>
      )}
    </svg>
  );
}

function ArchivePanel({ found, uid, onClose }: { found: number[]; uid: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030014]/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tech archive"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-gradient-to-b from-cyan-400/50 via-purple-500/25 to-cyan-400/10 p-px shadow-[0_0_80px_-12px_rgba(34,211,238,0.45)]"
      >
        <div className="relative overflow-hidden rounded-[15px] bg-[#050118]/95">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-2/3 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          {[
            "left-3 top-3 border-l border-t rounded-tl-md",
            "right-3 top-3 border-r border-t rounded-tr-md",
            "left-3 bottom-3 border-l border-b rounded-bl-md",
            "right-3 bottom-3 border-r border-b rounded-br-md",
          ].map((c) => (
            <span key={c} aria-hidden="true" className={`pointer-events-none absolute z-10 h-3 w-3 border-cyan-300/60 ${c}`} />
          ))}

          <div className="relative flex items-center justify-between gap-3 border-b border-white/5 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-200/80">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-px bg-cyan-300/60" />
              Tech archive
            </span>
            <span className="flex items-center gap-4">
              <span className="tabular-nums text-cyan-100">
                {found.length}/{TECHS.length} recovered
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close archive"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-white/10 text-sm text-gray-300 transition-colors hover:border-cyan-400/50 hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-300/60"
              >
                ×
              </button>
            </span>
          </div>

          <ul className="relative grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 md:grid-cols-3 md:p-6">
            {TECHS.map((t, i) => {
              const have = found.includes(i);
              return (
                <li
                  key={t.name}
                  className={`flex flex-col items-center rounded-xl border p-4 text-center ${
                    have ? "border-cyan-300/25 bg-cyan-400/5" : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div style={have ? undefined : { filter: "brightness(0.3) saturate(0)" }}>
                    <Artifact kind={i} uid={`${uid}-a${i}`} className="w-28" lit={have} />
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">No. {String(i + 1).padStart(2, "0")}</p>
                  <h3 className={`mt-1 text-sm font-semibold ${have ? "text-gray-100" : "text-gray-600"}`}>{have ? t.name : "???"}</h3>
                  {have ? (
                    <>
                      <span className={`mt-1 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${RARITY_STYLE[t.rarity]}`}>
                        {t.rarity}
                      </span>
                      <p className="mt-2 text-xs leading-relaxed text-gray-400">{t.blurb}</p>
                    </>
                  ) : (
                    <p className="mt-2 text-xs text-gray-600">Unrecovered. Restore a link to find it.</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

const centre = (v: number) => (v + 0.5) * T;
const Z = PLATE_H + 0.6;

export default function PipeGame() {
  const uid = `isoc-p${useId().replace(/:/g, "")}`;
  const [seed, setSeed] = useState(SEED);
  const [tiles, setTiles] = useState<Tile[]>(() => makePuzzle(SEED));
  const [turns, setTurns] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const lit = useMemo(() => litTiles(tiles), [tiles]);
  const solved = lit[GOAL];
  const powered = lit.filter(Boolean).length;

  // each solved puzzle awards a piece you don't have yet (-1 once the archive is complete)
  const [reward, setReward] = useState<number | null>(null);
  const awarded = useRef(false);
  const readSaved = (): number[] => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]") as number[];
      return Array.isArray(saved) ? saved.filter((n) => n >= 0 && n < TECHS.length) : [];
    } catch {
      return [];
    }
  };
  useEffect(() => {
    setFound(readSaved());
  }, []);
  useEffect(() => {
    if (!solved || awarded.current) return;
    awarded.current = true;
    const saved = readSaved();
    const left = TECHS.map((_, i) => i).filter((i) => !saved.includes(i));
    if (!left.length) {
      setFound(saved);
      setReward(-1);
      return;
    }
    const pick = left[Math.floor(Math.random() * left.length)];
    const next = [...saved, pick];
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {}
    setFound(next);
    setReward(pick);
  }, [solved]);

  const turn = (idx: number) => {
    if (solved || tiles[idx].locked) return;
    setTiles((prev) => prev.map((t, k) => (k === idx ? { ...t, mask: rot(t.mask) } : t)));
    setTurns((n) => n + 1);
  };
  const reset = () => {
    setTiles(makePuzzle(seed));
    setTurns(0);
    awarded.current = false;
    setReward(null);
  };
  const fresh = () => {
    const next = (Date.now() % 1_000_000_000) + 1;
    setSeed(next);
    setTiles(makePuzzle(next));
    setTurns(0);
    awarded.current = false;
    setReward(null);
  };

  const order = Array.from({ length: N * N }, (_, k) => k).sort((a, b) => (a % N) + Math.floor(a / N) - ((b % N) + Math.floor(b / N)));

  const readout = solved
    ? `> link restored in ${turns} turns.`
    : turns
      ? `> signal reaching ${powered} of ${N * N} tiles`
      : "> link down. turn the tiles to route power to the dead page.";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <style>{CSS}</style>
      <IsoStyle />

      <div className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">
        <span>
          Turns <span className="tabular-nums text-cyan-100">{turns}</span>
        </span>
        <span className="flex items-center gap-2">
          Powered
          <span className="flex gap-[3px]" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span
                key={i}
                className={`h-2 w-1.5 rounded-[1px] transition-all duration-300 ${
                  i < Math.round((powered / (N * N)) * 12) ? "bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.7)]" : "bg-white/10"
                }`}
              />
            ))}
          </span>
        </span>
      </div>

      <svg viewBox={FRAME.viewBox} className="isoc h-auto w-full" role="group" aria-label="Isometric 5 by 5 pipe grid. Turn tiles to connect the generator to the dead page.">
        <Filters id={uid} />
        <ellipse className={`halo ${solved ? "hot" : ""}`} cx={P(SIZE / 2, SIZE / 2, 0)[0]} cy={P(SIZE / 2, SIZE / 2, 0)[1] + 2} rx={100} ry={50} filter={`url(#${uid}-bloom)`} />
        <Box x={0} y={0} z={0} w={SIZE} d={SIZE} h={PLATE_H} />

        {order.map((idx) => {
          const i = idx % N;
          const j = Math.floor(idx / N);
          const t = tiles[idx];
          const on = lit[idx];
          const quad = pts([[i * T, j * T, PLATE_H], [(i + 1) * T, j * T, PLATE_H], [(i + 1) * T, (j + 1) * T, PLATE_H], [i * T, (j + 1) * T, PLATE_H]]);
          const cx = centre(i);
          const cy = centre(j);
          const segs = DIRS.flatMap(([di, dj], d) =>
            t.mask & (1 << d) ? [pts([[cx, cy, Z], [cx + (di * T) / 2, cy + (dj * T) / 2, Z]])] : []
          );
          const end = idx === 0 || idx === GOAL;
          const [hx, hy] = P(cx, cy, Z);
          return (
            <g key={idx}>
              <polygon
                className={`detail pipe-tile ${on ? "lit" : ""} ${t.locked ? "locked" : ""}`}
                points={quad}
                role={t.locked ? undefined : "button"}
                tabIndex={t.locked ? undefined : 0}
                aria-label={t.locked ? undefined : `Turn tile column ${i + 1}, row ${j + 1}`}
                onClick={() => turn(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    turn(idx);
                  }
                }}
              />
              <g style={{ pointerEvents: "none" }}>
                {segs.map((s, k) => (
                  <g key={k}>
                    <polyline className={`pipe ${on ? "hot" : ""}`} points={s} filter={on ? `url(#${uid}-soft)` : undefined} />
                    {on && <polyline className="pipe-flow" points={s} />}
                  </g>
                ))}
                {t.mask !== 0 && !end && <circle className={`knob ${on ? "hot" : ""}`} cx={hx} cy={hy} r={2} />}
                {end && (
                  <g>
                    <Box x={cx - 5} y={cy - 5} z={PLATE_H} w={10} d={10} h={8} />
                    <circle className={`knob ${on ? "hot" : ""}`} cx={P(cx, cy, PLATE_H + 8)[0]} cy={P(cx, cy, PLATE_H + 8)[1]} r={2.6} filter={on ? `url(#${uid}-glow)` : undefined} />
                  </g>
                )}
              </g>
            </g>
          );
        })}
        {solved && <polygon className="wire hot" points={pts([[0, 0, PLATE_H], [SIZE, 0, PLATE_H], [SIZE, SIZE, PLATE_H], [0, SIZE, PLATE_H]])} filter={`url(#${uid}-soft)`} style={{ pointerEvents: "none" }} />}
      </svg>

      <p className="min-h-5 text-center font-mono text-xs tracking-wider text-cyan-300/80" role="status" aria-live="polite">
        {readout}
      </p>

      {solved && reward !== null && reward >= 0 && (
        <div className="flex w-full items-center gap-4 rounded-xl border border-cyan-300/30 bg-cyan-400/5 p-3 shadow-[0_0_30px_-8px_rgba(34,211,238,0.5)]">
          <Artifact kind={reward} uid={`${uid}-art`} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Tech recovered</p>
            <h3 className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold text-gray-100">
              {TECHS[reward].name}
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${RARITY_STYLE[TECHS[reward].rarity]}`}>
                {TECHS[reward].rarity}
              </span>
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">{TECHS[reward].blurb}</p>
          </div>
        </div>
      )}

      {solved && reward === -1 && (
        <div className="w-full rounded-xl border border-cyan-300/30 bg-cyan-400/5 p-4 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Archive complete</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-400">Every piece of tech out here has been recovered. Nothing is left to find.</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex cursor-pointer items-center gap-2 rounded-md border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/70 transition-colors hover:border-cyan-400/50 hover:text-cyan-100"
      >
        View archive
        <span className="flex gap-1" aria-hidden="true">
          {TECHS.map((t, i) => (
            <span key={t.name} className={`h-2 w-2.5 rounded-[1px] ${found.includes(i) ? "bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.7)]" : "bg-white/10"}`} />
          ))}
        </span>
        <span className="tabular-nums">{found.length}/{TECHS.length}</span>
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={fresh}
          className={`cursor-pointer rounded-md border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
            solved
              ? "border-cyan-200 bg-cyan-400 text-[#03001a] shadow-[0_0_16px_rgba(34,211,238,0.5)]"
              : "border-white/15 text-gray-300 hover:border-cyan-400/50 hover:text-white"
          }`}
        >
          New puzzle
        </button>
        {!solved && (
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer rounded-md border border-white/15 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-gray-300 transition-colors hover:border-cyan-400/50 hover:text-white"
          >
            Reset
          </button>
        )}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Tap a tile to turn it</p>
      {open && <ArchivePanel found={found} uid={uid} onClose={() => setOpen(false)} />}
    </div>
  );
}
