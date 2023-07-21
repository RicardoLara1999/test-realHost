import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function Model({gltb,wallSelected,setWallSelected}) {
  const group = useRef();


  useEffect(() => {
    const boundingBox = new THREE.Box3().setFromObject(group.current);
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);
    const modelPosition = [-center.x, -center.y, -center.z];
    group.current.position.set(modelPosition[0], modelPosition[1], modelPosition[2]);

  }, []);

  // Función recursiva para renderizar los elementos de cada grupo
  const renderGroupChildren = (node) => {

    return Object.values(node.children).map((childNode, i) => {
      if (!childNode.isGroup) {
        const isSelected= wallSelected === childNode.uuid
        return (
          <mesh
            castShadow={true}
            receiveShadow={true}
            geometry={childNode.geometry}
            material={gltb.materials[childNode.material.name]}
            key={i}
            onClick={() => setWallSelected(childNode.uuid)}
          >
              <meshStandardMaterial color={isSelected ? "red" : childNode.material.color} />
          </mesh>
        );
      } else {
        // Si es un grupo, renderiza sus hijos de forma recursiva
        return renderGroupChildren(childNode);
      }
    });
  };

  return (
    <group ref={group} dispose={null} scale={0.5} position={[0, 0, 0]}>
      {renderGroupChildren(gltb.scene)}
    </group>
  );
}


