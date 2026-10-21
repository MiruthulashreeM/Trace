// ✅ File: /src/pages/ResultDownload.jsx
import React from 'react';
import './ResultPage.css';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#d63031', '#e17055', '#fdcb6e', '#00cec9', '#0984e3'];

const ResultDownload = ({ scores, summary, aiTips, aiTraits, famousPersonality }) => {
  const traitEntries = Object.entries(scores || {});
  const totalScore = traitEntries.reduce((sum, [, s]) => sum + (Number(s) || 0), 0) || 50;

  const percentages = traitEntries.map(([trait, score]) => ({
    name: aiTraits[trait] || trait,
    value: parseFloat((((Number(score) || 10) / totalScore) * 100).toFixed(1)),
  }));

  const topTraits = [...percentages]
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((t) => t.name);

  return (
    <div className="result-page-wrapper">
      <div className="result-container horizontal">
        {/* Pie Chart Left Section */}
        <div className="left-chart-area">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={percentages}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {percentages.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right Information Section */}
        <div className="right-info-area">
          <div className="summary-box">
            <h3>🧠 Personality Summary</h3>
            <p>{summary || 'The AI could not generate a summary at the moment.'}</p>
          </div>

          <div className="highlight-box">
            <h4>🌟 Top Traits</h4>
            <ul>
              {topTraits.map((trait, idx) => (
                <li key={idx}><strong>{trait}</strong></li>
              ))}
            </ul>
          </div>

          {famousPersonality && (
            <div className="highlight-box">
              <h4>🌟 You Resemble:</h4>
              <p>
                <strong>{famousPersonality.name}</strong> ({famousPersonality.match})<br />
                {famousPersonality.reason}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="traits-grid">
        {Object.entries(aiTips || {}).map(([trait, tips], index) => (
          <div key={index} className="trait-box">
            <h4>{aiTraits[trait] || trait}</h4>
            <ul>
              {tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultDownload;
