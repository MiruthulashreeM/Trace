import React, { useEffect, useState, useMemo } from 'react';
import './ResultPage.css';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { getGeminiSummary } from '../utils/gemini';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom';

const TRAIT_CONFIG = {
  trait0: { name: 'Openness', color: '#ef4444', desc: 'Curiosity, imagination, appreciation for culture and new experiences' },
  trait1: { name: 'Conscientiousness', color: '#f97316', desc: 'Discipline, organization, structured planning, and dependability' },
  trait2: { name: 'Extraversion', color: '#eab308', desc: 'Energy from people, sociability, boldness, and adventurous spirit' },
  trait3: { name: 'Agreeableness', color: '#06b6d4', desc: 'Empathy, compassion, warm cooperation, and harmony' },
  trait4: { name: 'Neuroticism', color: '#3b82f6', desc: 'Emotional sensitivity, need for calming retreats, and stress relief' },
};

function determinePersonalityArchetype(top1, top2) {
  const pair = `${top1.name}+${top2.name}`;
  const reversePair = `${top2.name}+${top1.name}`;

  const archetypeMap = {
    'Extraversion+Openness': {
      title: "The Bold Visionary & Social Explorer",
      tagline: "High-spirited, culturally curious, and energized by novel adventures and vibrant people."
    },
    'Extraversion+Agreeableness': {
      title: "The Radiant Connector & Community Soul",
      tagline: "Warm, outgoing, and happiest when sharing lively moments with fellow travelers."
    },
    'Extraversion+Conscientiousness': {
      title: "The Dynamic Leader & Expedition Organizer",
      tagline: "Energetic, proactive, and exceptionally skilled at orchestrating memorable journeys."
    },
    'Extraversion+Neuroticism': {
      title: "The Passionate Adventurer & Expressive Seeker",
      tagline: "Deeply feeling, enthusiastic, and seeking invigorating experiences to overcome tension."
    },
    'Openness+Conscientiousness': {
      title: "The Cultural Scholar & Heritage Architect",
      tagline: "Appreciates deep history, sacred geometry, and thoughtfully curated explorations."
    },
    'Openness+Agreeableness': {
      title: "The Mindful Philosopher & Harmonious Wanderer",
      tagline: "Curious about indigenous art, empathetic toward locals, and gentle in nature."
    },
    'Openness+Neuroticism': {
      title: "The Creative Dreamer & Poetic Sanctuary Seeker",
      tagline: "Imaginative, emotionally rich, and recharged by serene landscapes and contemplative spaces."
    },
    'Conscientiousness+Agreeableness': {
      title: "The Dependable Guide & Compassionate Planner",
      tagline: "Organized, kind-hearted, and dedicated to smooth, harmonious travel for everyone."
    },
    'Conscientiousness+Neuroticism': {
      title: "The Thoughtful Strategist & Serenity Planner",
      tagline: "Prefers well-structured, quiet itineraries that minimize chaos and restore peace of mind."
    },
    'Agreeableness+Neuroticism': {
      title: "The Gentle Healer & Mindful Nature Lover",
      tagline: "Empathetic, sensitive, and deeply refreshed by peaceful waterfalls and quiet villages."
    }
  };

  return archetypeMap[pair] || archetypeMap[reversePair] || {
    title: `The ${top1.name} Explorer`,
    tagline: `Guided primarily by a high affinity for ${top1.name.toLowerCase()} and authentic personal discovery.`
  };
}

