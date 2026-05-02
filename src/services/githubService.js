// GitHub API Service for fetching repository data
// No authentication required for public repositories (60 requests/hour limit)

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Parse GitHub URL to extract owner and repository name
 * Supports formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - github.com/owner/repo
 * @param {string} url - GitHub repository URL
 * @returns {Object|null} - { owner, repo } or null if invalid
 */
export function parseGitHubUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  // Remove trailing slashes and .git extension
  url = url.trim().replace(/\.git$/, '').replace(/\/$/, '');
  
  // Match GitHub URL patterns
  const patterns = [
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)/,
    /^github\.com\/([^\/]+)\/([^\/]+)/,
    /^([^\/]+)\/([^\/]+)$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2]
      };
    }
  }
  
  return null;
}

/**
 * Fetch repository information from GitHub API
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} - Repository metadata
 */
export async function fetchRepositoryInfo(owner, repo) {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found or is private');
    } else if (response.status === 403) {
      throw new Error('GitHub API rate limit reached. Please try again later.');
    } else {
      throw new Error(`Failed to fetch repository: ${response.statusText}`);
    }
  }
  
  const data = await response.json();
  
  return {
    name: data.full_name,
    description: data.description || 'No description available',
    stars: data.stargazers_count,
    language: data.language || 'Not specified',
    defaultBranch: data.default_branch,
    url: data.html_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    topics: data.topics || [],
    license: data.license?.name || 'No license'
  };
}

/**
 * Fetch repository file tree
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name (default: main/master)
 * @returns {Promise<Array>} - Array of file paths
 */
export async function fetchFileTree(owner, repo, branch = 'main') {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );
  
  if (!response.ok) {
    // Try 'master' branch if 'main' fails
    if (branch === 'main') {
      return fetchFileTree(owner, repo, 'master');
    }
    throw new Error('Failed to fetch file tree');
  }
  
  const data = await response.json();
  
  // Filter out directories, only return files
  const files = data.tree
    .filter(item => item.type === 'blob')
    .map(item => item.path);
  
  return files;
}

/**
 * Fetch content of a specific file
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} path - File path
 * @returns {Promise<string>} - File content
 */
export async function fetchFileContent(owner, repo, path) {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${path}`);
  }
  
  const data = await response.json();
  
  // GitHub returns content as base64 encoded
  if (data.content) {
    try {
      return atob(data.content.replace(/\n/g, ''));
    } catch (e) {
      return 'Unable to decode file content';
    }
  }
  
  return 'No content available';
}

/**
 * Identify important files in the repository
 * @param {Array} fileTree - Array of file paths
 * @returns {Array} - Array of important file paths (3-5 files)
 */
export function identifyImportantFiles(fileTree) {
  const importantPatterns = [
    // Documentation (highest priority)
    { pattern: /^README\.md$/i, priority: 1 },
    { pattern: /^README\.txt$/i, priority: 1 },
    
    // Package/dependency files
    { pattern: /^package\.json$/i, priority: 2 },
    { pattern: /^requirements\.txt$/i, priority: 2 },
    { pattern: /^Cargo\.toml$/i, priority: 2 },
    { pattern: /^go\.mod$/i, priority: 2 },
    { pattern: /^Gemfile$/i, priority: 2 },
    { pattern: /^composer\.json$/i, priority: 2 },
    
    // Entry points
    { pattern: /^(src\/)?index\.(js|ts|jsx|tsx)$/i, priority: 3 },
    { pattern: /^(src\/)?main\.(js|ts|py|rs|go)$/i, priority: 3 },
    { pattern: /^(src\/)?App\.(jsx|tsx|js|ts)$/i, priority: 3 },
    { pattern: /^(src\/)?app\.py$/i, priority: 3 },
    
    // Configuration files
    { pattern: /^\.env\.example$/i, priority: 4 },
    { pattern: /^config\.(js|json|yaml|yml)$/i, priority: 4 },
    { pattern: /^tsconfig\.json$/i, priority: 4 },
    { pattern: /^webpack\.config\.js$/i, priority: 4 }
  ];
  
  const matches = [];
  
  for (const file of fileTree) {
    for (const { pattern, priority } of importantPatterns) {
      if (pattern.test(file)) {
        matches.push({ path: file, priority });
        break;
      }
    }
  }
  
  // Sort by priority and limit to 5 files
  matches.sort((a, b) => a.priority - b.priority);
  return matches.slice(0, 5).map(m => m.path);
}

/**
 * Main function to analyze a GitHub repository
 * @param {string} url - GitHub repository URL
 * @returns {Promise<Object>} - Complete repository analysis
 */
export async function analyzeRepository(url) {
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
      try {
        const content = await fetchFileContent(owner, repo, path);
        return { path, content };
      } catch (error) {
        return { path, content: 'Failed to fetch content', error: true };
      }
    });
    
    const importantFiles = await Promise.all(fileContentPromises);
    
    // Step 6: Fetch README content separately
    let readme = 'No README found';
    const readmeFile = importantFiles.find(f => /^README\.md$/i.test(f.path));
    if (readmeFile && !readmeFile.error) {
      readme = readmeFile.content;
    }
    
    return {
      repoInfo,
      fileTree,
      importantFiles,
      readme,
      error: null
    };
    
  } catch (error) {
    return {
      error: error.message || 'An unexpected error occurred while analyzing the repository'
    };
  }
}

// Made with Bob
