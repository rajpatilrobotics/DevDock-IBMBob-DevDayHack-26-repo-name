# GitHub Repository Fetching - Implementation Plan

## Overview
Add GitHub repository fetching functionality to the React app that allows users to analyze public GitHub repositories by pasting a URL and clicking "Analyze Repo".

## Architecture Design

### Data Flow
```
User Input (GitHub URL)
    ↓
Parse URL (extract owner/repo)
    ↓
GitHub API Calls (parallel where possible)
    ├─ Repository Info
    ├─ File Tree
    ├─ README.md
    ├─ package.json/requirements.txt
    └─ Important Code Files (3-5 files)
    ↓
Store in React State
    ↓
Display in Summary Tab
```

### File Structure
```
src/
├── services/
│   └── githubService.js          (NEW - GitHub API integration)
├── App.jsx                        (MODIFY - add GitHub data state)
└── components/
    └── TabContent/
        └── Summary.jsx            (MODIFY - display GitHub data)
```

## Implementation Details

### 1. GitHub Service (`src/services/githubService.js`)

#### Functions to Implement:

**`parseGitHubUrl(url)`**
- Extract owner and repo name from GitHub URL
- Support formats:
  - `https://github.com/owner/repo`
  - `https://github.com/owner/repo.git`
  - `github.com/owner/repo`
- Return: `{ owner, repo }` or `null` if invalid

**`fetchRepositoryInfo(owner, repo)`**
- Endpoint: `GET https://api.github.com/repos/{owner}/{repo}`
- Return: `{ name, description, stars, language, defaultBranch }`
- Handle errors: 404 (not found), 403 (rate limit)

**`fetchFileTree(owner, repo, branch)`**
- Endpoint: `GET https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1`
- Return: Array of file paths
- Limit depth to avoid large responses

**`fetchFileContent(owner, repo, path)`**
- Endpoint: `GET https://api.github.com/repos/{owner}/{repo}/contents/{path}`
- Decode base64 content
- Return: File content as string
- Handle binary files gracefully

**`identifyImportantFiles(fileTree)`**
- Pattern matching for important files:
  - Entry points: `main.js`, `index.js`, `App.jsx`, `app.py`, `main.py`, `index.ts`
  - Config: `config.js`, `settings.py`, `webpack.config.js`
  - Dependencies: `package.json`, `requirements.txt`, `Cargo.toml`
  - Documentation: `README.md`
- Return: Array of 3-5 most important file paths
- Priority order: README > package.json/requirements.txt > entry points > config

**`analyzeRepository(url)`**
- Main orchestration function
- Steps:
  1. Parse URL
  2. Fetch repository info
  3. Fetch file tree
  4. Identify important files
  5. Fetch content of important files (parallel)
  6. Fetch README.md
- Return comprehensive data object:
```javascript
{
  repoInfo: {
    name: string,
    description: string,
    stars: number,
    language: string,
    url: string
  },
  fileTree: string[],
  importantFiles: [
    { path: string, content: string }
  ],
  readme: string,
  error: null | string
}
```

#### Error Handling Strategy:
- **404 Not Found**: Return error "Repository not found or is private"
- **403 Rate Limit**: Return error "GitHub API rate limit reached. Please try again later."
- **Network Errors**: Return error "Failed to fetch repository. Please check your connection."
- **Invalid URL**: Return error "Invalid GitHub URL format"

### 2. App Component Updates (`src/App.jsx`)

#### New State Variables:
```javascript
const [repoData, setRepoData] = useState(null);
const [error, setError] = useState(null);
const [successMessage, setSuccessMessage] = useState('');
```

#### Modified `handleAnalyze()` Function:
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
  } catch (err) {
    setError(err.message || 'An unexpected error occurred');
  } finally {
    setIsAnalyzing(false);
  }
};
```

#### Pass Data to Components:
```javascript
<Summary 
  repoUrl={repoUrl} 
  repoSize={repoSize}
  repoData={repoData}
