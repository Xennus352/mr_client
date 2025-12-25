"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export function UIPanel({
  position = [0, 0, 0],
  activeBtn = null,
  bgColor = "rgba(30,30,30,0.8)",
}) {
  const meshRef = useRef();
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      // 1. Dynamic Background Color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.font = "bold 60px Arial";
      ctx.fillText("Control Panel", 50, 100);

      // --- Left Button (Green highlight) ---
      ctx.fillStyle = activeBtn === "left" ? "#22c55e" : "#3b82f6";
      ctx.fillRect(50, 200, 400, 100);
      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.fillText("SET GREEN BG", 80, 265);

      // --- Right Button (Red highlight) ---
      ctx.fillStyle = activeBtn === "right" ? "#ef4444" : "#3b82f6";
      ctx.fillRect(500, 200, 400, 100);
      ctx.fillStyle = "white";
      ctx.font = "40px Arial";
      ctx.fillText("SET RED BG", 550, 265);
    };

    draw();
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true; // Ensure Three.js sees the canvas change
    setTexture(tex);
  }, [activeBtn, bgColor]); // Redraw when button is hovered OR background color changes

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.8, 0.4]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
