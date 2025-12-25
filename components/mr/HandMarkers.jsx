"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function HandMarkers({ tips }) {
  const thumbRef = useRef();
  const indexRef = useRef();

  // Multipliers for your 24x24 table calibration
  const sx = 2.15;
  const sy = 1.62;

  useFrame(() => {
    // --- INDEX FINGER LOGIC ---
    if (tips?.index && indexRef.current) {
      indexRef.current.visible = true;
      indexRef.current.position.lerp(
        new THREE.Vector3(tips.index[0] * sx, tips.index[1] * sy, 0.1),
        0.5 // Smoothing factor
      );
    } else if (indexRef.current) {
      // HIDE if data is missing
      indexRef.current.visible = false;
    }

    // --- THUMB LOGIC ---
    if (tips?.thumb && thumbRef.current) {
      thumbRef.current.visible = true;
      thumbRef.current.position.lerp(
        new THREE.Vector3(tips.thumb[0] * sx, tips.thumb[1] * sy, 0.1),
        0.5
      );
    } else if (thumbRef.current) {
      // HIDE if data is missing
      thumbRef.current.visible = false;
    }
  });

  return (
    <group>
      {/* Index Finger Dot */}
      <mesh ref={indexRef} visible={false}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Thumb Dot */}
      <mesh ref={thumbRef} visible={false}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="red"
          emissive="red"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
