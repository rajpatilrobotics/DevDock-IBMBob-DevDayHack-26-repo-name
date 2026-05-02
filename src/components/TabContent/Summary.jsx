import React from 'react';

function Summary({ repoUrl, repoSize, repoData }) {
  // If no repoData, show placeholder
  if (!repoData) {
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
      </div>
    );
  }

  const { repoInfo, importantFiles, readme } = repoData;

  // Truncate README to first 500 characters
  const readmePreview = readme && readme !== 'No README found' 
    ? readme.substring(0, 500) + (readme.length > 500 ? '...' : '')
    : 'No README found';

  return (
    <div className="tab-content summary-tab">
      {/* Repository Overview */}
      <div className="content-card">
        <h2 className="card-title">📦 Repository Overview</h2>
        <div className="card-content">
          <div className="info-row">
            <span className="info-label">Repository:</span>
            <span className="info-value">
              <a href={repoInfo.url} target="_blank" rel="noopener noreferrer" className="repo-link">
                {repoInfo.name}
              </a>
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Description:</span>
            <span className="info-value">{repoInfo.description}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Primary Language:</span>
            <span className="info-value language-badge">{repoInfo.language}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Stars:</span>
            <span className="info-value">⭐ {repoInfo.stars.toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span className="info-label">License:</span>
            <span className="info-value">{repoInfo.license}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Files:</span>
            <span className="info-value">{repoSize.toLocaleString()} files</span>
          </div>
          <div className="info-row">
            <span className="info-label">Last Updated:</span>
            <span className="info-value">{new Date(repoInfo.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* README Preview */}
      <div className="content-card">
        <h2 className="card-title">📄 README Preview</h2>
        <div className="card-content">
          <div className="readme-preview">
            {readmePreview}
          </div>
          {readme !== 'No README found' && (
            <a 
              href={`${repoInfo.url}#readme`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-full-link"
            >
              View Full README on GitHub →
            </a>
          )}
        </div>
      </div>

      {/* Important Files Detected */}
      <div className="content-card">
        <h2 className="card-title">🔍 Important Files Detected</h2>
        <div className="card-content">
          {importantFiles && importantFiles.length > 0 ? (
            <div className="files-list">
              {importantFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-header">
                    <span className="file-icon">📄</span>
                    <span className="file-path">{file.path}</span>
                  </div>
                  {!file.error && file.content && (
                    <div className="file-preview">
                      <pre>{file.content.substring(0, 200)}{file.content.length > 200 ? '...' : ''}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No important files detected</p>
          )}
        </div>
      </div>

      {/* Repository Topics */}
      {repoInfo.topics && repoInfo.topics.length > 0 && (
        <div className="content-card">
          <h2 className="card-title">🏷️ Topics</h2>
          <div className="card-content">
            <div className="topics-container">
              {repoInfo.topics.map((topic, index) => (
                <span key={index} className="topic-badge">{topic}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="content-card">
        <h2 className="card-title">📊 Quick Stats</h2>
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value">⭐ {repoInfo.stars.toLocaleString()}</div>
            <div className="metric-label">Stars</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{repoSize.toLocaleString()}</div>
            <div className="metric-label">Files</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{repoInfo.language}</div>
            <div className="metric-label">Language</div>
          </div>
          <div className="metric-item">
            <div className="metric-value">{importantFiles?.length || 0}</div>
            <div className="metric-label">Key Files</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;

// Made with Bob
