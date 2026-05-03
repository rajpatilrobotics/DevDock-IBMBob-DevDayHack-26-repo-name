import React from 'react';

function PoweredByBob() {
  const capabilities = [
    {
      icon: '🧠',
      title: 'Code Understanding',
      description: 'Deep semantic analysis using advanced AI',
      features: ['Pattern recognition', 'Dependency mapping', 'Architecture insights']
    },
    {
      icon: '⚡',
      title: 'Intelligent Automation',
      description: 'Accelerate development with smart automation',
      features: ['Auto-documentation', 'Smart suggestions', 'Instant analysis']
    },
    {
      icon: '📚',
      title: 'Smart Documentation',
      description: 'Generate accurate docs automatically',
      features: ['API references', 'Code examples', 'Setup guides']
    },
    {
      icon: '🔒',
      title: 'Security Analysis',
      description: 'Real-time vulnerability detection',
      features: ['Vulnerability scanning', 'Best practices', 'Risk assessment']
    }
  ];

  return (
    <section className="powered-by-bob-section">
      <div className="powered-by-bob-container">
        <div className="bob-header">
          <div className="bob-badge">
            <span className="bob-badge-icon">🤖</span>
            <span className="bob-badge-text">Enterprise AI Technology</span>
          </div>
          
          <h2 className="bob-title">
            Powered by <span className="bob-title-gradient">IBM Bob AI</span>
          </h2>
          
          <p className="bob-subtitle">
            Enterprise AI that understands code like a senior developer
          </p>
        </div>

        <div className="capabilities-grid">
          {capabilities.map((capability, index) => (
            <div key={index} className="capability-card">
              <div className="capability-icon-wrapper">
                <span className="capability-icon">{capability.icon}</span>
              </div>
              
              <h3 className="capability-title">{capability.title}</h3>
              <p className="capability-description">{capability.description}</p>
              
              <ul className="capability-features">
                {capability.features.map((feature, idx) => (
                  <li key={idx} className="capability-feature">
                    <span className="feature-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="capability-glow"></div>
            </div>
          ))}
        </div>

        <div className="bob-footer">
          <div className="bob-stats">
            <div className="bob-stat">
              <div className="bob-stat-icon">🎯</div>
              <div className="bob-stat-content">
                <div className="bob-stat-value">99.9%</div>
                <div className="bob-stat-label">Accuracy</div>
              </div>
            </div>
            <div className="bob-stat">
              <div className="bob-stat-icon">⚡</div>
              <div className="bob-stat-content">
                <div className="bob-stat-value">2-3min</div>
                <div className="bob-stat-label">Analysis Time</div>
              </div>
            </div>
            <div className="bob-stat">
              <div className="bob-stat-icon">🚀</div>
              <div className="bob-stat-content">
                <div className="bob-stat-value">24/7</div>
                <div className="bob-stat-label">Availability</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bob-background">
        <div className="bob-gradient-orb bob-orb-1"></div>
        <div className="bob-gradient-orb bob-orb-2"></div>
        <div className="bob-gradient-orb bob-orb-3"></div>
      </div>
    </section>
  );
}

export default PoweredByBob;

// Made with Bob