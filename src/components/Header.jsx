import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <img
            src="/devdock-logo-horizontal.svg"
            alt="DevDock"
            className="logo-image"
            style={{ height: '50px', width: 'auto' }}
          />
        </div>
        <p className="tagline">AI-Powered Code Analysis & Onboarding Platform</p>
      </div>
    </header>
  );
}

export default Header;

// Made with Bob
