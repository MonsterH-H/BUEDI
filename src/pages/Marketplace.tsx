
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import CartDrawer from "@/components/marketplace/CartDrawer";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Filter, 
  Star, 
  ChevronDown, 
  Heart, 
  MapPin, 
  Plus,
  Search,
  ArrowRight,
  ShieldCheck,
  X,
  Menu,
  Package
} from "lucide-react";

// Gabonese flag colors
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

const categories = [
  { id: "all", name: "Tous les produits" },
  { id: "cement", name: "Ciment & béton" },
  { id: "wood", name: "Bois & menuiserie" },
  { id: "plumbing", name: "Plomberie" },
  { id: "electrical", name: "Matériel électrique" },
  { id: "paint", name: "Peinture" },
  { id: "tools", name: "Outillage" },
  { id: "hardware", name: "Quincaillerie" }
];

// Locations in Gabon
const locations = [
  { id: "all", name: "Tout le Gabon" },
  { id: "libreville", name: "Libreville" },
  { id: "port-gentil", name: "Port-Gentil" },
  { id: "franceville", name: "Franceville" },
  { id: "oyem", name: "Oyem" },
  { id: "moanda", name: "Moanda" },
  { id: "lambarene", name: "Lambaréné" }
];

const products = [
  {
    id: 1,
    name: "Ciment Gabonais GX500",
    category: "cement",
    price: 7500,
    unit: "Sac de 50kg",
    rating: 4.5,
    reviews: 27,
    image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=300&auto=format",
    seller: "Matériaux Express",
    location: "Libreville",
    verified: true,
    featured: true,
    discountPercent: 5
  },
  {
    id: 2,
    name: "Planches de bois rouge traité",
    category: "wood",
    price: 15000,
    unit: "m³",
    rating: 4.2,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=300&auto=format",
    seller: "Bois & Cie",
    location: "Port-Gentil",
    verified: true,
    featured: false,
    discountPercent: 0
  },
  {
    id: 3,
    name: "Peinture acrylique blanche",
    category: "paint",
    price: 14500,
    unit: "Pot de 20L",
    rating: 4.7,
    reviews: 42,
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?q=80&w=300&auto=format",
    seller: "ColorShop Gabon",
    location: "Libreville",
    verified: true,
    featured: false,
    discountPercent: 10
  },
  {
    id: 4,
    name: "Tuyaux PVC DN100",
    category: "plumbing",
    price: 5200,
    unit: "Barre de 6m",
    rating: 4.0,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1581094488379-6a10d04c0f04?q=80&w=300&auto=format",
    seller: "Plomberie Plus",
    location: "Oyem",
    verified: false,
    featured: false,
    discountPercent: 0
  },
  {
    id: 5,
    name: "Câble électrique 2.5mm²",
    category: "electrical",
    price: 32000,
    unit: "Rouleau 100m",
    rating: 4.8,
    reviews: 36,
    image: "https://images.unsplash.com/photo-1601275549505-dc2f83979c93?q=80&w=300&auto=format",
    seller: "ElectroPro",
    location: "Franceville",
    verified: true,
    featured: true,
    discountPercent: 0
  },
  {
    id: 6,
    name: "Perceuse à percussion",
    category: "tools",
    price: 45000,
    unit: "Unité",
    rating: 4.6,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1563115298-e9590ab1c1df?q=80&w=300&auto=format",
    seller: "OutilBox",
    location: "Libreville",
    verified: true,
    featured: false,
    discountPercent: 15
  },
  {
    id: 7,
    name: "Marteau de charpentier",
    category: "tools",
    price: 8500,
    unit: "Unité",
    rating: 4.3,
    reviews: 19,
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=300&auto=format",
    seller: "OutilBox",
    location: "Libreville",
    verified: true,
    featured: false,
    discountPercent: 0
  },
  {
    id: 8,
    name: "Carrelage céramique 30x30",
    category: "hardware",
    price: 12000,
    unit: "m²",
    rating: 4.4,
    reviews: 31,
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=300&auto=format",
    seller: "Matériaux Express",
    location: "Libreville",
    verified: true,
    featured: false,
    discountPercent: 0
  }
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF' }).format(price);
};

