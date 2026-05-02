import React from 'react';

function DownloadPDFButton({ isVisible, onClick }) {
  if (!isVisible) return null;

  return (
    <button className="download-pdf-btn" onClick={onClick}>
      <span className="download-icon">📄</span>
      Download PDF Report
    </button>
  );
}

export default DownloadPDFButton;

// Made with Bob
