import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { CartProvider } from "@/contexts/CartContext";

// Lazy loading des composants
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PublishProject = lazy(() => import("./pages/PublishProject"));
const CreateProfile = lazy(() => import("./pages/CreateProfile"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const FindProfessionals = lazy(() => import("./pages/FindProfessionals"));
const ProfessionalDetails = lazy(() => import("./pages/ProfessionalDetails"));
const FindProjects = lazy(() => import("./pages/FindProjects"));
const Training = lazy(() => import("./pages/Training"));
const Auth = lazy(() => import("./pages/Auth"));
const ProjectPublish = lazy(() => import("./pages/ProjectPublish"));
const ProjectTracking = lazy(() => import("./pages/ProjectTracking"));
const Contact = lazy(() => import("./pages/Contact"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const ProductManagement = lazy(() => import("./pages/ProductManagement"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const EditProduct = lazy(() => import("./pages/EditProduct"));

// Composant de chargement
const LoadingSpinner = () => <div>Chargement...</div>;

// Composant de protection des routes
const ProtectedRoute = ({ children, requireAdmin = false, requireProfessional = false }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && user?.userType !== 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  if (requireProfessional && user?.userType !== 'professionnel' && user?.userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <ChatProvider>
                <ProjectProvider>
                  <CartProvider>
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        {/* Routes publiques */}
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/marketplace/product/:id" element={<ProductDetails />} />
                        
                        {/* Routes protégées */}
                        <Route path="/publish-project" element={
                          <ProtectedRoute>
                            <PublishProject />
                          </ProtectedRoute>
                        } />
                        <Route path="/create-profile" element={
                          <ProtectedRoute>
                            <CreateProfile />
                          </ProtectedRoute>
                        } />
                        <Route path="/find-professionals" element={
                          <ProtectedRoute>
                            <FindProfessionals />
                          </ProtectedRoute>
                        } />
                        <Route path="/find-professionals/:id" element={
                          <ProtectedRoute>
                            <ProfessionalDetails />
                          </ProtectedRoute>
                        } />
                        <Route path="/find-projects" element={
                          <ProtectedRoute>
                            <FindProjects />
                          </ProtectedRoute>
                        } />
                        <Route path="/training" element={
                          <ProtectedRoute>
                            <Training />
                          </ProtectedRoute>
                        } />
                        <Route path="/project-publish" element={
                          <ProtectedRoute>
                            <ProjectPublish />
                          </ProtectedRoute>
                        } />
                        <Route path="/project-tracking" element={
                          <ProtectedRoute>
                            <ProjectTracking />
                          </ProtectedRoute>
                        } />

                        {/* Routes admin */}
                        <Route path="/admin-dashboard" element={
                          <ProtectedRoute requireAdmin>
                            <AdminDashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/product-management" element={
                          <ProtectedRoute requireProfessional>
                            <ProductManagement />
                          </ProtectedRoute>
                        } />
                        <Route path="/add-product" element={
                          <ProtectedRoute requireAdmin>
                            <AddProduct />
                          </ProtectedRoute>
                        } />
                        <Route path="/edit-product/:id" element={
                          <ProtectedRoute requireAdmin>
                            <EditProduct />
                          </ProtectedRoute>
                        } />

                        {/* Route 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </CartProvider>
                </ProjectProvider>
              </ChatProvider>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
