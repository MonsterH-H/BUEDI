
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/PageLayout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ShoppingCart,
  BarChart2,
  Calendar,
  Shield,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types pour les produits
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  seller: {
    id: number;
    name: string;
  };
  status: "published" | "pending" | "rejected";
  createdAt: string;
  images: string[];
};

// Données factices
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Ciment Gabonais GX500",
    category: "cement",
    price: 7500,
    stock: 350,
    seller: {
      id: 1,
      name: "Matériaux Express"
    },
    status: "published",
    createdAt: "2023-08-15",
    images: ["https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=100&auto=format"]
  },
  {
    id: 2,
    name: "Planches de bois rouge traité",
    category: "wood",
    price: 15000,
    stock: 75,
    seller: {
      id: 2,
      name: "Bois & Cie"
    },
    status: "published",
    createdAt: "2023-09-01",
    images: ["https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=100&auto=format"]
  },
  {
    id: 3,
    name: "Peinture acrylique blanche",
    category: "paint",
    price: 14500,
    stock: 120,
    seller: {
      id: 3,
      name: "ColorShop Gabon"
    },
    status: "pending",
    createdAt: "2023-09-15",
    images: ["https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?q=80&w=100&auto=format"]
  },
  {
    id: 4,
    name: "Tuyaux PVC DN100",
    category: "plumbing",
    price: 5200,
    stock: 80,
    seller: {
      id: 1,
      name: "Matériaux Express"
    },
    status: "rejected",
    createdAt: "2023-10-02",
    images: ["https://images.unsplash.com/photo-1581094488379-6a10d04c0f04?q=80&w=100&auto=format"]
  },
  {
    id: 5,
    name: "Câble électrique 2.5mm²",
    category: "electrical",
    price: 32000,
    stock: 200,
    seller: {
      id: 4,
      name: "ElectroPro"
    },
    status: "published",
    createdAt: "2023-10-12",
    images: ["https://images.unsplash.com/photo-1601275549505-dc2f83979c93?q=80&w=100&auto=format"]
  }
];

// Catégories de produits
const categories = [
  { id: "all", name: "Toutes les catégories" },
  { id: "cement", name: "Ciment & béton" },
  { id: "wood", name: "Bois & menuiserie" },
  { id: "plumbing", name: "Plomberie" },
  { id: "electrical", name: "Matériel électrique" },
  { id: "paint", name: "Peinture" },
  { id: "tools", name: "Outillage" },
  { id: "hardware", name: "Quincaillerie" }
];

// Formatage du prix
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF' }).format(price);
};

