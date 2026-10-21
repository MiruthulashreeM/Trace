import React, { useState } from 'react';
import './PersonalityQuiz.css';

// 20 Psychometrically balanced questions: exactly 4 questions per OCEAN trait.
// Scored on a standard 4-point scale: 4 (Strongly High), 3 (High), 2 (Moderate), 1 (Mild/Low).
const questions = [
  // --- OPENNESS (Questions 0 - 3) ---
  {
    trait: 'trait0',
    traitName: 'Openness',
    question: "When planning a trip, what excites you the most?",
    options: [
      { text: "Unexplored cultures, offbeat art, and new philosophies", score: 4 },
      { text: "Visiting renowned museums and iconic cultural monuments", score: 3 },
      { text: "Sticking to popular, well-known sightseeing attractions", score: 2 },
      { text: "Visiting familiar places where I know exactly what to expect", score: 1 }
    ]
  },
  {
    trait: 'trait0',
    traitName: 'Openness',
    question: "How do you feel about trying completely unfamiliar exotic local cuisines?",
    options: [
      { text: "Eager! I want to taste the most unique and exotic dishes", score: 4 },
      { text: "Curious and willing to try with an open mind", score: 3 },
      { text: "Somewhat hesitant; I prefer safe, familiar options", score: 2 },
      { text: "I avoid them and stick strictly to my comfort food", score: 1 }
    ]
  },
  {
    trait: 'trait0',
    traitName: 'Openness',
    question: "Which phrase best describes your inner creative world?",
    options: [
      { text: "Endlessly imaginative, artistic, and craving novel ideas", score: 4 },
      { text: "Reflective and appreciative of beauty and storytelling", score: 3 },
      { text: "Practical and mostly grounded in everyday reality", score: 2 },
      { text: "Strictly routine-focused and straightforward", score: 1 }
    ]
  },
  {
    trait: 'trait0',
    traitName: 'Openness',
    question: "Given a completely free day in an unfamiliar town, you naturally:",
    options: [
      { text: "Wander spontaneously into alleyways to find hidden gems and street art", score: 4 },
      { text: "Explore a local craft market or historic heritage gallery", score: 3 },
      { text: "Follow a standard tourist map or top-rated checklist", score: 2 },
      { text: "Relax at the hotel or visit a shopping mall", score: 1 }
    ]
  },

  // --- CONSCIENTIOUSNESS (Questions 4 - 7) ---
  {
    trait: 'trait1',
    traitName: 'Conscientiousness',
    question: "How do you typically prepare for an upcoming journey or important project?",
    options: [
      { text: "Detailed itinerary with reservations, backup plans, and timed checklists", score: 4 },
      { text: "An organized outline of key sights and essential bookings", score: 3 },
      { text: "A loose mental plan of what I might do each day", score: 2 },
      { text: "No planning at all; I wing everything completely at the last minute", score: 1 }
    ]
  },
  {
    trait: 'trait1',
    traitName: 'Conscientiousness',
    question: "When scheduled departure times or deadlines approach, you usually:",
    options: [
      { text: "Arrive well in advance with everything packed and double-checked", score: 4 },
      { text: "Arrive right on time without rushing or stress", score: 3 },
      { text: "Sometimes rush at the last minute to catch up", score: 2 },
      { text: "Frequently run late or forget essential items", score: 1 }
    ]
  },
  {
    trait: 'trait1',
    traitName: 'Conscientiousness',
    question: "In your daily work or studies, what is your signature habit?",
    options: [
      { text: "Methodical discipline, clean organization, and following through", score: 4 },
      { text: "Steady progress and dependable consistency", score: 3 },
      { text: "Working in flexible bursts when pressure builds", score: 2 },
      { text: "Spontaneous chaos; I dislike routines and structure", score: 1 }
    ]
  },
  {
    trait: 'trait1',
    traitName: 'Conscientiousness',
    question: "How do you handle your personal belongings and travel gear?",
    options: [
      { text: "Neatly organized with pouches, labels, and designated spots", score: 4 },
      { text: "Generally orderly with occasional clutter", score: 3 },
      { text: "Somewhat messy until I'm forced to tidy up", score: 2 },
      { text: "Total chaos; I frequently misplace keys or tickets", score: 1 }
    ]
  },

  // --- EXTRAVERSION (Questions 8 - 11) ---
  {
    trait: 'trait2',
    traitName: 'Extraversion',
    question: "At a vibrant social gathering, celebration, or festival, you:",
    options: [
      { text: "Mingle enthusiastically, dance, and love being in the center of the crowd", score: 4 },
      { text: "Chat warmly within an active group of friends", score: 3 },
      { text: "Have quiet conversations with one or two people in a cozy corner", score: 2 },
      { text: "Feel quickly drained by the noise and seek a quiet exit", score: 1 }
    ]
  },
  {
    trait: 'trait2',
    traitName: 'Extraversion',
    question: "After a long and demanding week, how do you recharge your energy best?",
    options: [
      { text: "Going out with a lively group, partying, or joining exciting events", score: 4 },
      { text: "A fun dinner with close companions and lively conversation", score: 3 },
      { text: "A balanced evening chatting with family followed by personal downtime", score: 2 },
      { text: "Complete solitude—reading, gaming, or quiet reflection alone", score: 1 }
    ]
  },
  {
    trait: 'trait2',
    traitName: 'Extraversion',
    question: "Which travel vibe appeals to your spirit the most?",
    options: [
      { text: "Bustling night markets, beach festivals, and high-energy social hotspots", score: 4 },
      { text: "Guided group expeditions and lively walking tours with fellow travelers", score: 3 },
      { text: "Quiet scenic viewpoints with very few people around", score: 2 },
      { text: "Completely secluded wilderness escapes far away from all crowds", score: 1 }
    ]
  },
  {
    trait: 'trait2',
    traitName: 'Extraversion',
    question: "When entering a room full of new people, your natural instinct is to:",
    options: [
      { text: "Introduce myself boldly and spark up conversations right away", score: 4 },
      { text: "Smile warmly and join in when someone starts talking", score: 3 },
      { text: "Wait comfortably for others to initiate interaction", score: 2 },
      { text: "Keep quietly to myself and avoid unnecessary small talk", score: 1 }
    ]
  },

  // --- AGREEABLENESS (Questions 12 - 15) ---
  {
    trait: 'trait3',
    traitName: 'Agreeableness',
    question: "You notice a fellow traveler struggling with heavy bags or looking lost. You:",
    options: [
      { text: "Immediately step up, offer assistance, and guide them with a warm smile", score: 4 },
      { text: "Politely ask if they could use a hand", score: 3 },
      { text: "Wait to see if station staff or someone else assists first", score: 2 },
      { text: "Keep walking and stay focused on my own schedule", score: 1 }
    ]
  },
  {
    trait: 'trait3',
    traitName: 'Agreeableness',
    question: "During a disagreement about where a group should eat or travel, you:",
    options: [
      { text: "Prioritize group harmony and make sure everyone feels heard and content", score: 4 },
      { text: "Happily compromise to find a pleasant middle ground", score: 3 },
      { text: "Express my preference but go along with the majority", score: 2 },
      { text: "Insist firmly on my preference or go off on my own", score: 1 }
    ]
  },
  {
    trait: 'trait3',
    traitName: 'Agreeableness',
    question: "How would your closest friends describe your natural demeanor?",
    options: [
      { text: "Deeply compassionate, generous, empathetic, and always supportive", score: 4 },
      { text: "Kind-hearted, friendly, and dependable", score: 3 },
      { text: "Pragmatic, candid, and selectively warm", score: 2 },
      { text: "Blunt, highly independent, and skepticism-first", score: 1 }
    ]
  },
  {
    trait: 'trait3',
    traitName: 'Agreeableness',
    question: "What makes a local village visit most memorable for you?",
    options: [
      { text: "Connecting warmly with local families, sharing stories, and bonding", score: 4 },
      { text: "Appreciating the community hospitality and local customs", score: 3 },
      { text: "Observing community traditions respectfully from a polite distance", score: 2 },
      { text: "Taking photos of the architecture without personal interaction", score: 1 }
    ]
  },

  // --- NEUROTICISM (Questions 16 - 19) ---
  {
    trait: 'trait4',
    traitName: 'Neuroticism',
    question: "When unexpected travel delays, cancellations, or mix-ups happen, you:",
    options: [
      { text: "Feel intense anxiety and stress, worrying about what else could go wrong", score: 4 },
      { text: "Feel briefly frustrated and unsettled before trying to adjust", score: 3 },
      { text: "Take a deep breath, stay relatively composed, and find a workaround", score: 2 },
      { text: "Stay completely relaxed, calm, and unfazed by the unpredictability", score: 1 }
    ]
  },
  {
    trait: 'trait4',
    traitName: 'Neuroticism',
    question: "In loud, overcrowded, or chaotic environments, you typically feel:",
    options: [
      { text: "Easily overwhelmed and urgently needing a tranquil sanctuary", score: 4 },
      { text: "Somewhat fatigued and irritable after a short time", score: 3 },
      { text: "Mildly drained, but able to adapt comfortably", score: 2 },
      { text: "Completely at ease and grounded regardless of surrounding chaos", score: 1 }
    ]
  },
  {
    trait: 'trait4',
    traitName: 'Neuroticism',
    question: "How often do you find yourself overthinking decisions or replaying worries?",
    options: [
      { text: "Very often; my mind constantly replays 'what if' scenarios", score: 4 },
      { text: "Occasionally when under significant work or travel pressure", score: 3 },
      { text: "Rarely; I process concerns and move forward quickly", score: 2 },
      { text: "Almost never; I live in the present and let worries go easily", score: 1 }
    ]
  },
  {
    trait: 'trait4',
    traitName: 'Neuroticism',
    question: "What kind of natural sanctuary brings you the greatest inner relief?",
    options: [
      { text: "A secluded, tranquil mountain waterfall where I can release all built-up stress", score: 4 },
      { text: "A quiet, misty hill station with peaceful pine trees and fresh air", score: 3 },
      { text: "A pleasant city park or garden for a casual afternoon stroll", score: 2 },
      { text: "Any scenic spot works fine; I rarely feel internal tension", score: 1 }
    ]
  }
];

