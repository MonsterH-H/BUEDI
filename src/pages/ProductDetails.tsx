
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronLeft,
  Star,
  Heart,
  Share2,
  MessageCircle,
  ShoppingCart,
  MapPin,
  Truck,
  Package,
  Clock,
  Phone,
  ShieldCheck,
  Trash2,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";

// Couleurs du drapeau gabonais
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

// Données factices pour un produit (à remplacer par des données réelles)
const mockProduct = {
  id: 1,
  name: "Ciment Gabonais GX500",
  description: "Ciment de haute qualité fabriqué au Gabon, idéal pour tous travaux de maçonnerie générale. Ce produit offre une excellente résistance mécanique et une prise rapide.",
  detailedDescription: "Le Ciment Gabonais GX500 est conforme aux normes internationales et répond aux exigences des constructions modernes. Il permet d'obtenir des bétons de qualité supérieure avec une résistance optimale aux conditions climatiques d'Afrique centrale.",
  price: 7500,
  originalPrice: 8200,
  discount: 8.5,
  currency: "XAF",
  unit: "Sac de 50kg",
  stock: 350,
  minOrder: 1,
  maxOrder: 500,
  rating: 4.5,
  reviewCount: 27,
  categories: ["cement", "building-materials"],
  tags: ["ciment", "construction", "fabrication locale"],
  images: [
    "https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=600&auto=format",
    "https://images.unsplash.com/photo-1607131562608-0a82f1cb3a9c?q=80&w=600&auto=format",
    "https://images.unsplash.com/photo-1541446654331-def41325e92c?q=80&w=600&auto=format"
  ],
  seller: {
    id: 123,
    name: "Matériaux Express",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100&auto=format",
    rating: 4.7,
    verificationStatus: "verified",
    responseRate: 97,
    responseTime: "En moins de 2 heures",
    memberSince: "Mars 2022"
  },
  location: {
    city: "Libreville",
    district: "Zone Industrielle d'Oloumi",
    coordinates: {
      lat: 0.3924,
      lng: 9.4536
    }
  },
  delivery: {
    available: true,
    fee: 3000,
    estimatedTime: "24-48 heures",
    freeDeliveryThreshold: 100000
  },
  pickup: {
    available: true,
    address: "Zone Industrielle d'Oloumi, Libreville",
    hours: "Lun-Sam: 8h-18h, Dim: 9h-13h"
  },
  specifications: [
    { name: "Type de ciment", value: "Portland CEM II/B-L 32.5 R" },
    { name: "Résistance", value: "32.5 MPa à 28 jours" },
    { name: "Temps de prise", value: "Initial: 60 min, Final: 360 min" },
    { name: "Finesse (Blaine)", value: "3500 cm²/g" },
    { name: "Conditionnement", value: "Sac papier kraft 50kg" }
  ],
  paymentOptions: ["Mobile Money", "Espèces", "Virement bancaire", "Carte bancaire"],
  warranty: "Garantie de 30 jours sur les produits non ouverts",
  featured: true,
  createdAt: "2023-05-15T10:30:00Z"
};

// Données factices pour les avis
const mockReviews = [
  {
    id: 1,
    user: { name: "Thomas N.", avatar: "" },
    rating: 5,
    date: "12/04/2024",
    comment: "Excellent produit, livraison rapide et emballage de qualité. Je recommande vivement ce fournisseur."
  },
  {
    id: 2,
    user: { name: "Marie K.", avatar: "" },
    rating: 4,
    date: "02/04/2024",
    comment: "Bon rapport qualité/prix. La livraison a pris un peu plus de temps que prévu mais le produit est conforme à mes attentes."
  },
  {
    id: 3,
    user: { name: "Jean P.", avatar: "" },
    rating: 5,
    date: "23/03/2024",
    comment: "J'utilise ce ciment régulièrement pour mes chantiers. Qualité constante et service client réactif."
  }
];

