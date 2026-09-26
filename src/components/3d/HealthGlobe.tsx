import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HealthGlobe: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

    // WebGL Availability Check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch (e) {
      setWebGlSupported(false);
      return;
    }

    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Mouse Parallax Controls
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0008;
      mouseY = (e.clientY - windowHalfY) * 0.0008;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 2. Outer Wireframe Sphere
    const globeRadius = 6.2;
    const globeGeometry = new THREE.IcosahedronGeometry(globeRadius, 4);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    // 3. Inner Core Sphere
    const coreGeometry = new THREE.SphereGeometry(globeRadius * 0.95, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.88
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // 4. Healthcare Telemetry Node Points
    const nodeCount = 90;
    const nodesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    const colorRed = new THREE.Color(0xdc2626);
    const colorSlate = new THREE.Color(0x38bdf8);

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const x = globeRadius * Math.cos(theta) * Math.sin(phi);
      const y = globeRadius * Math.sin(theta) * Math.sin(phi);
      const z = globeRadius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const isEmergencyNode = i % 6 === 0;
      const c = isEmergencyNode ? colorRed : colorSlate;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nodesMaterial = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const nodesPoints = new THREE.Points(nodesGeometry, nodesMaterial);
    scene.add(nodesPoints);

    // 5. Orbiting Connection Arc Rings
    const ringGeometry = new THREE.RingGeometry(globeRadius * 1.14, globeRadius * 1.17, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Mouse Tilt Response
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      globeMesh.rotation.y = elapsedTime * 0.12 + targetX * 2;
      globeMesh.rotation.x = targetY * 1.5;

      coreMesh.rotation.y = elapsedTime * 0.12 + targetX * 2;
      coreMesh.rotation.x = targetY * 1.5;

      nodesPoints.rotation.y = elapsedTime * 0.12 + targetX * 2;
      nodesPoints.rotation.x = targetY * 1.5;

      ringMesh.rotation.z = elapsedTime * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webGlSupported) {
    return (
      <div className={`${className} flex items-center justify-center p-6 bg-slate-900/5 rounded-3xl border border-slate-200 text-center`}>
        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 mx-auto flex items-center justify-center font-extrabold text-xl shadow-md border border-red-200">
            🏥
          </div>
          <p className="text-xs font-extrabold text-slate-800">ArogyaSeva Telemetry Mesh</p>
          <p className="text-[11px] text-slate-500 font-medium">8 State Regional Jurisdictions Active</p>
        </div>
      </div>
    );
  }

  return <div ref={mountRef} className={className} />;
};
