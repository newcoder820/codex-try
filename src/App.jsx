import React from "react";
import InteractiveGlobe from "./components/InteractiveGlobe.jsx";

const sampleLocations = [
  {
    id: "new-york",
    name: "New York, USA",
    latitude: 40.7128,
    longitude: -74.006,
    description:
      "The city that never sleeps, known for its iconic skyline, cultural diversity, and financial district.",
    imageUrl:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "london",
    name: "London, UK",
    latitude: 51.5072,
    longitude: -0.1276,
    description:
      "A historic capital featuring landmarks like the Houses of Parliament, Big Ben, and the River Thames.",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "tokyo",
    name: "Tokyo, Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    description:
      "A vibrant metropolis blending cutting-edge technology with traditional culture and cuisine.",
    imageUrl:
      "https://images.unsplash.com/photo-1505066825904-5b26b1b8a94b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "delhi",
    name: "Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    description:
      "India's capital territory, rich in history, bustling markets, and architectural marvels such as the Red Fort.",
    imageUrl:
      "https://images.unsplash.com/photo-1524492449093-29594e0a0987?auto=format&fit=crop&w=800&q=80",
  },
];

const appStyles = {
  minHeight: "100vh",
  margin: 0,
  background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #111827 100%)",
  color: "#f9fafb",
  fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "2rem 1rem",
};

const App = () => (
  <div style={appStyles}>
    <InteractiveGlobe locations={sampleLocations} />
  </div>
);

export default App;
