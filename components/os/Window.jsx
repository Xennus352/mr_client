"use client";
import { DoubleSide } from "three";

export function Window({ position = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.3, 0.2]} />
      <meshBasicMaterial color="white" side={DoubleSide} />
    </mesh>
  );
}
