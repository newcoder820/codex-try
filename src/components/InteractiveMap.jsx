import React, { useMemo, useState } from "react";

const mapContainerStyle = {
  width: "min(100%, 960px)",
  background: "rgba(15, 23, 42, 0.55)",
  borderRadius: "1.5rem",
  padding: "1.5rem",
  boxShadow: "0 25px 60px -25px rgba(15, 23, 42, 0.9)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  backdropFilter: "blur(16px)",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
};

const mapWrapperStyle = {
  position: "relative",
  width: "100%",
  paddingTop: "56.25%",
  overflow: "hidden",
  borderRadius: "1rem",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  background: "linear-gradient(135deg, #1d4ed8 0%, #312e81 50%, #0f172a 100%)",
};

const mapImageStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "saturate(1.1) contrast(1.05)",
};

const markerBaseStyle = {
  position: "absolute",
  width: "1.25rem",
  height: "1.25rem",
  borderRadius: "9999px",
  border: "none",
  background: "#f97316",
  boxShadow: "0 0 0 4px rgba(249, 115, 22, 0.25)",
  transform: "translate(-50%, -50%)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const markerInnerDotStyle = {
  width: "0.45rem",
  height: "0.45rem",
  borderRadius: "50%",
  background: "#fff7ed",
};

const tooltipContainerStyle = {
  position: "absolute",
  transform: "translate(-50%, calc(-100% - 1rem))",
  minWidth: "12rem",
  maxWidth: "16rem",
  background: "rgba(15, 23, 42, 0.92)",
  borderRadius: "0.75rem",
  padding: "0.75rem 1rem",
  color: "#e2e8f0",
  boxShadow: "0 12px 30px -20px rgba(15, 23, 42, 0.9)",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  pointerEvents: "none",
};

const tooltipTitleStyle = {
  margin: 0,
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#f8fafc",
};

const tooltipDescriptionStyle = {
  margin: "0.35rem 0 0",
  fontSize: "0.8rem",
  lineHeight: 1.45,
};

const detailsPanelStyle = {
  display: "grid",
  gap: "1rem",
  padding: "1rem",
  borderRadius: "1rem",
  background: "rgba(15, 23, 42, 0.8)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  color: "#e2e8f0",
};

const detailsHeadingStyle = {
  margin: 0,
  fontSize: "1.1rem",
  fontWeight: 600,
};

const detailsDescriptionStyle = {
  margin: "0.5rem 0 0",
  lineHeight: 1.6,
  fontSize: "0.95rem",
};

const detailsImageStyle = {
  width: "100%",
  maxHeight: "220px",
  objectFit: "cover",
  borderRadius: "0.85rem",
  border: "1px solid rgba(148, 163, 184, 0.25)",
};

