"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Stars, useTexture } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { memo, useMemo, useRef } from "react";
import * as THREE from "three";

type EarthSceneProps = {
  isRunning?: boolean;
  anomalyDetected?: boolean;
  className?: string;
};
type OrbitRingConfig = {
  id: string;
  radius: number;
  thickness: number;
  rotation: [number, number, number];
  color: string;
  opacity: number;
};

type SatelliteConfig = {
  id: string;
  radius: number;
  speed: number;
  phase: number;
  verticalDrift: number;
  inclination: [number, number, number];
  bodyColor: string;
  panelColor: string;
  glowColor: string;
  size: number;
};

const ORBIT_RING_CONFIGS: OrbitRingConfig[] = [
  {
    id: "primary",
    radius: 1.66,
    thickness: 0.02,
    rotation: [Math.PI / 2.4, 0, 0],
    color: "#67e8f9",
    opacity: 0.42,
  },
  {
    id: "mid",
    radius: 1.82,
    thickness: 0.015,
    rotation: [Math.PI / 3.0, Math.PI / 8, 0],
    color: "#38bdf8",
    opacity: 0.23,
  },
  {
    id: "polar",
    radius: 1.54,
    thickness: 0.012,
    rotation: [Math.PI / 2.75, -Math.PI / 5, Math.PI / 10],
    color: "#22d3ee",
    opacity: 0.2,
  },
];

const SATELLITE_CONFIGS: SatelliteConfig[] = [
  {
    id: "sat-1",
    radius: 1.66,
    speed: 0.65,
    phase: 0,
    verticalDrift: 0.65,
    inclination: [Math.PI / 2.4, 0, 0],
    bodyColor: "#0b1220",
    panelColor: "#164e63",
    glowColor: "#22d3ee",
    size: 0.05,
  },
  {
    id: "sat-2",
    radius: 1.82,
    speed: 0.5,
    phase: Math.PI * 0.9,
    verticalDrift: 0.9,
    inclination: [Math.PI / 3.0, Math.PI / 8, 0],
    bodyColor: "#111827",
    panelColor: "#0f766e",
    glowColor: "#06b6d4",
    size: 0.048,
  },
  {
    id: "sat-3",
    radius: 1.54,
    speed: 0.72,
    phase: Math.PI * 1.6,
    verticalDrift: 0.5,
    inclination: [Math.PI / 2.75, -Math.PI / 5, Math.PI / 10],
    bodyColor: "#111827",
    panelColor: "#155e75",
    glowColor: "#67e8f9",
    size: 0.043,
  },
];

const TRAJECTORY_POINTS = 34;

