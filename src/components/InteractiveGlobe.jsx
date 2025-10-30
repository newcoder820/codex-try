import React, { Suspense, useMemo, useState, useCallback } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { TextureLoader } from "three";

const latLongToPosition = (latitude, longitude, radius) => {
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;
  const x = radius * Math.cos(lat) * Math.sin(lon);
  const y = radius * Math.sin(lat);
  const z = radius * Math.cos(lat) * Math.cos(lon);
  return [x, y, z];
};

const Marker = ({ location, radius, onSelect, onHover, isActive }) => {
  const position = useMemo(
    () => latLongToPosition(location.latitude, location.longitude, radius + 0.03),
    [location.latitude, location.longitude, radius]
  );

  const markerColor = isActive ? "#ff7849" : "#ffd166";

  return (
    <group position={position}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(location);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(location);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover(null);
        }}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color={markerColor} emissive="#442200" emissiveIntensity={0.5} />
      </mesh>
      <Html center>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(location);
          }}
          onFocus={() => onHover(location)}
          onBlur={() => onHover(null)}
          style={{
            border: "0",
            background: "transparent",
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            clip: "rect(0 0 0 0)",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          aria-label={`View information for ${location.name}`}
        />
      </Html>
    </group>
  );
};

const GlobeSurface = () => {
  const texture = useLoader(
    TextureLoader,
    "https://cdn.jsdelivr.net/gh/creativetimofficial/public-assets/earth-day/earthmap1k.jpg",
    (loader) => {
      loader.crossOrigin = "anonymous";
    }
  );

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        color={!texture ? "#3b82f6" : undefined}
        emissive="black"
      />
    </mesh>
  );
};

const tooltipStyles = {
  container: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    maxWidth: "280px",
    background: "rgba(17, 24, 39, 0.9)",
    color: "#f9fafb",
    padding: "1rem",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  image: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    borderRadius: "0.5rem",
  },
  title: {
    margin: 0,
    fontSize: "1.125rem",
    fontWeight: 600,
  },
  description: {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: 1.4,
  },
};

const navStyles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    justifyContent: "center",
    marginTop: "1rem",
  },
  button: (isActive) => ({
    border: "1px solid rgba(255,255,255,0.3)",
    background: isActive ? "rgba(59, 130, 246, 0.2)" : "rgba(17, 24, 39, 0.4)",
    color: "#f9fafb",
    borderRadius: "9999px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background 0.2s ease",
  }),
};

const containerStyles = {
  position: "relative",
  width: "100%",
  maxWidth: "960px",
  margin: "0 auto",
  padding: "1rem",
};

const canvasWrapperStyles = {
  position: "relative",
  width: "100%",
  height: "60vh",
  minHeight: "420px",
  borderRadius: "1rem",
  overflow: "hidden",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.35)",
  background: "radial-gradient(circle at center, #0f172a 0%, #020617 70%)",
};

export const InteractiveGlobe = ({ locations, autoRotateSpeed = 0.6 }) => {
  const [activeLocation, setActiveLocation] = useState(null);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const handleSelect = useCallback((location) => {
    setActiveLocation(location);
  }, []);

  const handleHover = useCallback((location) => {
    setHoveredLocation(location);
  }, []);

  const displayedLocation = hoveredLocation ?? activeLocation ?? locations[0] ?? null;

  return (
    <div style={containerStyles}>
      <div
        style={canvasWrapperStyles}
        role="img"
        aria-label="3D globe with interactive location markers"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <GlobeSurface />
            {locations.map((location) => (
              <Marker
                key={location.id}
                location={location}
                radius={2}
                onSelect={handleSelect}
                onHover={handleHover}
                isActive={activeLocation?.id === location.id}
              />
            ))}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={!isUserInteracting}
              autoRotateSpeed={autoRotateSpeed}
              rotateSpeed={0.8}
              onStart={() => setIsUserInteracting(true)}
              onEnd={() => setIsUserInteracting(false)}
            />
          </Suspense>
        </Canvas>
        {displayedLocation && (
          <div role="dialog" aria-live="polite" style={tooltipStyles.container}>
            <img
              src={displayedLocation.imageUrl}
              alt={`Photograph of ${displayedLocation.name}`}
              style={tooltipStyles.image}
            />
            <h3 style={tooltipStyles.title}>{displayedLocation.name}</h3>
            <p style={tooltipStyles.description}>{displayedLocation.description}</p>
          </div>
        )}
      </div>
      <nav aria-label="Globe locations" style={navStyles.container}>
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => handleSelect(location)}
            onFocus={() => handleHover(location)}
            onBlur={() => handleHover(null)}
            style={navStyles.button(activeLocation?.id === location.id)}
            aria-pressed={activeLocation?.id === location.id}
          >
            {location.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default InteractiveGlobe;