const detailsCloseButtonStyle = {
  alignSelf: "flex-start",
  background: "rgba(59, 130, 246, 0.15)",
  border: "1px solid rgba(59, 130, 246, 0.35)",
  color: "#bfdbfe",
  padding: "0.4rem 0.75rem",
  borderRadius: "9999px",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const instructionsStyle = {
  margin: 0,
  fontSize: "0.9rem",
  color: "#cbd5f5",
};

const mapAttributionStyle = {
  marginTop: "0.25rem",
  fontSize: "0.65rem",
  color: "#94a3b8",
  textAlign: "right",
};

const closeButtonLabel = "Close location details";

const MAP_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg";

const computePosition = (latitude, longitude) => ({
  top: ((90 - latitude) / 180) * 100,
  left: ((180 + longitude) / 360) * 100,
});

const InteractiveMap = ({ locations = [] }) => {
  const [activeState, setActiveState] = useState({ id: null, mode: "idle" });

  const activeLocation = useMemo(() => {
    if (!activeState.id) return null;
    return locations.find((location) => location.id === activeState.id) || null;
  }, [activeState.id, locations]);

  const openLocation = (id, mode) => {
    if (!id) {
      setActiveState({ id: null, mode: "idle" });
      return;
    }
    setActiveState({ id, mode });
  };

  const closeLocation = () => setActiveState({ id: null, mode: "idle" });

  const handleMouseEnter = (id) => openLocation(id, "hover");

  const handleMouseLeave = () => {
    if (activeState.mode === "hover") {
      closeLocation();
    }
  };

  const handleFocus = (id) => openLocation(id, "focus");

  const handleBlur = () => {
    if (activeState.mode !== "click") {
      closeLocation();
    }
  };

  const handleClick = (id) => {
    if (activeState.id === id && activeState.mode === "click") {
      closeLocation();
      return;
    }
    openLocation(id, "click");
  };

  const handleTouchStart = (event, id) => {
    event.preventDefault();
    if (activeState.id === id && activeState.mode === "touch") {
      closeLocation();
      return;
    }
    openLocation(id, "touch");
  };

  return (
    <section
      aria-label="Interactive world map"
      role="application"
      style={{ ...mapContainerStyle, width: "min(100%, 960px)" }}
    >
      <header>
        <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          Explore Global Destinations
        </h1>
        <p style={instructionsStyle}>
          Hover, focus, or tap on the markers to reveal photos and highlights for
          each destination. Use arrow keys to move between markers and press
          Enter to open details.
        </p>
      </header>

      <div style={mapWrapperStyle} aria-label="World map" role="img">
        <img
          alt="Equirectangular projection of the world map"
          src={MAP_IMAGE_URL}
          style={mapImageStyle}
        />

        {locations.map((location) => {
          const { top, left } = computePosition(
            location.latitude,
            location.longitude
          );
          const isActive = activeState.id === location.id;

          return (
            <React.Fragment key={location.id}>
              <button
                type="button"
                onMouseEnter={() => handleMouseEnter(location.id)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleFocus(location.id)}
                onBlur={handleBlur}
                onClick={() => handleClick(location.id)}
                onTouchStart={(event) => handleTouchStart(event, location.id)}
                aria-pressed={isActive}
                aria-label={`Show details for ${location.name}`}
                style={{
                  ...markerBaseStyle,
                  top: `${top}%`,
                  left: `${left}%`,
                  transform: isActive
                    ? "translate(-50%, -50%) scale(1.2)"
                    : "translate(-50%, -50%)",
                  boxShadow: isActive
                    ? "0 0 0 6px rgba(59, 130, 246, 0.35)"
                    : markerBaseStyle.boxShadow,
                }}
              >
                <span style={markerInnerDotStyle} />
              </button>

              {isActive && (
                <div
                  style={{
                    ...tooltipContainerStyle,
                    top: `${top}%`,
                    left: `${left}%`,
                  }}
                  role="status"
                  aria-live="polite"
                >
                  <h2 style={tooltipTitleStyle}>{location.name}</h2>
                  <p style={tooltipDescriptionStyle}>{location.description}</p>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <aside style={detailsPanelStyle} aria-live="polite">
        {activeLocation ? (
          <article>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2 style={detailsHeadingStyle}>{activeLocation.name}</h2>
              <button
                type="button"
                onClick={closeLocation}
                style={detailsCloseButtonStyle}
                aria-label={closeButtonLabel}
              >
                Close
              </button>
            </div>
            <img
              src={activeLocation.imageUrl}
              alt={`Photograph of ${activeLocation.name}`}
              style={detailsImageStyle}
            />
            <p style={detailsDescriptionStyle}>{activeLocation.description}</p>
          </article>
        ) : (
          <p style={instructionsStyle}>
            Select a marker on the map to view stories, photography, and quick
            facts about the destination.
          </p>
        )}
      </aside>

      <p style={mapAttributionStyle}>
        Map imagery © NASA Visible Earth (public domain).
      </p>
    </section>
  );
};

export default InteractiveMap;
