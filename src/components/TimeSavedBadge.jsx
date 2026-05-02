import React from 'react';

function TimeSavedBadge({ repoSize, isVisible }) {
  if (!isVisible) return null;

  // Calculate time saved based on repo size
  const calculateTimeSaved = () => {
    const days = Math.floor(repoSize / 100) + 10;
    const weeks = Math.floor(days / 7);
    return { days, weeks };
  };

  const { weeks } = calculateTimeSaved();

  return (
    <div className="time-saved-badge">
      <span className="badge-icon">⚡</span>
      <span className="badge-text">
        Time saved: <strong>{weeks} weeks</strong> → <strong className="highlight">5 minutes</strong>
      </span>
    </div>
  );
}

export default TimeSavedBadge;

// Made with Bob
