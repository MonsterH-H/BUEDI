import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  User,
  Users,
  Building,
  ShoppingBag,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  BarChart3,
  Briefcase,
  MessageSquare,
  Bell,
  Calendar,
  Award,
  Wrench,
  Hammer,
  Truck,
  CreditCard,
  Shield,
  BookOpen,
  Map,
  PlusCircle,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react';

const DashboardSidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  // Couleurs du drapeau gabonais
  const COLORS = {
    green: "#009e60",
    yellow: "#fcd116",
    blue: "#3a75c4"
  };

  // Menus spécifiques pour chaque type d'utilisateur
  const adminMenuItems = [
    { path: '/admin-dashboard', label: 'Tableau de bord', icon: <BarChart3 size={20} /> },
    { path: '/admin-users', label: 'Utilisateurs', icon: <Users size={20} /> },
    { path: '/admin-professionals', label: 'Professionnels', icon: <Briefcase size={20} /> },
    { path: '/admin-projects', label: 'Projets', icon: <FileText size={20} /> },
    { path: '/admin-marketplace', label: 'Marketplace', icon: <ShoppingBag size={20} /> },
    { path: '/admin-certifications', label: 'Certifications', icon: <Award size={20} /> },
    { path: '/admin-settings', label: 'Paramètres', icon: <Settings size={20} /> },
  ];

  const professionalMenuItems = [
    { path: '/pro-dashboard', label: 'Tableau de bord', icon: <BarChart3 size={20} /> },
    { path: '/pro-profile', label: 'Mon profil', icon: <User size={20} /> },
    { path: '/find-projects', label: 'Trouver des projets', icon: <FileText size={20} /> },
    { path: '/pro-projects', label: 'Mes projets', icon: <Briefcase size={20} /> },
    { path: '/pro-messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { path: '/pro-certifications', label: 'Certifications', icon: <Award size={20} /> },
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={20} /> },
    { path: '/training', label: 'Formation', icon: <BookOpen size={20} /> },
  ];

  const particulierMenuItems = [
    { path: '/user-dashboard', label: 'Tableau de bord', icon: <Home size={20} /> },
    { path: '/user-profile', label: 'Mon profil', icon: <User size={20} /> },
    { path: '/publish-project', label: 'Publier un projet', icon: <PlusCircle size={20} /> },
    { path: '/project-tracking', label: 'Mes projets', icon: <Clock size={20} /> },
    { path: '/find-professionals', label: 'Trouver des pros', icon: <Tool size={20} /> },
    { path: '/user-messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={20} /> },
  ];

  // Sélectionner le menu approprié en fonction du type d'utilisateur
  const menuItems = isAdmin 
    ? adminMenuItems 
    : user?.userType === 'professionnel' 
      ? professionalMenuItems 
      : particulierMenuItems;

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-slate-200 dark:border-slate-800">
        <SidebarHeader className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4] flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-lg">BUEDI</span>
          </div>
          <SidebarTrigger />
        </SidebarHeader>

        <SidebarContent className="px-2 py-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  data-active={activeItem === item.path}
                  className="flex items-center gap-3"
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3 px-2">
              <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{user?.fullName}</span>
                <span className="text-xs text-slate-500">{user?.email}</span>
              </div>
            </div>

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
                  <button onClick={() => logout()}>
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default DashboardSidebar;