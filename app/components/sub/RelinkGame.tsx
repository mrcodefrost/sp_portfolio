"use client";

import { useCallback, useEffect, useId, useReducer } from "react";
import { Box, Filters, IsoStyle, frame, P, pts } from "./IsoControls";

// "Relink": the 404 game, drawn as an ISO-GLOW figure (hairlines, one accent on whatever is live).
// Hop the probe tile to tile, collect every relay, and dodge the patrolling drones.
// Screen directions in this projection: +x is down-right, +y is down-left, so the arrows/WASD/d-pad move
// along the four diagonals (up = up-left, right = up-right, down = down-right, left = down-left).

const N = 7;
const T = 16;
const SIZE = N * T;
const PLATE_H = 4;
const RELAYS = 5;
const LIVES = 3;
const TICK_MS = 650;
const FRAME = frame([[0, 0, 0], [SIZE, 0, 0], [0, SIZE, 0], [SIZE, SIZE, 0], [SIZE / 2, SIZE / 2, 18]], 10);

type Vec = [number, number];
type Drone = { x: number; y: number; dx: number; dy: number };
type Status = "idle" | "playing" | "won" | "lost";
type State = { player: Vec; drones: Drone[]; nodes: Vec[]; got: number; lives: number; moves: number; hit: number; status: Status };
type Action = { type: "move"; dir: Vec } | { type: "tick" } | { type: "restart"; nodes: Vec[] };

const START: Vec = [0, 0];
const DRONES: Drone[] = [
  { x: 0, y: 3, dx: 1, dy: 0 },
  { x: 5, y: 0, dx: 0, dy: 1 },
  { x: 6, y: 5, dx: -1, dy: 0 },
];
// fixed first layout so server and client render the same; restarts pass a random one in the action
const FIRST_NODES: Vec[] = [[2, 1], [5, 2], [1, 5], [4, 4], [6, 6]];

const initial = (nodes: Vec[]): State => ({ player: START, drones: DRONES, nodes, got: 0, lives: LIVES, moves: 0, hit: 0, status: "idle" });

const randomNodes = (): Vec[] => {
  const tiles: Vec[] = [];
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) if (x + y > 1) tiles.push([x, y]);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles.slice(0, RELAYS);
};

const stepDrone = (d: Drone): Drone => {
  let { dx, dy } = d;
  if (d.x + dx < 0 || d.x + dx >= N) dx = -dx;
  if (d.y + dy < 0 || d.y + dy >= N) dy = -dy;
  return { x: d.x + dx, y: d.y + dy, dx, dy };
};

// a drone on the probe's tile costs one hull point and sends the probe back to the start
const resolveHit = (s: State): State => {
  if (!s.drones.some((d) => d.x === s.player[0] && d.y === s.player[1])) return s;
  const lives = s.lives - 1;
  return { ...s, player: START, lives, hit: s.hit + 1, status: lives <= 0 ? "lost" : s.status };
};

function reducer(s: State, a: Action): State {
  if (a.type === "restart") return initial(a.nodes);
  if (s.status === "won" || s.status === "lost") return s;
  if (a.type === "tick") {
    if (s.status !== "playing") return s;
    return resolveHit({ ...s, drones: s.drones.map(stepDrone) });
  }
  const nx = s.player[0] + a.dir[0];
  const ny = s.player[1] + a.dir[1];
  if (nx < 0 || ny < 0 || nx >= N || ny >= N) return s;
  const hitNode = s.nodes.findIndex(([x, y]) => x === nx && y === ny);
  const nodes = hitNode >= 0 ? s.nodes.filter((_, i) => i !== hitNode) : s.nodes;
  const got = s.got + (hitNode >= 0 ? 1 : 0);
  const next: State = { ...s, player: [nx, ny], nodes, got, moves: s.moves + 1, status: got >= RELAYS ? "won" : "playing" };
  return next.status === "won" ? next : resolveHit(next);
}

const KEYS: Record<string, Vec> = {
  ArrowUp: [-1, 0], w: [-1, 0], W: [-1, 0],
  ArrowRight: [0, -1], d: [0, -1], D: [0, -1],
  ArrowDown: [1, 0], s: [1, 0], S: [1, 0],
  ArrowLeft: [0, 1], a: [0, 1], A: [0, 1],
};

