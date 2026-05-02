# GitHub Integration - Visual Architecture

## Component Interaction Flow

```mermaid
graph TD
    A[User enters GitHub URL] --> B[InputSection Component]
    B --> C[Click Analyze Repo Button]
    C --> D[App.jsx handleAnalyze]
    D --> E[githubService.analyzeRepository]
    
    E --> F[Parse GitHub URL]
    F --> G{Valid URL?}
    G -->|No| H[Return Error: Invalid URL]
    G -->|Yes| I[Extract owner & repo]
    
    I --> J[Fetch Repository Info]
    J --> K{API Success?}
    K -->|No| L[Return Error: Not Found/Rate Limit]
    K -->|Yes| M[Fetch File Tree]
    
    M --> N[Identify Important Files]
    N --> O[Fetch File Contents in Parallel]
    O --> P[Fetch README.md]
    
    P --> Q[Combine All Data]
    Q --> R[Return to App.jsx]
    
    H --> S[Display Error Message]
    L --> S
    R --> T[Update State with Repo Data]
    T --> U[Show Success Message]
    U --> V[Display in Summary Tab]
    
    style E fill:#e1f5ff
    style S fill:#ffebee
    style U fill:#e8f5e9
    style V fill:#fff9c4
```

## Data Structure Flow

```mermaid
graph LR
    A[GitHub URL] --> B[parseGitHubUrl]
    B --> C[owner: string<br/>repo: string]
    
    C --> D[fetchRepositoryInfo]
    D --> E[name<br/>description<br/>stars<br/>language<br/>defaultBranch]
    
    C --> F[fetchFileTree]
    F --> G[Array of file paths]
    
    G --> H[identifyImportantFiles]
    H --> I[3-5 important file paths]
    
    I --> J[fetchFileContent]
    J --> K[File contents array]
    
    E --> L[analyzeRepository Result]
    K --> L
    G --> L
    
    L --> M[App State:<br/>repoData]
    M --> N[Summary Component]
    N --> O[Display to User]
    
    style A fill:#bbdefb
    style L fill:#c8e6c9
    style M fill:#fff9c4
    style O fill:#f8bbd0
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> Idle: Initial State
    Idle --> Analyzing: User clicks Analyze
    Analyzing --> Success: API calls succeed
    Analyzing --> Error: API calls fail
    Success --> DisplayingResults: Show success message
    Error --> DisplayingError: Show error message
    DisplayingResults --> Idle: User enters new URL
    DisplayingError --> Idle: User enters new URL
    DisplayingError --> Analyzing: User clicks retry
    
    note right of Analyzing
        - Show loading spinner
        - Disable input/buttons
        - Call GitHub API
    end note
    
    note right of Success
        - Store repo data
        - Set success message
        - Switch to Summary tab
    end note
    
    note right of Error
        - Clear repo data
        - Set error message
        - Keep on current view
    end note
```

## API Call Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Service
    participant GitHub
    
    User->>App: Enter URL & Click Analyze
    App->>App: Set isAnalyzing = true
    App->>Service: analyzeRepository(url)
    
    Service->>Service: parseGitHubUrl(url)
    alt Invalid URL
        Service-->>App: Return error
        App->>User: Show error message
    else Valid URL
        Service->>GitHub: GET /repos/owner/repo
        GitHub-->>Service: Repository info
        
        Service->>GitHub: GET /repos/owner/repo/git/trees/main
        GitHub-->>Service: File tree
        
        Service->>Service: identifyImportantFiles()
        
        par Fetch multiple files
            Service->>GitHub: GET /repos/owner/repo/contents/file1
            Service->>GitHub: GET /repos/owner/repo/contents/file2
            Service->>GitHub: GET /repos/owner/repo/contents/README.md
        end
        
        GitHub-->>Service: File contents
        
        Service->>Service: Combine all data
        Service-->>App: Return repo data
        
        App->>App: Update state
        App->>User: Show success message
        App->>User: Display in Summary tab
    end
