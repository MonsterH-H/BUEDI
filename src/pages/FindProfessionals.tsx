import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Star, 
  Award,
  Search,
  ThumbsUp,
  Wrench,
  CheckCircle,
  Clock,
  Shield,
  Download,
  Plus,
  Filter,
  SlidersHorizontal,
  Users,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Professional, professionalService } from "@/services/professionalService";
import ProfessionalCard from "@/components/professionals/ProfessionalCard";
import ProfessionalForm from "@/components/professionals/ProfessionalForm";
import DeleteConfirmation from "@/components/professionals/DeleteConfirmation";
import ContactDialog from "@/components/professionals/ContactDialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Couleurs du drapeau gabonais
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

const professionalCategories = [
  { id: "all", name: "Tous les pros" },
  { id: "masonry", name: "Maçonnerie" },
  { id: "plumbing", name: "Plomberie" },
  { id: "electrical", name: "Électricité" },
  { id: "painting", name: "Peinture" },
  { id: "carpentry", name: "Menuiserie" },
  { id: "tiling", name: "Carrelage" }
];

const ITEMS_PER_PAGE = 6;

const FindProfessionals = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.userType === "admin";

  // Charger les professionnels
  useEffect(() => {
    const loadProfessionals = () => {
      const data = professionalService.getAll();
      setProfessionals(data);
    };
    loadProfessionals();
  }, []);

  // Filtrer et trier les professionnels
  const filteredProfessionals = professionalService.filter({
    category: activeCategory === "all" ? undefined : activeCategory,
    location: selectedLocation || undefined,
    query: searchQuery,
    certified: showCertifiedOnly
  });

  // Tri des professionnels
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "experience":
        return b.yearsExp - a.yearsExp;
      case "projects":
        return b.projects - a.projects;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProfessionals.length / ITEMS_PER_PAGE);
  const paginatedProfessionals = sortedProfessionals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Gérer l'ajout d'un professionnel
  const handleAddProfessional = (data: any) => {
    try {
      const newProfessional = professionalService.add(data);
      setProfessionals([...professionals, newProfessional]);
      toast.success("Professionnel ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du professionnel");
    }
  };

  // Gérer la modification d'un professionnel
  const handleUpdateProfessional = (data: any) => {
    if (!selectedProfessional) return;
    
    try {
      const updated = professionalService.update(selectedProfessional.id, data);
      if (updated) {
        setProfessionals(professionals.map(p => 
          p.id === selectedProfessional.id ? updated : p
        ));
        toast.success("Professionnel mis à jour avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du professionnel");
    }
  };

  // Gérer la suppression d'un professionnel
  const handleDeleteProfessional = () => {
    if (!selectedProfessional || !isAdmin) return;
    
    try {
      const success = professionalService.delete(selectedProfessional.id);
      if (success) {
        setProfessionals(professionals.filter(p => p.id !== selectedProfessional.id));
        toast.success("Professionnel supprimé avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du professionnel");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (id: number) => {
    if (!isAdmin) {
      toast.error("Seul l'administrateur peut modifier les profils professionnels");
      return;
    }
    
    const professional = professionals.find(p => p.id === id);
    if (professional) {
      setSelectedProfessional(professional);
      setIsEditMode(true);
      setFormOpen(true);
    }
  };

  // Ouvrir la confirmation de suppression
  const handleDelete = (id: number) => {
    if (!isAdmin) {
      toast.error("Seul l'administrateur peut supprimer les profils professionnels");
      return;
    }
    
    const professional = professionals.find(p => p.id === id);
    if (professional) {
      setSelectedProfessional(professional);
      setDeleteConfirmOpen(true);
    }
  };

  // Gérer le contact avec un professionnel
  const handleContact = (professional: Professional) => {
    setSelectedProfessional(professional);
    setContactOpen(true);
  };

  // Gérer l'affichage du profil d'un professionnel
  const handleViewProfile = (id: number) => {
    navigate(`/find-professionals/${id}`);
  };

  // Gérer l'exportation des données
  const handleExport = () => {
    if (!isAdmin) {
      toast.error("Seul l'administrateur peut exporter les données");
      return;
    }
    professionalService.exportCSV();
  };

  // Ouvrir le formulaire d'ajout
  const handleOpenAddForm = () => {
    if (!isAuthenticated) {
      toast("Vous devez être connecté pour ajouter un professionnel", {
        description: "Connectez-vous ou créez un compte pour continuer",
        action: {
          label: "Se connecter",
          onClick: () => navigate("/auth")
        }
      });
      return;
    }
    
    setSelectedProfessional(null);
    setIsEditMode(false);
    setFormOpen(true);
  };

  // Animation pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <PageLayout>
      {/* Hero section */}
      <motion.div 
        className="relative bg-gradient-to-br from-buedi-blue to-buedi-blue/80 py-12 md:py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animating background stripes in Gabonese flag colors */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-full h-2 bg-[#009e60]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.div 
            className="absolute top-2 left-0 w-full h-2 bg-[#fcd116]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.div 
            className="absolute top-4 left-0 w-full h-2 bg-[#3a75c4]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>

        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Trouvez des professionnels qualifiés
            </motion.h1>
            <motion.p 
              className="text-white/90 text-lg md:text-xl mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Des artisans et entreprises certifiés pour tous vos projets de construction et rénovation au Gabon.
            </motion.p>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Input 
                placeholder="Rechercher par nom, spécialité ou compétence..."
                className="w-full py-6 pl-5 pr-12 rounded-lg bg-white/95 shadow-lg text-base focus-visible:ring-[#fcd116]"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Filters bar */}
      <div className="bg-white shadow-sm sticky top-16 z-30 overflow-x-auto scrollbar-none">
        <motion.div 
          className="container mx-auto px-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-2 overflow-x-auto">
              {professionalCategories.map((category, index) => (
                <motion.button
                  key={category.id}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap text-sm ${
                    activeCategory === category.id 
                      ? 'bg-[#009e60] text-white shadow-md' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setCurrentPage(1); // Reset to first page on category change
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden md:inline">Filtres</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtres avancés</SheetTitle>
                    <SheetDescription>
                      Affinez votre recherche de professionnels
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">Localisation</h3>
                      <select
                        className="w-full bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-buedi-blue"
                        value={selectedLocation}
                        onChange={(e) => {
                          setSelectedLocation(e.target.value);
                          setCurrentPage(1); // Reset to first page on location change
                        }}
                      >
                        <option value="">Toutes les villes</option>
                        {[...new Set(professionals.map(p => p.location))].map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Certification</h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="certified" 
                          checked={showCertifiedOnly}
                          onCheckedChange={(checked) => {
                            setShowCertifiedOnly(!!checked);
                            setCurrentPage(1); // Reset to first page on certification change
                          }}
                        />
                        <label htmlFor="certified" className="text-sm">
                          Professionnels certifiés uniquement
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Trier par</h3>
                      <Select
                        value={sortBy}
                        onValueChange={(value) => setSortBy(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Critère de tri" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Note</SelectItem>
                          <SelectItem value="experience">Expérience</SelectItem>
                          <SelectItem value="projects">Nombre de projets</SelectItem>
                          <SelectItem value="name">Nom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setSelectedLocation("");
                          setShowCertifiedOnly(false);
                          setSearchQuery("");
                          setActiveCategory("all");
                          setSortBy("rating");
                          setCurrentPage(1);
                        }}
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden md:block">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Trier par note</SelectItem>
                    <SelectItem value="experience">Trier par expérience</SelectItem>
                    <SelectItem value="projects">Trier par projets</SelectItem>
                    <SelectItem value="name">Trier par nom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <select
                className="bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-buedi-blue hidden md:block"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Toutes les villes</option>
                {[...new Set(professionals.map(p => p.location))].map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-800">
            {filteredProfessionals.length} professionnels disponibles
          </h2>
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <Button 
                onClick={handleOpenAddForm}
                className="bg-[#009e60] hover:bg-[#009e60]/90 flex items-center gap-1"
              >
                <UserPlus className="w-4 h-4" /> 
                <span className="hidden md:inline">Ajouter mon profil</span>
              </Button>
            )}
            
            {isAdmin && (
              <Button 
                variant="outline" 
                className="text-[#3a75c4] border-[#3a75c4] flex items-center gap-1"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" /> 
                <span className="hidden md:inline">Exporter</span>
              </Button>
            )}
            
            <div className="flex items-center md:ml-4">
              <label className="inline-flex items-center">
                <Checkbox 
                  checked={showCertifiedOnly} 
                  onCheckedChange={(checked) => {
                    setShowCertifiedOnly(!!checked);
                    setCurrentPage(1);
                  }}
                  className="md:hidden"
                />
                <span className="ml-2 text-sm text-gray-700 hidden md:inline">Certifiés uniquement</span>
              </label>
            </div>
          </div>
        </motion.div>

        {paginatedProfessionals.length > 0 ? (
          <AnimatePresence>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paginatedProfessionals.map((professional, index) => (
                <motion.div
                  key={professional.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20 }}
                  layout
                >
                  <ProfessionalCard
                    professional={professional}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onContact={handleContact}
                    onViewProfile={handleViewProfile}
                    isAdmin={isAdmin}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <motion.div 
            className="bg-white rounded-lg p-10 text-center shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-4xl mb-4">😢</div>
            <h3 className="text-xl font-medium mb-2">Aucun professionnel trouvé</h3>
            <p className="text-slate-500">Essayez d'autres critères de recherche</p>
            <Button 
              className="mt-4 bg-[#3a75c4]" 
              onClick={() => {
                setSearchQuery("");
                setSelectedLocation("");
                setShowCertifiedOnly(false);
                setActiveCategory("all");
                setCurrentPage(1);
              }}
            >
              Réinitialiser les filtres
            </Button>
          </motion.div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className="hover:bg-[#fcd116]/20 transition-colors"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </div>
      
      {/* Formulaire d'ajout/modification */}
      <ProfessionalForm 
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={isEditMode ? handleUpdateProfessional : handleAddProfessional}
        initialData={isEditMode ? selectedProfessional || undefined : undefined}
        title={isEditMode ? "Modifier un professionnel" : "Ajouter un professionnel"}
      />
      
      {/* Confirmation de suppression */}
      <DeleteConfirmation
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDeleteProfessional}
        title={`Supprimer ${selectedProfessional?.name || 'ce professionnel'} ?`}
        description="Cette action est irréversible et supprimera définitivement ce professionnel de la liste."
      />
      
      {/* Dialogue de contact */}
      <ContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        professional={selectedProfessional}
      />
    </PageLayout>
  );
};

export default FindProfessionals;
