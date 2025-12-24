"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { connectWS } from "../utils/socket";

export default function ARScene() {
  const mountRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // -------------------------------
    // Video background
    // -------------------------------
    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
    });
    const videoTexture = new THREE.VideoTexture(video);
    scene.background = videoTexture;

    // -------------------------------
    // Cubes for markers 42–45
    // -------------------------------
    const cubes = {};
    [42, 43, 44, 45].forEach((id) => {
      const geo = new THREE.BoxGeometry();
      const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geo, mat);
      cube.visible = false; // hidden until marker detected
      scene.add(cube);
      cubes[id] = cube;
    });

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 5, 5);
    scene.add(light);

    // -------------------------------
    // WebSocket
    // -------------------------------
    const socket = connectWS();
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "marker") {
        const cube = cubes[data.id];
        if (cube) {
          cube.visible = true;
          // Optional: compute cube.position from marker corners
          cube.position.set(0, 0, -5);
        }
      }

      if (data.type === "gesture") {
        Object.values(cubes).forEach((cube) => {
          if (cube.visible) {
            switch (data.name) {
              case "select":
                cube.material.color.set(0xff0000);
                break;
              case "rotate":
                cube.rotation.y += 0.05;
                break;
              case "resize":
                cube.scale.set(1.2, 1.2, 1.2);
                break;
            }
          }
        });
      }
    };

    camera.position.z = 5;

    // Animate loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }}></div>;
}
