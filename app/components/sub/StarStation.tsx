"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { useInView } from "react-intersection-observer";
import { FireButton, IsoStyle, ReactorSwitch } from "./IsoControls";
import { useHoveredBay } from "./bayHover";
import * as THREE from "three";

// World units: +x right-down, +z left-down on screen, +y up (true isometric camera).
// The station spins about the y axis: one turn every ~2.5 minutes.
const SPIN = 0.042;

const ACCENT = "#22d3ee";
const ACCENT_HI = "#a5f3fc";
const ACCENT_DIM = "#155e75";
const LINE = "#8b6cff";
const BODY = "#2a1f7e";
const GLASS = "#0e0a2a";
const DETAIL = "#4b3a9a";

const rad = (deg: number) => (deg * Math.PI) / 180;
type V3 = [number, number, number];

interface Mats {
  body: THREE.MeshStandardMaterial;
  line: THREE.LineBasicMaterial;
  detail: THREE.LineBasicMaterial;
  lit: THREE.MeshBasicMaterial;
  win: THREE.MeshBasicMaterial;
  pulse: THREE.MeshBasicMaterial;
  plume: THREE.MeshBasicMaterial;
  dish: THREE.MeshStandardMaterial;
}

interface Fx {
  shot: number;
}

const C_DETAIL = new THREE.Color(DETAIL);
const C_GLASS = new THREE.Color(GLASS);
const C_ACCENT = new THREE.Color(ACCENT);
const C_HI = new THREE.Color(ACCENT_HI);
const C_DIM = new THREE.Color(ACCENT_DIM);

// Each zone of the station is powered independently, so power can return (or fail) section by section.
interface ZoneState {
  id: string;
  delay: number;
  level: number;
  from: number;
  seed: number;
  lit: THREE.MeshBasicMaterial;
  win: THREE.MeshBasicMaterial;
  pulse: THREE.MeshBasicMaterial;
}

const ZONE_DELAY: Record<string, number> = {
  core: 0,
  hub: 0.375,
  halo: 0.71,
  "arm-home": 1.05,
  "pad-home": 1.35,
  "arm-projects": 1.43,
  "pad-projects": 1.73,
  "arm-contact": 1.8,
  "pad-contact": 2.1,
  "arm-blog": 2.18,
  "pad-blog": 2.48,
  fleet: 2.85,
};
// Section numbers announced while power returns or fails. They are not in power order, so the readout jumps around.
const SECTOR_NUMBER: Record<string, number> = {
  core: 1,
  hub: 2,
  halo: 9,
  "arm-home": 4,
  "pad-home": 5,
  "arm-projects": 8,
  "pad-projects": 3,
  "arm-contact": 11,
  "pad-contact": 6,
  "arm-blog": 10,
  "pad-blog": 7,
  fleet: 12,
};
const MAX_DELAY = 2.85;
const ZONE_DUR = 1.1;
const POWER_SECONDS = MAX_DELAY + ZONE_DUR;

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

class PowerRig {
  zones = new Map<string, ZoneState>();
  target = true;
  t0 = -1000;
  reduced = false;
  section: number | null = null;
  onSection?: (section: number | null) => void;

  zone(id: string): ZoneState {
    let z = this.zones.get(id);
    if (!z) {
      z = {
        id,
        delay: ZONE_DELAY[id] ?? 0,
        level: 1,
        from: 1,
        seed: this.zones.size + 1,
        lit: new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false }),
        win: new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false, side: THREE.DoubleSide }),
        pulse: new THREE.MeshBasicMaterial({ color: ACCENT_HI, toneMapped: false }),
      };
      this.zones.set(id, z);
    }
    return z;
  }

  set(on: boolean) {
    if (on === this.target) return;
    this.target = on;
    this.t0 = performance.now() / 1000;
    this.zones.forEach((z) => (z.from = z.level));
    this.section = null;
    this.onSection?.(null);
  }

  // Power returns in the order of ZONE_DELAY and fails in the reverse order, each zone flickering in between.
  update(now: number) {
    let latest = -1;
    let latestNumber: number | null = null;
    this.zones.forEach((z) => {
      const d = this.target ? z.delay : MAX_DELAY - z.delay;
      const u = (now - this.t0 - d) / ZONE_DUR;
      // the section announced is the one whose power change started most recently
      if (this.t0 >= 0 && u > 0 && SECTOR_NUMBER[z.id] && d >= latest) {
        latest = d;
        latestNumber = SECTOR_NUMBER[z.id];
      }
      let level: number;
      if (u <= 0) level = z.from;
      else if (u >= 1) level = this.target ? 1 : 0;
      else if (this.reduced) {
        // reduced motion: fade smoothly instead of flickering
        level = this.target ? z.from + (1 - z.from) * u : z.from * (1 - u);
      } else {
        const progress = this.target ? u : 1 - u;
        const lit = hash(Math.floor(u * 18) + z.seed * 13.7) < progress * 1.1;
        const p = lit ? 1 : this.target ? 0.06 : 0.12;
        level = this.target ? Math.max(p, z.from * 0.5) : Math.min(p, z.from);
      }
      z.level = level;
      z.lit.color.copy(C_GLASS).lerp(C_ACCENT, level);
      z.win.color.copy(C_GLASS).lerp(C_ACCENT, level);
      z.pulse.color.copy(C_DETAIL).lerp(C_HI, level);
    });
    if (latestNumber !== this.section && this.t0 >= 0 && (latestNumber !== null || this.section !== null)) {
      this.section = latestNumber;
      this.onSection?.(latestNumber);
    }
  }
}

interface SceneValue {
  mats: Mats;
  on: boolean;
  fx: MutableRefObject<Fx>;
  rig: PowerRig;
  zone: ZoneState;
}

const Ctx = createContext<SceneValue>(null!);
const useScene = () => useContext(Ctx);

