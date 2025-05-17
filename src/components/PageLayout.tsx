import { ReactNode } from "react";
import MainNavbar from "@/components/MainNavbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChatDrawer } from "@/components/Chat/ChatDrawer";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
      <MainNavbar />
      
      {/* Alerte pour les utilisateurs non connectés */}
      {!isAuthenticated && (
        <div className="fixed bottom-0 left-0 right-0 bg-buedi-blue text-white py-2 px-4 flex justify-between items-center z-50">
          <div className="text-sm">
            Connectez-vous pour accéder à toutes les fonctionnalités
          </div>
          <Button asChild variant="outline" size="sm" className="border-white text-white hover:bg-white/20">
            <Link to="/auth">Se connecter</Link>
          </Button>
        </div>
      )}
      
      <main className="flex-grow pt-20">
        {children}
      </main>
      
      <Footer />
      
      {/* Chat flottant (visible uniquement pour les utilisateurs connectés) */}
      {isAuthenticated && <ChatDrawer />}
    </div>
  );
};

export default PageLayout;
