import React, { useState, useEffect } from 'react';
import './PreviewPanel.css';

function PreviewPanel({ isAnalyzing, analysisComplete, repoSize, repoUrl }) {
  const [typingText, setTypingText] = useState('');
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  const analysisText = "This appears to be a well-structured React application with modern development practices. The codebase follows component-based architecture with clear separation of concerns.";

  // Typing animation effect
  useEffect(() => {
    if (isAnalyzing || analysisComplete) {
      let index = 0;
      setTypingText('');
      const timer = setInterval(() => {
        if (index < analysisText.length) {
          setTypingText(analysisText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isAnalyzing, analysisComplete]);

  // Staggered content reveal
  useEffect(() => {
    if (isAnalyzing || analysisComplete) {
      const timer1 = setTimeout(() => setShowArchitecture(true), 1000);
      const timer2 = setTimeout(() => setShowInsights(true), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowArchitecture(false);
      setShowInsights(false);
    }
  }, [isAnalyzing, analysisComplete]);

  // Empty state
  if (!isAnalyzing && !analysisComplete) {
    return (
      <div className="preview-panel">
        <div className="preview-empty-state">
          <div className="preview-icon">🤖</div>
          <h3 className="preview-title">AI-Powered Analysis</h3>
          <p className="preview-description">
            Enter a GitHub repository URL to see real-time AI analysis and insights appear here.
          </p>
          <div className="preview-features">
            <div className="preview-feature-item">
              <span className="feature-emoji">⚡</span>
              <span>Instant Analysis</span>
            </div>
            <div className="preview-feature-item">
              <span className="feature-emoji">🏗️</span>
              <span>Architecture Mapping</span>
            </div>
            <div className="preview-feature-item">
              <span className="feature-emoji">💡</span>
              <span>Smart Insights</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analyzing state
  if (isAnalyzing) {
    return (
      <div className="preview-panel">
        <div className="preview-header">
          <div className="preview-status analyzing">
            <span className="status-dot pulsing"></span>
            <span>AI Analysis in Progress</span>
          </div>
        </div>

        <div className="preview-section fade-in">
          <div className="section-header">
            <span className="section-icon">📊</span>
            <h4>Quick Summary</h4>
          </div>
          <div className="preview-card">
            <div className="summary-item">
              <span className="summary-label">Detected:</span>
              <span className="summary-value">React + Node.js</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Files scanned:</span>
              <span className="summary-value">{repoSize}/500</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Complexity:</span>
              <span className="summary-value complexity-medium">Medium</span>
            </div>
          </div>
        </div>

        {showArchitecture && (
          <div className="preview-section fade-in">
            <div className="section-header">
              <span className="section-icon">🏗️</span>
              <h4>Architecture Preview</h4>
            </div>
            <div className="preview-card">
              <div className="architecture-blocks">
                <div className="arch-block">Frontend</div>
                <div className="arch-arrow">→</div>
                <div className="arch-block">API</div>
                <div className="arch-break"></div>
                <div className="arch-block">State</div>
                <div className="arch-arrow">→</div>
                <div className="arch-block">Database</div>
              </div>
            </div>
          </div>
        )}

        {showInsights && (
          <div className="preview-section fade-in">
            <div className="section-header">
              <span className="section-icon">💬</span>
              <h4>AI Insights</h4>
            </div>
            <div className="preview-card">
              <p className="typing-text">
                {typingText}
                <span className="cursor">|</span>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Analysis complete state
  return (
    <div className="preview-panel">
      <div className="preview-header">
        <div className="preview-status complete">
          <span className="status-dot"></span>
          <span>Analysis Complete</span>
        </div>
      </div>

      <div className="preview-section fade-in">
        <div className="section-header">
          <span className="section-icon">📊</span>
          <h4>Repository Summary</h4>
        </div>
        <div className="preview-card">
          <div className="summary-grid">
            <div className="summary-stat">
              <div className="stat-value">{repoSize}</div>
              <div className="stat-label">Files Analyzed</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">5</div>
              <div className="stat-label">Languages</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">87%</div>
              <div className="stat-label">Coverage</div>
            </div>
            <div className="summary-stat">
              <div className="stat-value">12</div>
              <div className="stat-label">Contributors</div>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-section fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="section-header">
          <span className="section-icon">🎯</span>
          <h4>Key Insights</h4>
        </div>
        <div className="preview-card">
          <div className="insight-list">
            <div className="insight-item success">
              <span className="insight-icon">✓</span>
              <span>Well-structured codebase</span>
            </div>
            <div className="insight-item success">
              <span className="insight-icon">✓</span>
              <span>Modern tech stack</span>
            </div>
            <div className="insight-item success">
              <span className="insight-icon">✓</span>
              <span>Active development</span>
            </div>
            <div className="insight-item warning">
              <span className="insight-icon">⚠</span>
              <span>Consider more documentation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-section fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="section-header">
          <span className="section-icon">💡</span>
          <h4>Quick Actions</h4>
        </div>
        <div className="preview-card">
          <div className="quick-actions">
            <button className="quick-action-btn">
              <span>→</span> View full architecture
            </button>
            <button className="quick-action-btn">
              <span>→</span> Start onboarding guide
            </button>
            <button className="quick-action-btn">
              <span>→</span> Check security scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPanel;

// Made with Bob