
import React, { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Utensils, TrendingUp, Users, ChevronRight, ArrowRight, Zap, Shield, Play, Box, Activity } from 'lucide-react';
import { Link } from "react-router-dom";

// --- MOCK AUTH ---
const useAuth = () => ({ owner: { username: 'demo' }, loading: false });

// --- 3D & MOTION IMPORTS ---
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Float, 
  Environment, 
  ContactShadows, 
  SoftShadows,
  Html,
  PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// UI COMPONENTS
// ==========================================

const GradientText = ({ children, className }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ${className}`}>
    {children}
  </span>
);

const MagneticButton = ({ children, className, onClick, variant = "primary" }) => {
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(currentTarget, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  };

  const baseStyles = "relative z-10 px-8 py-3 rounded-xl font-bold transition-all duration-300 border border-transparent";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20",
    secondary: "bg-white border border-slate-200 text-blue-600 hover:border-blue-500 hover:bg-blue-50",
    dark: "bg-slate-900 text-white hover:bg-slate-800"
  };

  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// ==========================================
// 3D SCENE: ULTRA PREMIUM STEAK DISH
// ==========================================

const PremiumDishDisplay = () => {
  const groupRef = useRef();
  const { viewport } = useThree();

  // --- LAYER REFS (For Exploded View) ---
  const plateRef = useRef();
  const steakRef = useRef();
  const potatoesRefs = useRef([]);
  const asparagusRefs = useRef([]);
  const saucePoolRef = useRef();
  const garnishRefs = useRef([]);
  const butterRef = useRef();

  // Initialize refs arrays
  useEffect(() => {
    potatoesRefs.current = potatoesRefs.current.slice(0, 5);
    asparagusRefs.current = asparagusRefs.current.slice(0, 7);
    garnishRefs.current = garnishRefs.current.slice(0, 12);
  }, []);

  // --- HIGH-DETAIL MATERIALS ---
  
  // Ultra White Porcelain Plate with Gold Rim
  const plateMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#fefefe',
    roughness: 0.05,
    metalness: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0
  }), []);

  const goldRimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d4af37',
    roughness: 0.2,
    metalness: 0.9,
    emissive: '#d4af37',
    emissiveIntensity: 0.1
  }), []);
  
  // Perfectly Seared Steak
  const steakMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#6b3410',
    roughness: 0.4,
    metalness: 0.05,
    map: null
  }), []);

  const steakCrustMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3d1f0a',
    roughness: 0.6,
    metalness: 0.0
  }), []);

  // Creamy Mashed Potatoes
  const potatoMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#fef3c7',
    roughness: 0.7,
    metalness: 0.0
  }), []);

  // Fresh Green Asparagus
  const asparagusMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#16a34a',
    roughness: 0.5,
    metalness: 0.05
  }), []);

  const asparagusTipMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#14532d',
    roughness: 0.6,
    metalness: 0.0
  }), []);

  // Rich Red Wine Sauce
  const sauceMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#7c2d12',
    roughness: 0.1,
    metalness: 0.3,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.95
  }), []);

  // Fresh Herb Garnish
  const herbMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#22c55e',
    roughness: 0.7,
    metalness: 0.0
  }), []);

  // Melting Butter
  const butterMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#fef08a',
    roughness: 0.15,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.9
  }), []);

  // --- ANIMATION LOOP ---
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.05;
      groupRef.current.rotation.y = t * 0.06;
    }
    
    // Gentle herb sway
    garnishRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.rotation.z = Math.sin(t * 2 + i) * 0.05;
      }
    });

    // Butter shimmer
    if (butterRef.current) {
      butterRef.current.rotation.y = t * 0.3;
    }
  });

  // --- GSAP ANIMATION (Exploded View) ---
  useEffect(() => {
    const featuresSection = document.getElementById("features-section");
    if (!featuresSection) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: featuresSection,
        start: "top center",
        end: "bottom center",
        scrub: 1.5
      }
    });

    // Explode components
    if(butterRef.current) tl.to(butterRef.current.position, { y: 1.8, x: 0.3 }, "explode");
    garnishRefs.current.forEach((ref, i) => {
      if (ref) tl.to(ref.position, { y: 1.5 + i * 0.1, x: Math.cos(i) * 0.5, z: Math.sin(i) * 0.5 }, "explode");
    });
    asparagusRefs.current.forEach((ref, i) => {
      if (ref) tl.to(ref.position, { y: 1.0 + i * 0.05, x: ref.position.x * 1.3 }, "explode");
    });
    potatoesRefs.current.forEach((ref, i) => {
      if (ref) tl.to(ref.position, { y: 0.8 + i * 0.05, x: ref.position.x * 1.2 }, "explode");
    });
    if(steakRef.current) tl.to(steakRef.current.position, { y: 0.5 }, "explode");
    if(saucePoolRef.current) tl.to(saucePoolRef.current.position, { y: 0.15 }, "explode");

  }, []);

  const scale = viewport.width > 5 ? 1.3 : 1.0;

  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={groupRef} scale={scale} position={[1.5, -0.5, 0]}>
        
        {/* --- ULTRA DETAILED PLATE (High Poly) --- */}
        <mesh ref={plateRef} position={[0, -0.6, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.3, 2.1, 0.18, 128]} />
          <meshPhysicalMaterial {...plateMat} />
        </mesh>

        {/* Gold Rim Detail */}
        <mesh position={[0, -0.52, 0]} rotation={[0, 0, 0]} castShadow>
          <torusGeometry args={[2.15, 0.04, 32, 128]} />
          <meshStandardMaterial {...goldRimMat} />
        </mesh>

        {/* Inner Plate Design */}
        <mesh position={[0, -0.51, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[1.8, 0.015, 16, 128]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.1} />
        </mesh>

        {/* --- RED WINE SAUCE POOL (High Detail) --- */}
        <mesh ref={saucePoolRef} position={[0, -0.43, 0]} rotation={[0, 0, 0]} receiveShadow>
          <cylinderGeometry args={[1.2, 1.15, 0.02, 128]} />
          <meshPhysicalMaterial {...sauceMat} />
        </mesh>

        {/* Sauce artistic drizzle */}
        <mesh position={[0.7, -0.42, 0.3]} rotation={[0, 0.8, 0]}>
          <torusGeometry args={[0.25, 0.015, 16, 64]} />
          <meshPhysicalMaterial {...sauceMat} />
        </mesh>

        {/* --- PERFECTLY SEARED STEAK (Ultra High Detail) --- */}
        <group ref={steakRef} position={[0.1, -0.25, 0]} rotation={[0, 0.3, 0]}>
          {/* Main steak body */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.35, 1.0]} />
            <meshStandardMaterial {...steakMat} />
          </mesh>

          {/* Grill marks (multiple layers) */}
          {[0, 0.5, 1.0].map((offset, i) => (
            <mesh key={`grill-${i}`} position={[-0.5 + offset, 0.176, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.08, 0.002, 1.1]} />
              <meshStandardMaterial {...steakCrustMat} />
            </mesh>
          ))}

          {/* Cross grill marks */}
          {[-0.3, 0.3].map((offset, i) => (
            <mesh key={`grill-cross-${i}`} position={[0, 0.176, offset]} rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.08, 0.002, 1.5]} />
              <meshStandardMaterial {...steakCrustMat} />
            </mesh>
          ))}

          {/* Charred crust edge */}
          <mesh position={[0, 0.175, 0.51]}>
            <boxGeometry args={[1.42, 0.05, 0.03]} />
            <meshStandardMaterial {...steakCrustMat} />
          </mesh>

          {/* Fat marbling detail (small spheres) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={`fat-${i}`} 
              position={[
                (Math.random() - 0.5) * 1.0,
                0.15,
                (Math.random() - 0.5) * 0.7
              ]}
            >
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshStandardMaterial color="#f5deb3" roughness={0.4} />
            </mesh>
          ))}
        </group>

        {/* --- CREAMY MASHED POTATOES (Textured Quenelle) --- */}
        {[
          { pos: [-0.9, -0.3, 0.4], rot: 0.2 },
          { pos: [-0.7, -0.32, 0.7], rot: -0.3 },
          { pos: [-1.1, -0.35, 0.1], rot: 0.5 }
        ].map((potato, i) => (
          <group 
            key={`potato-${i}`}
            ref={el => potatoesRefs.current[i] = el}
            position={potato.pos}
            rotation={[0, potato.rot, 0]}
          >
            {/* Quenelle shape (high detail) */}
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <meshStandardMaterial {...potatoMat} />
            </mesh>
            {/* Texture ridges */}
            {Array.from({ length: 6 }).map((_, j) => (
              <mesh key={`ridge-${j}`} position={[0, 0.05, 0]} rotation={[0, j * Math.PI / 3, 0]}>
                <boxGeometry args={[0.25, 0.01, 0.01]} />
                <meshStandardMaterial color="#fde68a" roughness={0.8} />
              </mesh>
            ))}
          </group>
        ))}

        {/* --- FRESH ASPARAGUS SPEARS (Bundle) --- */}
        {Array.from({ length: 7 }).map((_, i) => {
          const angle = (i - 3) * 0.15;
          const xOffset = 0.7 + (i - 3) * 0.08;
          return (
            <group 
              key={`asparagus-${i}`}
              ref={el => asparagusRefs.current[i] = el}
              position={[xOffset, -0.35, -0.5]}
              rotation={[Math.PI / 2 + angle * 0.3, 0, angle]}
            >
              {/* Asparagus stalk (high segments) */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.04, 0.05, 0.9, 32]} />
                <meshStandardMaterial {...asparagusMat} />
              </mesh>
              
              {/* Tip */}
              <mesh position={[0, 0.5, 0]} castShadow>
                <coneGeometry args={[0.045, 0.15, 16]} />
                <meshStandardMaterial {...asparagusTipMat} />
              </mesh>

              {/* Texture detail (scales) */}
              {Array.from({ length: 20 }).map((_, j) => (
                <mesh 
                  key={`scale-${j}`} 
                  position={[0, -0.4 + j * 0.04, 0]} 
                  rotation={[0, j * 0.5, 0]}
                >
                  <ringGeometry args={[0.04, 0.048, 8]} />
                  <meshStandardMaterial color="#15803d" roughness={0.6} />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* --- MELTING HERB BUTTER PAT --- */}
        <mesh ref={butterRef} position={[0.1, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 0.06, 32]} />
          <meshPhysicalMaterial {...butterMat} />
        </mesh>

        {/* Butter drip */}
        <mesh position={[0.15, 0.05, 0.08]}>
          <sphereGeometry args={[0.04, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial {...butterMat} />
        </mesh>

        {/* --- FRESH HERB GARNISH (Microgreens) --- */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 0.15 + Math.random() * 0.1;
          return (
            <group
              key={`herb-${i}`}
              ref={el => garnishRefs.current[i] = el}
              position={[
                0.1 + Math.cos(angle) * radius,
                0.25,
                Math.sin(angle) * radius
              ]}
              rotation={[Math.random() * 0.3, Math.random() * Math.PI * 2, Math.random() * 0.5]}
            >
              {/* Herb stem */}
              <mesh>
                <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
                <meshStandardMaterial color="#166534" roughness={0.8} />
              </mesh>
              
              {/* Herb leaves (multiple) */}
              {[0.05, 0.09, 0.12].map((height, j) => (
                <mesh key={`leaf-${j}`} position={[0, height, 0]}>
                  <boxGeometry args={[0.025, 0.002, 0.04]} />
                  <meshStandardMaterial {...herbMat} />
                </mesh>
              ))}
            </group>
          );
        })}

        {/* --- PREMIUM AR LABELS --- */}
        <Html position={[2.5, 0.8, 0]} distanceFactor={1.5} className="pointer-events-none">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                <span className="text-xs font-bold uppercase tracking-wider">Premium Dish</span>
             </div>
             <div className="text-[10px] text-slate-300">Wagyu Steak · 680 cal</div>
          </div>
        </Html>
        
        <Html position={[-2.3, 0.2, 0.8]} distanceFactor={1.5} className="pointer-events-none">
           <div className="bg-white/95 backdrop-blur-lg p-3 rounded-xl shadow-2xl border border-slate-200">
              <div className="text-[9px] text-slate-500 font-mono font-bold mb-1.5">NUTRITIONAL BREAKDOWN</div>
              <div className="space-y-1">
                <div className="flex justify-between gap-3 text-[10px]">
                  <span className="text-slate-600">Protein</span>
                  <span className="font-bold text-slate-900">52g</span>
                </div>
                <div className="flex justify-between gap-3 text-[10px]">
                  <span className="text-slate-600">Carbs</span>
                  <span className="font-bold text-slate-900">28g</span>
                </div>
                <div className="flex justify-between gap-3 text-[10px]">
                  <span className="text-slate-600">Fat</span>
                  <span className="font-bold text-slate-900">35g</span>
                </div>
              </div>
           </div>
        </Html>

        <Html position={[0, -0.9, 1.8]} distanceFactor={1.5} className="pointer-events-none">
           <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-1.5 rounded-full shadow-lg text-[10px] font-bold border border-amber-400/30">
              ⭐ MICHELIN QUALITY
           </div>
        </Html>

      </group>
    </Float>
  );
};

const SceneController = () => {
  const { camera, mouse } = useThree();
  const groupRef = useRef();

  // Parallax Interaction
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.1, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.1, 0.05);
    }
  });

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#main-content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    // 1. Hero: Center
    // Initial Camera: [0, 0, 7]

    // 2. About: Camera moves Right (Profile View)
    tl.to(camera.position, { x: 2, y: 0, z: 6 }, "phase1");
    tl.to(camera.rotation, { y: 0.3 }, "phase1");

    // 3. Features: Camera moves Up-Left (Top-Down Menu View)
    // This aligns with burger "exploding" upwards
    tl.to(camera.position, { x: -2, y: 2.5, z: 5 }, "phase2");
    tl.to(camera.rotation, { x: -0.5, y: -0.2 }, "phase2");

    // 4. CTA: Return Front
    tl.to(camera.position, { x: 0, y: 0, z: 6 }, "phase3");
    tl.to(camera.rotation, { x: 0, y: 0 }, "phase3");

  }, [camera]);

  return (
    <group ref={groupRef}>
      <PremiumDishDisplay />
    </group>
  );
};

const SceneEnvironment = () => {
  return (
    <>
      <SceneController />
      
      {/* Bright Studio Lighting for High Visibility */}
      <SoftShadows size={50} focus={0.5} samples={32} />
      <ambientLight intensity={2.0} />
      <directionalLight position={[5, 10, 7]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-10, -5, 5]} intensity={1} color="#60a5fa" />
      <spotLight position={[0, 5, 5]} intensity={0.5} color="#3b82f6" />
      
      {/* Bright Environment */}
      <Environment preset="city" />
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} color="#cbd5e1" />
    </>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const LandingPage = () => {
  const navigate = useNavigate();
  const { owner } = useAuth();

  // Lenis Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const features = [
    {
      title: "Menu Visualization",
      description: "Let customers see dishes in 3D before ordering with immersive augmented reality previews.",
      icon: Camera,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmpc_igRYqatIrc5KMJ7fOprCk5qNcARxs3g&s",
    },
    {
      title: "AR Menu Insights",
      description: "Understand which dishes customers explore the most in AR and optimize your menu accordingly.",
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Live Ordering Management",
      description: "Track and manage live orders in real time with seamless kitchen and front-desk coordination.",
      icon: Utensils,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    },
    {
      title: "Automated Billing",
      description: "Generate bills instantly with integrated payment processing and real-time order tracking.",
      icon: Activity,
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&q=80",
    },
  ];

  const handleGetStarted = () => {
   
      navigate("/register");
   
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      
      {/* --- FIXED 3D BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 45 }}>
          <Suspense fallback={null}>
            <SceneEnvironment />
          </Suspense>
        </Canvas>
      </div>

      {/* --- SUBTLE FILM GRAIN (Cinematic Feel) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-multiply" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* --- NAVBAR (Floating Pill) --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-center">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 px-6 py-3 rounded-full shadow-sm flex items-center gap-8 transition-all hover:bg-white">
          <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20" /> DISHPOP
          </span>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Product</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Enterprise</a>
          </div>
          <button 
            onClick={() => navigate("/login")}
            className="bg-slate-900 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all shadow-lg hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div id="main-content" className="relative z-10 pt-24">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center px-6 md:px-20 lg:px-32">
          <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase"
              >
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Next Gen Dining
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] text-slate-900">
                See Your Food <br />
                <GradientText>Before You Order.</GradientText>
              </h1>
              
              <p className="text-slate-500 text-xl max-w-lg font-light leading-relaxed">
                Experience premium dishes in photorealistic 3D. <br/>
                See every detail, ingredient, and nutritional value before ordering.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <MagneticButton onClick={handleGetStarted}>
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </MagneticButton>
                <MagneticButton variant="secondary">
                  Watch Demo <Play className="w-4 h-4 ml-2 fill-current" />
                </MagneticButton>
              </div>
            </div>
            {/* Right side empty for 3D Space */}
            <div className="hidden md:block"></div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="min-h-screen py-32 px-6 md:px-20 lg:px-32 flex items-center bg-blue-50/30">
          <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-100 shadow-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Confidence in <br />
                <span className="text-blue-600">Every Bite.</span>
              </h2>
              
              <p className="text-slate-600 text-lg leading-relaxed">
                Dishpop removes guesswork. Our AR engine renders your dishes in high-fidelity 3D, ensuring customers get exactly what they crave. <br/><br/>
                It's not just a menu; it's a digital twin.
              </p>
              
              <div className="flex gap-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex-1">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Visual Accuracy</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex-1">
                  <div className="text-2xl font-bold text-slate-900">1.0s</div>
                  <div className="text-xs text-slate-500 font-medium">Latency</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              {/* Decorative placeholder layout for balance */}
              {/* <div className="w-full h-[400px] rounded-3xl bg-gradient-to-br from-blue-100 to-white border border-slate-100 shadow-sm flex items-center justify-center">
                <div className="text-center">
                   <Activity className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                   <p className="text-blue-600 font-mono text-sm">SCROLL FOR AR VIEW</p>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION (Exploded View Trigger) */}
        <section id="features-section" className="min-h-screen py-32 px-6 md:px-20 lg:px-32">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-center text-slate-900">
              Complete Restaurant <GradientText>Ecosystem.</GradientText>
            </h2>
            <p className="text-slate-500 text-center mb-20 max-w-2xl mx-auto">
              From AR visualization to automated billing - everything you need to run a modern restaurant.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white border border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                     <img 
                       src={feature.image}
                       alt={feature.title}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                     <div className="absolute bottom-4 left-4 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                       <feature.icon className="w-6 h-6" />
                     </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 px-4 md:px-20 lg:px-32 relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[4rem] transform scale-105 rotate-1" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Ready to <br />
              <span className="text-blue-400">Upgrade Reality?</span>
            </h2>
            <p className="text-blue-100 text-xl mb-12 max-w-2xl mx-auto">
              Join the AR dining revolution. Transform your restaurant's customer experience with cutting-edge technology.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center"
            
            onClick={handleGetStarted}>
               <MagneticButton className="!bg-white !text-blue-900 !border-none !px-12 !py-4 !text-xl !shadow-2xl">
                 Partner With Us 
               </MagneticButton>
               {/* <button className="text-blue-300 hover:text-white transition-colors underline underline-offset-4 font-medium">
                 View Documentation
               </button> */}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 px-6 border-t border-slate-100 bg-white text-slate-500 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
             <div className="flex items-center gap-2 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30" />
                <span className="font-bold text-slate-900 text-lg">Dishpop</span>
             </div>
             <div className="flex gap-8 font-medium">
                <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/contact" className="hover:text-blue-600 transition-colors">
                  Contact
                </Link>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  About us
                </Link>
                <Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">
                  Terms Policy
                </Link>
             </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;