import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Recommendation.css';

// Client-side fallback catalogue covering all 5 OCEAN traits
const CLIENT_FALLBACK_GEMS = [
  // Openness (Culture, Arts & Architecture)
  { name: "Nilgiri Library", location: "Nilgiris", description: "An ancient library with colonial architecture and rare literary archives.", category: "Openness" },
  { name: "Sankagiri Fort", location: "Salem", description: "Historic hill fort offering sweeping panoramic vistas and ancient ramparts.", category: "Openness" },
  { name: "Sri Aurobindo Ashram", location: "Puducherry", description: "Peaceful ashram steeped in spiritual history, philosophy, and mindful reflection.", category: "Openness" },
  { name: "The Charming Villas in White Town", location: "Puducherry", description: "Vibrant Franco-Tamil colonial architecture, quaint courtyards, and artistic alleyways.", category: "Openness" },
  { name: "Athangudi Palace", location: "Chettinad", description: "Traditional Chettinad architecture adorned with iconic handmade patterned tiles.", category: "Openness" },
  { name: "VVR Heritage House", location: "Kanadukathan, Chettinad", description: "Century-old heritage mansion showcasing indigenous timber carvings and courtyard designs.", category: "Openness" },

  // Conscientiousness (Heritage, Precision & History)
  { name: "Pinnangudi Temple", location: "Pudukkottai", description: "Meticulously preserved historic temple renowned for its Stambha Maha Ganapathi.", category: "Conscientiousness" },
  { name: "Pathai Kulasekaranathar Mahalingam Temple", location: "Tirunelveli", description: "Ancient Shaivite temple built with disciplined Dravidian stone masonry.", category: "Conscientiousness" },
  { name: "Kariya Manicka Perumal Temple", location: "Kanchipuram", description: "A tranquil, lesser-known Vishnu temple celebrated for its intricate pillared corridors.", category: "Conscientiousness" },
  { name: "Piranmalai Kodunkundreeswar Temple", location: "Sivagangai", description: "Multi-tiered hillside temple complex engineered into a rocky cliff face.", category: "Conscientiousness" },

  // Extraversion (Social, Vibrant, Outdoor & Adventure)
  { name: "Pondicherry Promenade & Rock Beach", location: "Puducherry", description: "Lively beachfront promenade bustling with social energy, street buskers, seaside cafes, and evening crowds.", category: "Extraversion" },
  { name: "Covelong (Kovalam) Surf & Music Village", location: "Chennai Coast", description: "Dynamic coastal community famous for group surf lessons, lively music festivals, and seaside adventures.", category: "Extraversion" },
  { name: "Madurai Night Market & Food Street", location: "Madurai", description: "High-energy evening bazaar filled with local street food vendors, lively chatter, and rich cultural interactions.", category: "Extraversion" },
  { name: "Kolli Hills 70 Hairpin Bends Trail", location: "Namakkal", description: "Exhilarating mountain road favored by motorbiking convoys and spirited group trekking expeditions.", category: "Extraversion" },
  { name: "Hogenakkal Coracle Boat Rapids", location: "Dharmapuri", description: "Thrilling group circular coracle boat rides slicing through roaring river gorges and lively fish markets.", category: "Extraversion" },
  { name: "Dhanushkodi 4x4 Beach Safari", location: "Rameswaram", description: "Action-packed off-road vehicle trek across coastal sands to the meeting point of two oceans.", category: "Extraversion" },

  // Agreeableness (Peaceful Nature, Warm Hamlets & Friendly Vistas)
  { name: "Droog Fort", location: "Coonoor", description: "Historic fort ruins set on a scenic hilltop with gentle breezes and birdwatching trails.", category: "Agreeableness" },
  { name: "Karadiyur View Point", location: "Yercaud", description: "Sweeping panoramic viewpoint over the Eastern Ghats valley, ideal for friendly group picnics.", category: "Agreeableness" },
  { name: "Javadi Hills", location: "Vellore", description: "Gentle hill region filled with peaceful forest trails, fruit orchards, and welcoming tribal hamlets.", category: "Agreeableness" },
  { name: "Ariyaman Beach", location: "Rameshwaram", description: "Calm, shallow beach with shaded casuarina groves, beloved by families and casual strolls.", category: "Agreeableness" },
  { name: "Kinnakorai Village", location: "Nilgiris", description: "A quiet, hospitable village surrounded by terraced green tea estates and mist-veiled valleys.", category: "Agreeableness" },
  { name: "Maanjolai Hills", location: "Tirunelveli", description: "Pristine tea plantations offering cozy mountain stays and warm tea-worker community culture.", category: "Agreeableness" },

  // Neuroticism (Stress Relief, Serene Waters & Calming Havens)
  { name: "Sirumalai Quiet Hills", location: "Dindigul", description: "Restorative, cool retreat with quiet pine groves, serene lakes, and peaceful unhurried atmosphere.", category: "Neuroticism" },
  { name: "Megamalai Cloud Mountain", location: "Theni", description: "Mist-blanketed sanctuary far from crowds, offering soothing tea garden panoramas and stillness.", category: "Neuroticism" },
  { name: "Pulicat Lake Bird Sanctuary", location: "Thiruvallur", description: "Tranquil lagoon sanctuary where watching thousands of flamingos and waterbirds brings deep calm.", category: "Neuroticism" },
  { name: "Kenni Hidden Falls", location: "Near Madurai", description: "Quiet, secluded natural pool surrounded by dense tree cover for therapeutic relaxation.", category: "Neuroticism" },
  { name: "Kookal Lake & Falls", location: "Kodaikanal", description: "Peaceful grassland lake bordered by pine forests, perfect for de-stressing and deep restoration.", category: "Neuroticism" },
];

