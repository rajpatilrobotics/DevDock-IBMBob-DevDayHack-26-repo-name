import React from 'react';

function DownloadPDFButton({ isVisible, onClick, isGenerating }) {
  if (!isVisible) return null;

  return (
    <button
      className="download-pdf-btn"
      onClick={onClick}
      disabled={isGenerating}
      style={{ opacity: isGenerating ? 0.6 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer' }}
    >
      <span className="download-icon">{isGenerating ? '⏳' : '📄'}</span>
      {isGenerating ? 'Generating PDF...' : 'Download PDF Report'}
    </button>
  );
}

export default DownloadPDFButton;

// Made with Bob
