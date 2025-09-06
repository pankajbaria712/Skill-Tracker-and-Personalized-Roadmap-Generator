import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// ---------- Data: Skills & Sub-skills ----------
const radius = 3;
const angleStep = (2 * Math.PI) / 6;

const coreSkill = {
  name: "Web Development",
  icon: "/icons/logo.png",
  position: [0, 0, 0],
  subSkills: [
    { name: "HTML", icon: "/icons/html.png" },
    { name: "CSS", icon: "/icons/css.png" },
    { name: "JavaScript", icon: "/icons/js.png" },
    { name: "React", icon: "/icons/react.png" },
    { name: "Git", icon: "/icons/git.png" },
    { name: "Node.js", icon: "/icons/node.png" },
  ],
};

// Calculate radial positions
const skills = [
  coreSkill,
  ...coreSkill.subSkills.map((skill, i) => {
    const angle = i * angleStep;
    return {
      ...skill,
      position: [radius * Math.cos(angle), radius * Math.sin(angle), 0],
      parent: coreSkill.position,
    };
  }),
];

// ---------- Components ----------
function SkillNode({ name, position, icon, onClick, isSub }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Floating animation
  useFrame(({ clock }) => {
    meshRef.current.position.y =
      position[1] + Math.sin(clock.elapsedTime + position[0]) * 0.2;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={hovered ? "#34d399" : "#3b82f6"} />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="flex items-center space-x-2 text-white text-sm bg-black px-2 py-1 rounded shadow">
            {icon && <img src={icon} alt={name} className="w-4 h-4" />}
            <span>{name}</span>
          </div>
        </Html>
      )}
    </mesh>
  );
}

function CurvedConnection({ start, end }) {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...start),
    new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 1.5,
      0
    ),
    new THREE.Vector3(...end)
  );
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" color="#bbb" />
    </line>
  );
}

// ---------- Main Graph ----------
export default function FloatingSkillGraph() {
  const [expanded, setExpanded] = useState(false);

  const handleCoreClick = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <Canvas className="w-full h-full">
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        {/* Core node */}
        <SkillNode
          name={coreSkill.name}
          position={coreSkill.position}
          icon={coreSkill.icon}
          onClick={handleCoreClick}
        />

        {/* Expanded sub-skills */}
        {expanded &&
          skills.slice(1).map((skill, i) => (
            <React.Fragment key={i}>
              <SkillNode
                name={skill.name}
                position={skill.position}
                icon={skill.icon}
                onClick={() => alert(`You clicked on ${skill.name}`)}
              />
              <CurvedConnection start={skill.parent} end={skill.position} />
            </React.Fragment>
          ))}
      </Canvas>
    </motion.div>
  );
}