// Composant pour afficher les étoiles de notation
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : star - 0.5 <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isAdmin, setIsAdmin] = useState(user?.userType === "admin");
  const [isSeller, setIsSeller] = useState(mockProduct.seller.id === 123); // Simulation

  // Dans une implémentation réelle, vous récupéreriez le produit avec son ID
  const product = mockProduct;
  const reviews = mockReviews;

  const handleAddToCart = () => {
    toast.success(`${quantity} ${product.name} ajouté au panier`, {
      description: `Total: ${formatPrice(product.price * quantity)}`
    });
  };

  const handleBuyNow = () => {
    toast.info("Redirection vers le paiement...");
  };

  const handleContact = () => {
    toast.info("Ouverture de la messagerie...");
  };

  const handleAddToFavorites = () => {
    toast.success("Produit ajouté aux favoris");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié dans le presse-papier");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Veuillez écrire un commentaire");
      return;
    }
    toast.success("Avis envoyé avec succès");
    setReviewText("");
  };

  const handleDelete = () => {
    toast.info("Demande de suppression envoyée", {
      description: "Un administrateur examinera votre demande"
    });
  };

  const handleEdit = () => {
    toast.info("Redirection vers la page d'édition");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF' }).format(price);
  };

  return (
    <PageLayout>
      {/* Fil d'Ariane */}
      <div className="bg-slate-50 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-slate-600">
            <Link to="/marketplace" className="hover:text-buedi-blue flex items-center">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Retour au Marketplace
            </Link>
            <span className="mx-2">/</span>
            <span>{product.categories[0]}</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-slate-800">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Partie gauche - Images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="bg-white rounded-lg overflow-hidden border aspect-video relative">
              <motion.img 
                key={currentImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images[currentImage]} 
                alt={product.name}
                className="w-full h-full object-cover" 
              />
              {product.discount > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-semibold">
                  -{product.discount}%
                </div>
              )}
              {product.featured && (
                <div className="absolute top-0 left-0 bg-buedi-yellow text-slate-900 px-3 py-1 rounded-br-lg font-semibold">
                  Produit en vedette
                </div>
              )}
            </div>
            
            {/* Miniatures */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`aspect-video cursor-pointer rounded-md overflow-hidden border-2 ${
                    currentImage === idx ? "border-buedi-blue" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImage(idx)}
                >
                  <img src={img} alt={`${product.name} - vue ${idx+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Actions sur mobile */}
            <div className="flex items-center justify-between md:hidden">
              <Button variant="outline" size="sm" onClick={handleAddToFavorites}>
                <Heart className={`mr-1 w-4 h-4`} />
                Favoris
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-1 w-4 h-4" />
                Partager
              </Button>
              <Button variant="outline" size="sm" onClick={handleContact}>
                <MessageCircle className="mr-1 w-4 h-4" />
                Contacter
              </Button>
            </div>

            {/* Section vendeur sur mobile */}
            <Card className="lg:hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={product.seller.logo} alt={product.seller.name} />
                    <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h4 className="font-medium">{product.seller.name}</h4>
                    <div className="flex items-center text-sm">
                      <RatingStars rating={product.seller.rating} />
                      <span className="ml-1">{product.seller.rating}</span>
                      {product.seller.verificationStatus === "verified" && (
                        <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-sm space-y-1 text-slate-600">
                  <p>Taux de réponse: {product.seller.responseRate}%</p>
                  <p>Temps de réponse: {product.seller.responseTime}</p>
                  <p>Membre depuis: {product.seller.memberSince}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleContact}>
                  <Phone className="w-4 h-4 mr-2" /> Contacter le vendeur
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Partie droite - Détails du produit */}
          <div>
            <div className="bg-white rounded-lg p-6 border mb-6">
              {/* En-tête du produit */}
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-slate-800">{product.name}</h1>
                  <div className="hidden md:flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleAddToFavorites}>
                      <Heart className="h-5 w-5 text-slate-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5 text-slate-600" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    <RatingStars rating={product.rating} />
                    <span className="ml-2 text-sm font-medium">{product.rating} ({product.reviewCount} avis)</span>
                  </div>
                  <span className="mx-3 text-slate-300">|</span>
                  <span className="text-sm text-green-600">{product.stock} en stock</span>
                </div>
              </div>

              {/* Prix et options d'achat */}
              <div className="mb-6">
                <div className="flex items-baseline mb-3">
                  <span className="text-3xl font-bold text-buedi-blue">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="ml-3 text-slate-500 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                  <span className="ml-2 text-sm text-slate-500">/ {product.unit}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex border rounded">
                    <button 
                      className="px-3 py-1 border-r" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      min="1"
                      max={product.stock}
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, Number(e.target.value))))}
                      className="w-16 text-center border-0 focus:ring-0" 
                    />
                    <button 
                      className="px-3 py-1 border-l" 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-slate-500">
                    Maximum: {product.maxOrder} unités par commande
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Button onClick={handleAddToCart} className="bg-buedi-yellow text-slate-900 hover:bg-buedi-yellow/90">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
                  </Button>
                  <Button onClick={handleBuyNow} className="bg-buedi-green text-white hover:bg-buedi-green/90">
                    Acheter maintenant
                  </Button>
                </div>
              </div>

              {/* Localisation et livraison */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-slate-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">Localisation</p>
                    <p className="text-slate-600">{product.location.district}, {product.location.city}</p>
                  </div>
                </div>
                
                {product.delivery.available && (
                  <div className="flex items-start">
                    <Truck className="w-5 h-5 text-slate-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Livraison</p>
                      <p className="text-slate-600">
                        {formatPrice(product.delivery.fee)} · Délai estimé: {product.delivery.estimatedTime}
                      </p>
                      <p className="text-xs text-green-600">
                        Livraison gratuite pour les commandes supérieures à {formatPrice(product.delivery.freeDeliveryThreshold)}
                      </p>
                    </div>
                  </div>
                )}
                
                {product.pickup.available && (
                  <div className="flex items-start">
                    <Package className="w-5 h-5 text-slate-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">Retrait sur place</p>
                      <p className="text-slate-600">{product.pickup.address}</p>
                      <p className="text-xs text-slate-500">Horaires: {product.pickup.hours}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-slate-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">Délais</p>
                    <p className="text-slate-600">Commande traitée le jour même pour toute commande avant 15h</p>
                  </div>
                </div>
              </div>

              {/* Méthodes de paiement */}
              <div className="mb-6">
                <h3 className="font-medium text-slate-800 mb-2">Modes de paiement acceptés</h3>
                <div className="flex flex-wrap gap-2">
                  {product.paymentOptions.map((option, idx) => (
                    <Badge key={idx} variant="outline" className="bg-slate-50">
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions pour admin/vendeur */}
              {(isAdmin || isSeller) && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleEdit}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Modifier
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Vendeur (desktop) */}
            <div className="hidden lg:block">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Vendeur</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={product.seller.logo} alt={product.seller.name} />
                      <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <h4 className="font-medium">{product.seller.name}</h4>
                      <div className="flex items-center text-sm">
                        <RatingStars rating={product.seller.rating} />
                        <span className="ml-1">{product.seller.rating}</span>
                        {product.seller.verificationStatus === "verified" && (
                          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            Vérifié
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm space-y-1 text-slate-600">
                    <p>Taux de réponse: {product.seller.responseRate}%</p>
                    <p>Temps de réponse: {product.seller.responseTime}</p>
                    <p>Membre depuis: {product.seller.memberSince}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={handleContact}>
                    <Phone className="w-4 h-4 mr-2" /> Contacter le vendeur
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs d'information */}
        <div className="mt-8">
          <Tabs defaultValue="description">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Spécifications</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Livraison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Description du produit</h3>
              <p className="text-slate-700 mb-4">{product.description}</p>
              <p className="text-slate-700">{product.detailedDescription}</p>
              
              {product.warranty && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 className="font-semibold flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-buedi-green" />
                    Garantie
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">{product.warranty}</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="specifications" className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Caractéristiques techniques</h3>
              <div className="divide-y">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="py-3 grid grid-cols-3">
                    <div className="font-medium text-slate-700">{spec.name}</div>
                    <div className="col-span-2 text-slate-600">{spec.value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Avis clients</h3>
                <div className="flex items-center">
                  <RatingStars rating={product.rating} />
                  <span className="ml-2">{product.rating} sur 5</span>
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                {reviews.map(review => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={review.user.avatar} alt={review.user.name} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{review.user.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">{review.date}</span>
                    </div>
                    <div className="mt-2">
                      <RatingStars rating={review.rating} />
                    </div>
                    <p className="mt-2 text-slate-700">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview}>
                  <h4 className="font-medium mb-2">Laisser un avis</h4>
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <span className="mr-3">Votre note:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= reviewRating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Partagez votre expérience avec ce produit..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="mb-3"
                      rows={4}
                    />
                    <Button type="submit">Envoyer mon avis</Button>
                  </div>
                </form>
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg text-center">
                  <p className="mb-2">Connectez-vous pour laisser un avis</p>
                  <Button asChild variant="outline">
                    <Link to="/auth">Se connecter</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="shipping" className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Options de livraison et retrait</h3>
              
              {product.delivery.available && (
                <div className="mb-6">
                  <h4 className="flex items-center font-medium text-lg mb-2">
                    <Truck className="w-5 h-5 mr-2 text-buedi-green" />
                    Livraison
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Frais de livraison: {formatPrice(product.delivery.fee)}
                  </p>
                  <p className="text-slate-700 mb-2">
                    Délai de livraison estimé: {product.delivery.estimatedTime} après validation de la commande
                  </p>
                  <p className="text-sm text-green-600">
                    Livraison gratuite pour toute commande supérieure à {formatPrice(product.delivery.freeDeliveryThreshold)}
                  </p>
                </div>
              )}
              
              {product.pickup.available && (
                <div>
                  <h4 className="flex items-center font-medium text-lg mb-2">
                    <Package className="w-5 h-5 mr-2 text-buedi-green" />
                    Retrait sur place
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Adresse: {product.pickup.address}
                  </p>
                  <p className="text-slate-700">
                    Horaires d'ouverture: {product.pickup.hours}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductDetails;