const DPAD: { dir: Vec; glyph: string; label: string }[] = [
  { dir: [-1, 0], glyph: "↖", label: "Move up-left" },
  { dir: [0, -1], glyph: "↗", label: "Move up-right" },
  { dir: [0, 1], glyph: "↙", label: "Move down-left" },
  { dir: [1, 0], glyph: "↘", label: "Move down-right" },
];

const CSS = `
.relink-tile{fill:transparent;pointer-events:all;transition:fill .15s}
.relink-tile.adj{fill:color-mix(in srgb,var(--accent) 9%,transparent);cursor:pointer}
.relink-tile.adj:hover{fill:color-mix(in srgb,var(--accent) 22%,transparent)}
.relink-node{animation:relink-pulse 1.4s ease-in-out infinite}
@keyframes relink-pulse{0%,100%{opacity:.55}50%{opacity:1}}
.relink-drone .face{stroke:var(--ink)}
.relink-hit{animation:relink-hit .45s ease-out}
@keyframes relink-hit{0%,40%{filter:brightness(2.2) saturate(0)}100%{filter:none}}
@media (prefers-reduced-motion:reduce){.relink-node,.relink-hit{animation:none}}
`;

const pip = (on: boolean) =>
  `h-2 w-5 rounded-[1px] transition-all duration-300 ${on ? "bg-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.7)]" : "bg-white/10"}`;

