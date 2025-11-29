import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  isBot: boolean;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers] = useState(['Support Agent', 'John Doe', 'Jane Smith']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(simulateIncomingMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    setMessages(savedMessages);
  };

  const simulateIncomingMessages = () => {
    const botMessages = [
      'Hello! How can I help you today?',
      'Is there anything specific you need assistance with?',
      'Feel free to ask any questions!',
      'Our support team is here to help 24/7'
    ];
    
    if (Math.random() > 0.7) {
      const botMessage: Message = {
        id: Date.now(),
        sender: 'Support Agent',
        message: botMessages[Math.floor(Math.random() * botMessages.length)],
        timestamp: new Date().toLocaleTimeString(),
        isBot: true
      };
      
      setMessages(prev => {
        const updated = [...prev, botMessage];
        localStorage.setItem('chatMessages', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now(),
      sender: user?.name || 'Anonymous',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      isBot: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        'Thank you for your message! I\'ll help you with that.',
        'That\'s a great question. Let me provide you with some information.',
        'I understand your concern. Here\'s what I can suggest.',
        'Thanks for reaching out! I\'m here to assist you.'
      ];
      
      const botResponse: Message = {
        id: Date.now() + 1,
        sender: 'Support Agent',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toLocaleTimeString(),
        isBot: true
      };
      
      setMessages(prev => {
        const updated = [...prev, botResponse];
        localStorage.setItem('chatMessages', JSON.stringify(updated));
        return updated;
      });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>Please Login</h2>
        <p>You need to be logged in to access the chat.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h6>Online Users ({onlineUsers.length})</h6>
            </div>
            <div className="card-body p-2">
              {onlineUsers.map((user, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <div className="bg-success rounded-circle me-2" style={{ width: '8px', height: '8px' }}></div>
                  <small>{user}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Live Support Chat</h5>
              <span className="badge bg-success">Online</span>
            </div>
            <div className="card-body p-0">
              <div 
                className="chat-messages p-3"
                style={{ height: '400px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`mb-3 ${msg.isBot ? 'text-start' : 'text-end'}`}>
                    <div className={`d-inline-block p-2 rounded ${
                      msg.isBot 
                        ? 'bg-white border' 
                        : 'bg-primary text-white'
                    }`} style={{ maxWidth: '70%' }}>
                      <div className="fw-bold small">{msg.sender}</div>
                      <div>{msg.message}</div>
                      <div className="small opacity-75">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="card-footer">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;