const calculateDiscountedPrice = (price: number, discountPercent: number) => {
  if (discountPercent <= 0) return price;
  return Math.round(price - (price * discountPercent / 100));
};

const Marketplace = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  
  const minPrice = 0;
  const maxPrice = 100000;

  // Filtered products
  const filteredProducts = products.filter(product => {
    // Category filter
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price filter
    const productPrice = product.price;
    const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
    
    // Location filter
    const matchesLocation = location === "all" || product.location.toLowerCase() === location.toLowerCase();
    
    return matchesCategory && matchesSearch && matchesPrice && matchesLocation;
  });

  // Sorted products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "popular":
      default:
        return b.reviews - a.reviews;
    }
  });

  const handleAddToCart = (productId: number, productName: string) => {
    toast({
      title: "Ajouté au panier",
      description: `${productName} a été ajouté à votre panier`,
    });
  };

  const handleAddToFavorites = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      toast({
        title: "Retiré des favoris",
        description: "Ce produit a été retiré de vos favoris",
      });
    } else {
      setFavorites([...favorites, productId]);
      toast({
        title: "Ajouté aux favoris",
        description: "Ce produit a été ajouté à vos favoris",
      });
    }
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/marketplace/product/${productId}`);
  };
  
  const handleManageProducts = () => {
    navigate("/product-management");
  };

  return (
    <PageLayout>
      {/* Hero section */}
      <div 
        className="relative bg-buedi-blue py-12 md:py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Marketplace des matériaux de construction
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              Trouvez tous les matériaux nécessaires pour vos projets de construction et rénovation au Gabon.
            </p>
            <div className="relative">
              <Input 
                placeholder="Rechercher des matériaux de construction, outils, équipements..."
                className="w-full py-6 pl-5 pr-12 rounded-lg bg-white/95 shadow-lg text-base focus-visible:ring-[#fcd116]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Panier
                </Button>
                
                <Button 
                  variant="outline" 
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres
                </Button>
              </div>
              
              {(isAuthenticated && (isAdmin || user?.userType === "professionnel")) && (
                <Button 
                  onClick={handleManageProducts}
                  className="bg-buedi-yellow text-slate-900 hover:bg-buedi-yellow/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isAdmin ? "Gérer les produits" : "Mes produits"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories bar */}
      <div className="bg-white shadow-sm sticky top-16 z-30 overflow-x-auto scrollbar-none">
        <div className="container mx-auto px-6">
          <div className="flex space-x-4 py-4 whitespace-nowrap">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-buedi-blue text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile filters toggle */}
          <div className="lg:hidden">
            {showFilters && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filtres</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {/* Price range filter */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Prix</h4>
                    <Slider
                      defaultValue={priceRange}
                      max={maxPrice}
                      min={minPrice}
                      step={1000}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                  
                  {/* Location filter */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Localisation</h4>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir une localisation" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Available only filter */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="inStock"
                      className="h-4 w-4 rounded border-gray-300 text-buedi-blue focus:ring-buedi-blue"
                    />
                    <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                      Uniquement les produits en stock
                    </label>
                  </div>
                  
                  {/* Verified sellers only */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="verifiedSellers"
                      className="h-4 w-4 rounded border-gray-300 text-buedi-blue focus:ring-buedi-blue"
                    />
                    <label htmlFor="verifiedSellers" className="ml-2 text-sm text-gray-700">
                      Vendeurs vérifiés uniquement
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Desktop sidebar filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm sticky top-32">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </h3>
              
              <div className="space-y-6">
                {/* Price range filter */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Prix</h4>
                  <Slider
                    defaultValue={priceRange}
                    max={maxPrice}
                    min={minPrice}
                    step={1000}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
                
                {/* Location filter */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Localisation</h4>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisir une localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Available only filter */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    className="h-4 w-4 rounded border-gray-300 text-buedi-blue focus:ring-buedi-blue"
                  />
                  <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                    Uniquement les produits en stock
                  </label>
                </div>
                
                {/* Verified sellers only */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verifiedSellers"
                    className="h-4 w-4 rounded border-gray-300 text-buedi-blue focus:ring-buedi-blue"
                  />
                  <label htmlFor="verifiedSellers" className="ml-2 text-sm text-gray-700">
                    Vendeurs vérifiés uniquement
                  </label>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2" 
                  onClick={() => {
                    setPriceRange([minPrice, maxPrice]);
                    setLocation("all");
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-blue-600 mb-3">
                  Si vous ne trouvez pas ce que vous cherchez, contactez-nous pour une assistance personnalisée.
                </p>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/contact">Contactez-nous</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                {filteredProducts.length} produits trouvés
              </h2>
              
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-slate-500">Trier par:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popularité</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Meilleures notes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:hidden">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Menu className="w-4 h-4" />
                  Trier
                </Button>
              </div>
            </div>

            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleViewProduct(product.id)}
                    className="cursor-pointer"
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="aspect-video relative bg-slate-100 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105" 
                        />
                        {product.featured && (
                          <div className="absolute top-0 left-0 bg-buedi-yellow text-slate-900 px-2 py-1 text-xs font-semibold">
                            Produit en vedette
                          </div>
                        )}
                        {product.discountPercent > 0 && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs font-semibold">
                            -{product.discountPercent}%
                          </div>
                        )}
                        <button
                          className={`absolute bottom-2 right-2 p-2 rounded-full ${
                            favorites.includes(product.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/80 text-slate-600 hover:bg-white'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToFavorites(product.id);
                          }}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="mb-2 flex items-center justify-between">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-normal">
                            {categories.find(c => c.id === product.category)?.name}
                          </Badge>
                          <div className="flex items-center text-amber-500">
                            <Star className="fill-current w-4 h-4 mr-1" />
                            <span className="text-sm">{product.rating}</span>
                            <span className="text-xs text-slate-500 ml-1">({product.reviews})</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-slate-800">{product.name}</h3>
                        <div className="flex items-center mt-1 mb-2">
                          <MapPin className="w-3 h-3 text-slate-400 mr-1" />
                          <span className="text-xs text-slate-500">{product.location}</span>
                        </div>
                        <div className="flex items-center mt-1 mb-2 text-sm">
                          <span className="text-slate-600">
                            Vendeur: {product.seller} 
                          </span>
                          {product.verified && (
                            <ShieldCheck className="w-3 h-3 text-green-600 ml-1" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{product.unit}</p>
                        <div className="mt-auto pt-3 flex justify-between items-center">
                          <div>
                            <span className="text-lg font-bold text-buedi-blue">
                              {product.discountPercent > 0 
                                ? formatPrice(calculateDiscountedPrice(product.price, product.discountPercent))
                                : formatPrice(product.price)
                              }
                            </span>
                            {product.discountPercent > 0 && (
                              <span className="ml-2 text-sm text-slate-400 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-buedi-green hover:bg-buedi-green/90 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.id, product.name);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" /> Ajouter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-10 text-center shadow-sm">
                <div className="text-4xl mb-4">😢</div>
                <h3 className="text-xl font-medium mb-2">Aucun produit trouvé</h3>
                <p className="text-slate-500 mb-6">Essayez d'autres mots-clés ou catégories</p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange([minPrice, maxPrice]);
                  setLocation('all');
                }}>
                  Réinitialiser la recherche
                </Button>
              </div>
            )}
            
            <div className="mt-12 bg-buedi-yellow/10 rounded-lg p-6 border border-buedi-yellow/30">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Vous êtes un professionnel du BTP ?
                  </h3>
                  <p className="text-slate-600 max-w-lg">
                    Créez un compte vendeur pour proposer vos produits et services sur notre marketplace.
                  </p>
                </div>
                <Button asChild className="bg-buedi-blue hover:bg-buedi-blue/90">
                  <Link to="/create-profile">
                    <Package className="mr-2 w-4 h-4" />
                    Devenir vendeur
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cart drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </PageLayout>
  );
};

export default Marketplace;
