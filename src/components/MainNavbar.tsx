import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Users, 
  Construction, 
  ShoppingBag,
  Briefcase,
  Shield,
  FileText,
  GraduationCap,
  BanknoteIcon,
  MenuIcon,
  X,
  ChevronDown,
  User,
  LogIn,
  LogOut,
  Bell,
  Phone,
  Mail,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { NotificationCenter } from '@/components/NotificationCenter';

// Gabonese flag colors
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4",
};

const MainNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const mainMenuItems = [
    {
      title: "Particuliers",
      items: [
        {
          title: "Publier un projet",
          description: "Décrivez votre projet et recevez des devis",
          icon: <Construction className="h-5 w-5 text-white" />,
          featured: true,
          href: isAuthenticated ? "/project-publish" : "/auth",
          color: COLORS.green,
          requiresAuth: true
        },
        {
          title: "Trouver des professionnels",
          description: "Recherchez par compétence et localisation",
          href: "/find-professionals"
        },
        {
          title: "Suivre mon chantier",
          description: "Visualisez l'avancement de votre projet",
          href: isAuthenticated ? "/project-tracking" : "/auth",
          requiresAuth: true
        },
        {
          title: "Guides & conseils",
          description: "Astuces pour réussir vos projets",
          href: "/guides"
        }
      ]
    },
    {
      title: "Professionnels",
      items: [
        {
          title: "Créer votre profil",
          description: "Présentez vos services et compétences",
          icon: <Briefcase className="h-5 w-5 text-white" />,
          featured: true,
          href: "/create-profile",
          color: COLORS.blue
        },
        {
          title: "Trouver des projets",
          description: "Parcourez les projets à proximité",
          href: "/find-projects"
        },
        {
          title: "Formation & certification",
          description: "Perfectionnez vos compétences",
          href: "/training"
        },
        {
          title: "Outils de gestion",
          description: "Gérez votre activité efficacement",
          href: "/pro-tools"
        }
      ]
    },
    {
      title: "Services",
      items: [
        {
          title: "Marketplace matériaux",
          description: "Achetez tous vos matériaux BTP",
          icon: <ShoppingBag className="h-5 w-5 text-white" />,
          featured: true,
          href: "/marketplace",
          color: COLORS.yellow
        },
        {
          title: "Assurance chantier",
          description: "Protégez vos projets et activités",
          href: "/insurance"
        },
        {
          title: "Financement",
          description: "Solutions pour financer vos projets",
          href: "/financing"
        },
        {
          title: "Contact",
          description: "Nous contacter pour toute question",
          href: "/contact",
          icon: <Phone className="h-4 w-4 mr-1" />
        }
      ]
    }
  ];

  const userMenuItems = [
    { label: "Mon profil", icon: <User className="h-4 w-4 mr-2" /> },
    { label: "Mes projets", icon: <FileText className="h-4 w-4 mr-2" />, href: "/project-tracking" },
    { label: "Paramètres", icon: <Shield className="h-4 w-4 mr-2" /> },
    { label: "Déconnexion", icon: <LogOut className="h-4 w-4 mr-2" />, action: handleLogout }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md py-2" 
          : "bg-white py-4"
      )}
    >
      <div className="container mx-auto px-4">
        {/* Colorful top border - Gabonese flag colors */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4]"></div>
        
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 relative z-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-buedi-blue to-[#3a75c4] text-white font-bold shadow-md">
              <span className="text-2xl">B</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-buedi-blue to-[#3a75c4] bg-clip-text text-transparent">
                BUEDI
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                BTP Gabon
              </span>
            </div>
          </Link>

          {/* Switch thème */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Changer le thème"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {mainMenuItems.map((category, idx) => (
                  <NavigationMenuItem key={idx}>
                    <NavigationMenuTrigger 
                      className="text-slate-700 hover:text-buedi-blue focus:text-buedi-blue data-[state=open]:text-buedi-blue font-medium"
                    >
                      {category.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {category.items.map((item, itemIdx) => (
                          item.featured ? (
                            <li key={itemIdx} className="row-span-3 md:col-span-2">
                              <NavigationMenuLink asChild>
                                <Link
                                  to={item.href}
                                  className={`flex flex-col h-full w-full rounded-md p-5 no-underline outline-none focus:shadow-md relative overflow-hidden group`}
                                  style={{ backgroundColor: item.color }}
                                >
                                  {item.requiresAuth && !isAuthenticated && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="text-white font-medium px-3 py-1 rounded-full border border-white/50 text-sm flex items-center">
                                        <LogIn className="h-3 w-3 mr-1" /> 
                                        Connexion requise
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 mb-2">
                                    {item.icon}
                                    <div className="text-lg font-medium text-white">{item.title}</div>
                                  </div>
                                  <p className="text-white/90 text-sm">{item.description}</p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ) : (
                            <li key={itemIdx}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={item.href}
                                  className={`block select-none space-y-1 rounded-md p-3 hover:bg-slate-100 transition-colors ${
                                    item.requiresAuth && !isAuthenticated ? "relative group" : ""
                                  }`}
                                >
                                  {item.requiresAuth && !isAuthenticated && (
                                    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                      <div className="text-slate-800 text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 flex items-center">
                                        <LogIn className="h-3 w-3 mr-1" /> 
                                        Connexion requise
                                      </div>
                                    </div>
                                  )}
                                  <div className="text-sm font-medium flex items-center">
                                    {item.icon} {item.title}
                                  </div>
                                  <p className="line-clamp-2 text-xs text-slate-500">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          )
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Contact Link & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/contact" className="text-slate-600 hover:text-buedi-blue transition-colors flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Contact
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <NotificationCenter />
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="p-1 rounded-full flex items-center space-x-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-buedi-blue text-white">
                          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start p-2">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium">
                          {user?.fullName || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      {userMenuItems.map((item, index) => (
                        <DropdownMenuItem 
                          key={index} 
                          className="cursor-pointer"
                          onClick={item.action ? item.action : item.href ? () => navigate(item.href) : undefined}
                        >
                          {item.icon}
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-buedi-blue hover:bg-buedi-blue hover:text-white transition-colors"
                  onClick={() => navigate("/auth")}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
                <Button 
                  className="bg-gradient-to-r from-buedi-orange to-buedi-orange/90 hover:opacity-90 text-white transition-colors"
                  onClick={() => navigate("/auth?tab=register")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Inscription
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center text-slate-700 hover:text-buedi-blue"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container mx-auto p-4">
              {isAuthenticated ? (
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-buedi-blue text-white">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.fullName || 'Utilisateur'}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 mb-4 pb-4 border-b">
                  <Button 
                    className="w-full justify-center bg-buedi-blue hover:bg-buedi-blue/90"
                    onClick={() => navigate("/auth")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full justify-center border-buedi-blue text-buedi-blue hover:bg-buedi-blue/10"
                    onClick={() => navigate("/auth?tab=register")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Inscription
                  </Button>
                </div>
              )}

              <div className="space-y-4 py-4">
                {mainMenuItems.map((category, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="font-medium text-lg text-buedi-blue">{category.title}</div>
                    <div className="space-y-2 pl-4">
                      {category.items.map((item, itemIdx) => (
                        <Link
                          key={itemIdx}
                          to={item.href}
                          className={cn(
                            "block py-2 hover:bg-slate-50 px-3 rounded-md transition-colors relative",
                            item.featured ? "font-medium" : "",
                            item.requiresAuth && !isAuthenticated ? "opacity-75" : ""
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <span>{item.title}</span>
                            {item.requiresAuth && !isAuthenticated && (
                              <Badge variant="outline" className="text-xs">
                                Connexion requise
                              </Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="flex items-center py-2 px-4 bg-slate-100 rounded-md text-buedi-blue hover:bg-slate-200 transition-colors my-2">
                <Phone className="h-4 w-4 mr-2" />
                Contactez-nous
              </Link>

              {isAuthenticated && (
                <div className="border-t pt-4">
                  <div className="font-medium text-lg text-buedi-blue mb-2">Mon compte</div>
                  <div className="space-y-2 pl-4">
                    {userMenuItems.slice(0, -1).map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.href || '#'}
                        className="flex items-center py-2 hover:bg-slate-50 px-3 rounded-md transition-colors"
                        onClick={item.action}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MainNavbar;
