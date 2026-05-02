import React from 'react';

function Documentation() {
  return (
    <div className="tab-content documentation-tab">
      <div className="content-card">
        <h2 className="card-title">📚 API Documentation</h2>
        <div className="card-content">
          <div className="api-section">
            <h4 className="api-endpoint">GET /api/users</h4>
            <p className="api-description">Retrieve a list of all users</p>
            <div className="code-block">
              <code>
                {`{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}`}
              </code>
            </div>
          </div>

          <div className="api-section">
            <h4 className="api-endpoint">POST /api/users</h4>
            <p className="api-description">Create a new user</p>
            <div className="code-block">
              <code>
                {`{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "developer"
}`}
              </code>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">🔧 Configuration Guide</h2>
        <div className="card-content">
          <h4 className="config-title">Environment Variables</h4>
          <table className="config-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Description</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>PORT</code></td>
                <td>Server port number</td>
                <td>3000</td>
              </tr>
              <tr>
                <td><code>DATABASE_URL</code></td>
                <td>Database connection string</td>
                <td>-</td>
              </tr>
              <tr>
                <td><code>API_KEY</code></td>
                <td>External API authentication key</td>
                <td>-</td>
              </tr>
              <tr>
                <td><code>NODE_ENV</code></td>
                <td>Environment mode</td>
                <td>development</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">💡 Code Examples</h2>
        <div className="card-content">
          <h4 className="example-title">Basic Component Usage</h4>
          <div className="code-block">
            <code>
              {`import { Button } from './components';

function App() {
  return (
    <Button 
      variant="primary"
      onClick={() => console.log('Clicked!')}
    >
      Click Me
    </Button>
  );
}`}
            </code>
          </div>

          <h4 className="example-title">API Integration</h4>
          <div className="code-block">
            <code>
              {`const fetchData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
};`}
            </code>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2 className="card-title">📖 Best Practices</h2>
        <div className="card-content">
          <ul className="best-practices-list">
            <li>✓ Always validate user input before processing</li>
            <li>✓ Use TypeScript for type safety</li>
            <li>✓ Write unit tests for critical functionality</li>
            <li>✓ Follow the established code style guide</li>
            <li>✓ Document complex logic with comments</li>
            <li>✓ Keep components small and focused</li>
            <li>✓ Use environment variables for configuration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Documentation;

// Made with Bob
