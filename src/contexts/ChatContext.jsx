// contexts/ChatContext.js - ADD AUTHENTICATION CHECKS
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AuthContext } from '../providers/AuthProvider';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, mongoUser } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeChats, setActiveChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = mongoUser?.role === 'admin';

  // Reset chat state when user logs out
  useEffect(() => {
    if (!user) {
      setIsChatOpen(false);
      setMessages([]);
      setUnreadCount(0);
      setActiveChats([]);
      setCurrentChat(null);
    }
  }, [user]);

  // Load messages for current user - WITH AUTH CHECK
  const loadMessages = async (customerEmail = null) => {
    if (!user?.email) {
      console.log('🚫 Cannot load messages: User not authenticated');
      setMessages([]); // Clear messages for logged out users
      return;
    }
    
    try {
      setLoading(true);
      let targetEmail = user.email;
      
      if (isAdmin && customerEmail) {
        targetEmail = customerEmail;
      }
      
      const response = await fetch(`http://localhost:5000/api/chat/messages/${targetEmail}`);
      
      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Load active chats for admin - WITH AUTH CHECK
  const loadActiveChats = async () => {
    if (!user?.email || !isAdmin) {
      console.log('🚫 Cannot load active chats: User not authenticated or not admin');
      setActiveChats([]);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/chat/admin/conversations');
      
      if (response.ok) {
        const chats = await response.json();
        setActiveChats(chats);
      }
    } catch (error) {
      console.error('Failed to load active chats:', error);
      setActiveChats([]);
    }
  };

  // Load unread count for current user - WITH AUTH CHECK
  const loadUnreadCount = async () => {
    if (!user?.email) {
      console.log('🚫 Cannot load unread count: User not authenticated');
      setUnreadCount(0); // Set to 0 for logged out users
      return;
    }
    
    try {
      let url;
      if (isAdmin) {
        url = 'http://localhost:5000/api/chat/admin/total-unread';
      } else {
        url = `http://localhost:5000/api/chat/unread-count/${user.email}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const count = isAdmin ? data.totalUnread : data.unreadCount;
        console.log(`🔵 Loaded unread count: ${count} for ${isAdmin ? 'admin' : 'customer'}`);
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Failed to load unread count:', error);
      setUnreadCount(0);
    }
  };

  // Send message - WITH AUTH CHECK
  const sendMessage = async (text, file = null, targetEmail = null) => {
    if (!user?.email) {
      console.log('🚫 Cannot send message: User not authenticated');
      throw new Error('Please log in to send messages');
    }

    const messageData = {
      senderEmail: user.email,
      senderName: user.displayName || user.email,
      text: text,
      file: file,
      isAdmin: isAdmin,
      targetEmail: targetEmail
    };

    try {
      const response = await fetch('http://localhost:5000/api/chat/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Reload data
        if (isAdmin) {
          await loadActiveChats();
          if (targetEmail) {
            await loadMessages(targetEmail);
          }
        } else {
          await loadMessages();
        }
        
        await loadUnreadCount();
        return result.chatMessage;
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  // Mark messages as read - WITH AUTH CHECK
  const markAsRead = async (customerEmail) => {
    if (!user?.email) {
      console.log('🚫 Cannot mark messages as read: User not authenticated');
      return;
    }

    try {
      console.log('🔵 Marking messages as read for customer:', customerEmail);
      
      const response = await fetch(`http://localhost:5000/api/chat/messages/read/${customerEmail}`, {
        method: 'PUT'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Successfully marked as read:', result.modifiedCount, 'messages');
        
        // Update local state immediately
        setUnreadCount(0);
        
        // Also reload from server to ensure consistency
        setTimeout(() => {
          loadUnreadCount();
        }, 100);
        
        return result.modifiedCount;
      } else {
        throw new Error('Server returned error');
      }
    } catch (error) {
      console.error('❌ Failed to mark messages as read:', error);
      throw error;
    }
  };

  // Mark admin messages as read - WITH AUTH CHECK
  const markAdminAsRead = async (customerEmail) => {
    if (!user?.email || !isAdmin) {
      console.log('🚫 Cannot mark admin messages as read: User not authenticated or not admin');
      return;
    }

    try {
      console.log('🔵 Marking admin messages as read for conversation:', customerEmail);
      
      const response = await fetch(`http://localhost:5000/api/chat/admin/messages/read/${customerEmail}`, {
        method: 'PUT'
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Successfully marked admin messages as read:', result.modifiedCount, 'messages');
        
        // Update local state
        await loadUnreadCount();
        await loadActiveChats();
        
        return result.modifiedCount;
      } else {
        throw new Error('Server returned error');
      }
    } catch (error) {
      console.error('❌ Failed to mark admin messages as read:', error);
      throw error;
    }
  };

  // Auto-mark as read when customer opens chat
  useEffect(() => {
    if (isChatOpen && !isAdmin && user?.email && unreadCount > 0) {
      console.log('🟡 Customer opened chat - marking messages as read');
      markAsRead(user.email);
    }
  }, [isChatOpen, isAdmin, user?.email]);

  // Load data on component mount - ONLY WHEN USER EXISTS
  useEffect(() => {
    if (user?.email) {
      loadMessages();
      loadUnreadCount();
      if (isAdmin) {
        loadActiveChats();
      }
    } else {
      // Clear all data when no user
      setMessages([]);
      setUnreadCount(0);
      setActiveChats([]);
    }
  }, [user?.email, isAdmin]);

  // Auto-refresh for real-time updates - ONLY WHEN USER EXISTS
  useEffect(() => {
    if (!user?.email) return;
    
    const interval = setInterval(() => {
      loadUnreadCount();
      if (isAdmin) {
        loadActiveChats();
      }
      if (isChatOpen && !isAdmin) {
        loadMessages();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [user?.email, isAdmin, isChatOpen]);

  const value = useMemo(() => ({
    isChatOpen,
    setIsChatOpen,
    messages,
    sendMessage,
    unreadCount,
    activeChats,
    currentChat,
    setCurrentChat,
    isAdmin,
    loading,
    loadMessages,
    loadActiveChats,
    markAsRead,
    markAdminAsRead,
    loadUnreadCount
  }), [
    isChatOpen,
    messages,
    unreadCount,
    activeChats,
    currentChat,
    isAdmin,
    loading
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};