export const EarthScene = memo(function EarthScene({ isRunning, anomalyDetected, className }: EarthSceneProps) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#020617", 5.5, 18]} />

        <group>
          <SpaceBackdrop />
          <StarfieldDust />
          <Stars
            radius={95}
            depth={70}
            count={2800}
            factor={3.5}
            saturation={0}
            fade
            speed={0.24}
          />
          <Stars
            radius={160}
            depth={120}
            count={2200}
            factor={6}
            saturation={0}
            fade
            speed={0.12}
          />

          <ambientLight intensity={0.42} color="#b8e6ff" />
          <hemisphereLight args={["#a5f3fc", "#020617", 0.34]} />
          <directionalLight intensity={1.2} position={[4.8, 2.2, 3.2]} color="#dff7ff" />
          <pointLight intensity={1.1} position={[-3.5, -1.2, -3.8]} color="#0ea5e9" />

          <Environment preset="night" />

          <Earth />
          <Atmosphere />
          <OrbitRings anomalyDetected={!!anomalyDetected} />
          <SatelliteConstellation isRunning={!!isRunning} anomalyDetected={!!anomalyDetected} />

          <CinematicCameraRig isRunning={!!isRunning} />
        </group>

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={isRunning ? 1.08 : 0.78}
            luminanceThreshold={0.16}
            luminanceSmoothing={0.74}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
});
function SpaceBackdrop() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color("#020617") },
          uBottom: { value: new THREE.Color("#030711") },
          uAccent: { value: new THREE.Color("#0c1d3b") },
        },
        vertexShader: `
          varying vec3 vWorldPos;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          varying vec3 vWorldPos;
          uniform vec3 uTop;
          uniform vec3 uBottom;
          uniform vec3 uAccent;
          void main() {
            vec3 dir = normalize(vWorldPos);
            float h = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
            vec3 base = mix(uBottom, uTop, smoothstep(0.0, 1.0, h));
            float accentMask = smoothstep(0.25, 0.95, 1.0 - abs(dir.z));
            vec3 color = mix(base, uAccent, accentMask * 0.22);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }),
    [],
  );

  return (
    <mesh scale={30} material={material}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}

function StarfieldDust() {
  const positions = useMemo(() => {
    const count = 1800;
    const next = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const t = i / count;
      const theta = i * 2.399963229728653;
      const y = 1 - 2 * t;
      const planarRadius = Math.sqrt(1 - y * y);
      const shellRadius = 7 + (((i * 13) % 97) / 97) * 16;

      next[i3] = Math.cos(theta) * planarRadius * shellRadius;
      next[i3 + 1] = y * shellRadius;
      next[i3 + 2] = Math.sin(theta) * planarRadius * shellRadius;
    }

    return next;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#bae6fd"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

function Earth() {
  const [day, normal] = useTexture([
    "/textures/earth_day_2048.jpg",
    "/textures/earth_normal_2048.jpg",
  ]);

  const [configuredDay, configuredNormal] = useMemo(() => {
    const nextDay = day.clone();
    nextDay.colorSpace = THREE.SRGBColorSpace;
    nextDay.anisotropy = 8;

    const nextNormal = normal.clone();
    nextNormal.anisotropy = 8;

    return [nextDay, nextNormal] as const;
  }, [day, normal]);

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += dt * 0.058;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial
        map={configuredDay}
        normalMap={configuredNormal}
        normalScale={new THREE.Vector2(0.62, 0.62)}
        roughness={0.86}
        metalness={0.06}
        emissive="#0b1f35"
        emissiveIntensity={0.23}
      />
    </mesh>
  );
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color("#38bdf8") },
          uIntensity: { value: 0.88 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          uniform vec3 uColor;
          uniform float uIntensity;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(viewDir, normalize(vNormal)), 0.0), 3.5);
            float alpha = fresnel * uIntensity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
      }),
    [],
  );

  return (
    <group>
      <mesh scale={1.08} material={material}>
        <sphereGeometry args={[1, 96, 96]} />
      </mesh>
      <mesh scale={1.17}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function OrbitRings({ anomalyDetected }: { anomalyDetected: boolean }) {
  const primaryColor = anomalyDetected ? "#fb7185" : "#a5f3fc";
  const ringTone = anomalyDetected ? "#f97316" : "#67e8f9";

  return (
    <group>
      {ORBIT_RING_CONFIGS.map((ring) => (
        <mesh key={ring.id} rotation={ring.rotation}>
          <ringGeometry args={[ring.radius - ring.thickness, ring.radius, 256]} />
          <meshBasicMaterial
            color={ring.id === "primary" ? ringTone : ring.color}
            transparent
            opacity={ring.id === "primary" && anomalyDetected ? 0.68 : ring.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.66, 0.0034, 16, 240]} />
        <meshBasicMaterial
          color={primaryColor}
          transparent
          opacity={anomalyDetected ? 1 : 0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SatelliteConstellation({
  isRunning,
  anomalyDetected,
}: {
  isRunning: boolean;
  anomalyDetected: boolean;
}) {
  return (
    <group>
      {SATELLITE_CONFIGS.map((config) => (
        <Satellite
          key={config.id}
          config={config}
          isRunning={isRunning}
          anomalyDetected={anomalyDetected}
        />
      ))}
    </group>
  );
}

function Satellite({
  config,
  isRunning,
  anomalyDetected,
}: {
  config: SatelliteConfig;
  isRunning: boolean;
  anomalyDetected: boolean;
}) {
  const satelliteRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(config.phase);
  const trajectoryPositions = useMemo(() => new Float32Array(TRAJECTORY_POINTS * 3), []);
  const trajectoryLine = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(trajectoryPositions, 3));

    const material = new THREE.LineBasicMaterial({
      color: "#7dd3fc",
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return new THREE.Line(geometry, material);
  }, [trajectoryPositions]);

  useFrame((_, dt) => {
    tRef.current += dt * config.speed * (isRunning ? 1 : 0.62);
    const t = tRef.current;

    const projectedDrift = isRunning ? getPredictionDeviation(t, config) : 0;
    const shakeAmp = anomalyDetected ? 0.014 : 0;
    const shakeX = Math.sin(t * 38 + config.phase) * shakeAmp;
    const shakeY = Math.sin(t * 47 + config.phase * 0.7) * shakeAmp;
    const shakeZ = Math.cos(t * 43 + config.phase) * shakeAmp;

    const x = Math.cos(t) * (config.radius + projectedDrift) + shakeX;
    const z = Math.sin(t) * (config.radius + projectedDrift) + shakeZ;
    const y =
      Math.sin(t * (1 + config.verticalDrift)) * 0.18 * config.verticalDrift +
      projectedDrift * 0.45 +
      shakeY;

    if (satelliteRef.current) {
      satelliteRef.current.position.set(x, y, z);
      satelliteRef.current.rotation.y = t + Math.PI / 2;
      satelliteRef.current.rotation.z =
        Math.sin(t * 1.7) * 0.12 + (anomalyDetected ? Math.sin(t * 55) * 0.08 : 0);
    }

    if (glowRef.current) {
      const glowScale = 1.78 + Math.sin(t * 4.4) * 0.12 + (anomalyDetected ? 0.16 : 0);
      glowRef.current.scale.setScalar(glowScale);
    }

    updateProjectedTrajectory(trajectoryPositions, t, config, isRunning);
    const positionAttribute = trajectoryLine.geometry.getAttribute("position");
    if (positionAttribute) {
      positionAttribute.needsUpdate = true;
    }

    const trajectoryMaterial = trajectoryLine.material;
    if (!Array.isArray(trajectoryMaterial)) {
      trajectoryMaterial.color.set(anomalyDetected ? "#fb7185" : "#7dd3fc");
    }
  });

  return (
    <group rotation={config.inclination}>
      <primitive object={trajectoryLine} visible={isRunning} />
      <group ref={satelliteRef}>
        <mesh>
          <boxGeometry args={[config.size * 1.8, config.size, config.size]} />
          <meshStandardMaterial
            color={config.bodyColor}
            emissive={config.glowColor}
            emissiveIntensity={isRunning ? 1.85 : 1.15}
            roughness={0.24}
            metalness={0.74}
          />
        </mesh>

        <mesh position={[config.size * 1.45, 0, 0]}>
          <boxGeometry args={[config.size * 1.55, config.size * 0.22, config.size * 1.08]} />
          <meshStandardMaterial
            color={config.panelColor}
            emissive={config.glowColor}
            emissiveIntensity={isRunning ? 0.72 : 0.45}
            roughness={0.48}
            metalness={0.56}
          />
        </mesh>
        <mesh position={[-config.size * 1.45, 0, 0]}>
          <boxGeometry args={[config.size * 1.55, config.size * 0.22, config.size * 1.08]} />
          <meshStandardMaterial
            color={config.panelColor}
            emissive={config.glowColor}
            emissiveIntensity={isRunning ? 0.72 : 0.45}
            roughness={0.48}
            metalness={0.56}
          />
        </mesh>

        <mesh position={[0, config.size * 0.85, 0]}>
          <cylinderGeometry args={[config.size * 0.08, config.size * 0.08, config.size * 1.35, 12]} />
          <meshStandardMaterial
            color="#c4b5fd"
            emissive={config.glowColor}
            emissiveIntensity={isRunning ? 0.65 : 0.35}
            roughness={0.35}
            metalness={0.5}
          />
        </mesh>

        <mesh ref={glowRef}>
          <sphereGeometry args={[config.size * 1.14, 20, 20]} />
          <meshBasicMaterial
            color={config.glowColor}
            transparent
            opacity={isRunning ? 0.24 : 0.16}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function getPredictionDeviation(t: number, config: SatelliteConfig) {
  const uncertaintyPulse = Math.sin(t * 1.35 + config.phase) * 0.012;
  const correctionBias = 0.024 + config.size * 0.12;

  return correctionBias + uncertaintyPulse;
}

function updateProjectedTrajectory(
  positions: Float32Array,
  currentT: number,
  config: SatelliteConfig,
  isRunning: boolean,
) {
  for (let i = 0; i < TRAJECTORY_POINTS; i += 1) {
    const t = currentT + i * 0.055;
    const drift = isRunning ? getPredictionDeviation(t, config) : 0;
    const radius = config.radius + drift;
    const i3 = i * 3;

    positions[i3] = Math.cos(t) * radius;
    positions[i3 + 1] =
      Math.sin(t * (1 + config.verticalDrift)) * 0.18 * config.verticalDrift + drift * 0.45;
    positions[i3 + 2] = Math.sin(t) * radius;
  }
}
function CinematicCameraRig({ isRunning }: { isRunning: boolean }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const tRef = useRef(0);

  useFrame((_, dt) => {
    const camera = cameraRef.current;
    if (!camera) return;

    tRef.current += dt * 0.07;
    const t = tRef.current;

    const radius = 3.25;
    const height = 1.25 + Math.sin(t * 1.2) * 0.08;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;

    // Cinematic easing.
    const targetPos = new THREE.Vector3(x, height, z);
    camera.position.lerp(targetPos, 0.03);

    camera.lookAt(new THREE.Vector3(0, 0.1, 0));
    // Subtle “breathing” zoom during runs.
    camera.fov = THREE.MathUtils.lerp(camera.fov, isRunning ? 40.5 : 42, 0.04);
    camera.updateProjectionMatrix();
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 1.35, 3.2]}
      fov={42}
      near={0.1}
      far={80}
    />
  );
}
