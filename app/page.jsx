"use client";
import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { TableRoot } from "@/components/mr/TableRoot";
import { HandMarkers } from "@/components/mr/HandMarkers";
import { VideoPlane } from "@/components/view/VideoPlane";
import OSController from "@/components/os/OSController";

export default function App() {
  const [socket, setSocket] = useState(null);
  const [markerPoints, setMarkerPoints] = useState({});
  const [handTips, setHandTips] = useState(null);
  const [panelPos, setPanelPos] = useState(null); // Initialize as null

  const isClicking = useRef(false);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8765");
    setSocket(ws);
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "marker_lines") {
        const points = msg.points || {};
        setMarkerPoints(points);

        // FIX: If Python sends 0 points, clear the panel position
        if (Object.keys(points).length === 0) {
          setPanelPos(null);
        }
      }
      if (msg.type === "hand_tips") setHandTips(msg.tips);
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    // FIX: If markers are gone (panelPos is null), stop the click logic
    if (!handTips?.index || !panelPos) return;

    const finger = new THREE.Vector3(
      handTips.index[0] * 2.15,
      handTips.index[1] * 1.62,
      0
    );

    const distance = finger.distanceTo(panelPos);

    if (distance < 0.15) {
      if (!isClicking.current) {
        isClicking.current = true;
        console.log("🚀 BOOT BUTTON PRESSED");
        window.dispatchEvent(new CustomEvent("START_OS_BOOT"));
      }
    } else {
      isClicking.current = false;
    }
  }, [handTips, panelPos]);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas flat camera={{ position: [0, 0, 1.6], fov: 60 }}>
        <ambientLight intensity={1.5} />
        {socket && <VideoPlane ws={socket} />}
        {handTips && <HandMarkers tips={handTips} />}

        {/* CRITICAL FIX: 
            Check for >= 3 markers. If less, the entire 3D group is removed. 
        */}

        <TableRoot
          pointsMap={markerPoints}
          onCenterUpdate={(pos) => setPanelPos(pos)}
        >
          <OSController
            position={[0, 0, 0]}
            visible={Object.keys(markerPoints).length >= 3}
          />
        </TableRoot>
      </Canvas>
    </div>
  );
}
