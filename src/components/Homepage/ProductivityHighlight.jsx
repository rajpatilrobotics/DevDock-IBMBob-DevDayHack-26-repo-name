import React from 'react';

function ProductivityHighlight() {
  const metrics = [
    {
      icon: '⚡',
      value: '10x',
      label: 'Faster',
      description: 'Understand codebases 10x faster than manual review'
    },
    {
      icon: '⏱️',
      value: '20+',
      label: 'Hours Saved',
      description: 'Save hours of manual effort every week'
    },
    {
      icon: '🎯',
      value: '90%',
      label: 'Time Reduction',
      description: 'Reduce onboarding time by up to 90%'
    }
  ];

  return (
    <section className="productivity-highlight-section">
      <div className="productivity-highlight-container">
        <div className="productivity-content">
          <div className="productivity-header">
            <div className="productivity-badge">
              <span className="productivity-badge-icon">📈</span>
              <span className="productivity-badge-text">Productivity Boost</span>
            </div>
            
            <h2 className="productivity-title">
              Understand Codebases{' '}
              <span className="productivity-title-gradient">10x Faster</span>
            </h2>
            
            <p className="productivity-subtitle">
              Save hours of manual effort and ship features faster with AI-powered insights
            </p>
          </div>

          <div className="productivity-metrics">
            {metrics.map((metric, index) => (
              <div key={index} className="productivity-metric">
                <div className="metric-icon-wrapper">
                  <span className="metric-icon">{metric.icon}</span>
                </div>
                <div className="metric-content">
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                  <p className="metric-description">{metric.description}</p>
                </div>
                <div className="metric-glow"></div>
              </div>
            ))}
          </div>

          <div className="productivity-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Instant code comprehension</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Automated documentation</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Real-time security insights</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Rapid team onboarding</span>
            </div>
          </div>
        </div>
      </div>

      <div className="productivity-background">
        <div className="productivity-gradient-orb productivity-orb-1"></div>
        <div className="productivity-gradient-orb productivity-orb-2"></div>
      </div>
    </section>
  );
}

export default ProductivityHighlight;

// Made with Bob