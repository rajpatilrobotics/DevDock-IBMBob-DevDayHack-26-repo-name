import React from 'react';

function OnboardingGuide() {
  return (
    <div className="tab-content onboarding-tab">
      <div className="content-card">
        <h2 className="card-title">🚀 Quick Start Guide</h2>
        <div className="card-content">
          <p className="guide-intro">
            Follow these steps to get up and running with this repository in just 5 minutes!
          </p>
        </div>
      </div>

      <div className="content-card">
        <h3 className="step-title">Step 1: Prerequisites</h3>
        <div className="card-content">
          <ul className="checklist">
            <li>✓ Node.js v16 or higher installed</li>
            <li>✓ Git installed and configured</li>
            <li>✓ Code editor (VS Code recommended)</li>
            <li>✓ Terminal/Command line access</li>
          </ul>
        </div>
      </div>

      <div className="content-card">
        <h3 className="step-title">Step 2: Clone & Install</h3>
        <div className="card-content">
          <div className="code-block">
            <code>
              git clone [repository-url]<br/>
              cd [repository-name]<br/>
              npm install
            </code>
          </div>
          <p className="step-description">
            This will clone the repository and install all necessary dependencies.
          </p>
        </div>
      </div>

      <div className="content-card">
        <h3 className="step-title">Step 3: Configuration</h3>
        <div className="card-content">
          <div className="code-block">
            <code>
              cp .env.example .env<br/>
              # Edit .env with your configuration
            </code>
          </div>
          <p className="step-description">
            Set up your environment variables for local development.
          </p>
        </div>
      </div>

      <div className="content-card">
        <h3 className="step-title">Step 4: Run Development Server</h3>
        <div className="card-content">
          <div className="code-block">
            <code>
              npm run dev
            </code>
          </div>
          <p className="step-description">
            Start the development server. The app will be available at http://localhost:3000
          </p>
        </div>
      </div>

      <div className="content-card">
        <h3 className="step-title">Step 5: Explore & Contribute</h3>
        <div className="card-content">
          <ul className="action-list">
            <li>📖 Read the documentation in the /docs folder</li>
            <li>🧪 Run tests with <code>npm test</code></li>
            <li>🎨 Check out the component library</li>
            <li>🐛 Report issues on GitHub</li>
            <li>💡 Submit pull requests for improvements</li>
          </ul>
        </div>
      </div>

      <div className="content-card success-card">
        <h3 className="card-title">🎉 You're All Set!</h3>
        <div className="card-content">
          <p>
            Congratulations! You've successfully onboarded to this project. 
            Check out the other tabs for more detailed information about the architecture, 
            documentation, and security considerations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OnboardingGuide;

// Made with Bob