/>
```

### 3. Summary Component Updates (`src/components/TabContent/Summary.jsx`)

#### Display GitHub Data:

**Repository Overview Section:**
- Repository Name
- Description
- Stars count
- Primary Language
- GitHub URL (clickable link)
- Total Files count

**README Section:**
- Display first 500 characters of README
- Add "View on GitHub" link

**Important Files Section:**
- List detected important files
- Show file paths
- Optionally show first few lines of code

**Key Metrics Section:**
- Keep existing metrics or replace with real data if available
- Stars, Language, File count

### 4. UI/UX Enhancements

#### Success Message:
- Display green success banner after analysis: "✓ Repo analyzed successfully"
- Auto-hide after 3 seconds

#### Error Message:
- Display red error banner with specific error message
- Show retry button
- Clear error when user modifies URL

#### Loading State:
- Show spinner with message "Fetching repository data..."
- Disable input and buttons during analysis

## API Endpoints Reference

### GitHub REST API v3 (No Authentication Required)

1. **Repository Info**
   - `GET https://api.github.com/repos/{owner}/{repo}`
   - Rate Limit: 60 requests/hour

2. **File Tree**
   - `GET https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1`
   - Returns: Tree structure with all files

3. **File Content**
   - `GET https://api.github.com/repos/{owner}/{repo}/contents/{path}`
   - Returns: Base64 encoded content

4. **Rate Limit Check**
   - `GET https://api.github.com/rate_limit`
   - Check remaining requests

## Testing Strategy

### Test Cases:

1. **Valid Public Repository**
   - Input: `https://github.com/facebook/react`
   - Expected: Successful fetch and display

2. **Invalid URL**
   - Input: `https://example.com/repo`
   - Expected: Error message "Invalid GitHub URL format"

3. **Non-existent Repository**
   - Input: `https://github.com/user/nonexistent-repo-xyz`
   - Expected: Error message "Repository not found or is private"

4. **Private Repository**
   - Input: Private repo URL
   - Expected: Error message "Repository not found or is private"

5. **Rate Limit Exceeded**
   - Simulate 60+ requests
   - Expected: Error message "GitHub API rate limit reached"

6. **Different Repository Types**
   - JavaScript project (with package.json)
   - Python project (with requirements.txt)
   - Rust project (with Cargo.toml)

## Performance Considerations

1. **Parallel API Calls**: Fetch file contents in parallel using `Promise.all()`
2. **Limit File Fetching**: Only fetch 3-5 important files
3. **Caching**: Consider caching results for same URL (optional)
4. **Timeout**: Add 10-second timeout for API calls
5. **File Size Limits**: Skip files larger than 1MB

## Security Considerations

1. **No Token Storage**: Don't store GitHub tokens in code
2. **URL Validation**: Strictly validate GitHub URLs
3. **XSS Prevention**: Sanitize displayed content (especially README)
4. **CORS**: GitHub API supports CORS for browser requests

## Future Enhancements (Out of Scope)

- GitHub token authentication for higher rate limits
- Repository comparison feature
- Code complexity analysis
- Dependency vulnerability scanning
- Clone/download repository functionality

## Success Criteria

✅ User can paste GitHub URL and click "Analyze Repo"
✅ App fetches repository info, file tree, README, and important files
✅ Data is displayed in Summary tab with proper formatting
✅ Loading spinner shows during fetch
✅ Success message appears after successful analysis
✅ Error messages display for invalid URLs, private repos, and rate limits
✅ All functionality works without authentication for public repos
✅ Code is organized in separate `githubService.js` file

## Implementation Order

1. Create `githubService.js` with all helper functions
2. Test service functions independently
3. Update `App.jsx` with new state and async logic
4. Update `Summary.jsx` to display GitHub data
5. Add error handling and success messages
6. Test with various repository URLs
7. Polish UI/UX and error states