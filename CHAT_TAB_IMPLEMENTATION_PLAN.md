# Chat Tab Implementation Plan

## Current Status Analysis

### ✅ Already Implemented Features

1. **Compressed Repository Context** (Lines 90-122)
   - `buildCompressedContext()` function exists
   - Creates context object with: `repo_name`, `repo_description`, `tech_stack`, `key_files`, `short_summary`
   - Context is built ONCE on mount and stored in state
   - ✅ Context reuse working - never regenerated

2. **Character Counter** (Lines 697-699)
   - Already implemented with `{charCount}/{MAX_CHARS}` display
   - MAX_CHARS = 200
   - Over-limit styling with `over-limit` class
   - ✅ Fully functional

3. **Suggested Starter Questions** (Lines 784-825)
   - Card with 5 suggested questions:
     - "What does this project do?"
     - "How do I set up this project?"
     - "What are the main components?"
     - "Where is authentication handled?"
     - "What are the key dependencies?"
   - ✅ All 5 required questions present

4. **WhatsApp-Style Bubble Layout** (Lines 618-683)
   - User messages on right with `user-message` class
   - Bot messages on left with `bot-message` class
   - Message wrappers for alignment
   - ✅ Layout structure correct

5. **Typing Animation** (Lines 663-680)
   - Typing indicator with 3 animated dots
   - "AI is typing" text
   - Shows while `isTyping` is true
   - ✅ Animation implemented

6. **Smooth Scroll** (Lines 86-88)
   - Auto-scroll to `messagesEndRef` on new messages
   - Uses `scrollIntoView({ behavior: 'smooth' })`
   - ✅ Working correctly

7. **Send on Enter** (Lines 591-596)
   - `handleKeyPress` function checks for Enter key
   - Prevents default and calls `handleSendMessage()`
   - ✅ Functional

8. **Timestamps** (Lines 651-657)
   - Each message shows time in HH:MM format
   - Uses `toLocaleTimeString()`
   - ✅ Working

---

## ❌ Issues Found - Needs Fixing

### Issue 1: System Prompt Format Mismatch

**Current Implementation** (Lines 313-358):
```javascript
const buildStructuredPrompt = (userQuestion, intent, context, chatHistory) => {
  const filesList = context.key_files
    .map((f, idx) => `{file_${idx + 1}}: ${f.purpose}`)
    .join('\n');
  
  return `You are a senior software engineer assistant...
REPOSITORY CONTEXT:
Name: ${context.repo_name}
Description: ${context.repo_description}
Tech Stack: ${context.tech_stack}
Key Files:
${filesList}
Summary: ${context.short_summary}
...`;
}
```

**Required Format** (from task):
```
Key Files:
{file_1}: {purpose}
{file_2}: {purpose}
{file_3}: {purpose}
{file_4}: {purpose}
```

**Problem**: Current format uses `{file_1}:` as placeholder text, but should use actual file names.

**Fix Required**:
```javascript
const filesList = context.key_files
  .map((f, idx) => `${f.name}: ${f.purpose}`)
  .join('\n');
```

### Issue 2: System Prompt Text Differences

**Current** (Lines 325-358):
- Uses "STRICT RULES:" (correct)
- Missing exact bullet format from specification
- Has correct rules but formatting differs slightly

**Required** (from task):
```
STRICT RULES:
- Answer ONLY based on the repository context provided
- Do NOT hallucinate features, files, or logic
- If information is missing, say: Not enough information in the repository
- Keep answers concise (max 120 words)
- Reference file names, folders, or components when possible
- Prefer practical explanations over theory
- Use bullet points when helpful
- Always suggest a follow up question at the end
- Format code snippets with proper labels
- If asked about setup always include exact commands
```

**Fix Required**: Update system prompt to match EXACT specification text.

### Issue 3: Context Object Structure

**Current** (Lines 114-122):
```javascript
return {
  repo_name: repoInfo.name,
  repo_description: repoInfo.description || 'No description available',
  tech_stack: techStackStr,
  key_files: keyFiles,  // Array of objects with {name, purpose, fullPath}
  short_summary: shortSummary,
  all_files: importantFiles || []
};
```

**Required** (from task):
```javascript
{
  repo_name: string,
  repo_description: string,
  tech_stack: string,
  key_files: [
    { file_1: string, purpose: string },
    { file_2: string, purpose: string },
    { file_3: string, purpose: string },
    { file_4: string, purpose: string }
  ],
  short_summary: string (first 300 chars)
}
```

**Problem**: Structure is close but key_files format differs slightly.

**Fix Required**: Ensure key_files array has exactly 4 items with consistent structure.

---

## Implementation Tasks

### Task 1: Fix System Prompt Format ✅ CRITICAL
**File**: [`src/components/TabContent/Chat.jsx`](src/components/TabContent/Chat.jsx:313-358)
**Lines**: 313-358

**Changes**:
1. Update `buildStructuredPrompt` function
2. Fix file list formatting to use actual file names instead of placeholders
3. Ensure exact text match with specification
4. Keep all existing functionality (intent, chat history, etc.)

**Code Change**:
```javascript
const buildStructuredPrompt = (userQuestion, intent, context, chatHistory) => {
  // Build key files list with actual file names
  const filesList = context.key_files
    .map((f, idx) => `${f.name}: ${f.purpose}`)
    .join('\n');
  
  // Get last 3 messages (6 total - 3 exchanges) for chat history
  const recentHistory = chatHistory.slice(-6);
  const historyStr = recentHistory
    .map(m => `${m.sender === 'user' ? 'User' : 'Assistant'}: ${m.text}`)
    .join('\n');
  
  return `You are a senior software engineer assistant who has fully analyzed a GitHub repository.
Your job is to answer questions about this codebase accurately and helpfully.

STRICT RULES:
- Answer ONLY based on the repository context provided
- Do NOT hallucinate features, files, or logic
- If information is missing, say: Not enough information in the repository
- Keep answers concise (max 120 words)
- Reference file names, folders, or components when possible
- Prefer practical explanations over theory
- Use bullet points when helpful
- Always suggest a follow up question at the end
- Format code snippets with proper labels
- If asked about setup always include exact commands

REPOSITORY CONTEXT:
Name: ${context.repo_name}
Description: ${context.repo_description}
Tech Stack: ${context.tech_stack}
Key Files:
${filesList}
Summary: ${context.short_summary}

CHAT HISTORY (last 3 messages only):
${historyStr || 'No previous messages'}

USER QUESTION:
${userQuestion}

RESPONSE FORMAT:
- Start with direct answer
- Support with specific file references
- End with: 💡 You might also want to ask: {suggested follow up question}`;
}
```

### Task 2: Verify Context Object Structure ✅ LOW PRIORITY
**File**: [`src/components/TabContent/Chat.jsx`](src/components/TabContent/Chat.jsx:90-122)
**Lines**: 90-122

**Current structure is acceptable** - just ensure it always has exactly 4 files:
```javascript
const keyFiles = (importantFiles || [])
  .slice(0, 4)  // ✅ Already limiting to 4
  .map(f => ({
    name: f.path,
    purpose: detectFilePurpose(f.path),
    fullPath: f.path
  }));
```

**No changes needed** - structure is compatible with system prompt.

### Task 3: Verify All UI Features ✅ TESTING
**File**: [`src/components/TabContent/Chat.jsx`](src/components/TabContent/Chat.jsx:1-832)

**Checklist**:
- [x] Character counter (max 200 chars) - Lines 697-699
- [x] Suggested starter questions - Lines 784-825
- [x] WhatsApp-style bubble layout - Lines 618-683
- [x] Typing animation - Lines 663-680
- [x] Smooth scroll - Lines 86-88
- [x] Send on Enter - Lines 591-596
- [x] Timestamps - Lines 651-657
- [x] Context reuse (never regenerate) - Lines 69-83

**All features present and functional!**

---

## Testing Plan

### Test 1: System Prompt Verification
1. Analyze a repository
2. Go to Chat tab
3. Send a message
4. Check browser console for the generated prompt
5. Verify it matches the exact specification

### Test 2: Context Reuse
1. Analyze a repository
2. Go to Chat tab (context built)
3. Send multiple messages
4. Verify context is NOT rebuilt between messages
5. Check console logs for "Building context" - should only appear once

### Test 3: Character Counter
1. Type in chat input
2. Verify counter shows `X/200`
3. Type over 200 characters
4. Verify counter turns red and send button is disabled

### Test 4: Suggested Questions
1. Click each of the 5 suggested questions
2. Verify they populate the input field
3. Verify they can be sent

### Test 5: UI Layout
1. Send user message - verify it appears on right in blue
2. Receive AI response - verify it appears on left in dark
3. Verify typing animation shows while waiting
4. Verify smooth scroll to latest message
5. Verify timestamps on all messages

---

## Summary

### What's Already Working ✅
- Compressed repository context (built once, reused)
- Character counter (200 char limit)
- All 5 suggested starter questions
- WhatsApp-style bubble layout
- Typing animation with dots
- Smooth scroll to latest message
- Send on Enter key
- Timestamps on messages
- Response caching
- Intent detection
- Dynamic file selection
- Code snippet extraction

### What Needs Fixing ❌
1. **System prompt file list format** - Use actual file names instead of `{file_1}:` placeholders
2. **System prompt text** - Ensure exact match with specification

### Implementation Priority
1. **HIGH**: Fix system prompt format (Task 1)
2. **MEDIUM**: Test all features with real repository
3. **LOW**: Verify context object structure (already correct)

---

## Next Steps

1. Switch to Code mode
2. Apply fix to `buildStructuredPrompt` function
3. Test with real repository data
4. Verify all features working correctly
5. Document completion

---

## Files to Modify

1. [`src/components/TabContent/Chat.jsx`](src/components/TabContent/Chat.jsx:313-358) - Lines 313-358 (system prompt)

**No other files need modification** - all other features are already implemented correctly!