function getClientFallbackRecommendations(userScores) {
  const traitMap = {
    trait0: 'Openness',
    trait1: 'Conscientiousness',
    trait2: 'Extraversion',
    trait3: 'Agreeableness',
    trait4: 'Neuroticism'
  };

  const sorted = Object.entries(userScores || {})
    .map(([k, v]) => ({ trait: traitMap[k] || 'Openness', score: Number(v) || 0 }))
    .sort((a, b) => b.score - a.score);

  const top1 = sorted[0]?.trait || 'Extraversion';
  const top2 = sorted[1]?.trait || 'Agreeableness';
  const top3 = sorted[2]?.trait || 'Openness';

  const shuffle = (list) => [...list].sort(() => 0.5 - Math.random());

  const p1 = shuffle(CLIENT_FALLBACK_GEMS.filter(g => g.category === top1)).slice(0, 3);
  const p2 = shuffle(CLIENT_FALLBACK_GEMS.filter(g => g.category === top2)).slice(0, 2);
  const p3 = shuffle(CLIENT_FALLBACK_GEMS.filter(g => g.category === top3)).slice(0, 1);

  return shuffle([...p1, ...p2, ...p3]).map((p, idx) => ({
    _id: `fallback-${idx}-${p.name}`,
    ...p,
    matchedTrait: p.category
  }));
}

const TRAIT_COLORS = {
  Openness: '#d63031',
  Conscientiousness: '#e17055',
  Extraversion: '#fdcb6e',
  Agreeableness: '#00cec9',
  Neuroticism: '#0984e3'
};

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve scores from route state or fall back to sessionStorage
  const [scores] = useState(() => {
    if (location.state?.scores && Object.keys(location.state.scores).length > 0) {
      try {
        sessionStorage.setItem('trace_scores', JSON.stringify(location.state.scores));
      } catch (e) {}
      return location.state.scores;
    }
    try {
      const stored = sessionStorage.getItem('trace_scores');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  });

  const [recommendations, setRecommendations] = useState([]);
  const [primaryTrait, setPrimaryTrait] = useState('');
  const [secondaryTrait, setSecondaryTrait] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
      setError('Could not get personality scores to fetch recommendations. Please retake the quiz.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/recommend/by-traits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setPrimaryTrait(data.primaryTrait || '');
        setSecondaryTrait(data.secondaryTrait || '');
      } else {
        // Fallback to client catalogue
        const fallback = getClientFallbackRecommendations(scores);
        setRecommendations(fallback);
      }
    } catch (err) {
      console.warn("Backend fetch failed, utilizing trait-based client fallback catalogue:", err.message);
      const fallback = getClientFallbackRecommendations(scores);
      setRecommendations(fallback);
    } finally {
      setLoading(false);
    }
  }, [scores]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loading) {
    return (
      <div className="recommendations-page">
        <div className="loading-state">
          <div className="recommendation-spinner"></div>
          <p>Analyzing your personality traits and curating hidden gems...</p>
        </div>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="recommendations-page">
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button onClick={() => navigate('/quiz')} className="action-btn-retake">
            Take Quiz Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <h2>🌟 Recommended Hidden Gems</h2>
        <p className="recommendations-subtitle">
          Dynamically curated based on your personality profile
          {primaryTrait && secondaryTrait ? (
            <span> — Highlighting <strong>{primaryTrait}</strong> & <strong>{secondaryTrait}</strong></span>
          ) : ''}
        </p>

        <div className="recommendations-toolbar">
          <button onClick={fetchRecommendations} className="toolbar-btn shuffle-btn">
            🎲 Shuffle / Refresh Gems
          </button>
          <button onClick={() => navigate(-1)} className="toolbar-btn back-btn">
            📊 Back to Personality Summary
          </button>
          <button onClick={() => navigate('/quiz')} className="toolbar-btn retake-btn">
            🔄 Retake Quiz
          </button>
        </div>
      </div>

      <div className="recommendations-list">
        {recommendations.length > 0 ? (
          recommendations.map((place, idx) => {
            const trait = place.matchedTrait || place.category || 'General';
            const badgeColor = TRAIT_COLORS[trait] || '#6c5ce7';

            return (
              <div key={place._id || idx} className="recommendation-item">
                <div className="recommendation-badge" style={{ backgroundColor: badgeColor }}>
                  {trait}
                </div>
                <h3>{place.name}</h3>
                {place.location && (
                  <p className="recommendation-location">
                    📍 <span>{place.location}</span>
                  </p>
                )}
                <p className="recommendation-desc">{place.description}</p>
              </div>
            );
          })
        ) : (
          <p className="no-recommendations">No hidden gems found based on your traits at this time.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