// Scopes lit materials to one power zone, so everything inside it flickers on and off together.
function Zone({ id, children }: { id: string; children: ReactNode }) {
  const parent = useScene();
  const zone = parent.rig.zone(id);
  const value = useMemo<SceneValue>(
    () => ({ ...parent, mats: { ...parent.mats, lit: zone.lit, win: zone.win, pulse: zone.pulse }, zone }),
    [parent, zone],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function PowerController() {
  const { rig } = useScene();
  useFrame(() => rig.update(performance.now() / 1000));
  return null;
}

const BAYS = [
  { id: "home", label: "Home", href: "/", x: -228, z: 0, dx: -1, dz: 0, kind: "command", labelY: 114 },
  { id: "projects", label: "Projects", href: "/#projects", x: 0, z: -228, dx: 0, dz: -1, kind: "factory", labelY: 86 },
  { id: "blog", label: "Blog", href: "/blog", x: 0, z: 228, dx: 0, dz: 1, kind: "archive", labelY: 117 },
  { id: "contact", label: "Contact", href: "/#contact", x: 228, z: 0, dx: 1, dz: 0, kind: "radar", labelY: 94 },
] as const;
type Bay = (typeof BAYS)[number];

// ---------- primitives ----------

function Solid({ geo, position, rotation }: { geo: THREE.BufferGeometry; position?: V3; rotation?: V3 }) {
  const { mats } = useScene();
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 25), [geo]);
  return (
    <mesh geometry={geo} material={mats.body} position={position} rotation={rotation}>
      <lineSegments geometry={edges} material={mats.line} />
    </mesh>
  );
}

// Box addressed by its minimum corner and size.
function Cube({ x, y, z, w, h, d, lit }: { x: number; y: number; z: number; w: number; h: number; d: number; lit?: boolean }) {
  const { mats } = useScene();
  const geo = useMemo(() => new THREE.BoxGeometry(w, h, d), [w, h, d]);
  const position: V3 = [x + w / 2, y + h / 2, z + d / 2];
  if (lit) return <mesh geometry={geo} material={mats.lit} position={position} />;
  return <Solid geo={geo} position={position} />;
}

function Cyl({ cx = 0, cz = 0, r, y, h, lit }: { cx?: number; cz?: number; r: number; y: number; h: number; lit?: boolean }) {
  const { mats } = useScene();
  const geo = useMemo(() => new THREE.CylinderGeometry(r, r, h, 48), [r, h]);
  const position: V3 = [cx, y + h / 2, cz];
  if (lit) return <mesh geometry={geo} material={mats.lit} position={position} />;
  return <Solid geo={geo} position={position} />;
}

interface Win {
  p: V3;
  ry: number;
}

function Windows({ items, w, h }: { items: Win[]; w: number; h: number }) {
  const { mats } = useScene();
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.rotation.set(0, it.ry, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [items]);
  return (
    <instancedMesh ref={ref} args={[undefined as never, undefined as never, items.length]} material={mats.win} frustumCulled={false}>
      <planeGeometry args={[w, h]} />
    </instancedMesh>
  );
}

function drumWindows(r: number, rows: [number, number][], step: number, skip: number): Win[] {
  const out: Win[] = [];
  rows.forEach(([y0, y1], row) => {
    for (let a = 0; a < 360; a += step) {
      if ((Math.round(a / step) + row * 2) % skip === 0) continue;
      const t = rad(a + step / 2);
      out.push({ p: [(r + 0.3) * Math.cos(t), (y0 + y1) / 2, (r + 0.3) * Math.sin(t)], ry: Math.PI / 2 - t });
    }
  });
  return out;
}

function armWindows(dx: number, dz: number): Win[] {
  const out: Win[] = [];
  for (let d = 84, i = 0; d < 196; d += 12, i++) {
    if (i % 5 === 4) continue;
    if (dx !== 0) out.push({ p: [dx * d, 14.5, 12.3], ry: 0 }, { p: [dx * d, 14.5, -12.3], ry: Math.PI });
    else out.push({ p: [12.3, 14.5, dz * d], ry: Math.PI / 2 }, { p: [-12.3, 14.5, dz * d], ry: -Math.PI / 2 });
  }
  return out;
}

const circleGeo = (r: number, y: number, cx = 0, cz = 0, n = 56) =>
  new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      return new THREE.Vector3(cx + r * Math.cos(a), y, cz + r * Math.sin(a));
    }),
  );

let glowTexture: THREE.CanvasTexture | null = null;
function getGlow() {
  if (!glowTexture) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(165,243,252,1)");
    gr.addColorStop(0.3, "rgba(34,211,238,0.45)");
    gr.addColorStop(1, "rgba(34,211,238,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    glowTexture = new THREE.CanvasTexture(c);
  }
  return glowTexture;
}

function Glow({ position, size, opacity = 1 }: { position: V3; size: number; opacity?: number }) {
  const { zone } = useScene();
  const sprite = useRef<THREE.Sprite>(null);
  const mat = useRef<THREE.SpriteMaterial>(null);
  useFrame(() => {
    if (!sprite.current || !mat.current) return;
    mat.current.opacity = opacity * zone.level;
    sprite.current.visible = zone.level > 0.02;
  });
  return (
    <sprite ref={sprite} position={position} scale={[size, size, 1]}>
      <spriteMaterial ref={mat} map={getGlow()} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0} />
    </sprite>
  );
}

function Beacon({ position }: { position: V3 }) {
  const { zone } = useScene();
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const lv = zone.level;
    if (mat.current) mat.current.color.copy(C_DETAIL).lerp(C_HI, lv);
    if (mesh.current) mesh.current.visible = lv < 0.5 || Math.floor(performance.now() / 900) % 2 === 0;
  });
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[2.4, 10, 10]} />
      <meshBasicMaterial ref={mat} color={DETAIL} toneMapped={false} />
    </mesh>
  );
}

