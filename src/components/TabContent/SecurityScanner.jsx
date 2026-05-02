import React from 'react';

function SecurityScanner() {
  return (
    <div className="tab-content security-tab">
      <div className="content-card">
        <h2 className="card-title">🔒 Security Overview</h2>
        <div className="card-content">
          <div className="security-score">
            <div className="score-circle">
              <span className="score-value">8.5</span>
              <span className="score-label">/10</span>
            </div>
            <div className="score-details">
              <p className="score-status">Good Security Posture</p>
              <p className="score-description">
                Your repository follows most security best practices. 
                Address the findings below to improve your score.
              </p>
              <p className="last-scan">Last scanned: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">⚠️ Vulnerability Findings</h2>
        <div className="card-content">
          <div className="vulnerability-item high">
            <div className="vuln-header">
              <span className="vuln-severity">HIGH</span>
              <span className="vuln-id">CVE-2023-45857</span>
            </div>
            <h4 className="vuln-title">Prototype Pollution in lodash</h4>
            <p className="vuln-description">
              Affected package: lodash@4.17.19 → Upgrade to 4.17.21 or higher
            </p>
            <div className="vuln-remediation">
              <strong>Remediation:</strong> Run <code>npm update lodash</code>
            </div>
          </div>

          <div className="vulnerability-item medium">
            <div className="vuln-header">
              <span className="vuln-severity">MEDIUM</span>
              <span className="vuln-id">CVE-2023-26136</span>
            </div>
            <h4 className="vuln-title">Regular Expression Denial of Service</h4>
            <p className="vuln-description">
              Affected package: tough-cookie@4.0.0 → Upgrade to 4.1.3 or higher
            </p>
            <div className="vuln-remediation">
              <strong>Remediation:</strong> Update dependencies with <code>npm audit fix</code>
            </div>
          </div>

          <div className="vulnerability-item low">
            <div className="vuln-header">
              <span className="vuln-severity">LOW</span>
              <span className="vuln-id">CVE-2023-28155</span>
            </div>
            <h4 className="vuln-title">Information Disclosure in request</h4>
            <p className="vuln-description">
              Affected package: request@2.88.2 → Consider migrating to axios or node-fetch
            </p>
            <div className="vuln-remediation">
              <strong>Remediation:</strong> Replace deprecated package
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">📦 Dependency Audit</h2>
        <div className="card-content">
          <div className="audit-summary">
            <div className="audit-stat">
              <span className="stat-number">247</span>
              <span className="stat-label">Total Dependencies</span>
            </div>
            <div className="audit-stat">
              <span className="stat-number">3</span>
              <span className="stat-label">Vulnerabilities Found</span>
            </div>
            <div className="audit-stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Outdated Packages</span>
            </div>
            <div className="audit-stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Up-to-date</span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">✅ Security Best Practices</h2>
        <div className="card-content">
          <ul className="best-practices-list">
            <li className="practice-item complete">
              <span className="practice-icon">✓</span>
              <span className="practice-text">Dependencies are regularly updated</span>
            </li>
            <li className="practice-item complete">
              <span className="practice-icon">✓</span>
              <span className="practice-text">No secrets or API keys in code</span>
            </li>
            <li className="practice-item complete">
              <span className="practice-icon">✓</span>
              <span className="practice-text">HTTPS enforced for all connections</span>
            </li>
            <li className="practice-item complete">
              <span className="practice-icon">✓</span>
              <span className="practice-text">Input validation implemented</span>
            </li>
            <li className="practice-item warning">
              <span className="practice-icon">⚠</span>
              <span className="practice-text">Consider adding Content Security Policy headers</span>
            </li>
            <li className="practice-item warning">
              <span className="practice-icon">⚠</span>
              <span className="practice-text">Enable Dependabot for automated security updates</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">🛡️ Recommended Actions</h2>
        <div className="card-content">
          <ol className="action-list">
            <li>Update lodash to version 4.17.21 or higher (High Priority)</li>
            <li>Run <code>npm audit fix</code> to automatically fix medium severity issues</li>
            <li>Review and update outdated dependencies</li>
            <li>Enable GitHub Dependabot alerts</li>
            <li>Add security headers to your application</li>
            <li>Implement rate limiting for API endpoints</li>
            <li>Set up automated security scanning in CI/CD pipeline</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default SecurityScanner;

// Made with Bob