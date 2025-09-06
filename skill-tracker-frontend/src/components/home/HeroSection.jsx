import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import VariableProximity from "../TextAnimations/VariableProximity/VariableProximity";
import RotatingText from "../TextAnimations/RotatingText/RotatingText";
import { useTheme } from "../ThemeProvider";
import { getComponentTheme } from "../../utils/themeUtils";

// Refined lighting for a more modern look
function HeroLighting() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#e0f2fe" />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.8}
        color="#fce7f3"
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={0.7}
        color="#fff"
        decay={2}
        distance={20}
      />
    </>
  );
}

function Robot3D({ mousePosition }) {
  const gltf = useLoader(GLTFLoader, "/Graph Arrow 01.glb");
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const clonedScene = useMemo(() => {
    const scene = gltf.scene.clone(true);
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);
    return scene;
  }, [gltf]);

  useFrame((state) => {
    if (meshRef.current) {
      const targetY = mousePosition.x * 0.2;
      const targetX = mousePosition.y * 0.1;

      meshRef.current.rotation.y +=
        (targetY - meshRef.current.rotation.y) * 0.03;
      meshRef.current.rotation.x +=
        (targetX - meshRef.current.rotation.x) * 0.03;

      meshRef.current.position.y =
        -1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;

      const scale = hovered ? 1.1 : 1.0;
      meshRef.current.scale.setScalar(
        meshRef.current.scale.x + (scale - meshRef.current.scale.x) * 0.1
      );
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={clonedScene}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={[0.1, 0.1, 0.1]}
      position={[0, -1, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const headline = "Unlock Your";
  const { theme } = useTheme();

  // Get theme-specific colors
  const themeColors = getComponentTheme(theme, "hero");

  useEffect(() => {
    const handleMouseMove = ({ clientX, clientY }) => {
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      lang="en"
      data-scroll-section
      className={`relative min-h-screen flex flex-col items-center justify-center lg:flex-row overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 md:py-3 transition-all duration-500 ${themeColors.background}`}
    >
      {/* Background Gradient/Blob for visual interest */}
      {/* Blobs remain hidden on mobile and shown on large screens */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 hidden lg:block">
        <div
          className={`absolute top-[10%] left-[10%] w-64 h-64 ${themeColors.blobColors.primary} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob lg:w-96 lg:h-96 transition-all duration-500`}
        ></div>
        <div
          className={`absolute bottom-[20%] right-[10%] w-64 h-64 ${themeColors.blobColors.secondary} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 lg:w-96 lg:h-96 transition-all duration-500`}
        ></div>
        <div
          className={`absolute top-[40%] right-[20%] w-64 h-64 ${themeColors.blobColors.accent} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 lg:w-96 lg:h-96 transition-all duration-500`}
        ></div>
      </div>

      {/* Text Content */}
      <motion.div
        ref={containerRef}
        // Removed explicit mb for mobile, allowing flexbox to handle spacing naturally.
        // lg:mb-0 lg:mr-8 are for desktop, which you want to keep.
        className="relative z-10 w-full lg:w-[48%] max-w-3xl text-center lg:text-left mb-8 lg:mb-0 lg:mr-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl font-extrabold mb-6 md:mb-8 leading-tight flex flex-col sm:flex-row items-center justify-center lg:justify-start bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-xl" // Kept your desktop sizes
          variants={itemVariants}
        >
          <span className="mb-2 sm:mb-0 sm:mr-4">{headline}</span>
          <RotatingText
            texts={["Potential", "Future..."]}
            mainClassName="cursor-target px-4 py-2 bg-gradient-to-r from-yellow-300 to-cyan-400 text-blue-900 shadow-12xl rounded-xl pb-0 text-4xl sm:text-3xl md:text-4xl lg:text-5xl whitespace-nowrap" // Adjusted text size for better fit on mobile (without changing lg:text-6xl)
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.02}
            splitLevelClassName="overflow-hidden pb-1"
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            rotationInterval={2500}
          />
        </motion.h1>

        <motion.p
          className={`text-base sm:text-lg md:text-xl mb-8 md:mb-12 font-light px-2 lg:px-0 max-w-full leading-relaxed transition-colors duration-500 ${themeColors.textSecondary}`}
          variants={itemVariants}
        >
          <VariableProximity
            label={`Tired of scattered AI learning? Get a clear, personalized roadmap to your goals. Track progress, learn efficiently, and easily share your achievements.`}
            className="variable-proximity-demo cursor-pointer"
            fromFontVariationSettings="'wght' 300, 'opsz' 9"
            toFontVariationSettings="'wght' 900, 'opsz' 40"
            containerRef={containerRef}
            radius={150}
            falloff="ease-out"
          />
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mt-13"
          variants={itemVariants}
        >
          {/* Primary Button */}
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(109, 40, 217, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white shadow-lg hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 text-base md:text-lg transform hover:-translate-y-1 w-full sm:w-auto lg:px-8 lg:py-4 lg:text-xl ${themeColors.buttonPrimary}`}
            aria-label="Start Learning Now"
          >
            <span className="text-xl">🚀</span>
            Start Learning Now
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            whileHover={{ scale: 1.05, borderColor: "#6b7280" }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 text-base md:text-lg w-full sm:w-auto lg:px-8 lg:py-4 lg:text-xl ${themeColors.buttonSecondary}`}
            aria-label="Browse Templates"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Browse Templates
          </motion.button>
        </motion.div>

        {/* Features Row */}
        <motion.div
          className={`mt-6 flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-sm md:text-base font-medium transition-colors duration-500 ${themeColors.textSecondary}`}
          variants={itemVariants}
        >
          <div className="flex items-center gap-1 p-1 rounded-md">
            <span className="text-lg">⚡</span>
            AI Roadmap Generation
          </div>
          <div className="flex items-center gap-1 p-1 rounded-md">
            <span className="text-lg">🧠</span>
            AI Learning Assistant
          </div>
          <div className="flex items-center gap-1 p-1 rounded-md">
            <span className="text-lg">🎯</span>
            Progress Tracking
          </div>
        </motion.div>
      </motion.div>

      {/* 3D Robot Canvas - Hidden on mobile, shown on lg screens and above */}
      <div className="hidden lg:block relative z-10 w-full lg:w-[50%] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[700px] mt-12 lg:mt-0 flex items-center justify-center">
        <Canvas
          camera={{ position: [1, 1.5, 6], fov: 60 }}
          dpr={[1, 2]}
          shadows
          className="rounded-3xl !h-full !w-full"
        >
          <Suspense fallback={null}>
            <HeroLighting />
            <Robot3D mousePosition={mousePosition} />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll Down Indicator - Adjust position for mobile, keep desktop as is */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce lg:bottom-12">
        <svg
          width="28"
          height="28"
          fill="none"
          stroke={theme === "light" ? "#374151" : "white"}
          strokeWidth="2"
          className="animate-pulse transition-colors duration-500"
        >
          <path d="M12 5v14m0 0l-7-7m7 7l7-7" />
        </svg>
      </div>
    </section>
  );
}