export default function RelinkGame() {
  const uid = `isoc-g${useId().replace(/:/g, "")}`;
  const [s, dispatch] = useReducer(reducer, FIRST_NODES, initial);
  const move = useCallback((dir: Vec) => dispatch({ type: "move", dir }), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dir = KEYS[e.key];
      if (!dir || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      move(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  useEffect(() => {
    if (s.status !== "playing") return;
    const id = setInterval(() => dispatch({ type: "tick" }), TICK_MS);
    return () => clearInterval(id);
  }, [s.status]);

  const won = s.status === "won";
  const tile = (i: number, j: number): V3Quad => [[i * T, j * T, PLATE_H], [(i + 1) * T, j * T, PLATE_H], [(i + 1) * T, (j + 1) * T, PLATE_H], [i * T, (j + 1) * T, PLATE_H]];
  const centre = (v: number) => (v + 0.5) * T;

  // everything standing on the board, painted back to front
  const things: { key: string; depth: number; node: React.ReactNode }[] = [
    ...s.nodes.map(([x, y]) => ({
      key: `n${x}-${y}`,
      depth: x + y,
      node: (
        <g key={`n${x}-${y}`} className="relink-node">
          <polygon
            className="glass hot"
            filter={`url(#${uid}-glow)`}
            points={pts([[centre(x) - 4, centre(y) - 4, PLATE_H + 1], [centre(x) + 4, centre(y) - 4, PLATE_H + 1], [centre(x) + 4, centre(y) + 4, PLATE_H + 1], [centre(x) - 4, centre(y) + 4, PLATE_H + 1]])}
          />
        </g>
      ),
    })),
    ...s.drones.map((d, i) => ({
      key: `d${i}`,
      depth: d.x + d.y + 0.1,
      node: (
        <g key={`d${i}`} className="relink-drone">
          <Box x={centre(d.x) - 4.5} y={centre(d.y) - 4.5} z={PLATE_H} w={9} d={9} h={5} />
          <polyline className="detail" style={{ stroke: "var(--ink)" }} points={pts([[centre(d.x) - 3, centre(d.y) - 3, PLATE_H + 5], [centre(d.x) + 3, centre(d.y) + 3, PLATE_H + 5]])} />
          <polyline className="detail" style={{ stroke: "var(--ink)" }} points={pts([[centre(d.x) + 3, centre(d.y) - 3, PLATE_H + 5], [centre(d.x) - 3, centre(d.y) + 3, PLATE_H + 5]])} />
        </g>
      ),
    })),
    {
      key: "player",
      depth: s.player[0] + s.player[1] + 0.2,
      node: (
        <g key="player">
          <Box x={centre(s.player[0]) - 4} y={centre(s.player[1]) - 4} z={PLATE_H} w={8} d={8} h={6} />
          <circle
            className="knob hot"
            cx={P(centre(s.player[0]), centre(s.player[1]), PLATE_H + 6)[0]}
            cy={P(centre(s.player[0]), centre(s.player[1]), PLATE_H + 6)[1]}
            r={2.4}
            filter={`url(#${uid}-glow)`}
          />
        </g>
      ),
    },
  ].sort((a, b) => a.depth - b.depth);

  const readout =
    s.status === "idle"
      ? "> link down. collect all 5 relays. avoid the drones."
      : s.status === "won"
        ? `> link restored in ${s.moves} moves.`
        : s.status === "lost"
          ? "> hull breached. link lost."
          : `> relays ${s.got}/${RELAYS} · hull ${s.lives}/${LIVES}`;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <style>{CSS}</style>
      <IsoStyle />

      <div className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">
        <span className="flex items-center gap-2">
          Relays
          <span className="flex gap-1" aria-hidden="true">
            {Array.from({ length: RELAYS }, (_, i) => (
              <span key={i} className={pip(i < s.got)} />
            ))}
          </span>
        </span>
        <span className="flex items-center gap-2">
          Hull
          <span className="flex gap-1" aria-hidden="true">
            {Array.from({ length: LIVES }, (_, i) => (
              <span key={i} className={pip(i < s.lives)} />
            ))}
          </span>
        </span>
      </div>

      <div key={s.hit} className={s.hit ? "relink-hit w-full" : "w-full"}>
        <svg
          viewBox={FRAME.viewBox}
          className="isoc h-auto w-full"
          role="img"
          aria-label="Isometric 7 by 7 grid. Move the probe with the arrow keys or WASD, collect five relays and avoid the drones."
        >
          <Filters id={uid} />
          <ellipse
            className={`halo ${s.status === "playing" || won ? "hot" : ""}`}
            cx={P(SIZE / 2, SIZE / 2, 0)[0]}
            cy={P(SIZE / 2, SIZE / 2, 0)[1] + 2}
            rx={110}
            ry={54}
            filter={`url(#${uid}-bloom)`}
          />
          <Box x={0} y={0} z={0} w={SIZE} d={SIZE} h={PLATE_H} />

          {/* tiles: hairlines, with the reachable ones highlighted and tappable */}
          {Array.from({ length: N * N }, (_, k) => {
            const i = Math.floor(k / N);
            const j = k % N;
            const adj = Math.abs(i - s.player[0]) + Math.abs(j - s.player[1]) === 1 && s.status !== "won" && s.status !== "lost";
            return (
              <polygon
                key={k}
                className={`detail relink-tile ${adj ? "adj" : ""}`}
                points={pts(tile(i, j))}
                onClick={adj ? () => move([i - s.player[0], j - s.player[1]]) : undefined}
              />
            );
          })}
          {won && <polygon className="wire hot" points={pts([...tile(0, 0).slice(0, 1), [SIZE, 0, PLATE_H], [SIZE, SIZE, PLATE_H], [0, SIZE, PLATE_H]])} filter={`url(#${uid}-soft)`} />}

          {things.map((t) => t.node)}
        </svg>
      </div>

      <p className="min-h-5 text-center font-mono text-xs tracking-wider text-cyan-300/80" role="status" aria-live="polite">
        {readout}
      </p>

      <div className="flex items-center gap-6">
        <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Move the probe">
          {DPAD.map((b) => (
            <button
              key={b.label}
              type="button"
              aria-label={b.label}
              onClick={() => move(b.dir)}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-cyan-400/30 bg-cyan-400/5 font-mono text-lg text-cyan-200 transition-colors hover:bg-cyan-400/15 active:translate-y-px focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-300/60"
            >
              {b.glyph}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => dispatch({ type: "restart", nodes: randomNodes() })}
          className={`cursor-pointer rounded-md border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
            s.status === "won" || s.status === "lost"
              ? "border-cyan-200 bg-cyan-400 text-[#03001a] shadow-[0_0_16px_rgba(34,211,238,0.5)]"
              : "border-white/15 text-gray-300 hover:border-cyan-400/50 hover:text-white"
          }`}
        >
          {s.status === "won" || s.status === "lost" ? "Play again" : "Restart"}
        </button>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">Arrows / WASD · tap a lit tile</p>
    </div>
  );
}

type V3Quad = [[number, number, number], [number, number, number], [number, number, number], [number, number, number]];
