"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export function UIPanel({ position = [0, 0.5, -0.5] }) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      ctx.fillStyle = "rgba(30,30,30,0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "bold 60px Arial";
      ctx.fillText("Control Panel", 50, 100);

      // Draw a Button
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(50, 200, 300, 100);
      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.fillText("OPEN WINDOW", 70, 265);
    };

    draw();
    const tex = new THREE.CanvasTexture(canvas);
    setTexture(tex);
  }, []);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, 0, 0]} // Keep it 0,0,0 if it's inside TableRoot's group
    >
      <planeGeometry args={[0.8, 0.4]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