// A bright dash that travels outward along an arm.
function Pulse({ dx, dz, offset }: { dx: number; dz: number; offset: number }) {
  const { mats, zone } = useScene();
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    m.visible = zone.level > 0.5;
    const t = (performance.now() / 2600 + offset) % 1;
    const d = 80 + 116 * t;
    m.position.set(dx * d, 20.8, dz * d);
  });
  return (
    <mesh ref={ref} material={mats.pulse} rotation-y={dz === 0 ? 0 : Math.PI / 2}>
      <boxGeometry args={[12, 2.4, 2.4]} />
    </mesh>
  );
}

// ---------- ships ----------

// Small fighter, nose along local +x.
function Fighter({ position, ry = 0, scale = 1 }: { position: V3; ry?: number; scale?: number }) {
  return (
    <group position={position} rotation-y={ry} scale={scale}>
      <Cube x={-14} y={3} z={-4} w={28} h={6} d={8} />
      <Cube x={-4} y={4} z={-16} w={10} h={2} d={12} />
      <Cube x={-4} y={4} z={4} w={10} h={2} d={12} />
      <Cube x={-18} y={4} z={-5} w={4} h={4} d={3} lit />
      <Cube x={-18} y={4} z={2} w={4} h={4} d={3} lit />
      <Cube x={4} y={9} z={-3} w={8} h={3} d={6} lit />
    </group>
  );
}

const SLABS = [
  { y0: 0, y1: 8, w: 80, tail: 0, nose: -220 },
  { y0: 8, y1: 14, w: 64, tail: -6, nose: -205 },
  { y0: 14, y1: 19, w: 44, tail: -14, nose: -180 },
] as const;

function Slab({ y0, y1, w, tail, nose }: (typeof SLABS)[number]) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-w, -tail);
    shape.lineTo(w, -tail);
    shape.lineTo(0, -nose);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false });
    g.rotateX(-Math.PI / 2);
    g.translate(0, y0, 0);
    return g;
  }, [w, tail, nose, y0, y1]);
  return <Solid geo={geo} />;
}

function hullLights(): Win[] {
  const out: Win[] = [];
  [SLABS[0], SLABS[1]].forEach((s, row) => {
    for (let t = 0.06; t < 0.94; t += 0.045) {
      if (Math.round(t * 100) % 3 === 0) continue;
      for (const side of [1, -1]) {
        const ex = side * s.w * (1 - t);
        const ez = s.tail + (s.nose - s.tail) * t;
        // outward normal of the slanted edge (x/z plane)
        const nx = side * Math.abs(s.nose - s.tail);
        const nz = -s.w;
        const len = Math.hypot(nx, nz);
        const ry = Math.atan2(nx / len, nz / len);
        out.push({ p: [ex + (nx / len) * 0.4, row === 0 ? 4 : 11, ez + (nz / len) * 0.4], ry });
      }
    }
  });
  return out;
}

function BattleShip() {
  const { mats, zone, fx } = useScene();
  const lights = useMemo(hullLights, []);
  const towerWindows = useMemo<Win[]>(
    () => Array.from({ length: 8 }, (_, i) => ({ p: [-14.7 + i * 4.2, 39, -29.7] as V3, ry: 0 })),
    [],
  );
  const bob = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = performance.now() / 1000;
    if (bob.current) bob.current.position.y = Math.sin(t * 0.9) * 5;
    const flare = Math.max(0, 1 - (t - fx.current.shot) / 1.2);
    mats.plume.opacity = zone.level * (0.3 + 0.08 * Math.sin(t * 2.4) + flare * 0.5);
  });
  const engines = [-60, -30, 0, 30, 60];
  return (
    <group ref={bob}>
      {SLABS.map((s) => (
        <Slab key={s.y0} {...s} />
      ))}
      <Windows items={lights} w={3.2} h={2.2} />
      {/* spine light */}
      <Cube x={-0.6} y={19} z={-170} w={1.2} h={0.6} d={160} lit />

      {/* bridge */}
      <Cube x={-28} y={19} z={-58} w={56} h={8} d={34} />
      <Cyl cx={-21} cz={-42} r={5.5} y={27} h={9} />
      <Cyl cx={21} cz={-42} r={5.5} y={27} h={9} />
      <Cube x={-18} y={27} z={-52} w={36} h={16} d={22} />
      <Windows items={towerWindows} w={2.8} h={3.2} />
      <Cyl cx={-9} cz={-44} r={5} y={43} h={6} />
      <Cyl cx={9} cz={-44} r={5} y={43} h={6} />
      <Cube x={-1} y={43} z={-45} w={2} h={24} d={2} />
      <Beacon position={[0, 69, -44]} />

      {/* engines */}
      {engines.map((x) => (
        <group key={x}>
          <Cube x={x - 8} y={1} z={0} w={16} h={6} d={9} lit />
          <mesh position={[x, 4, 37]} rotation-x={Math.PI / 2} material={mats.plume}>
            <coneGeometry args={[8, 56, 12, 1, true]} />
          </mesh>
          <Glow position={[x, 4, 12]} size={42} opacity={0.9} />
        </group>
      ))}
    </group>
  );
}

// ---------- station ----------

// ---------- bay structures (each is built with local +z facing away from the hub) ----------

const DOME = new THREE.SphereGeometry(7, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);

// Home: command center with a stepped tower, bridge window strip, shield domes and a mast.
function CommandCenter() {
  const bridge = useMemo<Win[]>(() => Array.from({ length: 9 }, (_, i) => ({ p: [-18 + i * 4.5, 47, 9.25] as V3, ry: 0 })), []);
  const tower = useMemo<Win[]>(() => [32, 38].flatMap((y) => [-6, 0, 6].map((x) => ({ p: [x, y, 10.25] as V3, ry: 0 }))), []);
  const cap = useMemo<Win[]>(() => [-3.5, 0, 3.5].map((x) => ({ p: [x, 54, 6.25] as V3, ry: 0 })), []);
  return (
    <group>
      <Cube x={-24} y={10} z={-24} w={48} h={8} d={48} />
      <Cube x={-17} y={18} z={-17} w={34} h={8} d={34} />
      <Cube x={-10} y={26} z={-10} w={20} h={18} d={20} />
      <Windows items={tower} w={3.4} h={3.4} />
      <Cube x={-22} y={44} z={-9} w={44} h={6} d={18} />
      <Windows items={bridge} w={3} h={3} />
      <Solid geo={DOME} position={[-17, 50, 0]} />
      <Solid geo={DOME} position={[17, 50, 0]} />
      <Cube x={-6} y={50} z={-6} w={12} h={8} d={12} />
      <Windows items={cap} w={2.6} h={3} />
      <Cube x={-1} y={58} z={-1} w={2} h={22} d={2} />
      <Beacon position={[0, 82, 0]} />
    </group>
  );
}

