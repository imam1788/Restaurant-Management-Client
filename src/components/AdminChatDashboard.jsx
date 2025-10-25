import React, { useState, useEffect, useContext } from 'react';
import { useChat } from '../contexts/ChatContext';
import { AuthContext } from '../providers/AuthProvider';
import Loader from '../components/Loader';

const AdminChatDashboard = () => {
  const {
    activeChats,
    currentChat,
    setCurrentChat,
    messages,
    sendMessage,
    loadMessages,
    markAdminAsRead,
    loading,
    loadActiveChats,
    unreadCount
  } = useChat();

  const { user } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);

  // Auto-select first conversation
  useEffect(() => {
    if (activeChats.length > 0 && !currentChat) {
      setCurrentChat(activeChats[0]);
    }
  }, [activeChats, currentChat]);

  // Load messages when conversation is selected AND mark as read
  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.customerEmail);
      
      // Mark messages as read when conversation is selected
      if (currentChat.unreadCount > 0 && !hasMarkedAsRead) {
        console.log('🟡 Admin selected conversation - marking messages as read');
        handleMarkAsRead(currentChat.customerEmail);
      }
    }
  }, [currentChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    try {
      setIsSending(true);
      await sendMessage(newMessage.trim(), null, currentChat.customerEmail);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectConversation = async (chat) => {
    console.log('Selecting conversation:', chat.customerEmail, 'Unread:', chat.unreadCount);

    // Reset the read flag when selecting new conversation
    setHasMarkedAsRead(false);
    
    // Set current chat first
    setCurrentChat(chat);
  };

  const handleMarkAsRead = async (customerEmail) => {
    try {
      await markAdminAsRead(customerEmail);
      setHasMarkedAsRead(true);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  // Manual refresh button
  const handleRefresh = async () => {
    await loadActiveChats();
    if (currentChat) {
      await loadMessages(currentChat.customerEmail);
    }
  };

  // Calculate stats
  const totalConversations = activeChats.length;
  const totalUnreadMessages = unreadCount; // Use the global unread count from context

  if (loading && !currentChat) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-2 bg-amber-100 rounded-full border border-amber-200 mb-6">
            <span className="text-amber-700 text-sm font-semibold">💬 Customer Support Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Support <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Center</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage customer conversations and provide excellent support experience
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
              {totalConversations}
            </div>
            <div className="text-gray-600 text-lg">Total Conversations</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
              {totalUnreadMessages}
            </div>
            <div className="text-gray-600 text-lg">Unread Messages</div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRefresh}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 flex items-center space-x-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Main Chat Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row h-[600px]">
            {/* Conversations Sidebar */}
            <div className="lg:w-1/3 border-r border-amber-200 flex flex-col">
              <div className="p-6 border-b border-amber-200 bg-amber-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">📩</span>
                    Conversations
                  </h2>
                  {totalUnreadMessages > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                      {totalUnreadMessages}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeChats.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <p className="text-gray-600">No active conversations</p>
                    <p className="text-sm text-gray-500 mt-1">Customer messages will appear here</p>
                  </div>
                ) : (
                  <div className="p-4">
                    {activeChats.map((chat) => (
                      <div
                        key={chat.customerEmail}
                        onClick={() => handleSelectConversation(chat)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 mb-3 border-2 ${currentChat?.customerEmail === chat.customerEmail
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 shadow-md'
                          : 'bg-gray-50 border-gray-200 hover:bg-amber-50 hover:border-amber-200'
                          } ${chat.unreadCount > 0 ? 'ring-2 ring-amber-200' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-800 truncate flex items-center">
                              {chat.customerName}
                              {chat.unreadCount > 0 && (
                                <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">
                              {chat.customerEmail}
                            </p>
                          </div>
                          {chat.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-6 text-center font-bold ml-2 flex-shrink-0">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                          {chat.lastMessage}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">
                            {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-gray-400">
                            {new Date(chat.lastMessageTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:w-2/3 flex flex-col">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {currentChat.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {currentChat.customerName}
                          </h3>
                          <p className="text-gray-600 text-sm">{currentChat.customerEmail}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Last active</div>
                        <div className="text-sm font-semibold text-gray-700">
                          {new Date(currentChat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {currentChat.unreadCount > 0 && (
                          <div className="text-xs text-red-500 font-semibold mt-1">
                            {currentChat.unreadCount} unread
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-amber-25 to-orange-25">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">💬</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
                        <p className="text-gray-600">Start the conversation with {currentChat.customerName}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${message.senderEmail === currentChat.customerEmail ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${message.senderEmail === currentChat.customerEmail
                                ? 'bg-white border border-amber-200 text-gray-800'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-2 ${message.senderEmail === currentChat.customerEmail ? 'text-gray-500' : 'text-amber-100'
                                }`}>
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-6 border-t border-amber-200 bg-white">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Type your reply to ${currentChat.customerName}...`}
                        className="flex-1 px-4 py-3 border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none shadow-sm"
                        disabled={isSending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {isSending ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Send</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">💬</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Welcome to Support</h3>
                    <p className="text-gray-600 max-w-sm">
                      {activeChats.length === 0
                        ? "No customer conversations yet. They'll appear here when customers message you."
                        : "Select a conversation from the sidebar to start chatting with customers."
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatDashboard;