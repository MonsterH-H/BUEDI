import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/services/authService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { AtSign, Eye, EyeOff, Lock, User, UserPlus, LogIn, Building, Construction } from "lucide-react";
import PageLayout from "@/components/PageLayout";

// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean().optional()
});

// Schéma de validation pour le formulaire d'inscription
const registerSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  userType: z.enum(["particulier", "professionnel", "admin"]),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter les conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Couleurs du drapeau gabonais
  const COLORS = {
    green: "#009e60",
    yellow: "#fcd116",
    blue: "#3a75c4"
  };

  // Formulaire de connexion
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  // Formulaire d'inscription
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "particulier",
      acceptTerms: undefined  // Changed from false to undefined to avoid type error
    }
  });

  // Gérer la soumission du formulaire de connexion
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      // Utiliser le service d'authentification pour la connexion
      const { user, token, refreshToken } = await authService.login(values);
      
      // Stocker les informations d'authentification
      localStorage.setItem("buedi_token", token);
      if (refreshToken) {
        localStorage.setItem("buedi_refresh_token", refreshToken);
      }
      localStorage.setItem("buedi_user", JSON.stringify(user));
      
      toast({
        title: "Connexion réussie!",
        description: "Bienvenue sur la plateforme Buedi.",
      });
      
      // Rediriger selon le type d'utilisateur
      if (user.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Échec de connexion",
        description: "Identifiants incorrects",
        variant: "destructive"
      });
    }
  };

  // Gérer la soumission du formulaire d'inscription
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      // Utiliser le service d'authentification pour l'inscription
      const { user, token, refreshToken } = await authService.register(values);
      
      // Stocker les informations d'authentification
      localStorage.setItem("buedi_token", token);
      if (refreshToken) {
        localStorage.setItem("buedi_refresh_token", refreshToken);
      }
      localStorage.setItem("buedi_user", JSON.stringify(user));
      
      toast({
        title: "Inscription réussie!",
        description: "Bienvenue sur la plateforme Buedi.",
      });
      
      // Rediriger selon le type d'utilisateur
      if (user.userType === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Échec d'inscription",
        description: "L'inscription a échoué. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  return (
    <PageLayout>
      <div className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-2 text-center mb-8">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Effet décoratif au début */}
              <div 
                className="absolute top-1/2 left-0 w-36 h-36 bg-buedi-green/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
                style={{ backgroundColor: `${COLORS.green}30` }}
              />
              <div 
                className="absolute top-1/2 right-0 w-36 h-36 bg-buedi-yellow/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
                style={{ backgroundColor: `${COLORS.yellow}30` }}
              />
              <div 
                className="absolute bottom-1/2 left-1/2 w-36 h-36 bg-buedi-blue/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
                style={{ backgroundColor: `${COLORS.blue}30`, transform: 'translateX(-50%)' }}
              />
            </div>
            
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Bienvenue sur Buedi
            </h1>
            <p className="max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
              La plateforme qui révolutionne le secteur du BTP au Gabon
            </p>
          </div>
          
          <div className="mx-auto w-full max-w-md space-y-6 bg-white p-6 sm:p-8 rounded-xl shadow-lg relative z-10 border border-slate-200">
            {/* Ligne aux couleurs du drapeau gabonais en haut du formulaire */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4] rounded-t-xl"></div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login" className="flex items-center justify-center gap-1">
                  <LogIn className="w-4 h-4" />
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center justify-center gap-1">
                  <UserPlus className="w-4 h-4" />
                  Inscription
                </TabsTrigger>
              </TabsList>

              {/* Formulaire de connexion */}
              <TabsContent value="login">
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <Input 
                                    placeholder="nom@example.com" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                  <button 
                                    type="button" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-between">
                          <FormField
                            control={loginForm.control}
                            name="rememberMe"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Se souvenir de moi</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          <Button variant="link" className="text-sm p-0 h-auto">
                            Mot de passe oublié?
                          </Button>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full"
                          style={{ backgroundColor: COLORS.blue }}
                        >
                          Se connecter
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              {/* Formulaire d'inscription */}
              <TabsContent value="register">
                <AnimatePresence mode="wait">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <Input 
                                    placeholder="John Doe" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <Input 
                                    placeholder="nom@example.com" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="userType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Je suis un:</FormLabel>
                              <div className="grid grid-cols-3 gap-2 pt-1">
                                <Button
                                  type="button"
                                  variant={field.value === "particulier" ? "default" : "outline"}
                                  className={`flex items-center justify-center gap-1 ${field.value === "particulier" ? "bg-buedi-green text-white" : ""}`}
                                  style={field.value === "particulier" ? { backgroundColor: COLORS.green } : {}}
                                  onClick={() => field.onChange("particulier")}
                                >
                                  <User className="w-4 h-4" />
                                  Particulier
                                </Button>
                                <Button
                                  type="button"
                                  variant={field.value === "professionnel" ? "default" : "outline"}
                                  className={`flex items-center justify-center gap-1 ${field.value === "professionnel" ? "bg-buedi-blue text-white" : ""}`}
                                  style={field.value === "professionnel" ? { backgroundColor: COLORS.blue } : {}}
                                  onClick={() => field.onChange("professionnel")}
                                >
                                  <Building className="w-4 h-4" />
                                  Pro
                                </Button>
                                <Button
                                  type="button"
                                  variant={field.value === "admin" ? "default" : "outline"}
                                  className={`flex items-center justify-center gap-1 ${field.value === "admin" ? "bg-buedi-yellow text-black" : ""}`}
                                  style={field.value === "admin" ? { backgroundColor: COLORS.yellow } : {}}
                                  onClick={() => field.onChange("admin")}
                                >
                                  <Construction className="w-4 h-4" />
                                  Admin
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                  <button 
                                    type="button" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmer le mot de passe</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <Input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    className="pl-10" 
                                    {...field} 
                                  />
                                  <button 
                                    type="button" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="acceptTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  J'accepte les{" "}
                                  <Button variant="link" className="p-0 h-auto text-sm">
                                    conditions d'utilisation
                                  </Button>
                                </FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          className="w-full"
                          style={{ backgroundColor: COLORS.green }}
                        >
                          S'inscrire
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </Tabs>

            <div className="or-divider flex items-center my-6">
              <div className="h-px bg-slate-200 flex-grow"></div>
              <span className="px-4 text-sm text-slate-500">ou continuer avec</span>
              <div className="h-px bg-slate-200 flex-grow"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Auth;
