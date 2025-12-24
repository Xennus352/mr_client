"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function HandMarkers({ tips }) {
  const thumbRef = useRef();
  const indexRef = useRef();

  useFrame(() => {
    // Multipliers (2.4, 1.8) must match your TableRoot alignment
    if (tips?.thumb && thumbRef.current) {
      thumbRef.current.position.lerp(
        new THREE.Vector3(tips.thumb[0] * 2.4, tips.thumb[1] * 1.8, 0.1),
        0.5 // Smoothing factor
      );
    }
    if (tips?.index && indexRef.current) {
      indexRef.current.position.lerp(
        new THREE.Vector3(tips.index[0] * 2.4, tips.index[1] * 1.8, 0.1),
        0.5
      );
    }
  });

  return (
    <group>
      <mesh ref={thumbRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="red"
          emissive="red"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={indexRef}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
