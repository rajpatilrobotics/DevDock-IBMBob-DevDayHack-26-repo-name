import React, { useState, useEffect, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your DevDock AI assistant. I've analyzed your repository and I'm here to help you understand the codebase. What would you like to know?",
      sender: 'bot',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware responses
    if (lowerMessage.includes('architecture') || lowerMessage.includes('structure')) {
      return "This appears to be a React application with a component-based architecture. The main entry point is src/index.js, and the app is structured with separate components for Header, Footer, and various tab content sections. Would you like me to explain any specific part?";
    } else if (lowerMessage.includes('setup') || lowerMessage.includes('install') || lowerMessage.includes('start')) {
      return "To set up this project: 1) Clone the repository, 2) Run 'npm install' to install dependencies, 3) Run 'npm start' to start the development server. The app will be available at http://localhost:3000. Need help with any specific step?";
    } else if (lowerMessage.includes('test') || lowerMessage.includes('testing')) {
      return "The project uses Jest and React Testing Library for testing. You can run tests with 'npm test'. The test files are located alongside the components with a .test.js extension. Would you like to know more about the testing strategy?";
    } else if (lowerMessage.includes('deploy') || lowerMessage.includes('production')) {
      return "For production deployment, run 'npm run build' to create an optimized build. The build folder will contain static files ready to be deployed to any static hosting service like Netlify, Vercel, or AWS S3. Need deployment guidance for a specific platform?";
    } else if (lowerMessage.includes('security') || lowerMessage.includes('vulnerability')) {
      return "I've identified 3 vulnerabilities in the dependencies: 1 high severity (lodash), 1 medium (tough-cookie), and 1 low (request). Check the Security Scanner tab for detailed information and remediation steps. Would you like me to explain any specific vulnerability?";
    } else if (lowerMessage.includes('component') || lowerMessage.includes('file')) {
      return "The main components are organized in the src/components directory. Key components include Header, InputSection, TabNavigation, and various tab content components. Each component is self-contained with its own logic. Which component would you like to explore?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
      return "I can help you with: understanding the architecture, setting up the project, explaining components, reviewing security findings, deployment guidance, testing strategies, and answering questions about the codebase. What would you like to explore?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Feel free to ask if you have any other questions about the repository. I'm here to help! 😊";
    } else if (lowerMessage.includes('dependencies') || lowerMessage.includes('packages')) {
      return "This project uses React 18.2.0 as the main framework, along with react-dom and react-scripts. There are 247 total dependencies including development dependencies. Most packages are up-to-date. Would you like details about any specific dependency?";
    } else {
      // Generic helpful response
      const responses = [
        "That's a great question! Based on the repository analysis, I can provide more specific information. Could you clarify what aspect you'd like to know more about?",
        "I understand you're asking about the codebase. The repository is well-structured with clear separation of concerns. What specific area would you like me to explain?",
        "Interesting question! This repository follows modern React best practices. Would you like me to explain the architecture, setup process, or specific components?",
        "I'm here to help you understand this codebase better. Could you be more specific about what you'd like to know? I can explain architecture, components, setup, or security findings."
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="tab-content chat-tab">
      <div className="content-card chat-card">
        <h2 className="card-title">💬 Chat with AI Assistant</h2>
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything about this repository..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <span className="send-icon">📤</span>
              Send
            </button>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h3 className="card-title">💡 Suggested Questions</h3>
        <div className="card-content">
          <div className="suggested-questions">
            <button 
              className="suggestion-chip"
              onClick={() => setInputValue("How do I set up this project?")}
            >
              How do I set up this project?
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => setInputValue("Explain the architecture")}
            >
              Explain the architecture
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => setInputValue("What are the security issues?")}
            >
              What are the security issues?
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => setInputValue("How do I run tests?")}
            >
              How do I run tests?
            </button>
            <button 
              className="suggestion-chip"
              onClick={() => setInputValue("What components are available?")}
            >
              What components are available?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

// Made with Bob