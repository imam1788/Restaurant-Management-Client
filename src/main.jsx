import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./providers/AuthProvider";
import { ThemeProvider } from "next-themes";
import "./index.css";
import { CartProvider } from './contexts/CartContext'
import { ChatProvider } from './contexts/ChatContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <CartProvider>
          <ChatProvider> 
            <App />
          </ChatProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