```

## File Structure After Implementation

```
devdock/
├── src/
│   ├── services/
│   │   └── githubService.js          ← NEW FILE
│   │       ├── parseGitHubUrl()
│   │       ├── fetchRepositoryInfo()
│   │       ├── fetchFileTree()
│   │       ├── fetchFileContent()
│   │       ├── identifyImportantFiles()
│   │       └── analyzeRepository()
│   │
│   ├── App.jsx                        ← MODIFIED
│   │   ├── + repoData state
│   │   ├── + error state
│   │   ├── + successMessage state
│   │   └── ~ handleAnalyze() - now async
│   │
│   └── components/
│       └── TabContent/
│           └── Summary.jsx            ← MODIFIED
│               └── + Display GitHub data
│
└── GITHUB_INTEGRATION_PLAN.md         ← NEW FILE (this plan)
```

## Error Handling Flow

```mermaid
graph TD
    A[API Call] --> B{Response Status}
    B -->|200 OK| C[Parse & Return Data]
    B -->|404| D[Repository Not Found]
    B -->|403| E[Rate Limit Exceeded]
    B -->|Network Error| F[Connection Failed]
    B -->|Other| G[Unexpected Error]
    
    D --> H[Show: Repository not found or is private]
    E --> I[Show: GitHub API rate limit reached]
    F --> J[Show: Failed to fetch repository]
    G --> K[Show: An unexpected error occurred]
    
    H --> L[User Action: Check URL]
    I --> M[User Action: Wait & Retry]
    J --> N[User Action: Check Connection]
    K --> O[User Action: Retry]
    
    style D fill:#ffcdd2
    style E fill:#ffcdd2
    style F fill:#ffcdd2
    style G fill:#ffcdd2
    style C fill:#c8e6c9
```

## Important Files Detection Logic

```mermaid
graph TD
    A[File Tree Array] --> B[Filter by Patterns]
    
    B --> C{README.md?}
    C -->|Yes| D[Priority 1: Add README]
    C -->|No| E[Skip]
    
    B --> F{package.json or requirements.txt?}
    F -->|Yes| G[Priority 2: Add Dependencies]
    F -->|No| H[Skip]
    
    B --> I{Entry Point Files?}
    I -->|Yes| J[Priority 3: Add Entry Points]
    I -->|No| K[Skip]
    
    B --> L{Config Files?}
    L -->|Yes| M[Priority 4: Add Config]
    L -->|No| N[Skip]
    
    D --> O[Combine Results]
    G --> O
    J --> O
    M --> O
    
    O --> P{Count > 5?}
    P -->|Yes| Q[Take Top 5]
    P -->|No| R[Return All]
    
    Q --> S[Final List: 3-5 Files]
    R --> S
    
    style S fill:#c8e6c9
```

## Summary Tab Layout (After Implementation)

```
┌─────────────────────────────────────────────────────┐
│  Summary Tab                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Repository Overview                         │  │
│  │                                             │  │
│  │ Name: facebook/react                        │  │
│  │ Description: A declarative, efficient...    │  │
│  │ Stars: ⭐ 234,567                           │  │
│  │ Language: JavaScript                        │  │
│  │ Total Files: 1,234 files                    │  │
│  │ GitHub URL: [View on GitHub]                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ README Preview                              │  │
│  │                                             │  │
│  │ React is a JavaScript library for...       │  │
│  │ [First 500 characters]                      │  │
│  │                                             │  │
│  │ [View Full README on GitHub]                │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Important Files Detected                    │  │
│  │                                             │  │
│  │ 📄 package.json                             │  │
│  │ 📄 src/index.js                             │  │
│  │ 📄 src/App.jsx                              │  │
│  │ 📄 webpack.config.js                        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Key Metrics                                 │  │
│  │                                             │  │
│  │ [Existing metrics or enhanced with real     │  │
│  │  data from GitHub API]                      │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Success & Error Message Display

```
┌─────────────────────────────────────────────────────┐
│  Success State                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ✓ Repo analyzed successfully                │  │
│  │ [Auto-hide after 3 seconds]                 │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  Error State                                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ⚠️ Repository not found or is private       │  │
│  │ [Retry Button]                              │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