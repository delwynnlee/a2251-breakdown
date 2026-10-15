import { Suspense, lazy, useRef, useState, useEffect, useMemo } from "react";
import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import {
  CameraControls,
  RoundedBox,
  Line,
  Html,
  Detailed,
} from "@react-three/drei";
import * as THREE from "three";
import {
  byId,
  renderParts,
  descendants,
  overlays,
  type Part,
  type Mode,
} from "./manifest";
import Keys from "./Keys";
import { visible, type State } from "./state";
export function isInternal(p: Part) {
  return (
    ["logic", "cooling", "power", "bms", "flex"].includes(p.parent || "") ||
    [
      "logic",
      "speaker-left",
      "speaker-right",
      "flex",
      "display-flex",
      "antenna",
    ].includes(p.id)
  );
}
export type Metrics = {
  fps: number;
  calls: number;
  triangles: number;
  renderer: string;
};
const InternalAssembly = lazy(() => import("./InternalAssembly"));
const external = [
  "upper",
  "lower",
  "lid",
  "panel",
  "camera",
  "keyboard",
  "touchbar",
  "touchid",
  "trackpad",
];
function layer(p: Part) {
  if (p.shape === "blade") return 2;
  if (["lid", "panel", "camera", "ambient-light"].includes(p.id)) return 9;
  if (p.parent === "inputs" || p.parent === "keyboard") return 5;
  if (p.id === "upper") return 4;
  if (p.id === "lower" || p.parent === "lower") return -4;
  if (p.parent === "cooling") return 2;
  if (p.parent === "logic" || p.id === "logic") return 0;
  return -1;
}
function Plate({
  p,
  opacity,
  selected,
  planes,
}: {
  p: Part;
  opacity: number;
  selected: boolean;
  planes: THREE.Plane[];
}) {
  const geometry = useMemo(() => {
    const [w, h, d] = p.size;
    const r = p.id === "trackpad" ? 0.3 : 0.65;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -d / 2);
    s.lineTo(w / 2 - r, -d / 2);
    s.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    s.lineTo(w / 2, d / 2 - r);
    s.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    s.lineTo(-w / 2 + r, d / 2);
    s.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    s.lineTo(-w / 2, -d / 2 + r);
    s.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: h,
      bevelEnabled: false,
      curveSegments: 8,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, -h / 2, 0);
    return g;
  }, [p]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group>
      <mesh geometry={geometry} name={p.id}>
        <Material
          color={p.color}
          opacity={opacity}
          selected={selected}
          planes={planes}
        />
      </mesh>
      {p.id === "upper" &&
        [
          [0, -0.5, 10.42, 29.2, 1, 0.18],
          [0, -0.5, -10.42, 29.2, 1, 0.18],
          [-15.02, -0.5, 0, 0.18, 1, 19.7],
          [15.02, -0.5, 0, 0.18, 1, 19.7],
        ].map(([x, y, z, w, h, d], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[w, h, d]} />
            <Material
              color={p.color}
              opacity={opacity}
              selected={selected}
              planes={planes}
            />
          </mesh>
        ))}
    </group>
  );
}
function Material({
  color,
  opacity,
  selected,
  planes,
}: {
  color: string;
  opacity: number;
  selected: boolean;
  planes: THREE.Plane[];
}) {
  return (
    <meshStandardMaterial
      key={opacity < 1 ? "transparent" : "opaque"}
      color={color}
      roughness={0.42}
      metalness={0.4}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={opacity > 0.55}
      emissive={selected ? "#d57d26" : "#000000"}
      emissiveIntensity={selected ? 0.2 : 0}
      clippingPlanes={planes}
      side={THREE.DoubleSide}
      forceSinglePass
    />
  );
}
function Repeats({
  kind,
  planes,
  parent,
  state,
  onSelect,
  onFocus,
}: {
  kind: "blade" | "passive";
  planes: THREE.Plane[];
  parent?: string;
  state?: State;
  onSelect?: (id: string) => void;
  onFocus?: (id: string) => void;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = kind === "blade" ? 22 : 18;
  useEffect(() => {
    if (!ref.current) return;
    const d = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      if (kind === "blade") {
        const a = (i / count) * Math.PI * 2;
        d.position.set(Math.cos(a) * 1.3, 0.33, Math.sin(a) * 1.3);
        d.rotation.set(0, -a + 0.7, 0);
        d.scale.set(1.05, 0.06, 0.18);
        if (state && !visible(`${parent}-blade-${i}`, state))
          d.scale.set(0, 0, 0);
      } else {
        d.position.set(
          (i % 6) * 0.27 - 0.67,
          0.15,
          Math.floor(i / 6) * 0.28 - 0.28,
        );
        d.scale.set(0.14, 0.09, 0.12);
      }
      d.updateMatrix();
      ref.current.setMatrixAt(i, d.matrix);
      ref.current.setColorAt(
        i,
        new THREE.Color(
          state?.selected === `${parent}-blade-${i}`
            ? "#dc9a53"
            : kind === "blade"
              ? "#77828b"
              : "#b6a379",
        ),
      );
    }
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [kind, count, state?.selected, state?.hidden, state?.isolated, parent]);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, count]}
      onClick={(e) => {
        if (parent && e.instanceId !== undefined) {
          e.stopPropagation();
          onSelect?.(`${parent}-blade-${e.instanceId}`);
        }
      }}
      onDoubleClick={(e) => {
        if (parent && e.instanceId !== undefined) {
          e.stopPropagation();
          onFocus?.(`${parent}-blade-${e.instanceId}`);
        }
      }}
    >
      <boxGeometry />
      <meshStandardMaterial
        color={kind === "blade" ? "#77828b" : "#b6a379"}
        clippingPlanes={planes}
      />
    </instancedMesh>
  );
}
const motionSpeed =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 100
    : 9;
