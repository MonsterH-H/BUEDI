
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center px-6">
          <h1 className="text-6xl font-bold text-buedi-blue mb-4">404</h1>
          <p className="text-xl text-slate-600 mb-8">
            Oups ! La page que vous recherchez n'existe pas.
          </p>
          <Button asChild className="bg-buedi-orange hover:bg-buedi-orange/90">
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
