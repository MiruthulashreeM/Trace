const mongoose = require('mongoose');
const Place = require('./models/Place');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trace';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const places = [
  // Cultural & Architectural Heritage → Openness
  { name: "Nilgiri Library", location: "Nilgiris", description: "An ancient library with colonial architecture and rare literary archives.", category: "Openness" },
  { name: "Sankagiri Fort", location: "Salem", description: "Historic hill fort offering sweeping panoramic vistas and ancient ramparts.", category: "Openness" },
  { name: "Sri Aurobindo Ashram", location: "Puducherry", description: "Peaceful ashram steeped in spiritual history, philosophy, and mindful reflection.", category: "Openness" },
  { name: "The Charming Villas in White Town", location: "Puducherry", description: "Vibrant Franco-Tamil colonial architecture, quaint courtyards, and artistic alleyways.", category: "Openness" },
  { name: "Thirumayam Fort", location: "Pudukkottai", description: "Massive 17th-century rock-cut fortress surrounded by dramatic granite boulder terrain.", category: "Openness" },
  { name: "Athangudi Palace", location: "Chettinad", description: "Traditional Chettinad architecture adorned with iconic handmade patterned tiles.", category: "Openness" },
  { name: "VVR Heritage House", location: "Kanadukathan, Chettinad", description: "Century-old heritage mansion showcasing indigenous timber carvings and courtyard designs.", category: "Openness" },
  { name: "Toda Huts", location: "Ooty", description: "Traditional barrel-vaulted houses preserving the ancient tribal architectural legacy of the Nilgiris.", category: "Openness" },

  // Spiritual & Heritage Monuments → Conscientiousness
  { name: "Pinnangudi Temple", location: "Pudukkottai", description: "Meticulously preserved historic temple renowned for its Stambha Maha Ganapathi.", category: "Conscientiousness" },
  { name: "Pathai Kulasekaranathar Mahalingam Temple", location: "Tirunelveli", description: "Ancient Shaivite temple built with disciplined Dravidian stone masonry and historical inscriptions.", category: "Conscientiousness" },
  { name: "Kariya Manicka Perumal Temple", location: "Kanchipuram", description: "A tranquil, lesser-known Vishnu temple celebrated for its intricate pillared corridors.", category: "Conscientiousness" },
  { name: "Piranmalai Kodunkundreeswar Temple", location: "Sivagangai", description: "Multi-tiered hillside temple complex engineered into a rocky cliff face with rich Sangam literature roots.", category: "Conscientiousness" },
  { name: "Athmanayaka–Rudrakoteeswarar Temple", location: "Sadurvadamangalam, Sivagangai", description: "Secluded heritage temple distinguished by its sacred geometry and stone sculptures.", category: "Conscientiousness" },
  { name: "Kayathar Kailasanathar Temple", location: "Thoothukudi", description: "Historically significant temple offering peaceful courtyards and disciplined daily rituals.", category: "Conscientiousness" },

  // Social, Vibrant & Adventure Spots → Extraversion
  { name: "Pondicherry Promenade & Rock Beach", location: "Puducherry", description: "Lively beachfront promenade bustling with social energy, street buskers, seaside cafes, and evening crowds.", category: "Extraversion" },
  { name: "Covelong (Kovalam) Surf & Music Village", location: "Chennai Coast", description: "Dynamic coastal community famous for group surf lessons, lively music festivals, and seaside adventures.", category: "Extraversion" },
  { name: "Madurai Night Market & Food Street", location: "Madurai", description: "High-energy evening bazaar filled with local street food vendors, lively chatter, and rich cultural interactions.", category: "Extraversion" },
  { name: "Kolli Hills 70 Hairpin Bends Trail", location: "Namakkal", description: "Exhilarating mountain road favored by motorbiking convoys and spirited group trekking expeditions.", category: "Extraversion" },
  { name: "Hogenakkal Coracle Boat Rapids", location: "Dharmapuri", description: "Thrilling group circular coracle boat rides slicing through roaring river gorges and lively fish markets.", category: "Extraversion" },
  { name: "Pichavaram Mangrove Eco-Boating Hub", location: "Chidambaram", description: "Interactive group boating adventures through one of the world's largest mangrove forest waterways.", category: "Extraversion" },
  { name: "Dhanushkodi 4x4 Beach Safari", location: "Rameswaram", description: "Action-packed off-road vehicle trek across coastal sands to the meeting point of two oceans.", category: "Extraversion" },
  { name: "Kallidaikurichi Artisan Craft Village", location: "Tirunelveli", description: "Interactive village where travelers connect with local potters and weavers in hands-on community workshops.", category: "Extraversion" },

  // Harmonious Nature & Community Villages → Agreeableness
  { name: "Droog Fort", location: "Coonoor", description: "Historic fort ruins set on a scenic hilltop with gentle breezes and birdwatching trails.", category: "Agreeableness" },
  { name: "Karadiyur View Point", location: "Yercaud", description: "Sweeping panoramic viewpoint over the Eastern Ghats valley, ideal for friendly group picnics.", category: "Agreeableness" },
  { name: "Javadi Hills", location: "Vellore", description: "Gentle hill region filled with peaceful forest trails, fruit orchards, and welcoming tribal hamlets.", category: "Agreeableness" },
  { name: "Ariyaman Beach", location: "Rameshwaram", description: "Calm, shallow beach with shaded casuarina groves, beloved by families and casual strolls.", category: "Agreeableness" },
  { name: "Kalrayan Hills", location: "Kallakurichi", description: "Unhurried hill range featuring scenic waterfalls, crystal clear streams, and friendly locals.", category: "Agreeableness" },
  { name: "Kinnakorai Village", location: "Nilgiris", description: "A quiet, hospitable village surrounded by terraced green tea estates and mist-veiled valleys.", category: "Agreeableness" },
  { name: "Hiriyaseekai Village", location: "Nilgiris", description: "Charming traditional hamlet offering genuine warm hospitality and untouched rural beauty.", category: "Agreeableness" },
  { name: "Maanjolai Hills", location: "Tirunelveli", description: "Pristine tea plantations offering cozy mountain stays and warm tea-worker community culture.", category: "Agreeableness" },
  { name: "Mekarai Village", location: "Tenkasi", description: "Hidden serene farming village backdropped by Western Ghats waterfalls and peaceful farmlands.", category: "Agreeableness" },
  { name: "Devala", location: "Nilgiris", description: "Picturesque offbeat rainforest haven near Gudalur known as the Cherrapunji of the South.", category: "Agreeableness" },
  { name: "Athri Hill", location: "Near Madurai", description: "Quiet spiritual hilltop with ancient hermitages, ideal for peace lovers and heartfelt contemplation.", category: "Agreeableness" },
  { name: "Pandrimalai", location: "Dindigul", description: "Harmonious village draped in lush greenery with gentle trails and friendly coffee planters.", category: "Agreeableness" },

  // Calming, Restorative & Stress-Relief Retreats → Neuroticism
  { name: "Sirumalai Quiet Hills", location: "Dindigul", description: "Restorative, cool retreat with quiet pine groves, serene lakes, and peaceful unhurried atmosphere.", category: "Neuroticism" },
  { name: "Megamalai Cloud Mountain", location: "Theni", description: "Mist-blanketed sanctuary far from crowds, offering soothing tea garden panoramas and stillness.", category: "Neuroticism" },
  { name: "Pulicat Lake Bird Sanctuary", location: "Thiruvallur", description: "Tranquil lagoon sanctuary where watching thousands of flamingos and waterbirds brings deep calm.", category: "Neuroticism" },
  { name: "Kenni Hidden Falls", location: "Near Madurai", description: "Quiet, secluded natural pool surrounded by dense tree cover for therapeutic relaxation.", category: "Neuroticism" },
  { name: "Varattaru Forest Stream", location: "Madurai", description: "Soothing natural brook hidden deep in forest shade, away from any traffic or city noise.", category: "Neuroticism" },
  { name: "Kookal Lake & Falls", location: "Kodaikanal", description: "Peaceful grassland lake bordered by pine forests, perfect for de-stressing and deep restoration.", category: "Neuroticism" },
];

async function seedDatabase() {
  try {
    // Clear previous places to avoid duplicates and ensure all 5 categories are clean
    await Place.deleteMany({});
    console.log("Cleared existing places.");

    const inserted = await Place.insertMany(places);
    console.log(`Successfully inserted ${inserted.length} places across all 5 OCEAN categories!`);
  } catch (err) {
    console.error("Error inserting places:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
