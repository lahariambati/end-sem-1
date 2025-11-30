import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface AssessmentResult {
  userId: string;
  userName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  answers: number[];
}

const Results: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [lastResult, setLastResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    loadResults();
  }, [user]);

  const loadResults = () => {
    const allAssessments = JSON.parse(localStorage.getItem('assessments') || '[]');
    const userResults = allAssessments.filter((result: AssessmentResult) => result.userId === user?.id);
    setResults(userResults);

    const lastAssessment = JSON.parse(localStorage.getItem('lastAssessment') || 'null');
    if (lastAssessment && lastAssessment.userId === user?.id) {
      setLastResult(lastAssessment);
    }
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `assessment-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>Please Login</h2>
        <p>You need to be logged in to view results.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Assessment Results</h2>
            <div>
              <button className="btn btn-outline-primary me-2" onClick={exportResults}>
                <i className="fas fa-download me-1"></i>
                Export Results
              </button>
              <Link to="/assessment" className="btn btn-primary">
                Take New Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {lastResult && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Latest Assessment Result</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 text-center">
                    <div className={`display-6 ${lastResult.percentage >= 70 ? 'text-success' : lastResult.percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                      {lastResult.percentage}%
                    </div>
                    <p className="text-muted">Score</p>
                  </div>
                  <div className="col-md-3 text-center">
                    <div className="h4">{lastResult.score}/{lastResult.totalQuestions}</div>
                    <p className="text-muted">Correct Answers</p>
                  </div>
                  <div className="col-md-3 text-center">
                    <div className="h4">{new Date(lastResult.date).toLocaleDateString()}</div>
                    <p className="text-muted">Date Taken</p>
                  </div>
                  <div className="col-md-3 text-center">
                    <div className={`h4 ${lastResult.percentage >= 70 ? 'text-success' : lastResult.percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                      {lastResult.percentage >= 70 ? 'Excellent' : lastResult.percentage >= 50 ? 'Good' : 'Needs Improvement'}
                    </div>
                    <p className="text-muted">Performance</p>
                  </div>
                </div>
                <div className="progress mt-3">
                  <div 
                    className={`progress-bar ${lastResult.percentage >= 70 ? 'bg-success' : lastResult.percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: `${lastResult.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Assessment History</h5>
            </div>
            <div className="card-body">
              {results.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No assessments taken yet.</p>
                  <Link to="/assessment" className="btn btn-primary">
                    Take Your First Assessment
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={index}>
                          <td>{new Date(result.date).toLocaleDateString()}</td>
                          <td>{result.score}/{result.totalQuestions}</td>
                          <td>
                            <span className={`badge ${result.percentage >= 70 ? 'bg-success' : result.percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}>
                              {result.percentage}%
                            </span>
                          </td>
                          <td>
                            <span className={`text-${result.percentage >= 70 ? 'success' : result.percentage >= 50 ? 'warning' : 'danger'}`}>
                              {result.percentage >= 70 ? 'Excellent' : result.percentage >= 50 ? 'Good' : 'Needs Improvement'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>Statistics</h5>
            </div>
            <div className="card-body">
              {results.length > 0 ? (
                <>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Total Assessments:</span>
                      <strong>{results.length}</strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Average Score:</span>
                      <strong>
                        {Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)}%
                      </strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Best Score:</span>
                      <strong className="text-success">
                        {Math.max(...results.map(r => r.percentage))}%
                      </strong>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Last Assessment:</span>
                      <strong>
                        {new Date(results[results.length - 1].date).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted">No statistics available yet.</p>
              )}
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <Link to="/assessment" className="btn btn-primary w-100 mb-2">
                <i className="fas fa-play me-1"></i>
                Take Assessment
              </Link>
              <Link to="/dashboard" className="btn btn-outline-primary w-100">
                <i className="fas fa-tachometer-alt me-1"></i>
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;