import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Upload, 
  Plus, 
  Search,
  UserCog,
  Users,
  Award,
  MapPin,
  Star,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Professional, professionalService } from "@/services/professionalService";
import ProfessionalForm from "@/components/professionals/ProfessionalForm";
import DeleteConfirmation from "@/components/professionals/DeleteConfirmation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger si ce n'est pas un admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    if (!isAdmin) {
      toast.error("Vous n'avez pas accès à cette page");
      navigate("/");
      return;
    }
    
    // Charger les professionnels
    const loadProfessionals = async () => {
      try {
        const data = await professionalService.getAll();
        setProfessionals(data);
      } catch (error) {
        toast.error("Erreur lors du chargement des professionnels");
        console.error(error);
      }
    };
    
    loadProfessionals();
  }, [isAdmin, isAuthenticated, navigate]);

  // Filtrer les professionnels
  const filteredProfessionals = professionals.filter(pro => {
    const matchesSearch = !searchQuery ? true : 
      pro.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pro.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" ? true : 
      pro.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Statistiques
  const stats = {
    totalPros: professionals.length,
    certifiedPros: professionals.filter(pro => pro.certified).length,
    averageRating: professionals.length > 0
      ? (professionals.reduce((sum, pro) => sum + (pro.rating || 0), 0) / professionals.length).toFixed(1)
      : "0.0",
    locations: [...new Set(professionals.map(pro => pro.location))].length
  };

  // Gérer l'ajout d'un professionnel
  const handleAddProfessional = async (data: Omit<Professional, "id">) => {
    try {
      const newProfessional = await professionalService.add(data);
      setProfessionals([...professionals, newProfessional]);
      toast.success("Professionnel ajouté avec succès");
      setFormOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du professionnel");
      console.error(error);
    }
  };

  // Gérer la modification d'un professionnel
  const handleUpdateProfessional = async (data: Professional) => {
    if (!selectedProfessional) return;
    
    try {
      const updated = await professionalService.update(selectedProfessional.id, data);
      if (updated) {
        setProfessionals(professionals.map(p => 
          p.id === selectedProfessional.id ? updated : p
        ));
        toast.success("Professionnel mis à jour avec succès");
        setFormOpen(false);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du professionnel");
      console.error(error);
    }
  };

  // Gérer la suppression d'un professionnel
  const handleDeleteProfessional = async () => {
    if (!selectedProfessional) return;
    
    try {
      const success = await professionalService.delete(selectedProfessional.id);
      if (success) {
        setProfessionals(professionals.filter(p => p.id !== selectedProfessional.id));
        toast.success("Professionnel supprimé avec succès");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du professionnel");
      console.error(error);
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  // Ouvrir le formulaire d'édition
  const handleEdit = (id: number) => {
    const professional = professionals.find(p => p.id === id);
    if (professional) {
      setSelectedProfessional(professional);
      setIsEditMode(true);
      setFormOpen(true);
    }
  };

  // Ouvrir la confirmation de suppression
  const handleDelete = (id: number) => {
    const professional = professionals.find(p => p.id === id);
    if (professional) {
      setSelectedProfessional(professional);
      setDeleteConfirmOpen(true);
    }
  };

  // Gérer l'exportation des données
  const handleExport = async () => {
    try {
      await professionalService.exportCSV();
      toast.success("Exportation réussie");
    } catch (error) {
      toast.error("Erreur lors de l'exportation");
      console.error(error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-6 py-12">
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tableau de bord Admin</h1>
            <p className="text-slate-500">Gérez les professionnels et les utilisateurs de la plateforme</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              className="bg-[#009e60] hover:bg-[#009e60]/90 flex items-center gap-2"
              onClick={() => {
                setSelectedProfessional(null);
                setIsEditMode(false);
                setFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Ajouter un pro
            </Button>
            
            <Button 
              variant="outline" 
              className="border-[#3a75c4] text-[#3a75c4] flex items-center gap-2"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" /> Exporter
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" /> Importer
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-[#3a75c4]">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Professionnels</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.totalPros}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-[#3a75c4]/10">
                    <Users className="w-6 h-6 text-[#3a75c4]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-[#009e60]">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Professionnels Certifiés</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.certifiedPros}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-[#009e60]/10">
                    <Award className="w-6 h-6 text-[#009e60]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-[#fcd116]">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Note moyenne</p>
                    <h3 className="text-3xl font-bold mt-1 flex items-center">
                      {stats.averageRating}
                      <Star className="w-5 h-5 text-amber-500 ml-1 fill-amber-500" />
                    </h3>
                  </div>
                  <div className="rounded-full p-3 bg-[#fcd116]/10">
                    <Star className="w-6 h-6 text-[#fcd116]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="border-l-4 border-l-buedi-orange">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Villes</p>
                    <h3 className="text-3xl font-bold mt-1">{stats.locations}</h3>
                  </div>
                  <div className="rounded-full p-3 bg-buedi-orange/10">
                    <MapPin className="w-6 h-6 text-buedi-orange" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Filtres et recherche */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Rechercher un professionnel..."
              className="pl-10 bg-slate-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select 
              value={filterCategory} 
              onValueChange={setFilterCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="masonry">Maçonnerie</SelectItem>
                <SelectItem value="plumbing">Plomberie</SelectItem>
                <SelectItem value="electrical">Électricité</SelectItem>
                <SelectItem value="painting">Peinture</SelectItem>
                <SelectItem value="carpentry">Menuiserie</SelectItem>
                <SelectItem value="tiling">Carrelage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Liste des professionnels */}
        <motion.div
          className="bg-white rounded-lg shadow-sm overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <UserCog className="mr-2 w-5 h-5" /> 
              Liste des professionnels ({filteredProfessionals.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {filteredProfessionals.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-center">Certifié</TableHead>
                      <TableHead className="text-center">Vérifié</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessionals.map((pro) => (
                      <TableRow key={pro.id}>
                        <TableCell className="font-medium">{pro.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200">
                              {pro.photo ? (
                                <img 
                                  src={pro.photo} 
                                  alt={pro.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs">
                                  {pro.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <span>{pro.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{pro.company}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {pro.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{pro.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
                            <span>{pro.rating || 'N/A'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {pro.certified ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {pro.verified ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-300 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-amber-600 hover:bg-amber-50"
                              onClick={() => handleEdit(pro.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(pro.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                Aucun professionnel ne correspond à vos critères de recherche
              </div>
            )}
          </CardContent>
        </motion.div>
      </div>
      
      {/* Formulaire d'ajout/modification */}
      <ProfessionalForm 
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={(data) => {
          if (isEditMode) {
            handleUpdateProfessional(data as unknown as Professional);
          } else {
            handleAddProfessional(data as unknown as Omit<Professional, "id">);
          }
        }}
        initialData={isEditMode ? selectedProfessional : undefined}
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
    </PageLayout>
  );
};

export default AdminDashboard;