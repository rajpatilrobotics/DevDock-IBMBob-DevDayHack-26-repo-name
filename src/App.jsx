import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import InputSection from './components/InputSection';
import LoadingSpinner from './components/LoadingSpinner';
import TabNavigation from './components/TabNavigation';
import TimeSavedBadge from './components/TimeSavedBadge';
import DownloadPDFButton from './components/DownloadPDFButton';
import Footer from './components/Footer';

// Tab Content Components
import Summary from './components/TabContent/Summary';
import Architecture from './components/TabContent/Architecture';
import OnboardingGuide from './components/TabContent/OnboardingGuide';
import Documentation from './components/TabContent/Documentation';
import SecurityScanner from './components/TabContent/SecurityScanner';
import Chat from './components/TabContent/Chat';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [previousUrl, setPreviousUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [repoSize, setRepoSize] = useState(0);
  const resultsRef = useRef(null);

  const tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'onboarding', label: 'Onboarding Guide' },
    { id: 'documentation', label: 'Documentation' },
    { id: 'security', label: 'Security Scanner' },
    { id: 'chat', label: 'Chat' }
  ];

  // Reset logic when URL changes
  useEffect(() => {
    if (repoUrl !== previousUrl && previousUrl !== '') {
      setAnalysisComplete(false);
      setActiveTab('summary');
    }
    setPreviousUrl(repoUrl);
  }, [repoUrl, previousUrl]);

  // Smooth scroll to results after analysis completes
  useEffect(() => {
    if (analysisComplete && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [analysisComplete]);

  const handleAnalyze = () => {
    if (!repoUrl.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate API call with random repo size
    setTimeout(() => {
      const randomSize = Math.floor(Math.random() * 500) + 100; // 100-600 files
      setRepoSize(randomSize);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setActiveTab('summary');
    }, 2500);
  };

  const handleQuickOnboard = () => {
    if (!repoUrl.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    
    // Simulate quick onboarding
    setTimeout(() => {
      const randomSize = Math.floor(Math.random() * 500) + 100;
      setRepoSize(randomSize);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      setActiveTab('onboarding');
    }, 2500);
  };

  const handleDownloadPDF = () => {
    alert('PDF Report download would start here (UI only - no backend)');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return <Summary repoUrl={repoUrl} repoSize={repoSize} />;
      case 'architecture':
        return <Architecture />;
      case 'onboarding':
        return <OnboardingGuide />;
      case 'documentation':
        return <Documentation />;
      case 'security':
        return <SecurityScanner />;
      case 'chat':
        return <Chat />;
      default:
        return <Summary repoUrl={repoUrl} repoSize={repoSize} />;
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="single-column">
          {!analysisComplete && !isAnalyzing && (
            <div className="empty-state">
              <div className="empty-state-icon">🚢</div>
              <h2 className="empty-state-title">Understand Any Codebase in Minutes</h2>
              <p className="empty-state-subtitle">
                Paste a GitHub repository URL and get instant AI-powered insights
              </p>
              <div className="empty-state-features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span className="feature-text">AI-powered analysis</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📚</span>
                  <span className="feature-text">Interactive onboarding</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span className="feature-text">Security scanning</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💬</span>
                  <span className="feature-text">Live chat support</span>
                </div>
              </div>
              <p className="empty-state-cta">👇 Get Started Below</p>
            </div>
          )}

          <InputSection
            repoUrl={repoUrl}
            onUrlChange={setRepoUrl}
            onAnalyze={handleAnalyze}
            onQuickOnboard={handleQuickOnboard}
            isAnalyzing={isAnalyzing}
            disabled={isAnalyzing}
          />

          <LoadingSpinner isVisible={isAnalyzing} />

          {analysisComplete && (
            <div ref={resultsRef} className="results-section">
              <div className="results-header">
                <TimeSavedBadge repoSize={repoSize} isVisible={analysisComplete} />
                <DownloadPDFButton
                  isVisible={analysisComplete}
                  onClick={handleDownloadPDF}
                />
              </div>

              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              <div className="tab-content-wrapper">
                {renderTabContent()}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

// Made with Bob
