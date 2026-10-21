const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// In-memory fallback catalogue ensuring all 5 traits always have diverse places,
// even if MongoDB has not yet been seeded or re-indexed.
const FALLBACK_PLACES = [
  // Openness (Culture, Architecture & Art)
  { name: "Nilgiri Library", location: "Nilgiris", description: "An ancient library with colonial architecture and rare literary archives.", category: "Openness" },
  { name: "Sankagiri Fort", location: "Salem", description: "Historic hill fort offering sweeping panoramic vistas and ancient ramparts.", category: "Openness" },
  { name: "Sri Aurobindo Ashram", location: "Puducherry", description: "Peaceful ashram steeped in spiritual history, philosophy, and mindful reflection.", category: "Openness" },
  { name: "The Charming Villas in White Town", location: "Puducherry", description: "Vibrant Franco-Tamil colonial architecture, quaint courtyards, and artistic alleyways.", category: "Openness" },
  { name: "Athangudi Palace", location: "Chettinad", description: "Traditional Chettinad architecture adorned with iconic handmade patterned tiles.", category: "Openness" },
  { name: "VVR Heritage House", location: "Kanadukathan, Chettinad", description: "Century-old heritage mansion showcasing indigenous timber carvings and courtyard designs.", category: "Openness" },
  { name: "Toda Huts", location: "Ooty", description: "Traditional barrel-vaulted houses preserving the ancient tribal architectural legacy of the Nilgiris.", category: "Openness" },

  // Conscientiousness (Heritage, Sacred Geometry & History)
  { name: "Pinnangudi Temple", location: "Pudukkottai", description: "Meticulously preserved historic temple renowned for its Stambha Maha Ganapathi.", category: "Conscientiousness" },
  { name: "Pathai Kulasekaranathar Mahalingam Temple", location: "Tirunelveli", description: "Ancient Shaivite temple built with disciplined Dravidian stone masonry and historical inscriptions.", category: "Conscientiousness" },
  { name: "Kariya Manicka Perumal Temple", location: "Kanchipuram", description: "A tranquil, lesser-known Vishnu temple celebrated for its intricate pillared corridors.", category: "Conscientiousness" },
  { name: "Piranmalai Kodunkundreeswar Temple", location: "Sivagangai", description: "Multi-tiered hillside temple complex engineered into a rocky cliff face with rich Sangam literature roots.", category: "Conscientiousness" },
  { name: "Kayathar Kailasanathar Temple", location: "Thoothukudi", description: "Historically significant temple offering peaceful courtyards and disciplined daily rituals.", category: "Conscientiousness" },

  // Extraversion (Social, Vibrant, Outdoor & Adventure)
  { name: "Pondicherry Promenade & Rock Beach", location: "Puducherry", description: "Lively beachfront promenade bustling with social energy, street buskers, seaside cafes, and evening crowds.", category: "Extraversion" },
  { name: "Covelong (Kovalam) Surf & Music Village", location: "Chennai Coast", description: "Dynamic coastal community famous for group surf lessons, lively music festivals, and seaside adventures.", category: "Extraversion" },
  { name: "Madurai Night Market & Food Street", location: "Madurai", description: "High-energy evening bazaar filled with local street food vendors, lively chatter, and rich cultural interactions.", category: "Extraversion" },
  { name: "Kolli Hills 70 Hairpin Bends Trail", location: "Namakkal", description: "Exhilarating mountain road favored by motorbiking convoys and spirited group trekking expeditions.", category: "Extraversion" },
  { name: "Hogenakkal Coracle Boat Rapids", location: "Dharmapuri", description: "Thrilling group circular coracle boat rides slicing through roaring river gorges and lively fish markets.", category: "Extraversion" },
  { name: "Dhanushkodi 4x4 Beach Safari", location: "Rameswaram", description: "Action-packed off-road vehicle trek across coastal sands to the meeting point of two oceans.", category: "Extraversion" },
  { name: "Kallidaikurichi Artisan Craft Village", location: "Tirunelveli", description: "Interactive village where travelers connect with local potters and weavers in hands-on community workshops.", category: "Extraversion" },

  // Agreeableness (Peaceful Nature, Warm Hamlets & Friendly Vistas)
  { name: "Droog Fort", location: "Coonoor", description: "Historic fort ruins set on a scenic hilltop with gentle breezes and birdwatching trails.", category: "Agreeableness" },
  { name: "Karadiyur View Point", location: "Yercaud", description: "Sweeping panoramic viewpoint over the Eastern Ghats valley, ideal for friendly group picnics.", category: "Agreeableness" },
  { name: "Javadi Hills", location: "Vellore", description: "Gentle hill region filled with peaceful forest trails, fruit orchards, and welcoming tribal hamlets.", category: "Agreeableness" },
  { name: "Ariyaman Beach", location: "Rameshwaram", description: "Calm, shallow beach with shaded casuarina groves, beloved by families and casual strolls.", category: "Agreeableness" },
  { name: "Kinnakorai Village", location: "Nilgiris", description: "A quiet, hospitable village surrounded by terraced green tea estates and mist-veiled valleys.", category: "Agreeableness" },
  { name: "Maanjolai Hills", location: "Tirunelveli", description: "Pristine tea plantations offering cozy mountain stays and warm tea-worker community culture.", category: "Agreeableness" },
  { name: "Athri Hill", location: "Near Madurai", description: "Quiet spiritual hilltop with ancient hermitages, ideal for peace lovers and heartfelt contemplation.", category: "Agreeableness" },

  // Neuroticism (Stress Relief, Serene Waters & Calming Havens)
  { name: "Sirumalai Quiet Hills", location: "Dindigul", description: "Restorative, cool retreat with quiet pine groves, serene lakes, and peaceful unhurried atmosphere.", category: "Neuroticism" },
  { name: "Megamalai Cloud Mountain", location: "Theni", description: "Mist-blanketed sanctuary far from crowds, offering soothing tea garden panoramas and stillness.", category: "Neuroticism" },
  { name: "Pulicat Lake Bird Sanctuary", location: "Thiruvallur", description: "Tranquil lagoon sanctuary where watching thousands of flamingos and waterbirds brings deep calm.", category: "Neuroticism" },
  { name: "Kenni Hidden Falls", location: "Near Madurai", description: "Quiet, secluded natural pool surrounded by dense tree cover for therapeutic relaxation.", category: "Neuroticism" },
  { name: "Kookal Lake & Falls", location: "Kodaikanal", description: "Peaceful grassland lake bordered by pine forests, perfect for de-stressing and deep restoration.", category: "Neuroticism" },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// POST route to get recommendations based on personality traits
router.post('/by-traits', async (req, res) => {
  const { scores } = req.body;

  if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) {
    console.warn('Backend: Scores data is missing or invalid for recommendations.');
    return res.status(400).json({ message: 'Personality scores are required to get recommendations.' });
  }

  console.log('Backend: Received scores for trait-based recommendations:', scores);

  // Full OCEAN mapping covering all 5 traits
  const traitCategoryMap = {
    trait0: { name: 'Openness', category: 'Openness' },
    trait1: { name: 'Conscientiousness', category: 'Conscientiousness' },
    trait2: { name: 'Extraversion', category: 'Extraversion' },
    trait3: { name: 'Agreeableness', category: 'Agreeableness' },
    trait4: { name: 'Neuroticism', category: 'Neuroticism' },
  };

  // Sort traits by user score in descending order
  const sortedTraits = Object.entries(scores)
    .map(([traitKey, score]) => ({
      traitKey,
      score: Number(score) || 0,
      ...traitCategoryMap[traitKey]
    }))
    .filter(t => t.category)
    .sort((a, b) => b.score - a.score);

  console.log('Backend: Sorted traits by user score:', sortedTraits.map(t => `${t.name}: ${t.score}`));

  const primaryTrait = sortedTraits[0]?.category || 'Openness';
  const secondaryTrait = sortedTraits[1]?.category || 'Agreeableness';
  const tertiaryTrait = sortedTraits[2]?.category || 'Extraversion';

  // Quotas: 3 from dominant, 2 from secondary, 1 from tertiary = 6 total varied recommendations
  const quotaMap = [
    { category: primaryTrait, count: 3 },
    { category: secondaryTrait, count: 2 },
    { category: tertiaryTrait, count: 1 }
  ];

  try {
    const finalRecommendations = [];
    const usedNames = new Set();

    for (const { category, count } of quotaMap) {
      let sampled = [];

      // Attempt random sampling from MongoDB using $sample aggregation
      try {
        sampled = await Place.aggregate([
          { $match: { category: category } },
          { $sample: { size: count } }
        ]);
      } catch (dbErr) {
        console.warn(`MongoDB aggregation failed for category ${category}, falling back to catalogue:`, dbErr.message);
      }

      // If DB has no places or fewer places for this category (e.g. before re-seeding)
      if (!sampled || sampled.length < count) {
        const fallbackCandidates = FALLBACK_PLACES.filter(
          p => p.category === category && !usedNames.has(p.name)
        );
        const shuffledFallback = shuffleArray(fallbackCandidates);
        const needed = count - (sampled ? sampled.length : 0);
        sampled = [...(sampled || []), ...shuffledFallback.slice(0, needed)];
      }

      // Add to recommendations and track uniqueness
      for (const place of sampled) {
        if (!usedNames.has(place.name)) {
          usedNames.add(place.name);
          finalRecommendations.push({
            _id: place._id || `fallback-${place.name}`,
            name: place.name,
            location: place.location || 'Tamil Nadu',
            description: place.description,
            category: place.category,
            matchedTrait: category
          });
        }
      }
    }

    // Ensure we have at least 5 recommendations
    if (finalRecommendations.length < 5) {
      const remainingFallback = shuffleArray(FALLBACK_PLACES.filter(p => !usedNames.has(p.name)));
      for (const p of remainingFallback) {
        if (finalRecommendations.length >= 6) break;
        usedNames.add(p.name);
        finalRecommendations.push({
          _id: p._id || `fallback-${p.name}`,
          name: p.name,
          location: p.location || 'Tamil Nadu',
          description: p.description,
          category: p.category,
          matchedTrait: p.category
        });
      }
    }

    // Return randomized recommendations
    res.json({
      recommendations: shuffleArray(finalRecommendations),
      primaryTrait,
      secondaryTrait,
      message: `Hidden gems customized for your dominant traits: ${primaryTrait} & ${secondaryTrait}!`
    });

  } catch (error) {
    console.error("Backend Error in /recommend/by-traits route:", error);

    // Reliable fallback response directly from in-memory catalogue
    const emergencyPlaces = shuffleArray(FALLBACK_PLACES)
      .slice(0, 6)
      .map(p => ({ ...p, _id: `fallback-${p.name}`, matchedTrait: p.category }));

    res.json({
      recommendations: emergencyPlaces,
      primaryTrait,
      secondaryTrait,
      message: 'Showing curated hidden gems based on your personality.'
    });
  }
});

module.exports = router;
