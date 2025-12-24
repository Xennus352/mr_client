'use client'
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from 'three';

export  function VideoPlane({ ws }) {
  const { scene, gl } = useThree();

  useEffect(() => {
    if (!ws) return;
    const loader = new THREE.TextureLoader();
    gl.toneMapping = THREE.NoToneMapping;

    const handleMessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        // FIX: Match Python server key "data"
        if (msg.type === "frame" && msg.data) {
          loader.load("data:image/jpeg;base64," + msg.data, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            
            // Auto-crop to fit screen (Cover mode)
            const imgA = tex.image.width / tex.image.height;
            const scrA = window.innerWidth / window.innerHeight;
            tex.matrixAutoUpdate = false;
            if (imgA > scrA) tex.matrix.setUvTransform(0, 0, scrA / imgA, 1, 0, 0.5, 0.5);
            else tex.matrix.setUvTransform(0, 0, 1, imgA / scrA, 0, 0.5, 0.5);

            if (scene.background) scene.background.dispose();
            scene.background = tex;
          });
        }
      } catch (err) {}
    };

    ws.addEventListener("message", handleMessage);
    return () => ws.removeEventListener("message", handleMessage);
  }, [ws, scene, gl]);

  return null;
}