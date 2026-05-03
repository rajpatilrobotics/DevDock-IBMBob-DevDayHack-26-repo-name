# Dynamic Data Flow Diagram - Implementation Plan

## Current Situation

**File**: [`src/components/TabContent/DataFlowDiagram_NEW.jsx`](src/components/TabContent/DataFlowDiagram_NEW.jsx)
**Current Props**: `techStack`, `detailedArchitecture`
**Problem**: Uses hardcoded layers and generic templates, not derived from actual code

**Usage in Architecture.jsx** (Line 1905):
```javascript
<DataFlowDiagram techStack={techStack} detailedArchitecture={detailedArchitecture} />
```

## Required Changes

### 1. Add codeAnalysis Prop
**File**: [`src/components/TabContent/Architecture.jsx`](src/components/TabContent/Architecture.jsx:1905)
```javascript
// BEFORE
<DataFlowDiagram techStack={techStack} detailedArchitecture={detailedArchitecture} />

// AFTER
<DataFlowDiagram 
  techStack={techStack} 
  detailedArchitecture={detailedArchitecture}
  codeAnalysis={codeAnalysis}
/>
```

### 2. Complete Rewrite of DataFlowDiagram_NEW.jsx

## Implementation Strategy

### Phase 1: Flow Extraction from Code
Extract real data flow signals from `codeAnalysis` object:

**Available Data Structure** (from codeAnalysisService.js):
```javascript
codeAnalysis = {
  files: [
    {
      path: "src/App.jsx",
      size: 12345,
      lines: 500,
      content: "...",  // Full file content
      patterns: {
        frameworks: ["React"],
        libraries: ["axios"],
        databases: [],
        patterns: ["Component-Based"],
        apis: ["fetch", "axios"]
      },
      security: [...],
      definitions: {
        functions: [
          { name: "handleSubmit", line: 45, type: "arrow", async: true }
        ],
        classes: [
          { name: "App", line: 10 }
        ],
        exports: [
          { name: "App", line: 100, default: true }
        ]
      }
    }
  ],
  summary: {
    totalFiles: 15,
    analyzedFiles: 15,
    totalLines: 5000,
    frameworks: ["React", "Express"],
    libraries: ["axios", "mongoose"],
    databases: ["MongoDB"],
    patterns: ["MVC", "REST API"],
    apis: ["fetch", "axios"]
  },
  security: { critical: [], high: [], medium: [], low: [] },
  definitions: {
    functions: [...],  // All functions across all files
    classes: [...],    // All classes across all files
    exports: [...]     // All exports across all files
  }
}
```

### Phase 2: Node Detection Logic

#### 1. Detect Entry Points
```javascript
const detectEntryPoints = (codeAnalysis) => {
  const entryFiles = codeAnalysis.files.filter(f => 
    f.path.match(/index\.(js|jsx|ts|tsx)$/) ||
    f.path.match(/main\.(js|jsx|ts|tsx|py)$/) ||
    f.path.match(/App\.(jsx|tsx)$/) ||
    f.path.match(/app\.py$/) ||
    f.path.match(/server\.(js|ts)$/)
  );
  
  return entryFiles.map(f => ({
    id: `entry_${f.path}`,
    file: f.path,
    type: 'entry',
    layer: 'entry',
    importance: 10
  }));
};
```

#### 2. Detect UI Components
```javascript
const detectUIComponents = (codeAnalysis) => {
  const uiFiles = codeAnalysis.files.filter(f =>
    (f.path.includes('component') || 
     f.path.includes('pages') || 
     f.path.includes('views') ||
     f.path.match(/\.(jsx|tsx|vue)$/)) &&
    !f.path.includes('test')
  );
  
  return uiFiles.map(f => ({
    id: `ui_${f.path}`,
    file: f.path,
    type: 'component',
    layer: 'ui',
    importance: f.definitions.functions.length + f.definitions.classes.length,
    hasState: f.content?.includes('useState') || f.content?.includes('this.state')
  }));
};
```