function Puff({ x, z, base, delay }: { x: number; z: number; base: number; delay: number }) {
  const { zone } = useScene();
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#8b7cff", transparent: true, opacity: 0, depthWrite: false }), []);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const t = (performance.now() / 4200 + delay) % 1;
    m.position.set(x + t * 4, base + t * 34, z);
    m.scale.setScalar(2.5 + t * 6);
    mat.opacity = (1 - t) * 0.32 * zone.level;
  });
  return (
    <mesh ref={ref} material={mat}>
      <sphereGeometry args={[1, 10, 8]} />
    </mesh>
  );
}

// Projects: factory with a sawtooth-roof hall, smokestacks, a conveyor and a gantry crane.
function Factory() {
  const { mats } = useScene();
  const hall = useMemo<Win[]>(() => Array.from({ length: 7 }, (_, i) => ({ p: [-18 + i * 6, 17, 10.25] as V3, ry: 0 })), []);
  const tooth = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(11, 0);
    shape.lineTo(11, 7);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 30, bevelEnabled: false });
  }, []);
  const crate = useRef<THREE.Mesh>(null);
  const trolley = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const t = performance.now();
    if (crate.current) crate.current.position.z = 12 + ((t / 2200) % 1) * 14;
    if (trolley.current) trolley.current.position.x = -1 + Math.sin(t / 1400) * 8;
  });
  const stacks = [
    { x: -14, h: 44 },
    { x: -4, h: 36 },
    { x: 6, h: 30 },
  ];
  return (
    <group>
      <Cube x={-22} y={10} z={-20} w={44} h={14} d={30} />
      {[0, 1, 2, 3].map((i) => (
        <Solid key={i} geo={tooth} position={[-22 + i * 11, 24, -20]} />
      ))}
      <Windows items={hall} w={4} h={5} />
      {stacks.map((st, i) => (
        <group key={st.x}>
          <Cyl cx={st.x} cz={-24} r={3.2} y={10} h={st.h} />
          <Cyl cx={st.x} cz={-24} r={3.6} y={10 + st.h} h={1.4} lit />
          <Puff x={st.x} z={-24} base={10 + st.h + 2} delay={i * 0.33} />
          <Puff x={st.x} z={-24} base={10 + st.h + 2} delay={i * 0.33 + 0.5} />
        </group>
      ))}
      {/* conveyor with a moving crate */}
      <Cube x={-4} y={10} z={10} w={8} h={2} d={16} />
      <Cube x={-0.8} y={12} z={10} w={1.6} h={0.5} d={16} lit />
      <mesh ref={crate} position={[0, 14, 12]} material={mats.pulse}>
        <boxGeometry args={[4, 3, 4]} />
      </mesh>
      {/* gantry crane straddling the conveyor */}
      <Cube x={-12} y={10} z={16} w={2} h={26} d={2} />
      <Cube x={10} y={10} z={16} w={2} h={26} d={2} />
      <Cube x={-12} y={36} z={16} w={24} h={2} d={2} />
      <mesh ref={trolley} position={[-1, 34, 17]} material={mats.lit}>
        <boxGeometry args={[3, 2, 2]} />
      </mesh>
      <Cube x={-26} y={10} z={14} w={10} h={6} d={8} />
      <Cube x={-26} y={16} z={14} w={10} h={6} d={8} />
    </group>
  );
}

