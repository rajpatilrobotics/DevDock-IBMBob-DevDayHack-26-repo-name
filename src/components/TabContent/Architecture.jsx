import React from 'react';

function Architecture() {
  return (
    <div className="tab-content architecture-tab">
      <div className="content-card">
        <h2 className="card-title">System Architecture</h2>
        <div className="card-content">
          <div className="architecture-diagram">
            <div className="arch-layer">
              <div className="arch-box">Frontend Layer</div>
              <div className="arch-description">React, TypeScript, Redux</div>
            </div>
            <div className="arch-arrow">↓</div>
            <div className="arch-layer">
              <div className="arch-box">API Layer</div>
              <div className="arch-description">REST API, GraphQL</div>
            </div>
            <div className="arch-arrow">↓</div>
            <div className="arch-layer">
              <div className="arch-box">Business Logic</div>
              <div className="arch-description">Services, Controllers</div>
            </div>
            <div className="arch-arrow">↓</div>
            <div className="arch-layer">
              <div className="arch-box">Data Layer</div>
              <div className="arch-description">Database, Cache</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">Technology Stack</h2>
        <div className="card-content">
          <div className="tech-stack-grid">
            <div className="tech-item">
              <div className="tech-category">Frontend</div>
              <div className="tech-list">React, TypeScript, CSS Modules</div>
            </div>
            <div className="tech-item">
              <div className="tech-category">Backend</div>
              <div className="tech-list">Node.js, Express, PostgreSQL</div>
            </div>
            <div className="tech-item">
              <div className="tech-category">DevOps</div>
              <div className="tech-list">Docker, Kubernetes, CI/CD</div>
            </div>
            <div className="tech-item">
              <div className="tech-category">Testing</div>
              <div className="tech-list">Jest, React Testing Library</div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">Component Hierarchy</h2>
        <div className="card-content">
          <div className="hierarchy-tree">
            <div className="tree-item">📦 App</div>
            <div className="tree-children">
              <div className="tree-item">├─ 🎨 Layout</div>
              <div className="tree-children">
                <div className="tree-item">│  ├─ Header</div>
                <div className="tree-item">│  ├─ Sidebar</div>
                <div className="tree-item">│  └─ Footer</div>
              </div>
              <div className="tree-item">├─ 📄 Pages</div>
              <div className="tree-children">
                <div className="tree-item">│  ├─ Home</div>
                <div className="tree-item">│  ├─ Dashboard</div>
                <div className="tree-item">│  └─ Settings</div>
              </div>
              <div className="tree-item">└─ 🔧 Components</div>
              <div className="tree-children">
                <div className="tree-item">   ├─ Button</div>
                <div className="tree-item">   ├─ Input</div>
                <div className="tree-item">   └─ Card</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Architecture;

// Made with Bob