const PersonalityQuiz = ({ onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  const handleOptionClick = (index) => {
    setSelectedOptionIndex(index);
  };

  const handleNext = () => {
    if (selectedOptionIndex === null && answers[currentQuestionIndex] === undefined) return;
    const updatedAnswers = [...answers];
    if (selectedOptionIndex !== null) {
      updatedAnswers[currentQuestionIndex] = selectedOptionIndex;
    }
    setAnswers(updatedAnswers);
    setSelectedOptionIndex(answers[currentQuestionIndex + 1] ?? null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex === 0) return;
    const updatedAnswers = [...answers];
    if (selectedOptionIndex !== null) {
      updatedAnswers[currentQuestionIndex] = selectedOptionIndex;
    }
    setAnswers(updatedAnswers);
    setCurrentQuestionIndex((prev) => prev - 1);
    setSelectedOptionIndex(updatedAnswers[currentQuestionIndex - 1] ?? null);
  };

  const handleReset = () => {
    setAnswers([]);
    setSelectedOptionIndex(null);
    setCurrentQuestionIndex(0);
  };

  const handleSubmit = () => {
    // Capture the final question's answer cleanly
    const finalAnswers = [...answers];
    if (selectedOptionIndex !== null) {
      finalAnswers[currentQuestionIndex] = selectedOptionIndex;
    }

    // Initialize trait totals (each trait has 4 questions with scores 1 to 4)
    const traitScores = {
      trait0: 0, // Openness
      trait1: 0, // Conscientiousness
      trait2: 0, // Extraversion
      trait3: 0, // Agreeableness
      trait4: 0  // Neuroticism
    };

    finalAnswers.forEach((chosenOptionIdx, qIdx) => {
      const q = questions[qIdx];
      if (q && chosenOptionIdx !== undefined && chosenOptionIdx !== null) {
        const optionObj = q.options[chosenOptionIdx];
        const points = optionObj ? optionObj.score : 2;
        traitScores[q.trait] += points;
      }
    });

    // Fallback baseline if any trait had unselected answers
    Object.keys(traitScores).forEach(k => {
      if (!traitScores[k] || traitScores[k] <= 0) {
        traitScores[k] = 8;
      }
    });

    console.log("Calculated Psychometric OCEAN Scores:", traitScores);

    // Save in sessionStorage to prevent loss across routes/refreshes
    try {
      sessionStorage.setItem('trace_scores', JSON.stringify(traitScores));
    } catch (e) {}

    onSubmit(traitScores);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <div className="quiz-overlay">
          <div className="quiz-main">
            <div className="quiz-progress">
              <span className="quiz-progress-label">Question</span>
              <span className="quiz-progress-count">{currentQuestionIndex + 1}/{questions.length}</span>
              <div className="quiz-progress-bar">
                <div
                  className="quiz-progress-filled"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="quiz-trait-badge">
              Category: <strong>{currentQuestion.traitName}</strong>
            </div>

            <div className="quiz-question">{currentQuestion.question}</div>

            <div className="quiz-options">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`quiz-option ${selectedOptionIndex === index ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <span className="quiz-option-letter">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="quiz-option-text">{option.text}</span>
                </div>
              ))}
            </div>

            <div className="quiz-buttons">
              <button className="quiz-btn" onClick={handleReset}>Reset</button>
              <button
                className="quiz-btn"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  className="quiz-btn submit-btn"
                  onClick={handleSubmit}
                  disabled={selectedOptionIndex === null && answers[currentQuestionIndex] === undefined}
                >
                  Submit & See Personality
                </button>
              ) : (
                <button
                  className="quiz-btn"
                  onClick={handleNext}
                  disabled={selectedOptionIndex === null && answers[currentQuestionIndex] === undefined}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