// Blog: data archive of shelf-towers around a ringed core, with a floating document hologram.
function Archive() {
  const { zone, mats } = useScene();
  const holo = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = holo.current;
    if (!g) return;
    const t = performance.now() / 1000;
    g.rotation.y = t * 0.6;
    g.position.y = 66 + Math.sin(t * 1.2) * 2.5;
    g.visible = zone.level > 0.3;
  });
  const page = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(18, 24)), []);
  const towers = [
    { x: -24, h: 34 },
    { x: -14, h: 46 },
    { x: -4, h: 30 },
    { x: 6, h: 42 },
    { x: 16, h: 26 },
  ];
  const bars = [
    { w: 12, y: 8 },
    { w: 14, y: 3.5 },
    { w: 11, y: 0 },
    { w: 14, y: -3.5 },
    { w: 8, y: -7 },
  ];
  return (
    <group>
      {towers.map((t) => (
        <group key={t.x}>
          <Cube x={t.x} y={10} z={-26} w={8} h={t.h} d={10} />
          {Array.from({ length: Math.floor((t.h - 6) / 7) }, (_, k) => (
            <Cube key={k} x={t.x + 1} y={14 + k * 7} z={-16.2} w={6} h={1} d={0.6} lit />
          ))}
        </group>
      ))}
      <Cyl cx={0} cz={10} r={8} y={10} h={34} />
      {[20, 28, 36].map((y) => (
        <mesh key={y} position={[0, y, 10]} rotation-x={Math.PI / 2} material={mats.lit}>
          <torusGeometry args={[8.4, 0.5, 6, 32]} />
        </mesh>
      ))}
      <Cyl cx={0} cz={10} r={5} y={44} h={4} />
      <Cyl cx={0} cz={10} r={2.5} y={48} h={4} lit />
      <group ref={holo} position={[0, 66, 10]}>
        <mesh>
          <planeGeometry args={[18, 24]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
        <lineSegments geometry={page}>
          <lineBasicMaterial color={ACCENT_HI} />
        </lineSegments>
        <mesh position={[-2, 10, 0.1]} material={mats.lit}>
          <boxGeometry args={[10, 1.6, 0.3]} />
        </mesh>
        {bars.map((b) => (
          <mesh key={b.y} position={[-7 + b.w / 2, b.y, 0.1]} material={mats.lit}>
            <boxGeometry args={[b.w, 0.9, 0.3]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Contact: large scanning radar dish on a yoke, plus a small fixed dish.
const BOWL_R = 24;
const BOWL_A = 0.95;

function bowlPoint(alpha: number, beta: number): V3 {
  return [BOWL_R * Math.sin(alpha) * Math.cos(beta), BOWL_R * (1 - Math.cos(alpha)) + 0.2, BOWL_R * Math.sin(alpha) * Math.sin(beta)];
}

function Radar() {
  const { mats } = useScene();
  const scan = useRef<THREE.Group>(null);
  useFrame(() => {
    if (scan.current) scan.current.rotation.y = (performance.now() / 1000) * 0.4;
  });
  const bowl = useMemo(() => {
    const g = new THREE.SphereGeometry(BOWL_R, 40, 14, 0, Math.PI * 2, Math.PI - BOWL_A, BOWL_A);
    g.translate(0, BOWL_R, 0);
    return g;
  }, []);
  const rim = useMemo(() => new THREE.EdgesGeometry(bowl, 25), [bowl]);
  const detail = useMemo(() => {
    const v: number[] = [];
    const seg = (a: V3, b: V3) => v.push(...a, ...b);
    [0.35, 0.65, BOWL_A].forEach((al) => {
      for (let i = 0; i < 48; i++) seg(bowlPoint(al, (i / 48) * Math.PI * 2), bowlPoint(al, ((i + 1) / 48) * Math.PI * 2));
    });
    for (let k = 0; k < 8; k++) {
      for (let j = 0; j < 9; j++) seg(bowlPoint((BOWL_A * j) / 9, (k * Math.PI) / 4), bowlPoint((BOWL_A * (j + 1)) / 9, (k * Math.PI) / 4));
    }
    // feed struts from the rim to the focal point
    [0, 2.1, 4.2].forEach((b) => seg(bowlPoint(BOWL_A, b), [0, 17, 0]));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    return g;
  }, []);
  const dish = (
    <group>
      <mesh geometry={bowl} material={mats.dish}>
        <lineSegments geometry={rim} material={mats.line} />
      </mesh>
      <lineSegments geometry={detail} material={mats.detail} />
      <mesh position={[0, 17, 0]} material={mats.lit}>
        <sphereGeometry args={[2.2, 12, 10]} />
      </mesh>
      <Glow position={[0, 17, 0]} size={30} opacity={0.9} />
    </group>
  );
  return (
    <group>
      <Cyl r={11} y={10} h={4} />
      <Cyl r={6} y={14} h={22} />
      <group position={[0, 36, 0]} ref={scan}>
        <Cube x={-23} y={0} z={-2} w={2} h={16} d={4} />
        <Cube x={21} y={0} z={-2} w={2} h={16} d={4} />
        <Cube x={-23} y={7} z={-1} w={46} h={2} d={2} />
        <group position={[0, 8, 0]} rotation-x={-0.75}>
          {dish}
        </group>
      </group>
      {/* small fixed dish */}
      <Cyl cx={-20} cz={-18} r={2} y={10} h={8} />
      <group position={[-20, 18, -18]} rotation={[-0.9, 0.8, 0]} scale={0.32}>
        <mesh geometry={bowl} material={mats.dish}>
          <lineSegments geometry={rim} material={mats.line} />
        </mesh>
        <lineSegments geometry={detail} material={mats.detail} />
      </group>
    </group>
  );
}

function BayPad({ bay, hot, setBay, go }: { bay: Bay; hot: boolean; setBay: (b: Bay | null) => void; go: () => void }) {
  const { on, zone } = useScene();
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const m = ringMat.current;
    if (!m) return;
    if (hot) m.color.copy(C_HI);
    else m.color.copy(C_DETAIL).lerp(C_DIM, zone.level);
  });
  const facing = Math.atan2(bay.dx, bay.dz);
  return (
    <group
      position={[bay.x, 0, bay.z]}
      onClick={(e) => {
        e.stopPropagation();
        go();
      }}
      onPointerOver={() => {
        setBay(bay);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setBay(null);
        document.body.style.cursor = "";
      }}
    >
      <Cube x={-36} y={0} z={-36} w={72} h={10} d={72} />
      <mesh rotation-x={-Math.PI / 2} position-y={10.3}>
        <ringGeometry args={[31, 33, 56]} />
        <meshBasicMaterial ref={ringMat} color={DETAIL} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {hot && (
        <group>
          <mesh rotation-x={-Math.PI / 2} position-y={10.2}>
            <circleGeometry args={[31, 48]} />
            <meshBasicMaterial color={ACCENT} transparent opacity={0.3} depthWrite={false} toneMapped={false} />
          </mesh>
          {/* light column so the bay stands out from every side */}
          <mesh position-y={60}>
            <cylinderGeometry args={[30, 30, 100, 40, 1, true]} />
            <meshBasicMaterial color={ACCENT} transparent opacity={0.09} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
          <Glow position={[0, 24, 0]} size={190} opacity={0.8} />
        </group>
      )}
      <Cube x={-34} y={10} z={-34} w={4} h={3} d={4} lit />
      <Cube x={30} y={10} z={-34} w={4} h={3} d={4} lit />
      <Cube x={-34} y={10} z={30} w={4} h={3} d={4} lit />
      <Cube x={30} y={10} z={30} w={4} h={3} d={4} lit />
      <group rotation-y={facing} scale={1.3} position-y={-3}>
        {bay.kind === "command" && <CommandCenter />}
        {bay.kind === "factory" && <Factory />}
        {bay.kind === "archive" && <Archive />}
        {bay.kind === "radar" && <Radar />}
      </group>
      <Html position={[0, bay.labelY, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <button
          type="button"
          onClick={go}
          onMouseEnter={() => setBay(bay)}
          onMouseLeave={() => setBay(null)}
          onFocus={() => setBay(bay)}
          onBlur={() => setBay(null)}
          aria-label={`Docking bay: ${bay.label}`}
          className={`pointer-events-auto hidden whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors sm:block ${
            hot ? "text-cyan-200" : on ? "text-gray-300" : "text-gray-500"
          } hover:text-cyan-200 focus-visible:text-cyan-200 focus-visible:outline-none`}
        >
          {bay.label}
        </button>
      </Html>
    </group>
  );
}

const HUB_BASE = drumWindows(74, [[8, 13]], 9, 4);
const HUB_MID = drumWindows(56, [[32, 37], [42, 47], [52, 57]], 7, 5);
const HUB_HALO = drumWindows(98, [[36, 40]], 4.2, 6);
const ARMS = [
  { id: "arm-contact", dx: 1, dz: 0 },
  { id: "arm-home", dx: -1, dz: 0 },
  { id: "arm-blog", dx: 0, dz: 1 },
  { id: "arm-projects", dx: 0, dz: -1 },
] as const;
const ARM_WINDOWS: Record<string, Win[]> = Object.fromEntries(ARMS.map((a) => [a.id, armWindows(a.dx, a.dz)]));
const MAST_RINGS = [circleGeo(9, 54, -129, 0, 24), circleGeo(9, 40, 0, -129, 24)];

function Arm({ id, dx, dz, index }: { id: string; dx: number; dz: number; index: number }) {
  const { mats } = useScene();
  return (
    <Zone id={id}>
      {dx !== 0 ? (
        <Cube x={dx > 0 ? 40 : -200} y={6} z={-12} w={160} h={14} d={24} />
      ) : (
        <Cube x={-12} y={6} z={dz > 0 ? 40 : -200} w={24} h={14} d={160} />
      )}
      {dx !== 0 ? (
        <Cube x={dx > 0 ? 78 : -198} y={20} z={-1} w={120} h={0.8} d={2} lit />
      ) : (
        <Cube x={-1} y={20} z={dz > 0 ? 78 : -198} w={2} h={0.8} d={120} lit />
      )}
      {[90, 116, 142, 168, 190].map((p) =>
        dx !== 0 ? <Cube key={p} x={dx * p - 2} y={20} z={-14} w={4} h={3} d={28} /> : <Cube key={p} x={-14} y={20} z={dz * p - 2} w={28} h={3} d={4} />,
      )}
      <Windows items={ARM_WINDOWS[id]} w={6} h={5} />
      <Pulse dx={dx} dz={dz} offset={index * 0.25} />
      <Cube x={dx * 127 - 7} y={20} z={dz * 127 - 7} w={14} h={12} d={14} />
      <Cube x={dx * 127 - 3} y={32} z={dz * 127 - 3} w={6} h={3} d={6} lit />
      {id === "arm-home" && (
        <group>
          <Cube x={-134} y={20} z={-5} w={10} h={86} d={10} />
          <Cube x={-142} y={70} z={-3} w={26} h={3} d={6} />
          <lineLoop geometry={MAST_RINGS[0]} material={mats.detail} />
          <Beacon position={[-129, 110, 0]} />
        </group>
      )}
      {id === "arm-projects" && (
        <group>
          <Cube x={-5} y={20} z={-134} w={10} h={64} d={10} />
          <Cube x={-3} y={52} z={-142} w={6} h={3} d={26} />
          <lineLoop geometry={MAST_RINGS[1]} material={mats.detail} />
          <Beacon position={[0, 88, -129]} />
        </group>
      )}
    </Zone>
  );
}
const HANGAR_A = rad(52);

function Station({ onFire, hot, setBay, go }: {
  onFire: () => void;
  hot: Bay | null;
  setBay: (b: Bay | null) => void;
  go: (href: string) => void;
}) {
  const { rig, mats } = useScene();
  const core = rig.zone("core");
  const hubZone = rig.zone("hub");
  const spin = useRef<THREE.Group>(null);
  const reduced = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    const onChange = () => (reduced.current = mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  // Slow further while a bay is hovered so it is easy to click.
  useFrame((_, dt) => {
    if (spin.current && !reduced.current) spin.current.rotation.y += dt * SPIN * (hot ? 0.15 : 1);
  });

  const halo = useMemo(
    () =>
      new THREE.LatheGeometry(
        [new THREE.Vector2(88, 34), new THREE.Vector2(98, 34), new THREE.Vector2(98, 42), new THREE.Vector2(88, 42), new THREE.Vector2(88, 34)],
        72,
      ),
    [],
  );
  const dishRings = useMemo(() => [46, 40, 33, 27, 20].map((r) => circleGeo(r, 72.15)), []);
  const spokes = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const v: number[] = [];
    for (let i = 0; i < 12; i++) {
      const a = rad(i * 30 + 15);
      v.push(14 * Math.cos(a), 72.15, 14 * Math.sin(a), 46 * Math.cos(a), 72.15, 46 * Math.sin(a));
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3));
    return g;
  }, []);

  return (
    <group ref={spin}>
      {/* hub */}
      <Cyl r={74} y={0} h={26} />
      <Zone id="hub">
        <Windows items={HUB_BASE} w={5.2} h={5} />
        <mesh position={[74.4 * Math.cos(HANGAR_A), 9.5, 74.4 * Math.sin(HANGAR_A)]} rotation-y={Math.PI / 2 - HANGAR_A} material={hubZone.win}>
          <planeGeometry args={[22, 13]} />
        </mesh>
        <Windows items={HUB_MID} w={3.3} h={5} />
      </Zone>
      <Cyl r={56} y={26} h={34} />
      <Cyl r={62} y={60} h={8} />

      {/* reactor core: dish, equator ring and spires. Click the dish to fire the ion lance */}
      <Zone id="core">
        <mesh position={[0, 27, 0]} rotation-x={Math.PI / 2} material={core.lit}>
          <torusGeometry args={[56.3, 0.6, 6, 72]} />
        </mesh>
        <group
          onClick={(e) => {
            e.stopPropagation();
            onFire();
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "")}
        >
          <Cyl r={50} y={68} h={4} />
          {dishRings.map((g, i) => (
            <lineLoop key={i} geometry={g} material={mats.detail} />
          ))}
          <lineSegments geometry={spokes} material={mats.detail} />
          <mesh position={[0, 72.3, 0]} rotation-x={-Math.PI / 2} material={core.lit}>
            <circleGeometry args={[12, 32]} />
          </mesh>
        </group>
        <Glow position={[0, 80, 0]} size={150} opacity={0.8} />
        <Cube x={-37} y={72} z={-37} w={3} h={32} d={3} />
        <Beacon position={[-35.5, 107, -35.5]} />
        <Cube x={33} y={72} z={-37} w={3} h={22} d={3} />
        <Beacon position={[34.5, 97, -35.5]} />
      </Zone>

      {/* halo ring and turrets */}
      <Solid geo={halo} />
      <Zone id="halo">
        <Windows items={HUB_HALO} w={2.5} h={4} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = rad(i * 30);
          const x = 93 * Math.cos(a);
          const z = 93 * Math.sin(a);
          return (
            <group key={i}>
              <Cube x={x - 3} y={42} z={z - 3} w={6} h={4} d={6} />
              <Cube x={x - 1.5} y={46} z={z - 1.5} w={3} h={2} d={3} lit />
            </group>
          );
        })}
      </Zone>

      {/* arms, masts and docking bays: each section has its own power */}
      {ARMS.map((a, i) => (
        <Arm key={a.id} id={a.id} dx={a.dx} dz={a.dz} index={i} />
      ))}
      {BAYS.map((b) => (
        <Zone key={b.id} id={`pad-${b.id}`}>
          <BayPad bay={b} hot={hot?.id === b.id} setBay={setBay} go={() => go(b.href)} />
        </Zone>
      ))}
    </group>
  );
}

function Lance() {
  const { fx } = useScene();
  const beam = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const shock = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const t = performance.now() / 1000 - fx.current.shot;
    const live = t >= 0 && t < 0.9;
    [beam, halo, shock].forEach((r) => r.current && (r.current.visible = live));
    if (!live || !beam.current || !halo.current || !shock.current) return;
    const k = Math.min(1, t / 0.14);
    const fade = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.3;
    beam.current.scale.set(1, 520 * k, 1);
    beam.current.position.y = 72 + 260 * k;
    halo.current.scale.set(1, 520 * k, 1);
    halo.current.position.y = 72 + 260 * k;
    (beam.current.material as THREE.MeshBasicMaterial).opacity = fade;
    (halo.current.material as THREE.MeshBasicMaterial).opacity = fade * 0.3;
    shock.current.scale.setScalar(1 + (t / 0.9) * 3);
    (shock.current.material as THREE.MeshBasicMaterial).opacity = (1 - t / 0.9) * 0.9;
  });
  return (
    <group>
      <mesh ref={beam} visible={false}>
        <cylinderGeometry args={[3, 3, 1, 12]} />
        <meshBasicMaterial color={ACCENT_HI} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={halo} visible={false}>
        <cylinderGeometry args={[11, 11, 1, 16]} />
        <meshBasicMaterial color={ACCENT} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={shock} visible={false} position={[0, 72.4, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[22, 25, 56]} />
        <meshBasicMaterial color={ACCENT_HI} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Fighter that circles the station on its own orbit.
function Patrol() {
  const { zone } = useScene();
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    g.visible = zone.level > 0.05;
    const a = (performance.now() / 1000) * 0.22;
    g.position.set(300 * Math.cos(a), 70 + Math.sin(a * 2) * 12, 300 * Math.sin(a));
    g.rotation.y = -Math.atan2(Math.cos(a), -Math.sin(a));
  });
  return (
    <group ref={ref}>
      <Fighter position={[0, 0, 0]} scale={1.3} />
    </group>
  );
}

