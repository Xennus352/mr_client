"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export function BootButton({ isBooting, progress, onPress }) {
  const canvasRef = useRef(document.createElement("canvas"));
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Animation Loop for the "Glow"
    const draw = () => {
      ctx.fillStyle = "#0a0a0a"; // Deep black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyberpunk Border
      ctx.strokeStyle = "#00f2ff";
      ctx.lineWidth = 8;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      if (!isBooting) {
        ctx.fillStyle = "#00f2ff";
        ctx.font = "bold 40px monospace";
        ctx.fillText("> INITIALIZE OS", 80, 145);
      } else {
        // Booting Text
        ctx.fillStyle = "#00f2ff";
        ctx.font = "20px monospace";
        ctx.fillText(`MOUNTING DRIVE... ${Math.round(progress)}%`, 50, 80);
        
        // Progress Bar Background
        ctx.fillStyle = "#222";
        ctx.fillRect(50, 120, 412, 40);
        
        // Animated Filling Bar
        ctx.fillStyle = "#00f2ff";
        ctx.fillRect(50, 120, (progress / 100) * 412, 40);
      }

      const newTexture = new THREE.CanvasTexture(canvas);
      setTexture(newTexture);
    };

    draw();
  }, [isBooting, progress]);

  return (
    <mesh onClick={onPress} castShadow>
      <boxGeometry args={[1, 0.5, 0.1]} />
      <meshStandardMaterial 
        map={texture} 
        emissive={"#00f2ff"} 
        emissiveIntensity={isBooting ? 2 : 0.5} 
      />
    </mesh>
  );
}