import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import TourismPage from './components/TourismPage';
import AboutUs from './components/AboutUs';
import ContactUs from "./components/ContactUs";
import ResultPage from './components/ResultPage';
import QuizFlow from './components/QuizFlow';
import Recommendations from './components/Recommendation'; // Make sure this path is correct: 'Recommendation' vs 'Recommendations'

function App() {
  // Assuming 'scores' state is managed elsewhere or passed down if needed by QuizFlow
  // For the purpose of the recommendations flow, ResultPage will pass scores via route state

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/explore" element={<TourismPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Updated Route for Recommendations: No longer expects a :userId parameter */}
        {/* The Recommendations component will now receive scores via `location.state` */}
        <Route path="/recommendations" element={<Recommendations />} />

        {/* Routes for quiz flow and results */}
        <Route path="/quiz" element={<QuizFlow />} />
        {/* ResultPage will get scores from QuizFlow, and then pass them to Recommendations via state */}
        <Route path="/result" element={<ResultPage />} />
        {/* If you previously had /result/:userId for ResultPage, it's now redundant for this flow */}
        {/* <Route path="/result/:userId" element={<ResultPage />} /> */}

        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
