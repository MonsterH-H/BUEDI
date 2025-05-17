import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { User, LoginData, RegisterData } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "buedi_token";
const USER_KEY = "buedi_user";
const REFRESH_TOKEN_KEY = "buedi_refresh_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAdmin = user?.userType === "admin";

  // Vérification initiale de l'authentification
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Erreur d'initialisation:", error);
        // En cas d'erreur, on nettoie tout
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { user: userData, token, refreshToken } = await authService.login(loginData);
      
      localStorage.setItem(TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      setUser(userData);
      
      toast.success("Connexion réussie!");
      
      if (userData.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
      
      return true;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Identifiants incorrects");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { user: newUser, token, refreshToken } = await authService.register(userData);
      
      localStorage.setItem(TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      
      setUser(newUser);
      
      toast.success("Inscription réussie!");
      
      if (newUser.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
      
      return true;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast.error("L'inscription a échoué");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      setUser(null);
      toast.info("Vous êtes déconnecté");
      navigate("/auth");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      // Même en cas d'erreur, on déconnecte localement
      setUser(null);
      localStorage.clear();
      navigate("/auth");
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      toast.success("Profil mis à jour avec succès");
      return true;
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      toast.error("La mise à jour du profil a échoué");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export default useAuth;