import { useRef, useLayoutEffect, useMemo, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { parts, descendants } from "./manifest";
import { visible, type State } from "./state";
export default function Keys({
  state,
  planes,
  onSelect,
  onFocus,
}: {
  state: State;
  planes: THREE.Plane[];
  onSelect: (id: string) => void;
  onFocus: (id: string) => void;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const keys = useMemo(
    () => parts.filter((p) => p.shape === "key" && visible(p.id, state)),
    [state.hidden, state.isolated],
  );
  useLayoutEffect(() => {
    if (!ref.current) return;
    const d = new THREE.Object3D();
    const selected = new Set(
      state.selected === "machine" ? [] : descendants(state.selected),
    );
    keys.forEach((p, i) => {
      d.position.set(...p.position);
      d.scale.set(...p.size);
      d.updateMatrix();
      ref.current!.setMatrixAt(i, d.matrix);
      ref.current!.setColorAt(
        i,
        new THREE.Color(
          selected.has(p.id) || hover === i ? "#b58755" : p.color,
        ),
      );
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [keys, state.selected, hover]);
  useFrame((_, dt) => {
    if (group.current)
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        state.explode * 5,
        9,
        dt,
      );
  });
  const click = (e: ThreeEvent<MouseEvent>, focus = false) => {
    if (
      state.xray > 0.85 ||
      e.instanceId === undefined ||
      planes.some((p) => p.distanceToPoint(e.point) < 0)
    )
      return;
    e.stopPropagation();
    (focus ? onFocus : onSelect)(keys[e.instanceId].id);
  };
  if (!keys.length) return null;
  return (
    <group ref={group}>
      <instancedMesh
        key={keys.length}
        ref={ref}
        args={[undefined, undefined, keys.length]}
        onPointerMove={(e) => {
          if (state.xray < 0.85 && e.instanceId !== undefined) {
            e.stopPropagation();
            setHover(e.instanceId);
          }
        }}
        onPointerOut={() => setHover(null)}
        onClick={(e) => click(e)}
        onDoubleClick={(e) => click(e, true)}
      >
        <boxGeometry />
        <meshStandardMaterial
          key={state.xray > 0 ? "transparent" : "opaque"}
          roughness={0.6}
          metalness={0.1}
          transparent={state.xray > 0}
          opacity={1 - state.xray * 0.94}
          depthWrite={state.xray < 0.5}
          clippingPlanes={planes}
        />
      </instancedMesh>
    </group>
  );
}
