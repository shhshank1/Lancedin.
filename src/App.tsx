import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/pages/LandingPage";
import { ClientHomePage } from "@/pages/ClientHomePage";
import { MessagingPage } from "@/pages/MessagingPage";
import { FreelancerHomePage } from "@/pages/FreelancerHomePage";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { PortfolioUploadPage } from "@/pages/PortfolioUploadPage";
import { PostJobPage } from "@/pages/PostJobPage";

import { AuthProvider, useAuth } from "@/context/AuthContext";

const AppLayout: React.FC<{ readonly theme: "light" | "dark"; readonly onToggleTheme: () => void }> = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isMessagingPage = location.pathname === "/messages";

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (!user.onboarded && location.pathname !== "/onboarding") {
          navigate("/onboarding");
        } else if (user.onboarded && location.pathname === "/onboarding") {
          navigate(user.role === "SEEKER" ? "/client" : "/freelancer");
        } else if (user.onboarded && user.role !== "SEEKER" && location.pathname === "/post-job") {
          navigate("/freelancer");
        }
      } else {
        const isProfilePath = location.pathname.startsWith("/profile");
        const protectedRoutes = ["/client", "/freelancer", "/messages", "/onboarding", "/portfolio/upload", "/dashboard", "/post-job"];
        if (protectedRoutes.includes(location.pathname) || isProfilePath) {
          navigate("/");
        }
      }
    }
  }, [user, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />
      <main className={`pt-16 ${isMessagingPage ? "flex-grow overflow-hidden" : "flex-grow"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/client" element={<ClientHomePage />} />
          <Route path="/messages" element={<MessagingPage />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard (You are logged in!)" />} />
          {/* Placeholder routes for remaining pages */}
          <Route path="/freelancer" element={<FreelancerHomePage />} />
          <Route path="/board" element={<PlaceholderPage title="Needs Board" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/portfolio/upload" element={<PortfolioUploadPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
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