// Status badge component
const StatusBadge = ({ status }: { status: "published" | "pending" | "rejected" }) => {
  const statusConfig = {
    published: {
      label: "Publié",
      className: "bg-green-100 text-green-800"
    },
    pending: {
      label: "En attente",
      className: "bg-yellow-100 text-yellow-800"
    },
    rejected: {
      label: "Refusé",
      className: "bg-red-100 text-red-800"
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

const ProductManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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
  if (!isAdmin && user?.userType !== "professionnel") {
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

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    // Filtrer par recherche
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrer par catégorie
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    // Filtrer par statut
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    
    // Si c'est un vendeur, ne montrer que ses produits
    const matchesSeller = isAdmin || product.seller.id === 1; // Simuler l'ID du vendeur connecté
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSeller;
  });

  // Trier les produits
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Gérer la visualisation d'un produit
  const handleViewProduct = (productId: number) => {
    navigate(`/marketplace/product/${productId}`);
  };

  // Gérer l'édition d'un produit
  const handleEditProduct = (productId: number) => {
    navigate(`/edit-product/${productId}`);
  };

  // Gérer la suppression d'un produit
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success("Produit supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Gérer le changement de statut
  const handleStatusChange = (productId: number, newStatus: "published" | "pending" | "rejected") => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, status: newStatus } 
        : product
    ));
    
    const statusMessages = {
      published: "Produit publié avec succès",
      pending: "Produit mis en attente",
      rejected: "Produit rejeté"
    };
    
    toast.success(statusMessages[newStatus]);
  };

  // Ajouter un nouveau produit
  const handleAddProduct = () => {
    navigate("/add-product");
  };

  return (
    <PageLayout>
      <div className="bg-buedi-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Gestion des Produits</h1>
              <p className="text-blue-100">
                {isAdmin ? "Administration complète du marketplace" : "Gérez vos produits sur le marketplace"}
              </p>
            </div>
            <Button onClick={handleAddProduct} className="bg-buedi-yellow text-slate-900 hover:bg-buedi-yellow/90">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <TabsList>
              <TabsTrigger value="products" className="flex items-center">
                <ShoppingCart className="w-4 h-4 mr-2" /> Produits
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center">
                <BarChart2 className="w-4 h-4 mr-2" /> Statistiques
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="approval" className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" /> Modération
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="products" className="space-y-4">
            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    type="search" 
                    placeholder="Rechercher un produit..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publiés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="rejected">Refusés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-slate-500">
                  {sortedProducts.length} produit{sortedProducts.length !== 1 ? 's' : ''} trouvé{sortedProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents d'abord</SelectItem>
                  <SelectItem value="oldest">Plus anciens d'abord</SelectItem>
                  <SelectItem value="price-asc">Prix: croissant</SelectItem>
                  <SelectItem value="price-desc">Prix: décroissant</SelectItem>
                  <SelectItem value="name-asc">Nom: A à Z</SelectItem>
                  <SelectItem value="name-desc">Nom: Z à A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tableau des produits */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    {isAdmin && <TableHead>Vendeur</TableHead>}
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProducts.length > 0 ? (
                    sortedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-12 h-12 rounded object-cover" 
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center">
                              <FileText className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>{product.seller.name}</TableCell>
                        )}
                        <TableCell>
                          <StatusBadge status={product.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            <span>{product.createdAt}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                                <Eye className="mr-2 h-4 w-4" /> Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                                <Edit className="mr-2 h-4 w-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {isAdmin && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(product.id, "published")}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Publier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(product.id, "pending")}>
                                    <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" /> Mettre en attente
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(product.id, "rejected")}>
                                    <XCircle className="mr-2 h-4 w-4 text-red-600" /> Rejeter
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product)} 
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 8 : 7} className="h-24 text-center">
                        Aucun produit ne correspond à vos critères.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-6">Statistiques des Produits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm text-slate-500 mb-1">Total des produits</h3>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-sm text-slate-500 mb-1">Produits publiés</h3>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.status === "published").length}
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h3 className="text-sm text-slate-500 mb-1">En attente de validation</h3>
                  <p className="text-2xl font-bold">
                    {products.filter(p => p.status === "pending").length}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-semibold mb-4">Répartition par catégorie</h3>
                <div className="h-64 flex items-end justify-around">
                  {categories.slice(1).map((category) => {
                    const count = products.filter(p => p.category === category.id).length;
                    const percentage = (count / products.length) * 100;
                    return (
                      <div key={category.id} className="flex flex-col items-center">
                        <div 
                          className="bg-buedi-blue w-12 rounded-t-lg" 
                          style={{ height: `${Math.max(percentage, 5)}%` }}
                        ></div>
                        <div className="text-xs mt-2 text-center">{category.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="approval">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-6">Modération des Produits</h2>
                
                <div className="space-y-6">
                  <p className="text-slate-600">
                    En tant qu'administrateur, vous pouvez approuver ou rejeter les produits avant leur publication.
                  </p>
                  
                  <h3 className="font-medium text-lg">Produits en attente d'approbation</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead>Vendeur</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Date de soumission</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.filter(p => p.status === "pending").map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-10 h-10 rounded object-cover mr-3" 
                                />
                              ) : (
                                <div className="w-10 h-10 bg-slate-200 rounded flex items-center justify-center mr-3">
                                  <FileText className="w-5 h-5 text-slate-400" />
                                </div>
                              )}
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{product.seller.name}</TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>{product.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-slate-600"
                                onClick={() => handleViewProduct(product.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" /> Voir
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusChange(product.id, "published")}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Approuver
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleStatusChange(product.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4 mr-1" /> Refuser
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {products.filter(p => p.status === "pending").length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            Aucun produit en attente d'approbation.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le produit "{productToDelete?.name}" ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteProduct}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProductManagement;
