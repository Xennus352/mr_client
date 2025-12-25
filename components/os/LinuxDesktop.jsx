"use client";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export function LinuxDesktop({ position = [0, 0, 0.05], visible = true }) {
  return (
    <group position={position} visible={visible}>
      {/* PREMIUM GLASS BACKPLATE 
          Note: We use MeshPhysicalMaterial for the "Vision Pro" look.
          MeshBasicMaterial will CRASH if you give it 'transmission'.
      */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.7, 1.0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.05}
          transmission={0.9} // Glass transparency
          thickness={0.1} // Glass depth
          transparent={true}
          opacity={0.5} // Base opacity
          reflectivity={1}
          clearcoat={1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* SUBTLE GLOSS RIM (The premium border) */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.72, 1.02]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Html
        transform
        distanceFactor={0.5}
        position={[0, 0, 0.01]}
        style={{
          width: "1280px",
          height: "720px",
          display: visible ? "block" : "none",
          borderRadius: "30px", // Rounded corners for premium feel
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,0,0,0.4)", // Floating shadow
          border: "1px solid rgba(255,255,255,0.3)", // Glass edge
        }}
      >
        <iframe
          src="http://127.0.0.1:6080/vnc.html?autoconnect=true&resize=scale&quality=9&compression=6&reconnect=true"
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </Html>
    </group>
  );
}
