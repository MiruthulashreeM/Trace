import React from "react";
import { motion } from "framer-motion";
import {
  Mountain,
  Trees,
  Landmark,
  Building2,
  MapPin,
  Home,
} from "lucide-react";
import "./TourismPage.css"; // Link to your CSS

const places = [
  {
    name: "Ooty",
    icon: <Mountain size={48} className="text-white" />,
    description:
      "Nestled in the Nilgiris with tea gardens, colonial charm, and crisp air — Ooty soothes the soul.",
  },
  {
    name: "Kodaikanal",
    icon: <Trees size={48} className="text-white" />,
    description:
      "A misty escape known for lakes, forests, and breathtaking valley views.",
  },
  {
    name: "Mahabalipuram",
    icon: <Landmark size={48} className="text-white" />,
    description:
      "Where ancient carvings meet the sea — Mahabalipuram is a heritage lover’s dream.",
  },
  {
    name: "Rameswaram",
    icon: <Building2 size={48} className="text-white" />,
    description:
      "A spiritual island filled with sacred stories and tranquil shores.",
  },
  {
    name: "Thanjavur",
    icon: <Building2 size={48} className="text-white" />,
    description:
      "The cultural heartbeat of Tamil Nadu with temples, art, and music in the air.",
  },
  {
    name: "Yercaud",
    icon: <Trees size={48} className="text-white" />,
    description:
      "Cool weather, coffee estates, and forest trails await in this hidden hill town.",
  },
  {
    name: "Madurai",
    icon: <MapPin size={48} className="text-white" />,
    description:
      "Ancient and alive — Madurai blends tradition, temples, and Tamil vibrance.",
  },
];

export default function TourismPage() {
  return (
    <div className="tourism-container">
      <div className="bg-overlay" />

      {/* Home Icon */}
      <div className="home-icon">
        <a href="/home" title="Home">
          <Home size={28} className="text-white" />
        </a>
      </div>
      

      <div className="content">
        <h1 className="title">Explore Tamil Nadu</h1>
        <p className="subtitle">
          From misty hill stations to ancient temples, uncover stories written in every landscape.
        </p>

        <div className="cards-grid">
          {places.map((place, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="place-card"
            >
              <div className="icon-circle">{place.icon}</div>
              <h2 className="place-name">{place.name}</h2>
              <p className="place-description">{place.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
