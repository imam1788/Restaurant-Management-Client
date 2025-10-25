import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect } from "react";
import ChatBubble from "../components/ChatBubble";

// Warm Earthy Tones - Creates cozy restaurant feel
const MainLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[url('/src/assets/subtle-food-pattern.png')] opacity-5 pointer-events-none"></div>

      <div className="relative z-10">
        <Navbar />
        <main className="mt-16">
          <Outlet />
        </main>
        <Footer />
        <ChatBubble />
      </div>
    </div>
  );
};

export default MainLayout;