import React from 'react';

function Summary({ repoUrl, repoSize }) {
  return (
    <div className="tab-content summary-tab">
      <div className="content-card">
        <h2 className="card-title">Repository Overview</h2>
        <div className="card-content">
          <div className="info-row">
            <span className="info-label">Repository URL:</span>
            <span className="info-value">{repoUrl || 'N/A'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Files:</span>
            <span className="info-value">{repoSize} files</span>
          </div>
          <div className="info-row">
            <span className="info-label">Analysis Status:</span>
            <span className="info-value status-complete">✓ Complete</span>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value">87%</div>
            <div className="metric-label">Code Coverage</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">12</div>
            <div className="metric-label">Contributors</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">5</div>
            <div className="metric-label">Languages</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">234</div>
            <div className="metric-label">Commits</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">Quick Insights</h2>
        <div className="card-content">
          <ul className="insights-list">
            <li>✓ Well-structured codebase with clear separation of concerns</li>
            <li>✓ Comprehensive test coverage across major components</li>
            <li>✓ Active development with regular commits</li>
            <li>✓ Modern tech stack with up-to-date dependencies</li>
            <li>⚠ Consider adding more inline documentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Summary;

// Made with Bob
