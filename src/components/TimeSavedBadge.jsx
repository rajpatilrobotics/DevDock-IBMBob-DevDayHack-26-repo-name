import React from 'react';

function TimeSavedBadge({ repoSize, isVisible }) {
  if (!isVisible) return null;

  // Calculate time saved based on repo size
  const calculateTimeSaved = () => {
    const days = Math.floor(repoSize / 100) + 10;
    const weeks = Math.floor(days / 7);
    return { days, weeks };
  };

  // Classify project size based on file count
  const getProjectClassification = (fileCount) => {
    if (fileCount < 500) {
      return { type: 'Small project', color: '#10b981' };
    } else if (fileCount < 2000) {
      return { type: 'Medium-sized codebase', color: '#3b82f6' };
    } else if (fileCount < 5000) {
      return { type: 'Large codebase', color: '#f59e0b' };
    } else {
      return { type: 'Enterprise codebase', color: '#8b5cf6' };
    }
  };

  const { weeks } = calculateTimeSaved();
  const classification = getProjectClassification(repoSize);

  return (
    <div className="time-saved-badge">
      <div className="badge-main">
        <span className="badge-icon">⚡</span>
        <span className="badge-text">
          Time saved: <strong>{weeks} weeks</strong> → <strong className="highlight">5 minutes</strong>
        </span>
      </div>
      <div className="badge-context">
        <span className="context-text">
          Based on repository size ({repoSize.toLocaleString()} files)
        </span>
        <span className="context-divider">•</span>
        <span
          className="context-classification"
          style={{ color: classification.color }}
        >
          Typical for a {classification.type.toLowerCase()}
        </span>
      </div>
    </div>
  );
}

export default TimeSavedBadge;

// Made with Bob
