import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

import Model from "../Model";

export default function App() {
  const cameraRef = useRef();
  const controlsRef = useRef(); // Nuevo ref para los controles
  const gltb = useGLTF("utils/Barn_Testing/Barn_Testing.glb");
  const [wallSelected, setWallSelected] = useState(null);
  const [autoRotation, setAutoRotation] = useState(true);

  const handleSelectChange = (event) => {
    setWallSelected(event.target.value);
  };

  const moveToSelectedMesh = (selectedMeshUuid) => {
    if (selectedMeshUuid) {
      const selectedMesh = gltb.scene.getObjectByProperty(
        "uuid",
        selectedMeshUuid
      );
      if (selectedMesh && controlsRef.current) {
        const controls = controlsRef.current;
        const position = new THREE.Vector3();
        selectedMesh.getWorldPosition(position);
        controls.target.copy(position);
        controls.update();
      }
    }
  };

  useEffect(() => {
    if (wallSelected) {
      moveToSelectedMesh(wallSelected);
    }
  }, [wallSelected]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          paddingBottom: "1em",
        }}
      >
        <select value={wallSelected} onChange={handleSelectChange}>
          <option value="">Select a wall</option>
          {Object.values(gltb.nodes)
            .filter((node) => node.name.includes("Wall"))
            .map(
              (node) =>
                !node.isGroup && (
                  <option key={node.uuid} value={node.uuid}>
                    {node.name}
                  </option>
                )
            )}
        </select>
        <select value={wallSelected} onChange={handleSelectChange}>
          <option value="">Select another mesh</option>
          {Object.values(gltb.nodes)
            .filter((node) => !node.name.includes("Wall"))
            .map(
              (node) =>
                !node.isGroup && (
                  <option key={node.uuid} value={node.uuid}>
                    {node.name}
                  </option>
                )
            )}
        </select>
        <label>
          Autorotation
          <input
            type="checkbox"
            checked={autoRotation}
            onChange={() => {
              setAutoRotation(!autoRotation);
            }}
          />
        </label>
      </div>
      <Canvas>
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          target={[0, 0, 0]}
          minDistance={300}
          autoRotate={autoRotation}
        />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />

        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          fov={75}
          position={[0, 0, 50]}
        />
        <Model
          gltb={gltb}
          wallSelected={wallSelected}
          setWallSelected={setWallSelected}
        />
        <Environment preset="sunset" background />
      </Canvas>
    </>
  );
}

useGLTF.preload("utils/Barn_Testing/Barn_Testing.glb");
