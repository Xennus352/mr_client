"use client";
import { useState, useEffect } from "react";
import { BootButton } from "@/components/mr/BootButton";
import { LinuxDesktop } from "./LinuxDesktop";
import * as THREE from "three";


export default function OSController({ position = [0, 0, 0], visible = true }) {
  const [systemState, setSystemState] = useState("POWER_OFF");
  const [progress, setProgress] = useState(0);
  const [bootStatus, setBootStatus] = useState("SYSTEM_READY");

  useEffect(() => {
    const handleRemoteTap = () => {
      if (systemState === "POWER_OFF") {
        startBootSequence();
      }
    };
    window.addEventListener("START_OS_BOOT", handleRemoteTap);
    return () => window.removeEventListener("START_OS_BOOT", handleRemoteTap);
  }, [systemState]);

  const startBootSequence = () => {
    setSystemState("BOOTING");
    const bootMessages = [
      "MOUNTING DRIVE...",
      "LOADING KERNEL...",
      "INIT_NETWORK...",
      "STARTING X-SERVER...",
      "DECRYPTING GUI...",
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setBootStatus("SUCCESS");
          setTimeout(() => setSystemState("LIVE"), 800);
          return 100;
        }
        const msgIndex = Math.floor((prev / 100) * bootMessages.length);
        setBootStatus(bootMessages[msgIndex]);
        return prev + Math.random() * 8;
      });
    }, 120);
  };

  return (
    <group position={position} visible={visible}>
      {systemState !== "LIVE" ? (
        <BootButton
          isBooting={systemState === "BOOTING"}
          progress={progress}
          statusText={bootStatus}
          onPress={startBootSequence}
        />
      ) : (
        // PASS THE VISIBLE PROP HERE
        <LinuxDesktop visible={visible} />
      )}
    </group>
  );
}
