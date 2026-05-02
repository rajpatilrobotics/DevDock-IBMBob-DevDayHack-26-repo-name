import React, { useState } from 'react';

function InputSection({ repoUrl, onUrlChange, onAnalyze, onQuickOnboard, isAnalyzing, disabled }) {
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    if (!url.trim()) {
      return 'Please enter a GitHub repository URL';
    }
    if (!url.includes('github.com')) {
      return 'Please enter a valid GitHub URL (must contain github.com)';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateUrl(repoUrl);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onAnalyze();
  };

  const handleQuickOnboardClick = () => {
    const validationError = validateUrl(repoUrl);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onQuickOnboard();
  };

  const handleInputChange = (e) => {
    onUrlChange(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  return (
    <section className="input-section">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          <input
            type="text"
            className={`repo-input ${error ? 'input-error' : ''}`}
            placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
            value={repoUrl}
            onChange={handleInputChange}
            disabled={disabled}
          />
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>
        
        <div className="button-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={disabled || !repoUrl.trim()}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Repo'}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleQuickOnboardClick}
            disabled={disabled || !repoUrl.trim()}
          >
            Onboard me in 5 minutes
          </button>
        </div>
      </form>
    </section>
  );
}

export default InputSection;

// Made with Bob
