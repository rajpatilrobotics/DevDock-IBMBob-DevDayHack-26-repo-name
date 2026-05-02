# GitHub Integration - Code Implementation Guide

## 1. GitHub Service Implementation

### File: `src/services/githubService.js`

```javascript
// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Parse GitHub URL to extract owner and repository name
 * @param {string} url - GitHub repository URL
 * @returns {Object|null} - { owner, repo } or null if invalid
 */
export const parseGitHubUrl = (url) => {
  try {
    // Remove trailing slashes and .git extension
    const cleanUrl = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
    
    // Match patterns: github.com/owner/repo
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/  // Support "owner/repo" format
    ];
    
    for (const pattern of patterns) {
      const match = cleanUrl.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2]
        };
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Fetch repository information from GitHub API
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} - Repository info
 */
export const fetchRepositoryInfo = async (owner, repo) => {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  
  if (response.status === 404) {
    throw new Error('Repository not found or is private');
  }
  
  if (response.status === 403) {
    const data = await response.json();
    if (data.message && data.message.includes('rate limit')) {
      throw new Error('GitHub API rate limit reached. Please try again later.');
    }
    throw new Error('Access forbidden');
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch repository information');
  }
  
  const data = await response.json();
  
  return {
    name: data.name,
    fullName: data.full_name,
    description: data.description || 'No description available',
    stars: data.stargazers_count,
    language: data.language || 'Not specified',
    defaultBranch: data.default_branch || 'main',
    url: data.html_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    size: data.size,
    openIssues: data.open_issues_count,
    forks: data.forks_count
  };
};

/**
 * Fetch repository file tree
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name (default: main)
 * @returns {Promise<Array>} - Array of file paths
 */
export const fetchFileTree = async (owner, repo, branch = 'main') => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );
  
  if (!response.ok) {
    // Try 'master' branch if 'main' fails
    if (branch === 'main') {
      return fetchFileTree(owner, repo, 'master');
    }
    throw new Error('Failed to fetch file tree');
  }
  
  const data = await response.json();
  
  // Filter only files (not directories) and return paths
  return data.tree
    .filter(item => item.type === 'blob')
    .map(item => item.path);
};

/**
 * Fetch content of a specific file
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @returns {Promise<string>} - File content
 */
export const fetchFileContent = async (owner, repo, path) => {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`
  );
  
  if (!response.ok) {
    return null; // Return null if file cannot be fetched
  }
  
  const data = await response.json();
  
  // Check if file is too large (> 1MB)
  if (data.size > 1048576) {
    return `[File too large: ${(data.size / 1024 / 1024).toFixed(2)}MB]`;
  }
  
  // Decode base64 content
  try {
    return atob(data.content);
  } catch (error) {
    return '[Binary file - content not displayable]';
  }
};

/**
 * Identify important files from file tree using pattern matching
 * @param {Array} fileTree - Array of file paths
 * @returns {Array} - Array of important file paths (max 5)
 */
export const identifyImportantFiles = (fileTree) => {
  const importantPatterns = {
    // Priority 1: Documentation
    readme: /^README\.md$/i,
    
    // Priority 2: Package/Dependency files
    packageJson: /^package\.json$/,
    requirementsTxt: /^requirements\.txt$/,
    cargoToml: /^Cargo\.toml$/,
    gemfile: /^Gemfile$/,
    goMod: /^go\.mod$/,
    
    // Priority 3: Entry point files
    mainJs: /^(src\/)?main\.(js|ts|jsx|tsx)$/,
    indexJs: /^(src\/)?index\.(js|ts|jsx|tsx)$/,
    appJs: /^(src\/)?[Aa]pp\.(js|ts|jsx|tsx)$/,
    mainPy: /^(src\/)?main\.py$/,
    appPy: /^(src\/)?app\.py$/,
    
    // Priority 4: Configuration files
    config: /^(src\/)?config\.(js|ts|json|yaml|yml)$/,
    webpack: /^webpack\.config\.(js|ts)$/,
    vite: /^vite\.config\.(js|ts)$/,
    tsconfig: /^tsconfig\.json$/
  };
  
  const foundFiles = [];
  const priorities = {
    readme: 1,
    packageJson: 2,
    requirementsTxt: 2,
    cargoToml: 2,
    gemfile: 2,
    goMod: 2,
    mainJs: 3,
    indexJs: 3,
    appJs: 3,
    mainPy: 3,
    appPy: 3,
    config: 4,
    webpack: 4,
    vite: 4,
    tsconfig: 4
  };
  
  // Find matching files
  for (const [key, pattern] of Object.entries(importantPatterns)) {
    const matchingFile = fileTree.find(file => pattern.test(file));
    if (matchingFile) {
      foundFiles.push({
        path: matchingFile,
        priority: priorities[key],
        type: key
      });
    }
  }
  
  // Sort by priority and take top 5
  return foundFiles
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 5)
    .map(file => file.path);
};

