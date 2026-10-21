// gemini.js
import axios from 'axios';

// Pull key from environment variable if present, or fall back to default
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyA5YQYouBPPskuYWeeW2QZxETq3PXNCvN0';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL_ID = 'gemini-1.5-flash';

/**
 * Intelligent psychometric fallback generator when Gemini API is unavailable,
 * quota-limited, or unauthorized.
 */
function generateFallbackInsights(scores) {
  const o = scores?.trait0 ?? 6;
  const c = scores?.trait1 ?? 6;
  const e = scores?.trait2 ?? 6;
  const a = scores?.trait3 ?? 6;
  const n = scores?.trait4 ?? 6;

  // Identify primary and secondary strengths
  const traitValues = [
    { name: 'Openness', val: o, highDesc: 'curious, imaginative, and open to novel experiences' },
    { name: 'Conscientiousness', val: c, highDesc: 'disciplined, goal-oriented, and dependable' },
    { name: 'Extraversion', val: e, highDesc: 'outgoing, energetic, and socially engaged' },
    { name: 'Agreeableness', val: a, highDesc: 'empathetic, cooperative, and compassionate' },
    { name: 'Neuroticism', val: n, highDesc: 'emotionally sensitive, observant, and cautious' }
  ].sort((x, y) => y.val - x.val);

  const topTrait = traitValues[0];
  const secondTrait = traitValues[1];

  let famousMatch = "Leonardo da Vinci (Curious Explorer & Visionary)";
  if (topTrait.name === 'Extraversion') {
    famousMatch = "Amelia Earhart (Bold, adventurous, and inspiring trailblazer)";
  } else if (topTrait.name === 'Conscientiousness') {
    famousMatch = "Marcus Aurelius (Thoughtful, organized, and steadfast strategist)";
  } else if (topTrait.name === 'Agreeableness') {
    famousMatch = "Jane Goodall (Deeply empathetic, cooperative, and mindful observer)";
  } else if (topTrait.name === 'Neuroticism') {
    famousMatch = "Vincent van Gogh (Deeply sensitive, introspective, and passionately perceptive)";
  }

  const summary = `You possess a distinct personality profile highlighted by strong ${topTrait.name} and ${secondTrait.name}. You tend to be ${topTrait.highDesc}, while also being ${secondTrait.highDesc}. This dynamic gives you a balanced approach to exploring new destinations and connecting with the world around you.

In travel and daily life, your psychological tendencies favor environments where you can freely express your natural curiosity and autonomy. Embracing both spontaneous cultural immersion and structured discovery will bring you the greatest fulfillment and creative renewal.`;

  const traitTips = {
    Openness: o >= 6
      ? "Seek out offbeat cultural heritage sites, art galleries, and diverse cuisine to stimulate your creative intellect."
      : "Try stepping outside familiar routines by sampling local cuisines or visiting a new scenic landmark.",
    Conscientiousness: c >= 6
      ? "Channel your natural organization into creating flexible itineraries that balance must-see landmarks with relaxation."
      : "Keep lightweight checklists or booking reminders to reduce travel friction and ensure smooth transit.",
    Extraversion: e >= 6
      ? "Thrive in vibrant city centers, group walking tours, and lively social markets to recharge your energy."
      : "Carve out tranquil solo time in serene natural settings or quiet cafes to reflect and unwind.",
    Agreeableness: a >= 6
      ? "Connect warmly with local hosts, artisans, and fellow travelers through community-based cultural experiences."
      : "Practice clear communication of your personal preferences and travel boundaries with companions.",
    Neuroticism: n >= 6
      ? "Choose serene, restorative retreats like mountain viewpoints or peaceful beaches to stay centered and grounded."
      : "Your steady emotional resilience allows you to navigate unexpected travel delays with confidence and calm."
  };

  return {
    summary,
    traitTips,
    famousPersonality: famousMatch
  };
}

export const getGeminiSummary = async (scores) => {
  const url = `${BASE_URL}/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

  const promptText = `Given these personality scores from a game (each trait is scored out of 12):
Openness (Trait0): ${scores.trait0}
Conscientiousness (Trait1): ${scores.trait1}
Extraversion (Trait2): ${scores.trait2}
Agreeableness (Trait3): ${scores.trait3}
Neuroticism (Trait4): ${scores.trait4}

Based on these scores, provide a concise personality summary (1-2 paragraphs), 3 short actionable tips for personal growth based on their highest/lowest traits, and suggest one famous historical or fictional personality that might share similar broad traits. Respond only in JSON format with the following structure:
{
  "summary": "string",
  "traitTips": {
    "Openness": "string",
    "Conscientiousness": "string",
    "Extraversion": "string",
    "Agreeableness": "string",
    "Neuroticism": "string"
  },
  "famousPersonality": "string or null"
}`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          summary: { type: "STRING" },
          traitTips: {
            type: "OBJECT",
            properties: {
              Openness: { type: "STRING" },
              Conscientiousness: { type: "STRING" },
              Extraversion: { type: "STRING" },
              Agreeableness: { type: "STRING" },
              Neuroticism: { type: "STRING" }
            },
            required: ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism"]
          },
          famousPersonality: { type: "STRING", nullable: true }
        },
        required: ["summary", "traitTips", "famousPersonality"]
      }
    }
  };

  try {
    // Attempt live call to Gemini API
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 8000
    });

    const responseData = JSON.parse(response.data.candidates[0].content.parts[0].text);
    return responseData;
  } catch (error) {
    console.warn("Gemini API call failed (quota, invalid key, or network). Using psychometric fallback insights:", error.message);
    // Return gracefully generated psychometric insights instead of crashing the UI
    return generateFallbackInsights(scores);
  }
};