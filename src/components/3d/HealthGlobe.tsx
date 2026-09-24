import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HealthGlobe: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 400;
    const height = mountRef.current.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Outer Wireframe Globe
    const globeRadius = 6;
    const globeGeometry = new THREE.IcosahedronGeometry(globeRadius, 4);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globeMesh);

    // 3. Inner Core Sphere
    const coreGeometry = new THREE.SphereGeometry(globeRadius * 0.96, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x070d1d,
      transparent: true,
      opacity: 0.85
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // 4. Healthcare Node Points on Globe Surface
    const nodeCount = 70;
    const nodesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    const colorTeal = new THREE.Color(0x00f2fe);
    const colorRed = new THREE.Color(0xef4444);

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const x = globeRadius * Math.cos(theta) * Math.sin(phi);
      const y = globeRadius * Math.sin(theta) * Math.sin(phi);
      const z = globeRadius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const isEmergencyNode = i % 8 === 0;
      const c = isEmergencyNode ? colorRed : colorTeal;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nodesMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.95
    });
    const nodesPoints = new THREE.Points(nodesGeometry, nodesMaterial);
    scene.add(nodesPoints);

    // 5. Orbiting Connection Arc Rings
    const ringGeometry = new THREE.RingGeometry(globeRadius * 1.15, globeRadius * 1.18, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      globeMesh.rotation.y += 0.003;
      coreMesh.rotation.y += 0.003;
      nodesPoints.rotation.y += 0.003;
      ringMesh.rotation.z += 0.002;

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
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
};