const ResultPage = ({ scores: propScores }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load scores reliably from props, route state, or sessionStorage
  const scores = useMemo(() => {
    if (propScores && Object.keys(propScores).length > 0) return propScores;
    if (location.state?.scores && Object.keys(location.state.scores).length > 0) return location.state.scores;
    try {
      const stored = sessionStorage.getItem('trace_scores');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Object.keys(parsed).length > 0) return parsed;
      }
    } catch (e) {}
    // Balanced default if visited directly
    return { trait0: 12, trait1: 10, trait2: 15, trait3: 13, trait4: 8 };
  }, [propScores, location.state]);

  const [summary, setSummary] = useState('');
  const [aiTips, setAiTips] = useState({});
  const [famousPersonality, setFamousPersonality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorGeneratingSummary, setErrorGeneratingSummary] = useState(false);

  // Calculate normalized percentages such that the Pie Chart TOTAL IS ALWAYS 100%
  const { traitList, rankedTraits, dominantTrait, secondaryTrait, archetype } = useMemo(() => {
    // 1. Gather raw scores and compute grand total
    const rawScores = {};
    let totalScore = 0;

    Object.keys(TRAIT_CONFIG).forEach(key => {
      let val = Number(scores[key]);
      if (isNaN(val) || val < 0) val = 0;
      rawScores[key] = val;
      totalScore += val;
    });

    // Safeguard: if total is zero, assign equal baseline so the pie chart never collapses
    const isAllZero = totalScore === 0;
    if (isAllZero) {
      Object.keys(TRAIT_CONFIG).forEach(k => { rawScores[k] = 10; });
      totalScore = 50;
    }

    // 2. Calculate proportional share of 100% for each trait
    let sumPercentages = 0;
    const list = Object.entries(TRAIT_CONFIG).map(([key, config]) => {
      const raw = rawScores[key];
      // Proportion of the 100% pie
      const exactShare = (raw / totalScore) * 100;
      const roundedPercent = parseFloat(exactShare.toFixed(1));
      sumPercentages += roundedPercent;

      return {
        key,
        name: config.name,
        color: config.color,
        desc: config.desc,
        score: raw,
        percentage: roundedPercent,
        value: roundedPercent
      };
    });

    // 3. Guarantee that the sum of slices equals EXACTLY 100.0%
    const roundingDiff = parseFloat((100.0 - sumPercentages).toFixed(1));
    if (roundingDiff !== 0 && list.length > 0) {
      // Absorb any tiny floating point rounding difference into the highest slice
      const maxSlice = list.reduce((prev, curr) => curr.value > prev.value ? curr : prev, list[0]);
      maxSlice.value = parseFloat((maxSlice.value + roundingDiff).toFixed(1));
      maxSlice.percentage = maxSlice.value;
    }

    // 4. Sort ranked list from highest percentage to lowest
    const ranked = [...list].sort((a, b) => b.percentage - a.percentage);
    const top1 = ranked[0] || list[0];
    const top2 = ranked[1] || list[1];
    const arch = determinePersonalityArchetype(top1, top2);

    return {
      traitList: list,
      rankedTraits: ranked,
      dominantTrait: top1,
      secondaryTrait: top2,
      archetype: arch
    };
  }, [scores]);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      setErrorGeneratingSummary(false);
      try {
        const result = await getGeminiSummary(scores);
        setSummary(result.summary || "Your personality profile shows a compelling balance across the Big Five traits.");
        setAiTips(result.traitTips || {});
        setFamousPersonality(result.famousPersonality || null);
      } catch (err) {
        console.error("Failed to fetch insights:", err);
        setSummary("Your personality profile shows a compelling balance across the Big Five traits.");
        setErrorGeneratingSummary(true);
      } finally {
        setLoading(false);
      }
    }

    if (scores && Object.keys(scores).length > 0) {
      fetchInsights();
    }
  }, [scores]);

  const handleExploreClick = () => {
    try {
      sessionStorage.setItem('trace_scores', JSON.stringify(scores));
    } catch (e) {}
    console.log('Navigating to recommendations with scores:', scores);
    navigate('/recommendations', { state: { scores } });
  };

  const handleDownload = () => {
    const container = document.querySelector('.result-container');
    const buttons = document.querySelector('.action-section');
    container.classList.add('download-layout');
    if (buttons) buttons.style.display = 'none';

    setTimeout(() => {
      html2canvas(container, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('trace-personality-dossier.pdf');
        container.classList.remove('download-layout');
        if (buttons) buttons.style.display = 'flex';
      });
    }, 300);
  };

  const renderCustomizedPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 22;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#1e293b"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="700"
      >
        {`${name}: ${percentage}%`}
      </text>
    );
  };

  return (
    <div className="result-page-wrapper">
      {loading ? (
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
          <p className="loading-text">Synthesizing your psychological profile with Gemini AI...</p>
        </div>
      ) : (
        <div className="result-container broader taller quiz-transparent">
          {/* Top Archetype Identification Banner */}
          <div className="archetype-banner">
            <span className="archetype-badge">🎯 Identified Personality Archetype</span>
            <h1 className="archetype-title">{archetype.title}</h1>
            <p className="archetype-tagline">{archetype.tagline}</p>
            <div className="archetype-dominant-pill">
              <span>Primary: <strong style={{ color: dominantTrait.color }}>{dominantTrait.name} ({dominantTrait.percentage}% share)</strong></span>
              <span className="pill-divider">•</span>
              <span>Secondary: <strong style={{ color: secondaryTrait.color }}>{secondaryTrait.name} ({secondaryTrait.percentage}% share)</strong></span>
            </div>
          </div>

          <div className="horizontal-section">
            {/* Left Section: Pie Chart & AI Summary */}
            <div className="left-section">
              <div className="chart-card">
                <div className="chart-header-row">
                  <h3>📊 Trait Distribution</h3>
                  <span className="total-100-badge">Total: 100%</span>
                </div>
                <div className="chart-section">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={traitList}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={95}
                        label={renderCustomizedPieLabel}
                        labelLine={true}
                      >
                        {traitList.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}% share of personality`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="custom-legend">
                    {traitList.map((trait) => (
                      <div key={trait.key} className="legend-item">
                        <span className="legend-color" style={{ backgroundColor: trait.color }}></span>
                        <span>{trait.name}: <strong>{trait.percentage}%</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gemini AI Summary Box */}
              <div className="summary-box below-pie">
                <div className="ai-summary-header">
                  <h3>🧠 Gemini AI Personality Insights</h3>
                  <span className="ai-model-tag">Gemini 1.5 &bull; Big Five OCEAN</span>
                </div>

                <p className="ai-summary-text">
                  {summary || (errorGeneratingSummary ? "Note: Gemini AI couldn't generate a live summary at this time." : "Loading psychological summary...")}
                </p>

                {aiTips && Object.keys(aiTips).length > 0 && (
                  <div className="ai-tips-section">
                    <h4>🌱 Tailored Growth Tips:</h4>
                    <div className="ai-tips-grid">
                      {Object.entries(aiTips).map(([trait, tip]) => (
                        <div key={trait} className="tip-card">
                          <strong>{trait}:</strong> <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {famousPersonality && (
                  <div className="famous-personality-section">
                    <h4>⭐ Famous Personality Match:</h4>
                    <p>{famousPersonality}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section: Ranked Trait Breakdown */}
            <div className="right-section">
              <div className="traits-ranked-card">
                <h3>🎯 Your Traits Ranked</h3>
                <p className="traits-ranked-subtitle">Ranked by proportion of your total personality profile (adds up to 100%)</p>

                <div className="ranked-traits-list">
                  {rankedTraits.map((trait, index) => {
                    const level = trait.percentage >= 24 ? 'Dominant' : trait.percentage >= 19 ? 'Strong' : trait.percentage >= 15 ? 'Moderate' : 'Mild';
                    const levelClass = trait.percentage >= 24 ? 'level-high' : trait.percentage >= 19 ? 'level-med' : 'level-low';

                    return (
                      <div key={trait.key} className="ranked-trait-item">
                        <div className="ranked-trait-header">
                          <div className="ranked-trait-title">
                            <span className="trait-rank-num">#{index + 1}</span>
                            <span className="trait-name">{trait.name}</span>
                          </div>
                          <div className="ranked-trait-stats">
                            <span className={`trait-level-tag ${levelClass}`}>{level}</span>
                            <span className="trait-percent-value">{trait.percentage}%</span>
                          </div>
                        </div>

                        {/* Progress Bar representing % share of 100% */}
                        <div className="trait-bar-track">
                          <div
                            className="trait-bar-fill"
                            style={{
                              width: `${Math.min(100, trait.percentage * 2.5)}%`,
                              backgroundColor: trait.color
                            }}
                          />
                        </div>

                        <p className="trait-brief-desc">{trait.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="action-section no-print">
            <button onClick={handleDownload} className="pdf-btn">
              📥 Download PDF Dossier
            </button>
            <button onClick={handleExploreClick} className="explore-btn">
              🔍 Explore Hidden Gems for {dominantTrait.name}
            </button>
            <button onClick={() => navigate('/quiz')} className="retake-btn">
              🔄 Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