/**
 * Main function to analyze a GitHub repository
 * @param {string} url - GitHub repository URL
 * @returns {Promise<Object>} - Complete repository analysis data
 */
export const analyzeRepository = async (url) => {
  try {
    // Step 1: Parse URL
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      return {
        error: 'Invalid GitHub URL format. Please use: https://github.com/owner/repo'
      };
    }
    
    const { owner, repo } = parsed;
    
    // Step 2: Fetch repository info
    const repoInfo = await fetchRepositoryInfo(owner, repo);
    
    // Step 3: Fetch file tree
    const fileTree = await fetchFileTree(owner, repo, repoInfo.defaultBranch);
    
    // Step 4: Identify important files
    const importantFilePaths = identifyImportantFiles(fileTree);
    
    // Step 5: Fetch content of important files (in parallel)
    const fileContentPromises = importantFilePaths.map(async (path) => {
      const content = await fetchFileContent(owner, repo, path);
      return {
        path,
        content: content || '[Content not available]'
      };
    });
    
    const importantFiles = await Promise.all(fileContentPromises);
    
    // Step 6: Fetch README separately (if not already in important files)
    let readme = null;
    const readmeInImportant = importantFiles.find(f => 
      f.path.toLowerCase() === 'readme.md'
    );
    
    if (readmeInImportant) {
      readme = readmeInImportant.content;
    } else {
      readme = await fetchFileContent(owner, repo, 'README.md');
    }
    
    // Return complete analysis
    return {
      repoInfo,
      fileTree,
      importantFiles,
      readme: readme || 'No README found',
      error: null
    };
    
  } catch (error) {
    return {
      error: error.message || 'An unexpected error occurred'
    };
  }
};
```

## 2. App.jsx Updates

### Add imports:
```javascript
import { analyzeRepository } from './services/githubService';
```

### Add new state variables:
```javascript
const [repoData, setRepoData] = useState(null);
const [error, setError] = useState(null);
const [successMessage, setSuccessMessage] = useState('');
```

### Update handleAnalyze function:
```javascript
const handleAnalyze = async () => {
  if (!repoUrl.trim()) return;
  
  setIsAnalyzing(true);
  setAnalysisComplete(false);
  setError(null);
  setSuccessMessage('');
  
  try {
    const data = await analyzeRepository(repoUrl);
    
    if (data.error) {
      setError(data.error);
      setIsAnalyzing(false);
      return;
    }
    
    setRepoData(data);
    setRepoSize(data.fileTree.length);
    setSuccessMessage('Repo analyzed successfully');
    setAnalysisComplete(true);
    setActiveTab('summary');
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
    
  } catch (err) {
    setError(err.message || 'An unexpected error occurred');
  } finally {
    setIsAnalyzing(false);
  }
};
```

### Add success/error message display (before InputSection):
```javascript
{successMessage && (
  <div className="success-banner">
    <span className="success-icon">✓</span>
    {successMessage}
  </div>
)}

{error && (
  <div className="error-banner">
    <span className="error-icon">⚠️</span>
    {error}
    <button 
      className="retry-button"
      onClick={() => {
        setError(null);
        handleAnalyze();
      }}
    >
      Retry
    </button>
  </div>
)}
```

### Update Summary component props:
```javascript
<Summary 
  repoUrl={repoUrl} 
  repoSize={repoSize}
  repoData={repoData}
