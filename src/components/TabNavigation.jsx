import React from 'react';

function TabNavigation({ tabs, activeTab, onTabChange, onDownloadPDF, isGeneratingPDF }) {
  return (
    <nav className="tab-navigation">
      <div className="tab-nav-container">
        <div className="tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {onDownloadPDF && (
          <button
            className="download-pdf-btn-nav"
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
          >
            <span className="download-icon">📄</span>
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
        )}
      </div>
    </nav>
  );
}

export default TabNavigation;

// Made with Bob
