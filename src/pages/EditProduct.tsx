
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProductForm from "@/components/marketplace/ProductForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [productExists, setProductExists] = useState(true);

  useEffect(() => {
    // Dans une application réelle, vous feriez une requête API pour vérifier si le produit existe
    // et si l'utilisateur a le droit de le modifier
    const fetchProduct = async () => {
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Pour la démo, on suppose que le produit 999 n'existe pas
        if (id === "999") {
          setProductExists(false);
        }
        
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les informations du produit",
          variant: "destructive",
        });
        setIsLoading(false);
        setProductExists(false);
      }
    };

    if (isAuthenticated) {
      fetchProduct();
    } else {
      setIsLoading(false);
    }
  }, [id, isAuthenticated, toast]);

  // Rediriger si non authentifié
  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
          <p className="mb-6">Vous devez être connecté pour accéder à cette page.</p>
          <Button asChild>
            <Link to="/auth">Se connecter</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Rediriger si non autorisé (ni admin ni vendeur)
  if (user?.userType !== "professionnel" && user?.userType !== "admin") {
    return (
      <PageLayout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Accès restreint</h1>
          <p className="mb-6">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-20 text-center">
          <p>Chargement...</p>
        </div>
      </PageLayout>
    );
  }

  if (!productExists) {
    return (
      <PageLayout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Produit introuvable</h1>
          <p className="mb-6">Le produit que vous essayez de modifier n'existe pas ou a été supprimé.</p>
          <Button asChild>
            <Link to="/product-management">Retour à la gestion des produits</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="bg-buedi-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Modifier le produit</h1>
              <p className="text-blue-100">ID: {id}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                asChild
                className="bg-transparent border-white/30 text-white hover:bg-white/20"
              >
                <Link to="/product-management">
                  Annuler
                </Link>
              </Button>
              <Button 
                asChild
                className="bg-buedi-yellow text-slate-900 hover:bg-buedi-yellow/90"
              >
                <Link to={`/marketplace/product/${id}`}>
                  Voir la fiche produit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <ProductForm
            productId={parseInt(id || "0")}
            onSuccess={() => navigate("/product-management")}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default EditProduct;