// Extra canvas height (px) added above the original box so the top of the ship is not clipped.
// The scene keeps its size and sits where it did; the added room is all at the top.
const TOP_EXTRA = 28;
// Enlarges the ship and station; the camera keeps the top of the scene inside the canvas.
const SCENE_SCALE = 1.1;

// True isometric orthographic view; the station sits right of centre so the fleet has room on the left.
function Rig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    const dir = new THREE.Vector3(1, 1, 1).normalize();
    const right = new THREE.Vector3(1, 0, -1).normalize();
    const up = new THREE.Vector3(-1, 2, -1).normalize();
    // Wide: fleet on the left, station right of centre. Narrow: station only, filling the width.
    const narrow = size.width < 900;
    const [vw, vh, shift] = narrow ? [640, 480, 0] : [900, 450, -130];
    // zoom fits the original box height, then SCENE_SCALE enlarges it. The scene is shifted down so the top
    // of its frame lines up with the top of the (taller) canvas: the extra height is spent on the top edge.
    const base = Math.min(size.width / vw, (size.height - TOP_EXTRA) / vh);
    const zoom = base * SCENE_SCALE;
    const lift = (vh * zoom - size.height) / 2 / zoom;
    const target = right.clone().multiplyScalar(shift).add(up.clone().multiplyScalar((narrow ? 40 : 0) + lift));
    cam.position.copy(target).addScaledVector(dir, 1500);
    cam.up.set(0, 1, 0);
    cam.lookAt(target);
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

