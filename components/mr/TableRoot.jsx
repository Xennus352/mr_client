"use client";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export function TableRoot({ pointsMap, onCenterUpdate, children }) {
  const lineRef = useRef(); // Still needed for the mesh now
  const groupRef = useRef();
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);

  useFrame(() => {
    // --- 1. CRITICAL SAFETY CHECK ---
    // If refs aren't ready or attached to anything, exit the frame immediately
    if (!lineRef.current || !groupRef.current) return;

    const order = [42, 43, 44, 45, 42];

    // Check if we have the pointsMap data
    if (!pointsMap || Object.keys(pointsMap).length === 0) {
      lineRef.current.visible = false;
      groupRef.current.visible = false;
      // Optional: keep the state but hide visuals
      return;
    }

    const visibleIds = order.filter((id) => pointsMap[id]);

    if (visibleIds.length >= 3) {
      // Show everything
      lineRef.current.visible = true;
      groupRef.current.visible = true;

      const sx = 2.15;
      const sy = 1.62;

      const vertices = visibleIds
        .map((id) => [pointsMap[id][0] * sx, pointsMap[id][1] * sy, 0])
        .flat();

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.attributes.position.needsUpdate = true;

      let avgX = 0,
        avgY = 0;
      visibleIds.forEach((id) => {
        avgX += pointsMap[id][0] * sx;
        avgY += pointsMap[id][1] * sy;
      });

      const newPos = new THREE.Vector3(
        avgX / visibleIds.length,
        avgY / visibleIds.length,
        0
      );

      groupRef.current.position.copy(newPos);

      if (onCenterUpdate) onCenterUpdate(newPos);
    } else {
      // Hide visuals, but don't reset state
      lineRef.current.visible = false;
      groupRef.current.visible = false;
    }
  });

  return (
    <group>
      {/* ATTACH THE REF TO THE MESH SO IT DOESN'T ERROR */}
      <mesh
        ref={lineRef}
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.4, 0]}
      >
        <meshBasicMaterial
          color="#00f2ff"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* This group contains your OSController/LinuxDesktop */}
      <group ref={groupRef}>{children}</group>
    </group>
  );
}
