"use client";
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { TableRoot } from "@/components/mr/TableRoot";
import { HandMarkers } from "@/components/mr/HandMarkers";
import { UIPanel } from "@/components/os/UIPanel";
import { VideoPlane } from "@/components/view/VideoPlane";

export default function App() {
  const [socket, setSocket] = useState(null);
  const [markerPoints, setMarkerPoints] = useState({});
  const [handTips, setHandTips] = useState(null);
  const [panelPos, setPanelPos] = useState(new THREE.Vector3(0, 0, 0));

  // Ref to prevent multiple logs in one click
  const isClicking = useRef(false);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8765");
    setSocket(ws);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "marker_lines") setMarkerPoints(msg.points);
      if (msg.type === "hand_tips") setHandTips(msg.tips);
    };
    return () => ws.close();
  }, []);

  // --- IMPROVED CLICK DETECTION ---
  useEffect(() => {
    if (!handTips?.index || !panelPos) return;

    // Use specific multipliers to match standard 720p/1080p aspect ratios
    const finger = new THREE.Vector3(
      handTips.index[0] * 2.4,
      handTips.index[1] * 1.8,
      0
    );

    const distance = finger.distanceTo(panelPos);

    if (distance < 0.15) {
      if (!isClicking.current) {
        console.log("🎯 SINGLE CLICK DETECTED");
        prompt("Enter your name");
        isClicking.current = true; // Lock the click
      }
    } else {
      isClicking.current = false; // Reset when finger pulls away
    }
  }, [handTips, panelPos]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas
        flat // Disables automatic tone mapping for better camera matching
        camera={{ position: [0, 0, 1.6], fov: 65 }}
      >
        <ambientLight intensity={1.5} />
        {socket && <VideoPlane ws={socket} />}
        {handTips && <HandMarkers tips={handTips} />}

        {Object.keys(markerPoints).length > 0 && (
          <TableRoot
            pointsMap={markerPoints}
            onCenterUpdate={(pos) => setPanelPos(pos)}
          >
            {/* The UI Panel - rotation 0 makes it face the camera */}
            <UIPanel position={[0, 0, 0]} />
          </TableRoot>
        )}
      </Canvas>
    </div>
  );
}
