import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/pages/LandingPage";
import { ClientHomePage } from "@/pages/ClientHomePage";
import { MessagingPage } from "@/pages/MessagingPage";
import { FreelancerHomePage } from "@/pages/FreelancerHomePage";

import { AuthProvider } from "@/context/AuthContext";

const AppLayout: React.FC<{ readonly theme: "light" | "dark"; readonly onToggleTheme: () => void }> = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const isMessagingPage = location.pathname === "/messages";

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className={`pt-16 ${isMessagingPage ? "flex-grow overflow-hidden" : "flex-grow"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/client" element={<ClientHomePage />} />
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard (You are logged in!)" />} />
          {/* Placeholder routes for remaining pages */}
          <Route path="/freelancer" element={<FreelancerHomePage />} />
          <Route path="/board" element={<PlaceholderPage title="Needs Board" />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
          <Route path="/portfolio/upload" element={<PlaceholderPage title="Portfolio Upload" />} />
        </Routes>
      </main>
      {!isMessagingPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout theme={theme} onToggleTheme={toggleTheme} />
      </BrowserRouter>
    </AuthProvider>
  );
};

// Temporary placeholder for pages not yet built
interface PlaceholderPageProps {
  readonly title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => (
  <div className="max-w-7xl mx-auto px-6 py-24 text-center">
    <h1 className="text-4xl font-black text-on-surface mb-4">{title}</h1>
    <p className="text-on-surface-variant text-lg">
      This page will be built in the next iteration of the Stitch Build Loop.
    </p>
  </div>
);

export default App;
