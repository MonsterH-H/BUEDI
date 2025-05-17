
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Award,
  Wrench,
  CheckCircle,
  Clock,
  Shield,
  ChevronLeft,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  ThumbsUp
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Professional, professionalService } from "@/services/professionalService";
import ContactDialog from "@/components/professionals/ContactDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

const ProfessionalDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Récupérer les informations du professionnel
  useEffect(() => {
    if (id) {
      const professionalId = parseInt(id, 10);
      const fetchedProfessional = professionalService.getById(professionalId);
      
      if (fetchedProfessional) {
        setProfessional(fetchedProfessional);
      } else {
        toast.error("Professionnel non trouvé");
        navigate("/find-professionals");
      }
      
      setLoading(false);
    }
  }, [id, navigate]);

  // Gérer le contact avec le professionnel
  const handleContact = () => {
    if (professional) {
      setContactOpen(true);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a75c4]"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!professional) {
    return (
      <PageLayout>
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Professionnel non trouvé</h1>
            <p className="mt-4">Le professionnel que vous recherchez n'existe pas.</p>
            <Button 
              className="mt-6 bg-[#3a75c4]"
              onClick={() => navigate("/find-professionals")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour à la liste
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header with Gabonese flag colors */}
      <div className="relative bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4] h-16">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="outline" 
            className="mb-8" 
            onClick={() => navigate("/find-professionals")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Button>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-12 gap-8"
        >
          {/* Colonne de gauche (informations principales) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-4 lg:col-span-3"
          >
            <Card className="overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={professional.photo} 
                  alt={professional.name}
                  className="w-full h-full object-cover" 
                />
                {professional.certified && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#fcd116] text-black font-semibold">
                      <Award className="w-3 h-3 mr-1" /> Certifié
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-5">
                <h1 className="text-2xl font-bold mb-1">{professional.name}</h1>
                <p className="text-slate-500">{professional.company}</p>
                
                <div className="flex items-center mt-3 mb-6">
                  <div className="flex items-center text-amber-500">
                    <Star className="fill-current w-5 h-5 mr-1" />
                    <span className="font-medium">{professional.rating}</span>
                  </div>
                  <span className="text-sm text-slate-500 ml-1">({professional.reviews} avis)</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-[#009e60] mr-3" />
                    <span>{professional.location}</span>
                  </div>
                  
                  {professional.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-[#3a75c4] mr-3" />
                      <span>{professional.phone}</span>
                    </div>
                  )}
                  
                  {professional.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-[#fcd116] mr-3" />
                      <span>{professional.email}</span>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full mt-6 bg-[#3a75c4] hover:bg-[#3a75c4]/90"
                  onClick={handleContact}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Contacter
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Indicateurs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Wrench className="w-5 h-5 text-[#009e60] mr-2" />
                    <span>Projets réalisés</span>
                  </div>
                  <Badge variant="outline" className="ml-2 font-medium">
                    {professional.projects}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[#fcd116] mr-2" />
                    <span>Expérience</span>
                  </div>
                  <Badge variant="outline" className="ml-2 font-medium">
                    {professional.yearsExp} ans
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-[#3a75c4] mr-2" />
                    <span>Vérification</span>
                  </div>
                  <Badge variant={professional.verified ? "default" : "outline"} className="ml-2">
                    {professional.verified ? "Vérifié" : "En attente"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-[#009e60] mr-2" />
                    <span>Certification</span>
                  </div>
                  <Badge variant={professional.certified ? "default" : "outline"} className="ml-2">
                    {professional.certified ? "Certifié" : "Non certifié"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Colonne de droite (contenu principal) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-8 lg:col-span-9 space-y-6"
          >
            <Tabs defaultValue="about">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="about">
                  <Briefcase className="mr-2 h-4 w-4" /> À propos
                </TabsTrigger>
                <TabsTrigger value="services">
                  <Wrench className="mr-2 h-4 w-4" /> Services
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <ThumbsUp className="mr-2 h-4 w-4" /> Avis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="about">
                <Card>
                  <CardHeader>
                    <CardTitle>À propos de {professional.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed">
                      {professional.description}
                    </p>
                    
                    <div className="mt-8">
                      <h3 className="font-semibold text-lg mb-3">Spécialités</h3>
                      <div className="flex flex-wrap gap-2">
                        {professional.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-semibold text-lg mb-3">Informations complémentaires</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-[#3a75c4] mr-3" />
                          <div>
                            <div className="font-medium">Disponibilité</div>
                            <div className="text-sm text-slate-500">Sur rendez-vous</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-[#009e60] mr-3" />
                          <div>
                            <div className="font-medium">Zone d'intervention</div>
                            <div className="text-sm text-slate-500">Tout le Gabon</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services">
                <Card>
                  <CardHeader>
                    <CardTitle>Services proposés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {professional.specialties.map((specialty, index) => (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg">
                          <h3 className="font-semibold text-[#3a75c4] mb-2">{specialty}</h3>
                          <p className="text-slate-700">
                            Service professionnel de {specialty.toLowerCase()} par {professional.name}, 
                            avec {professional.yearsExp} années d'expérience dans le domaine.
                          </p>
                        </div>
                      ))}
                      
                      <div className="p-4 border border-[#fcd116]/30 rounded-lg bg-[#fcd116]/5">
                        <h3 className="font-semibold flex items-center">
                          <CheckCircle className="w-5 h-5 text-[#009e60] mr-2" /> 
                          Devis gratuit
                        </h3>
                        <p className="mt-2 text-slate-700">
                          Contactez {professional.name} pour obtenir un devis personnalisé gratuit 
                          pour votre projet au Gabon.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Avis clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {professional.reviews > 0 ? (
                      <div className="space-y-6">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="text-3xl font-bold mr-2">{professional.rating}</div>
                              <div className="text-amber-500 flex">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-5 h-5 ${i < Math.floor(professional.rating) ? "fill-current" : ""}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              Basé sur {professional.reviews} avis
                            </div>
                          </div>
                          
                          <div className="hidden md:block">
                            <Button className="bg-[#3a75c4]">Laisser un avis</Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          {/* Exemple d'avis (à remplacer par des données réelles) */}
                          {[1, 2, 3].map((_, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-[#3a75c4] rounded-full flex items-center justify-center text-white font-bold">
                                    {String.fromCharCode(65 + i)}
                                  </div>
                                  <div className="ml-3">
                                    <div className="font-medium">Client {i+1}</div>
                                    <div className="text-xs text-slate-500">Il y a {i+1} mois</div>
                                  </div>
                                </div>
                                <div className="flex text-amber-500">
                                  {Array(5).fill(0).map((_, j) => (
                                    <Star 
                                      key={j} 
                                      className={`w-4 h-4 ${j < 5 - i ? "fill-current" : ""}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="mt-3 text-slate-700">
                                {["Excellent travail, je recommande vivement.", 
                                  "Professionnel compétent, mais délais un peu longs.", 
                                  "Service correct mais prix un peu élevé."][i]}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 md:hidden flex justify-center">
                          <Button className="bg-[#3a75c4]">Laisser un avis</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-4">🌟</div>
                        <h3 className="text-xl font-medium mb-2">Aucun avis pour le moment</h3>
                        <p className="text-slate-500">Soyez le premier à évaluer {professional.name}</p>
                        <Button className="mt-4 bg-[#3a75c4]">Laisser un avis</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Dialogue de contact */}
      <ContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        professional={professional}
      />
    </PageLayout>
  );
};

export default ProfessionalDetails;