/>
```

## 3. Summary.jsx Updates

### Update component signature:
```javascript
function Summary({ repoUrl, repoSize, repoData }) {
```

### Add repository info display:
```javascript
<div className="content-card">
  <h2 className="card-title">Repository Overview</h2>
  <div className="card-content">
    {repoData ? (
      <>
        <div className="info-row">
          <span className="info-label">Repository:</span>
          <span className="info-value">
            <a 
              href={repoData.repoInfo.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="repo-link"
            >
              {repoData.repoInfo.fullName}
            </a>
          </span>
        </div>
        <div className="info-row">
          <span className="info-label">Description:</span>
          <span className="info-value">{repoData.repoInfo.description}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Stars:</span>
          <span className="info-value">⭐ {repoData.repoInfo.stars.toLocaleString()}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Primary Language:</span>
          <span className="info-value">{repoData.repoInfo.language}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Total Files:</span>
          <span className="info-value">{repoSize} files</span>
        </div>
      </>
    ) : (
      <div className="info-row">
        <span className="info-label">Repository URL:</span>
        <span className="info-value">{repoUrl || 'N/A'}</span>
      </div>
    )}
  </div>
</div>
```

### Add README preview section:
```javascript
{repoData && repoData.readme && (
  <div className="content-card">
    <h2 className="card-title">README Preview</h2>
    <div className="card-content">
      <div className="readme-preview">
        {repoData.readme.substring(0, 500)}
        {repoData.readme.length > 500 && '...'}
      </div>
      <a 
        href={`${repoData.repoInfo.url}#readme`}
        target="_blank"
        rel="noopener noreferrer"
        className="view-full-link"
      >
        View Full README on GitHub →
      </a>
    </div>
  </div>
)}
```

### Add important files section:
```javascript
{repoData && repoData.importantFiles && repoData.importantFiles.length > 0 && (
  <div className="content-card">
    <h2 className="card-title">Important Files Detected</h2>
    <div className="card-content">
      <ul className="file-list">
        {repoData.importantFiles.map((file, index) => (
          <li key={index} className="file-item">
            <span className="file-icon">📄</span>
            <span className="file-path">{file.path}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}
```

## 4. CSS Additions (App.css)

```css
/* Success Banner */
.success-banner {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideDown 0.3s ease-out;
}

.success-icon {
  font-size: 20px;
}

/* Error Banner */
.error-banner {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideDown 0.3s ease-out;
}

.error-icon {
  font-size: 20px;
}

.retry-button {
  margin-left: auto;
  padding: 6px 16px;
  background-color: #721c24;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-button:hover {
  background-color: #5a161d;
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Repository Link */
.repo-link {
  color: #0366d6;
  text-decoration: none;
}

.repo-link:hover {
  text-decoration: underline;
}

/* README Preview */
.readme-preview {
  background-color: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 12px;
}

.view-full-link {
  color: #0366d6;
  text-decoration: none;
  font-weight: 500;
}

.view-full-link:hover {
  text-decoration: underline;
}

/* File List */
.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #e1e4e8;
}

.file-item:last-child {
  border-bottom: none;
}

.file-icon {
  font-size: 18px;
}

.file-path {
  font-family: monospace;
  font-size: 14px;
  color: #24292e;
}
```

## 5. Testing Checklist

### Test Cases:

1. **Valid Public Repository**
   - URL: `https://github.com/facebook/react`
   - Expected: Success with all data displayed

2. **Different URL Formats**
   - `https://github.com/owner/repo`
   - `github.com/owner/repo`
   - `https://github.com/owner/repo.git`

3. **Invalid URL**
   - URL: `https://example.com/repo`
   - Expected: Error "Invalid GitHub URL format"

4. **Non-existent Repository**
   - URL: `https://github.com/user/nonexistent-xyz-123`
   - Expected: Error "Repository not found or is private"

5. **Different Project Types**
   - JavaScript: `https://github.com/vercel/next.js`
   - Python: `https://github.com/django/django`
   - Rust: `https://github.com/rust-lang/rust`

6. **Edge Cases**
   - Repository with no README
   - Repository with no package.json
   - Very large repository (>1000 files)

## 6. Implementation Order

1. ✅ Create `src/services/` directory
2. ✅ Create `githubService.js` with all functions
3. ✅ Test service functions in browser console
4. ✅ Update `App.jsx` with new state and async logic
5. ✅ Add success/error banners to UI
6. ✅ Update `Summary.jsx` to display GitHub data
7. ✅ Add CSS styles for new components
8. ✅ Test with various repository URLs
9. ✅ Handle edge cases and errors
10. ✅ Final polish and code review