#### 3. Detect API Calls
```javascript
const detectAPICalls = (codeAnalysis) => {
  const apiFiles = codeAnalysis.files.filter(f =>
    f.patterns.apis.length > 0 ||
    f.content?.includes('fetch(') ||
    f.content?.includes('axios.') ||
    f.content?.includes('http.')
  );
  
  return apiFiles.map(f => ({
    id: `api_${f.path}`,
    file: f.path,
    type: 'api',
    layer: 'api',
    importance: f.patterns.apis.length,
    methods: f.patterns.apis
  }));
};
```

#### 4. Detect Backend Routes
```javascript
const detectBackendRoutes = (codeAnalysis) => {
  const routeFiles = codeAnalysis.files.filter(f =>
    f.path.includes('route') ||
    f.path.includes('controller') ||
    f.path.includes('api') ||
    f.content?.includes('app.get(') ||
    f.content?.includes('app.post(') ||
    f.content?.includes('@app.route') ||
    f.content?.includes('router.')
  );
  
  return routeFiles.map(f => ({
    id: `route_${f.path}`,
    file: f.path,
    type: 'route',
    layer: 'backend',
    importance: f.definitions.functions.length,
    endpoints: extractEndpoints(f.content)
  }));
};
```

#### 5. Detect Data Access
```javascript
const detectDataAccess = (codeAnalysis) => {
  const dataFiles = codeAnalysis.files.filter(f =>
    f.path.includes('model') ||
    f.path.includes('schema') ||
    f.path.includes('database') ||
    f.path.includes('db') ||
    f.patterns.databases.length > 0 ||
    f.content?.includes('mongoose.') ||
    f.content?.includes('sequelize') ||
    f.content?.includes('prisma')
  );
  
  return dataFiles.map(f => ({
    id: `data_${f.path}`,
    file: f.path,
    type: 'model',
    layer: 'data',
    importance: f.definitions.classes.length,
    database: f.patterns.databases[0] || 'Database'
  }));
};
```

### Phase 3: Edge Generation (Relationships)

```javascript
const generateEdges = (nodes, codeAnalysis) => {
  const edges = [];
  
  codeAnalysis.files.forEach(file => {
    // Extract imports from file content
    const imports = extractImports(file.content);
    
    imports.forEach(importPath => {
      const sourceNode = nodes.find(n => n.file === file.path);
      const targetNode = nodes.find(n => n.file.includes(importPath));
      
      if (sourceNode && targetNode) {
        edges.push({
          id: `${sourceNode.id}-${targetNode.id}`,
          source: sourceNode.id,
          target: targetNode.id,
          type: 'smoothstep',
          animated: true
        });
      }
    });
    
    // Detect API calls to backend
    if (file.patterns.apis.length > 0) {
      const apiNode = nodes.find(n => n.file === file.path);
      const backendNodes = nodes.filter(n => n.layer === 'backend');
      
      backendNodes.forEach(backend => {
        edges.push({
          id: `${apiNode.id}-${backend.id}`,
          source: apiNode.id,
          target: backend.id,
          type: 'smoothstep',
          animated: true,
          label: 'HTTP'
        });
      });
    }
  });
  
  return edges;
};
```

### Phase 4: Importance Scoring & Filtering

```javascript
const scoreAndFilterNodes = (nodes, maxNodes = 15) => {
  // Score based on:
  // - Number of functions/classes
  // - Number of imports/exports
  // - File type (entry points = highest)
  // - Connections to other nodes
  
  const scored = nodes.map(node => ({
    ...node,
    score: calculateImportanceScore(node)
  }));
  
  // Sort by score and take top N
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxNodes);
};

const calculateImportanceScore = (node) => {
  let score = node.importance || 0;
  
  // Boost entry points
  if (node.layer === 'entry') score += 50;
  
  // Boost files with many functions
  if (node.importance > 10) score += 20;
  
  // Boost API and route files
  if (node.layer === 'api' || node.layer === 'backend') score += 15;
  
  return score;
};
```

### Phase 5: Dagre Layout Integration

```javascript
import dagre from 'dagre';

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Configure layout
  dagreGraph.setGraph({
    rankdir: 'TB',  // Top to bottom
    nodesep: 200,   // Horizontal spacing
    ranksep: 120,   // Vertical spacing
    marginx: 50,
    marginy: 50
  });
  
  // Add nodes
  nodes.forEach(node => {
    dagreGraph.setNode(node.id, {
      width: 280,
      height: 150
    });
  });
  
  // Add edges
  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  // Calculate layout
  dagre.layout(dagreGraph);
  
  // Apply positions
  const layoutedNodes = nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 140,  // Center node
        y: nodeWithPosition.y - 75
      }
    };
  });
  
  return { nodes: layoutedNodes, edges };
};
```

