
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Home, User, Building, ShoppingBag, GraduationCap, Shield } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-buedi-blue text-white p-1 rounded">
            <Home size={24} />
          </div>
          <span className="text-buedi-blue text-xl font-bold">BUEDI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-buedi-darkgray hover:text-buedi-blue">
                  Particuliers
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link to="/publish-project" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-buedi-blue p-6 no-underline outline-none focus:shadow-md">
                          <User className="h-6 w-6 text-white" />
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Publier un projet
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Décrivez votre projet et recevez des devis gratuits
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link to="/find-professionals" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Trouver des artisans
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Recherchez des professionnels par compétence et localisation
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/project-tracking" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Suivre mon chantier
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Restez informé de l'avancement de vos projets
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-buedi-darkgray hover:text-buedi-blue">
                  Professionnels
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <Link to="/create-profile" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Créer votre profil
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Mettez en valeur vos compétences et réalisations
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/find-projects" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Trouver des projets
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Répondez aux demandes des clients
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/training" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Formation et certification
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Améliorez vos compétences et obtenez des badges
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-buedi-darkgray hover:text-buedi-blue">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4">
                    <li>
                      <Link to="/marketplace" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Marketplace matériaux
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Trouvez les matériaux pour votre projet
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/insurance" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Assurance chantier
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Protégez vos projets avec nos partenaires
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link to="/financing" className="block select-none space-y-1 rounded-md p-3 hover:bg-slate-100">
                        <div className="text-sm font-medium leading-none">
                          Solutions de financement
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                          Financez vos projets avec nos partenaires bancaires
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-2">
            <Button variant="outline" className="border-buedi-blue text-buedi-blue hover:bg-buedi-blue hover:text-white">
              Se connecter
            </Button>
            <Button className="bg-buedi-orange text-white hover:bg-buedi-orange/90">
              S'inscrire
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-buedi-darkgray hover:text-buedi-blue"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-2">
          <div className="container mx-auto px-4">
            <ul className="space-y-2">
              <li>
                <Link to="/publish-project" className="block py-2 text-buedi-darkgray hover:text-buedi-blue">
                  Particuliers
                </Link>
              </li>
              <li>
                <Link to="/create-profile" className="block py-2 text-buedi-darkgray hover:text-buedi-blue">
                  Professionnels
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="block py-2 text-buedi-darkgray hover:text-buedi-blue">
                  Services
                </Link>
              </li>
              <li className="pt-2 border-t">
                <Link to="/login" className="block py-2 text-buedi-blue hover:text-buedi-blue/70">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link to="/register" className="block py-2 px-4 text-white bg-buedi-orange rounded-md hover:bg-buedi-orange/90">
                  S'inscrire
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
