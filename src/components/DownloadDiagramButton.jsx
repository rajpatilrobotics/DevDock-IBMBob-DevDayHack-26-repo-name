import React, { useState } from 'react';
import { toPng } from 'html-to-image';

const DownloadDiagramButton = ({ containerId, fileName = 'diagram' }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadDiagram = async () => {
    setIsDownloading(true);
    
    try {
      const node = document.getElementById(containerId);
      
      if (!node) {
        console.error('Diagram container not found');
        setIsDownloading(false);
        return;
      }

      // Hide controls temporarily for clean export
      const controls = node.querySelectorAll('.react-flow__controls, .react-flow__minimap, .react-flow__attribution');
      controls.forEach(control => {
        control.style.display = 'none';
      });

      // Generate high-quality PNG
      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#1a1a2e'
      });

      // Restore controls
      controls.forEach(control => {
        control.style.display = '';
      });

      // Download the image
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();

      // Show success (optional - can add toast notification here)
      console.log('✅ Diagram downloaded successfully');
      
    } catch (err) {
      console.error('❌ Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={downloadDiagram}
      disabled={isDownloading}
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        background: isDownloading 
          ? 'linear-gradient(135deg, #4b5563 0%, #374151 100%)'
          : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: isDownloading ? 'not-allowed' : 'pointer',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        transition: 'all 0.3s ease',
        opacity: isDownloading ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (!isDownloading) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
      }}
    >
      {isDownloading ? (
        <>
          <span style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid #fff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download PNG</span>
        </>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default DownloadDiagramButton;

// Made with Bob
