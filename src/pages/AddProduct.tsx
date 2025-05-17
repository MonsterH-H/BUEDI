
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ProductForm from "@/components/marketplace/ProductForm";
import { Button } from "@/components/ui/button";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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

  return (
    <PageLayout>
      <div className="bg-buedi-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Ajouter un produit</h1>
              <p className="text-blue-100">
                {user?.userType === "admin" 
                  ? "Ajout direct au marketplace" 
                  : "Les produits ajoutés seront revus avant publication"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <ProductForm
            onSuccess={() => navigate("/product-management")}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default AddProduct;