### Phase 6: Smart Layer Grouping

```javascript
const inferLayer = (file) => {
  const path = file.path.toLowerCase();
  const content = file.content || '';
  
  // Entry point
  if (path.match(/index|main|app\.(jsx?|tsx?|py)$/)) {
    return 'entry';
  }
  
  // UI Layer
  if (path.includes('component') || 
      path.includes('pages') || 
      path.includes('views') ||
      path.match(/\.(jsx|tsx|vue)$/)) {
    return 'ui';
  }
  
  // API Layer
  if (content.includes('fetch(') || 
      content.includes('axios') ||
      content.includes('http.')) {
    return 'api';
  }
  
  // Backend Layer
  if (path.includes('route') || 
      path.includes('controller') ||
      path.includes('api/') ||
      content.includes('app.get(') ||
      content.includes('router.')) {
    return 'backend';
  }
  
  // Data Layer
  if (path.includes('model') || 
      path.includes('schema') ||
      path.includes('database') ||
      content.includes('mongoose') ||
      content.includes('prisma')) {
    return 'data';
  }
  
  return 'other';
};
```

## Final Component Structure

```javascript
function DataFlowDiagram({ techStack, detailedArchitecture, codeAnalysis }) {
  if (!codeAnalysis || !codeAnalysis.files) {
    return <div>No code analysis data available</div>;
  }
  
  // 1. Extract flow from code
  const entryPoints = detectEntryPoints(codeAnalysis);
  const uiComponents = detectUIComponents(codeAnalysis);
  const apiCalls = detectAPICalls(codeAnalysis);
  const backendRoutes = detectBackendRoutes(codeAnalysis);
  const dataAccess = detectDataAccess(codeAnalysis);
  
  // 2. Combine all nodes
  const allNodes = [
    ...entryPoints,
    ...uiComponents,
    ...apiCalls,
    ...backendRoutes,
    ...dataAccess
  ];
  
  // 3. Filter to top 10-15 most important
  const importantNodes = scoreAndFilterNodes(allNodes, 15);
  
  // 4. Generate edges based on relationships
  const edges = generateEdges(importantNodes, codeAnalysis);
  
  // 5. Apply dagre layout
  const { nodes: layoutedNodes, edges: layoutedEdges } = 
    getLayoutedElements(importantNodes, edges);
  
  // 6. Convert to React Flow format
  const reactFlowNodes = layoutedNodes.map(node => ({
    id: node.id,
    type: 'default',
    data: {
      label: <NodeComponent node={node} />
    },
    position: node.position,
    style: getNodeStyle(node.layer)
  }));
  
  return (
    <div style={{ height: '800px' }}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={layoutedEdges}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
```

## Implementation Checklist

- [ ] Add `codeAnalysis` prop to DataFlowDiagram in Architecture.jsx
- [ ] Install dagre: `npm install dagre`
- [ ] Create `detectEntryPoints()` function
- [ ] Create `detectUIComponents()` function
- [ ] Create `detectAPICalls()` function
- [ ] Create `detectBackendRoutes()` function
- [ ] Create `detectDataAccess()` function
- [ ] Create `generateEdges()` function
- [ ] Create `scoreAndFilterNodes()` function
- [ ] Create `getLayoutedElements()` with dagre
- [ ] Create `inferLayer()` function
- [ ] Create custom node component showing file name and purpose
- [ ] Test with real repository data
- [ ] Verify no overlapping nodes (120px vertical, 200px horizontal)

## Expected Output

**Dynamic Flow Example** (for a React + Express app):
```
User Action
    ↓
App.jsx (Entry)
    ↓
LoginComponent.jsx (UI)
    ↓
authService.js (API - axios.post)
    ↓
/routes/auth.js (Backend - Express route)
    ↓
/models/User.js (Data - Mongoose model)
    ↓
MongoDB (Database)
    ↓
Response flows back up
```

All nodes and edges derived from actual code analysis, not hardcoded!