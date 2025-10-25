import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../providers/AuthProvider'; // ADD THIS IMPORT
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBubble = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    messages,
    sendMessage,
    unreadCount,
    isAdmin,
    markAsRead,
    loadUnreadCount
  } = useChat();

  const { user } = useAuth(); // GET AUTH STATE
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const hasMarkedAsReadRef = useRef(false);

  // Track previous unread count for notifications
  const previousUnreadCountRef = useRef(unreadCount);

  // Show notification when new messages arrive
  useEffect(() => {
    if (unreadCount > previousUnreadCountRef.current && !isChatOpen && user) {
      console.log('🟡 New message notification triggered');
      setShowNotification(true);
      
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
    
    previousUnreadCountRef.current = unreadCount;
  }, [unreadCount, isChatOpen, user]);

  // Auto-mark as read when chat opens AND scroll to bottom
  useEffect(() => {
    if (isChatOpen && !isAdmin && user) {
      const userEmail = user.email;
      
      if (userEmail && unreadCount > 0 && !hasMarkedAsReadRef.current) {
        console.log('🟡 Auto-marking messages as read');
        markAsRead(userEmail);
        hasMarkedAsReadRef.current = true;
      }
      
      // Scroll to bottom when chat opens
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }

    // Reset the flag when chat closes
    if (!isChatOpen) {
      hasMarkedAsReadRef.current = false;
    }
  }, [isChatOpen, unreadCount, isAdmin, user]);

  // Scroll to bottom smoothly
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (isChatOpen && !isAdmin && user) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isChatOpen, isAdmin, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    if (!newMessage.trim()) return;

    try {
      setIsTyping(true);
      await sendMessage(newMessage.trim());
      setNewMessage('');
      
      // Scroll to bottom after sending
      setTimeout(() => {
        scrollToBottom();
      }, 150);
    } catch (error) {
      console.error('Failed to send message:', error);
      if (error.message.includes('log in')) {
        setShowLoginPrompt(true);
      }
    } finally {
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  const handleFileUpload = (e) => {
    // Check if user is logged in
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    const file = e.target.files[0];
    if (file) {
      sendMessage(`Shared file: ${file.name}`, file);
      e.target.value = '';
    }
  };

  const handleBubbleClick = () => {
    if (isAdmin) {
      navigate('/admin/chat');
    } else {
      setIsChatOpen(true);
      setShowNotification(false);
    }
  };

  const handleOpenChat = () => {
    if (isAdmin) {
      navigate('/admin/chat');
    } else {
      setIsChatOpen(true);
      setShowNotification(false);
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setShowLoginPrompt(false);
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/chat' } });
    setIsChatOpen(false);
  };

  // Quick suggestions for customers
  const quickSuggestions = [
    'Hello! I need help with the menu',
    'What are today\'s specials?',
    'I have allergy concerns',
    'Can I modify my order?',
    'What\'s my order status?'
  ];

  // Don't show chat interface for admins
  if (isAdmin) {
    return (
      <>
        {/* Notification Badge for Admin */}
        <AnimatePresence>
          {showNotification && unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-24 right-6 z-50"
            >
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">
                  {unreadCount} new message{unreadCount > 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Chat Bubble */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBubbleClick}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center z-50 group"
        >
          <div className="relative">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg font-bold border-2 border-white"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-16 bottom-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {unreadCount > 0 ? `${unreadCount} new messages` : 'Customer Support'}
          </div>
        </motion.button>
      </>
    );
  }

  // Customer Chat Interface
  return (
    <>
      {/* Notification Badge for Customer */}
      <AnimatePresence>
        {showNotification && unreadCount > 0 && !isChatOpen && user && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-6 z-50 cursor-pointer"
            onClick={handleOpenChat}
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-full shadow-xl flex items-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">
                {unreadCount} new message{unreadCount > 1 ? 's' : ''} from support!
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Chat Bubble */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-2xl flex items-center justify-center z-50 group"
        >
          <div className="relative">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {user && unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-16 bottom-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            {user ? (
              unreadCount > 0 ? `${unreadCount} new messages` : 'Need help? Chat with us!'
            ) : (
              'Click to chat with support'
            )}
          </div>
        </motion.button>
      )}

      {/* Customer Chat Window */}
      <AnimatePresence>
        {isChatOpen && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-amber-200 flex flex-col z-50"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-amber-600 font-bold text-lg">TH</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">TasteHub Support</h3>
                  <p className="text-amber-100 text-sm">We're here to help!</p>
                  {user && unreadCount > 0 ? (
                    <p className="text-amber-200 text-xs mt-1">
                      {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                    </p>
                  ) : (
                    <p className="text-amber-200 text-xs mt-1">
                      {user ? 'All messages read' : 'Please log in to chat'}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleCloseChat}
                className="text-white hover:text-amber-200 transition-colors p-2 rounded-lg hover:bg-amber-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-amber-50 to-orange-50 scroll-smooth"
            >
              {/* Login Prompt */}
              {!user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-gray-500 mt-8"
                >
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Please Log In</h3>
                  <p className="text-gray-600 mb-6">You need to be logged in to chat with our support team</p>
                  <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Log In to Continue
                  </button>
                </motion.div>
              )}

              {/* Chat Messages (only show when user is logged in) */}
              {user && messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-gray-500 mt-8"
                >
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💬</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h3>
                  <p className="text-gray-600">Send us a message and we'll respond shortly!</p>
                  
                  {/* Quick Suggestions */}
                  <div className="mt-6">
                    <p className="text-sm text-amber-700 font-medium mb-3">Quick suggestions:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {quickSuggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => sendMessage(suggestion)}
                          className="text-xs bg-white border border-amber-300 text-amber-700 px-3 py-2 rounded-full hover:bg-amber-50 transition-colors shadow-sm"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : user ? (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message._id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.isAdmin
                            ? 'bg-white border border-amber-200 text-gray-800 shadow-lg'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                        }`}
                      >
                        <p className="text-sm break-words">{message.text}</p>
                        <p className={`text-xs mt-2 ${message.isAdmin ? 'text-gray-500' : 'text-amber-100'}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-amber-200 px-4 py-3 rounded-2xl shadow-lg">
                        <div className="flex space-x-1 items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <span className="text-xs text-gray-500 ml-2">Support is typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              ) : null}
            </div>

            {/* Message Input */}
            {user && (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-amber-200 bg-white rounded-b-2xl">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none shadow-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-3 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors cursor-pointer flex items-center shadow-sm"
                    title="Attach file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </label>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!newMessage.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBubble;