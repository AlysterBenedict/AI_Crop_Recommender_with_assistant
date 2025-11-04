import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

// The URL of your FastAPI backend chat endpoint
const API_CHAT_URL = 'http://127.0.0.1:8000/chat';

// --- Preset Queries ---
const presetQueries = [
  "Why was my top crop recommended?",
  "What are the risks for my top recommended crop?",
  "Give me a simple tip for one of these crops.",
  "Which of these 3 crops is most resilient?",
];

// --- NEW HELPER COMPONENT ---
/**
 * A simple markdown parser that handles:
 * - **bold text**
 * - bullet points (* or -)
 * - new lines
 */
const SimpleMarkdownRenderer = ({ text }) => {
  // 1. Split the text into lines
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        let processedLine = line;

        // 2. Handle bullet points
        let isBullet = false;
        if (processedLine.startsWith('* ') || processedLine.startsWith('- ')) {
          processedLine = `• ${processedLine.substring(2)}`;
          isBullet = true;
        }

        // 3. Handle bold text using regex
        // This splits the line by bold segments, e.g., "Hello **World**" -> ["Hello ", "**World**", ""]
        const parts = processedLine.split(/(\*\*.*?\*\*)/g);

        const renderedLine = parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // It's bold text: remove the **
            return <strong key={j}>{part.substring(2, part.length - 2)}</strong>;
          }
          // It's regular text
          return part;
        });

        // 4. Return the line, wrapped in a div for proper spacing
        return (
          <div 
            key={i} 
            style={{ 
              display: 'block', 
              paddingLeft: isBullet ? '1.25rem' : '0', // Indent bullets
              textIndent: isBullet ? '-1.25rem' : '0', // Create a hanging indent
              lineHeight: '1.6', // Add a bit more space
              // This ensures empty lines are still rendered, preserving paragraphs
              minHeight: '1.6em', 
            }}
          >
            {renderedLine.length > 0 ? renderedLine : '\u00A0'} {/* Render a non-breaking space for empty lines */}
          </div>
        );
      })}
    </>
  );
};
// --- END OF NEW HELPER COMPONENT ---


const Chatbot = ({ inputs, predictions }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  // --- Scroll to bottom when new messages appear ---
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // --- Main function to handle sending a message ---
  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim() || !inputs || !predictions) return;

    const newUserMessage = { role: 'user', content: messageContent };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch(API_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_query: messageContent,
          inputs: inputs,
          predictions: predictions
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      const botResponse = data.response;
      
      setMessages([...newMessages, { role: 'assistant', content: botResponse }]);

    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `Sorry, I couldn't connect. Error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (query) => {
    handleSendMessage(query);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(userInput);
  };

  return (
    <div className="chatbot-container">
      <h4 className="chatbot-title">
        <FaRobot style={{ marginRight: '0.5rem' }} />
        Ask AgriBot Advisor
      </h4>
      
      {/* --- Chat Message Window --- */}
      <div className="chat-window" ref={chatWindowRef}>
        {messages.length === 0 && (
          <div className="chat-placeholder">
            Ask a question about your results.
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <span className="chat-icon">
              {msg.role === 'user' ? <FaUser /> : <FaRobot />}
            </span>

            {/* --- MODIFICATION --- */}
            {/* This is the line that was changed */}
            <div className="chat-bubble">
              <SimpleMarkdownRenderer text={msg.content} />
            </div>
            {/* --- END OF MODIFICATION --- */}

          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant">
            <span className="chat-icon"><FaRobot /></span>
            <div className="chat-bubble loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      {/* --- Preset Queries --- */}
      <div className="preset-queries">
        {presetQueries.map((query, index) => (
          <button 
            key={index} 
            className="preset-query-btn"
            onClick={() => handlePresetClick(query)}
            disabled={isLoading}
          >
            {query}
          </button>
        ))}
      </div>

      {/* --- Input Form --- */}
      <form className="chat-input-form" onSubmit={handleCustomSubmit}>
        <input
          type="text"
          className="chat-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your custom query..."
          disabled={isLoading}
        />
        <button type="submit" className="chat-send-btn" disabled={isLoading}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;