import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">
          <img
            src="/devdock-logo.png"
            alt="DevDock Logo"
            className="logo-image"
            style={{ height: '40px', marginRight: '10px' }}
          />
          DevDock
        </h1>
        <p className="tagline">AI-Powered Code Analysis & Onboarding Platform</p>
      </div>
    </header>
  );
}

export default Header;

// Made with Bob