// Fleet anchor: offset from the station centre in view units (left and up).
const fleetOrigin = (() => {
  const right = new THREE.Vector3(1, 0, -1).normalize();
  const up = new THREE.Vector3(-1, 2, -1).normalize();
  return right.multiplyScalar(-440).add(up.multiplyScalar(120)).toArray() as V3;
})();

// The battleship group only fits the wide view; on narrow screens the camera is centred on the station.
function Fleet() {
  const size = useThree((state) => state.size);
  if (size.width < 900) return null;
  return (
    <Zone id="fleet">
      <group position={fleetOrigin} scale={0.95}>
        <BattleShip />
        <Fighter position={[-90, 6, 40]} ry={Math.PI / 2} />
        <Fighter position={[70, 30, -120]} ry={Math.PI / 2} />
      </group>
    </Zone>
  );
}

export default function StarStation() {
  const router = useRouter();
  const [on, setOn] = useState(true);
  const [shots, setShots] = useState(0);
  const [bay, setBay] = useState<Bay | null>(null);
  const fx = useRef<Fx>({ shot: -10 });
  const rig = useMemo(() => new PowerRig(), []);
  useEffect(() => {
    rig.onSection = setSection;
    return () => {
      rig.onSection = undefined;
    };
  }, [rig]);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (rig.reduced = mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [rig]);
  const [phase, setPhase] = useState<"idle" | "starting" | "stopping">("idle");
  const [section, setSection] = useState<number | null>(null);
  const prevOn = useRef(true);
  const { ref, inView } = useInView({ rootMargin: "200px" });
  const navBay = useHoveredBay();
  const activeBay = bay ?? BAYS.find((b) => b.id === navBay) ?? null;

  const mats = useMemo<Mats>(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: BODY, roughness: 0.95, metalness: 0.05, flatShading: true }),
      line: new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.6 }),
      detail: new THREE.LineBasicMaterial({ color: DETAIL }),
      lit: new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false }),
      win: new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false, side: THREE.DoubleSide }),
      pulse: new THREE.MeshBasicMaterial({ color: ACCENT_HI, toneMapped: false }),
      dish: new THREE.MeshStandardMaterial({ color: BODY, roughness: 0.8, metalness: 0.2, side: THREE.DoubleSide }),
      plume: new THREE.MeshBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    }),
    [],
  );

  // Start or cut power: zones flicker on (or off) one after another until the transition completes.
  useEffect(() => {
    rig.set(on);
    // only announce a transition when the reactor state really changed (not on mount or a dev double-run)
    if (prevOn.current === on) return;
    prevOn.current = on;
    setPhase(on ? "starting" : "stopping");
    const timer = setTimeout(() => setPhase("idle"), POWER_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [on, rig]);

  const rootMats = useMemo<Mats>(() => {
    const base = rig.zone("default");
    return { ...mats, lit: base.lit, win: base.win, pulse: base.pulse };
  }, [rig, mats]);

  const fire = () => {
    if (!on) {
      setOn(true);
      return;
    }
    if (rig.zone("core").level < 0.8) return;
    fx.current.shot = performance.now() / 1000;
    setShots((n) => n + 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === " ") {
      e.preventDefault();
      setOn((v) => !v);
    } else if (e.key.toLowerCase() === "f") {
      fire();
    }
  };

  const readout =
    phase === "starting"
      ? `power returning in section ${section ?? "…"}`
      : phase === "stopping"
        ? `power shutting down in section ${section ?? "…"}`
        : !on
          ? "reactor offline · space to power up"
          : activeBay
      ? `docking bay · ${activeBay.label.toLowerCase()}`
      : shots > 0
        ? `ion lance fired · ${shots} · fleet standing by`
        : "station online · slow orbit · fleet on patrol";

  return (
    <div className="relative flex w-full flex-col items-center">
      <div
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label="Interactive rotating starship station with a battleship. Press space to toggle power and F to fire the ion lance. Each docking bay links to a section of the site."
        onKeyDown={onKeyDown}
        className="relative aspect-[4/3] w-full rounded-lg focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan-300/60 lg:aspect-[7/3]"
      >
        {/* the canvas box reaches TOP_EXTRA px above the footprint, into the footer's top padding */}
        <div className="absolute inset-x-0 bottom-0" style={{ top: -TOP_EXTRA }}>
        <Canvas
          orthographic
          dpr={[1, 1.5]}
          frameloop={inView ? "always" : "never"}
          camera={{ near: 1, far: 5000, position: [1000, 1000, 1000], zoom: 1 }}
          gl={{ alpha: true, antialias: true, toneMapping: THREE.NoToneMapping }}
        >
          <Ctx.Provider value={{ mats: rootMats, on, fx, rig, zone: rig.zone("default") }}>
            <PowerController />
            <Rig />
            <ambientLight intensity={1.1} color="#8f7dff" />
            <directionalLight position={[-300, 520, 240]} intensity={2.4} color="#ffffff" />
            <directionalLight position={[400, 200, -300]} intensity={0.6} color="#7042f8" />
            <Station onFire={fire} hot={activeBay} setBay={setBay} go={(href) => router.push(href)} />
            <Lance />
            <Zone id="fleet">
              <Patrol />
            </Zone>
            <Fleet />
          </Ctx.Provider>
        </Canvas>
        </div>
      </div>

      {/* controls on the right; the status line sits under them. The block has a fixed width, so the
          buttons stay put no matter how long the status text is */}
      <div className="mt-3 flex w-full justify-end lg:pointer-events-none lg:absolute lg:bottom-0 lg:right-0 lg:z-10 lg:mt-0 lg:w-auto">
        <IsoStyle />
        <div className="w-[22rem] max-w-full lg:pointer-events-auto">
          <div className="flex items-end justify-center gap-4">
            <ReactorSwitch on={on} onToggle={() => setOn((v) => !v)} />
            <FireButton ready={on && phase !== "stopping"} onFire={fire} />
          </div>
          <p className="mt-2 min-h-[1rem] whitespace-nowrap text-center font-mono text-[11px] lowercase tracking-wide text-gray-500" aria-live="polite">
            {readout}
          </p>
        </div>
      </div>
    </div>
  );
}