export function PartMesh({
  p,
  state,
  planes,
  onSelect,
  onFocus,
  quality,
}: {
  p: Part;
  state: State;
  planes: THREE.Plane[];
  onSelect: (id: string) => void;
  onFocus: (id: string) => void;
  quality: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector3());
  const [hover, setHover] = useState(false);
  const isLid = ["lid", "panel", "camera", "ambient-light"].includes(p.id);
  const selected =
    state.selected !== "machine" && descendants(state.selected).includes(p.id);
  const opacity =
    external.includes(p.id) ||
    p.id === "ambient-light" ||
    p.parent === "keyboard" ||
    p.parent === "lower"
      ? 1 - state.xray * 0.94
      : 1;
  useFrame((_, dt) => {
    if (!ref.current) return;
    let [x, y, z] = p.position;
    y += state.explode * layer(p);
    if (isLid) {
      const a = (state.lid * Math.PI) / 180;
      const rel = z + 10.2;
      y =
        1 +
        Math.sin(a) * rel +
        (p.position[1] - 1) * Math.cos(a) +
        state.explode * 9;
      z = -10.2 + Math.cos(a) * rel;
      ref.current.rotation.x = THREE.MathUtils.damp(
        ref.current.rotation.x,
        -a,
        motionSpeed,
        dt,
      );
    }
    ref.current.position.lerp(
      target.current.set(x, y, z),
      1 - Math.exp(-motionSpeed * dt),
    );
  });
  const bladeIsolated =
    p.shape === "fan" && state.isolated?.startsWith(p.id + "-blade-");
  if (!visible(p.id, state) && !bladeIsolated) return null;
  const event = (e: ThreeEvent<MouseEvent>) => {
    if (
      opacity < 0.2 ||
      planes.some((plane) => plane.distanceToPoint(e.point) < 0)
    )
      return;
    e.stopPropagation();
    onSelect(p.id);
  };
  return (
    <group
      ref={ref}
      position={p.position}
      onClick={event}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onFocus(p.id);
      }}
      onPointerOver={(e) => {
        if (opacity < 0.2) return;
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      {["lid", "upper", "lower", "trackpad", "panel"].includes(p.id) ? (
        <Plate
          p={p}
          opacity={opacity}
          selected={selected || hover}
          planes={planes}
        />
      ) : p.shape === "fan" ? (
        <>
          {!bladeIsolated && (
            <>
              <Detailed distances={[0, 40, 80]}>
                {[40, 24, 12].map((segments) => (
                  <mesh key={segments}>
                    <cylinderGeometry
                      args={[
                        2.35,
                        2.35,
                        0.5,
                        quality === "Low" ? 12 : segments,
                      ]}
                    />
                    <Material
                      color={p.color}
                      opacity={1}
                      selected={selected || hover}
                      planes={planes}
                    />
                  </mesh>
                ))}
              </Detailed>
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.56, 16, 8]} />
                <meshStandardMaterial color="#252c31" clippingPlanes={planes} />
              </mesh>
            </>
          )}
          <Repeats
            kind="blade"
            planes={planes}
            parent={p.id}
            state={state}
            onSelect={onSelect}
            onFocus={onFocus}
          />
        </>
      ) : (
        <RoundedBox
          args={p.size}
          radius={Math.min(0.23, ...p.size.map((s) => s * 0.22))}
          smoothness={quality === "Low" ? 1 : 2}
        >
          <Material
            color={p.color}
            opacity={opacity}
            selected={selected || hover}
            planes={planes}
          />
        </RoundedBox>
      )}
      {p.id === "passives" && quality !== "Low" && (
        <Repeats kind="passive" planes={planes} />
      )}
      {p.id.startsWith("battery-") && (
        <mesh position={[0, 0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[p.size[0] - 0.3, p.size[2] - 0.4]} />
          <meshStandardMaterial
            color="#292e33"
            roughness={0.9}
            clippingPlanes={planes}
          />
        </mesh>
      )}
      {hover && opacity > 0.2 && (
        <Html center position={[0, 1, 0]} style={{ pointerEvents: "none" }}>
          <div className="mesh-label">{p.name}</div>
        </Html>
      )}
    </group>
  );
}
function Paths({
  mode,
  explode,
  state,
  planes,
}: {
  mode: Mode;
  explode: number;
  state: State;
  planes: THREE.Plane[];
}) {
  const color =
    mode === "Thermal" ? "#e7964c" : mode === "Power" ? "#b1cb5b" : "#81b6da";
  return (
    <group>
      {overlays[mode].paths.map((ids, i) => {
        if (!ids.every((id) => visible(id, state))) return null;
        const pathColor = mode === "Thermal" && i >= 2 ? "#71a8be" : color;
        const pts = ids.map((id) => {
          const p = byId[id];
          return [p.position[0], 1.1 + explode * layer(p), p.position[2]] as [
            number,
            number,
            number,
          ];
        });
        return (
          <group key={i}>
            <Line
              points={pts}
              clippingPlanes={planes}
              color={pathColor}
              lineWidth={2.5}
              dashed
              dashScale={2}
              dashSize={0.5}
              gapSize={0.25}
            />
            {pts.slice(1).map((p, j) => {
              const start = new THREE.Vector3(...pts[j]);
              const end = new THREE.Vector3(...p);
              const dir = end.clone().sub(start).normalize();
              const q = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                dir,
              );
              return (
                <mesh
                  key={j}
                  position={end.clone().addScaledVector(dir, -0.325)}
                  quaternion={q}
                >
                  <coneGeometry args={[0.2, 0.65, 8]} />
                  <meshBasicMaterial
                    color={pathColor}
                    clippingPlanes={planes}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}
function World({
  state,
  clip,
  quality,
  onSelect,
  onFocus,
  focusToken,
  focusId,
  resetToken,
  onMetrics,
}: {
  state: State;
  clip: number;
  quality: string;
  onSelect: (id: string) => void;
  onFocus: (id: string) => void;
  focusToken: number;
  focusId: string;
  resetToken: number;
  onMetrics: (m: Metrics) => void;
}) {
  const controls = useRef<CameraControls>(null);
  const { gl, size } = useThree();
  const t = useRef({ elapsed: 0, frames: 0 });
  const planes = useMemo(
    () =>
      clip > 0
        ? [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 15.5 - clip * 31)]
        : [],
    [clip],
  );
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);
  useEffect(() => {
    const p = byId[focusId];
    if (!p || !controls.current) return;
    const d = Math.max(...p.size) * 1.7 + 4;
    let [x, y, z] = p.position;
    y += state.explode * layer(p);
    if (["lid", "panel", "camera", "ambient-light"].includes(p.id)) {
      const a = (state.lid * Math.PI) / 180;
      y = 1 + Math.sin(a) * (z + 10.2) + state.explode * 9;
      z = -10.2 + Math.cos(a) * (z + 10.2);
    }
    void controls.current.setLookAt(
      x + d * 0.55,
      y + d * 0.8,
      z + d,
      x,
      y,
      z,
      true,
    );
  }, [focusToken]);
  useEffect(() => {
    const scale = size.width < 500 ? 1.9 : 1;
    void controls.current?.setLookAt(
      36 * scale,
      32 * scale,
      41 * scale,
      0,
      0,
      0,
      true,
    );
  }, [resetToken, size.width]);
  useFrame(({ camera, scene }, dt) => {
    gl.domElement.dataset.camera = camera.position
      .toArray()
      .map((v) => v.toFixed(2))
      .join(",");
    const upper = scene.getObjectByName("upper") as THREE.Mesh | undefined;
    if (upper) {
      const material = upper.material as THREE.MeshStandardMaterial;
      gl.domElement.dataset.upperOpacity = String(material.opacity);
      gl.domElement.dataset.upperTransparent = String(material.transparent);
    }
    t.current.elapsed += dt;
    t.current.frames++;
    if (t.current.elapsed > 1.5) {
      onMetrics({
        fps: Math.round(t.current.frames / t.current.elapsed),
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        renderer: gl.getContext().getParameter(gl.getContext().RENDERER),
      });
      t.current = { elapsed: 0, frames: 0 };
    }
  });
  return (
    <>
      <color attach="background" args={["#edece8"]} />
      <ambientLight intensity={1.5} />
      <hemisphereLight args={["#ffffff", "#a6a197", 2]} />
      <directionalLight position={[10, 30, 15]} intensity={3} />
      <directionalLight
        position={[-20, 8, -10]}
        intensity={2}
        color="#c5d2e0"
      />
      <CameraControls
        ref={controls}
        minDistance={2}
        maxDistance={110}
        minPolarAngle={0.04}
        maxPolarAngle={Math.PI - 0.04}
        smoothTime={0.22}
      />
      <gridHelper
        args={[150, 50, "#dadbd3", "#e4e5dd"]}
        position={[0, -8.8, 0]}
      />
      {renderParts
        .filter((p) => !isInternal(p) && p.shape !== "key")
        .map((p) => (
          <PartMesh
            key={p.id}
            p={p}
            state={state}
            planes={planes}
            onSelect={onSelect}
            onFocus={onFocus}
            quality={quality}
          />
        ))}
      <Keys
        state={state}
        planes={planes}
        onSelect={onSelect}
        onFocus={onFocus}
      />
      {(state.xray > 0 ||
        state.explode > 0 ||
        state.hidden.length > 0 ||
        state.isolated !== null ||
        state.lid > 5) && (
        <Suspense fallback={null}>
          <InternalAssembly
            state={state}
            planes={planes}
            onSelect={onSelect}
            onFocus={onFocus}
            quality={quality}
          />
        </Suspense>
      )}
      <Paths
        mode={state.mode}
        explode={state.explode}
        state={state}
        planes={planes}
      />
    </>
  );
}
const initialCamera = {
  position: [36, 32, 41] as [number, number, number],
  fov: 38,
  near: 0.05,
  far: 400,
};
export default function Scene(props: Parameters<typeof World>[0]) {
  return (
    <Canvas
      camera={initialCamera}
      dpr={
        props.quality === "Low"
          ? 0.75
          : props.quality === "High"
            ? [1, 2]
            : [1, 1.5]
      }
      gl={{
        antialias: props.quality !== "Low",
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.domElement.setAttribute(
          "aria-label",
          "Interactive 3D MacBook model",
        );
      }}
    >
      <Suspense fallback={null}>
        <World {...props} />
      </Suspense>
    </Canvas>
  );
}
