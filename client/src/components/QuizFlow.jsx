import React, { useState } from 'react';
import PersonalityQuiz from './PersonalityQuiz';
import ResultPage from './ResultPage';

const QuizFlow = () => {
  const [showResult, setShowResult] = useState(false);
  const [scores, setScores] = useState({});

  const handleQuizSubmit = (traitScores) => {
    setScores(traitScores);
    try {
      sessionStorage.setItem('trace_scores', JSON.stringify(traitScores));
    } catch (e) {}
    setShowResult(true);
  };

  const handleExploreClick = () => {
    window.location.href = "/explore";  // OR use navigate()
  };

  return (
    <>
      {!showResult ? (
        <PersonalityQuiz onSubmit={handleQuizSubmit} />
      ) : (
        <ResultPage scores={scores} onExplore={handleExploreClick} />
      )}
    </>
  );
};

export default QuizFlow;
