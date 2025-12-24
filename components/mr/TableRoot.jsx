"use client";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

export function TableRoot({ pointsMap, onCenterUpdate, children }) {
  const lineRef = useRef();
  const groupRef = useRef();
  const geometry = useMemo(() => new THREE.BufferGeometry(), []);

  useFrame(() => {
    const order = [42, 43, 44, 45, 42];

    // FIX: Only process markers that are actually detected right now
    const visibleIds = order.filter((id) => pointsMap && pointsMap[id]);

    if (visibleIds.length >= 3) {
      lineRef.current.visible = true;
      groupRef.current.visible = true;

      // Scaling factors to map -1/1 space to Three.js world space
      const sx = 2.4;
      const sy = 1.8;

      const vertices = visibleIds
        .map((id) => [pointsMap[id][0] * sx, pointsMap[id][1] * sy, 0])
        .flat();

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      geometry.attributes.position.needsUpdate = true;

      // Calculate the center point for the UI Panel
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
      // FIX: Hide if markers are lost to prevent "ghost" UI
      if (lineRef.current) lineRef.current.visible = false;
      if (groupRef.current) groupRef.current.visible = false;
    }
  });

  return (
    <group>
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color="#00ff00" linewidth={4} />
      </line>
      <group ref={groupRef}>{children}</group>
    </group>
  );
}
