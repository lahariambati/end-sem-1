import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const Assessment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "What is React?",
      options: ["A JavaScript library", "A database", "A server", "An OS"],
      correct: 0
    },
    {
      id: 2,
      question: "What is JSX?",
      options: ["JavaScript XML", "Java Syntax", "JSON Extended", "JavaScript eXtended"],
      correct: 0
    },
    {
      id: 3,
      question: "What is a React Hook?",
      options: ["A function", "A class", "A component", "A library"],
      correct: 0
    },
    {
      id: 4,
      question: "What is useState used for?",
      options: ["State management", "Routing", "API calls", "Styling"],
      correct: 0
    },
    {
      id: 5,
      question: "What is the virtual DOM?",
      options: ["A JavaScript representation of DOM", "A real DOM", "A database", "A server"],
      correct: 0
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishAssessment = () => {
    const score = answers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correct ? 1 : 0);
    }, 0);

    const result = {
      userId: user?.id,
      userName: user?.name,
      score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      date: new Date().toISOString(),
      answers
    };

    // Save to localStorage
    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    assessments.push(result);
    localStorage.setItem('assessments', JSON.stringify(assessments));
    localStorage.setItem('lastAssessment', JSON.stringify(result));

    setShowResult(true);
  };

  const getScore = () => {
    return answers.reduce((total, answer, index) => {
      return total + (answer === questions[index].correct ? 1 : 0);
    }, 0);
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>Please Login</h2>
        <p>You need to be logged in to take the assessment.</p>
      </div>
    );
  }

  if (showResult) {
    const score = getScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body text-center">
                <h2 className="mb-4">Assessment Complete!</h2>
                <div className="mb-4">
                  <div className={`display-4 ${percentage >= 70 ? 'text-success' : percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                    {percentage}%
                  </div>
                  <p className="lead">You scored {score} out of {questions.length}</p>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5>Performance</h5>
                        <div className="progress mb-2">
                          <div 
                            className={`progress-bar ${percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <small>{percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good!' : 'Keep Learning!'}</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5>Details</h5>
                        <p className="mb-1">Correct: {score}</p>
                        <p className="mb-1">Incorrect: {questions.length - score}</p>
                        <p className="mb-0">Total: {questions.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="btn btn-primary me-2" onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                  </button>
                  <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
                    Retake Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4>React Assessment</h4>
                <span className="badge bg-primary">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="progress mt-2">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="card-body">
              <h5 className="mb-4">{questions[currentQuestion].question}</h5>
              
              <div className="row">
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="col-12 mb-2">
                    <div 
                      className={`card option-card ${answers[currentQuestion] === index ? 'border-primary bg-light' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAnswer(index)}
                    >
                      <div className="card-body py-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={`question-${currentQuestion}`}
                            checked={answers[currentQuestion] === index}
                            onChange={() => handleAnswer(index)}
                          />
                          <label className="form-check-label">
                            {option}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <button 
                  className="btn btn-outline-secondary"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={nextQuestion}
                  disabled={answers[currentQuestion] === undefined}
                >
                  {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;