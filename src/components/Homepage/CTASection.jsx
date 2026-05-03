import React from 'react';

function CTASection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">
            Start Turning Your Code Into <span className="cta-title-gradient">Impact</span>
          </h2>
          <p className="cta-subtitle">
            Join developers who ship faster with AI-powered insights from IBM Bob
          </p>
          
          <button onClick={scrollToTop} className="cta-button">
            <span className="cta-button-icon">🚀</span>
            Analyze Repository
          </button>

          <div className="cta-stats">
            <div className="stat-item">
              <div className="stat-number">10x</div>
              <div className="stat-label">Faster Development</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">2-3min</div>
              <div className="stat-label">To Full Insights</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">90%</div>
              <div className="stat-label">Time Saved</div>
            </div>
          </div>
        </div>

        <div className="cta-background">
          <div className="cta-gradient-orb cta-orb-1"></div>
          <div className="cta-gradient-orb cta-orb-2"></div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;

// Made with Bob
