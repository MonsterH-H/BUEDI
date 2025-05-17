
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  Clock, 
  Users,
  Star,
  Award,
  CheckCircle,
  Play,
  BookOpen,
  CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Gabonese flag colors
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

const trainingCategories = [
  { id: "all", name: "Toutes les formations" },
  { id: "technical", name: "Techniques" },
  { id: "safety", name: "Sécurité" },
  { id: "business", name: "Gestion" },
  { id: "legal", name: "Réglementation" }
];

const courses = [
  {
    id: 1,
    title: "Techniques avancées de maçonnerie",
    category: "technical",
    duration: "15 heures",
    level: "Intermédiaire",
    students: 124,
    rating: 4.8,
    description: "Maîtrisez les techniques avancées de maçonnerie pour améliorer la qualité et la durabilité de vos constructions. Formation incluant des ateliers pratiques.",
    topics: ["Fondations spéciales", "Murs porteurs", "Voûtes et arcs", "Matériaux innovants"],
    certification: true,
    instructor: "Jean Koumba",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format",
    price: "75000",
    nextSession: "2025-05-15"
  },
  {
    id: 2,
    title: "Sécurité sur les chantiers BTP",
    category: "safety",
    duration: "8 heures",
    level: "Débutant",
    students: 245,
    rating: 4.9,
    description: "Formation essentielle sur les normes de sécurité à respecter sur un chantier. Prévention des risques et application des protocoles de sécurité.",
    topics: ["Équipements de protection", "Prévention des chutes", "Sécurité électrique", "Premiers secours"],
    certification: true,
    instructor: "Marie Obame",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format",
    price: "50000",
    nextSession: "2025-05-10"
  },
  {
    id: 3,
    title: "Gestion financière pour artisans",
    category: "business",
    duration: "12 heures",
    level: "Débutant",
    students: 98,
    rating: 4.6,
    description: "Apprenez à gérer efficacement vos finances en tant qu'artisan ou petite entreprise du BTP. Calcul de devis, facturation et suivi de trésorerie.",
    topics: ["Établir un devis", "Facturation", "Comptabilité simplifiée", "Fiscalité"],
    certification: true,
    instructor: "Pascal Ndong",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format",
    price: "60000",
    nextSession: "2025-05-20"
  },
  {
    id: 4,
    title: "Installation électrique aux normes gabonaises",
    category: "technical",
    duration: "20 heures",
    level: "Avancé",
    students: 76,
    rating: 4.7,
    description: "Formation certifiante sur les installations électriques conformes aux normes gabonaises et internationales. Théorie et pratique sur installation réelle.",
    topics: ["Lecture de schémas", "Tableaux électriques", "Mises à la terre", "Certification"],
    certification: true,
    instructor: "Sophie Moussavou",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format",
    price: "90000",
    nextSession: "2025-06-01"
  },
  {
    id: 5,
    title: "Réglementation urbaine et permis de construire",
    category: "legal",
    duration: "6 heures",
    level: "Intermédiaire",
    students: 112,
    rating: 4.5,
    description: "Maîtrisez les démarches administratives et la réglementation pour l'obtention des permis de construire au Gabon. Documents et procédures expliqués.",
    topics: ["Code de l'urbanisme", "Dossier de permis", "PLU et POS", "Autorisations spécifiques"],
    certification: false,
    instructor: "Pierre Mba",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format",
    price: "45000",
    nextSession: "2025-05-25"
  },
  {
    id: 6,
    title: "Pose de carrelage grand format",
    category: "technical",
    duration: "10 heures",
    level: "Intermédiaire",
    students: 87,
    rating: 4.8,
    description: "Techniques spécifiques pour la pose de carrelages grand format au sol et au mur. Formation pratique avec ateliers de mise en situation.",
    topics: ["Préparation des supports", "Découpe précise", "Pose sans décalage", "Jointoiement"],
    certification: false,
    instructor: "Fabrice Ondo",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format",
    price: "70000",
    nextSession: "2025-06-05"
  }
];

const myCourses = [
  {
    id: 2,
    title: "Sécurité sur les chantiers BTP",
    progress: 75,
    completed: 6,
    total: 8,
    nextLesson: "Premiers secours sur chantier",
    category: "safety",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format"
  },
  {
    id: 3,
    title: "Gestion financière pour artisans",
    progress: 25,
    completed: 3,
    total: 12,
    nextLesson: "Calcul de marge et rentabilité",
    category: "business",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format"
  }
];

const certificates = [
  {
    id: 1,
    title: "Techniques de base en électricité BTP",
    issuedDate: "2025-03-15",
    category: "technical",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format"
  },
  {
    id: 2,
    title: "Habilitation travail en hauteur",
    issuedDate: "2025-02-10",
    category: "safety",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format"
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const Training = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageLayout>
      {/* Hero section */}
      <div 
        className="relative bg-buedi-blue py-12 md:py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Formation et Certification
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              Améliorez vos compétences et obtenez des certifications reconnues pour développer votre activité.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-[#fcd116] hover:bg-[#fcd116]/90 text-black font-medium">
                <GraduationCap className="mr-2" /> Voir mes formations
              </Button>
              <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/40">
                Chercher une certification
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <Tabs defaultValue="browse" className="space-y-8">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="browse">Formations disponibles</TabsTrigger>
            <TabsTrigger value="my-courses">Mes formations</TabsTrigger>
            <TabsTrigger value="certificates">Mes certificats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-8">
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="relative max-w-md">
                <Input
                  placeholder="Rechercher une formation..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {trainingCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`px-3 py-1.5 rounded-full transition-colors text-sm ${
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
            
            {/* Courses grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video relative">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
                      {course.certification && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-[#fcd116] text-black font-medium flex items-center gap-1">
                            <Award className="w-3 h-3" /> Certification
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 text-white flex items-center text-sm">
                        <Play className="fill-white w-4 h-4 mr-1.5" /> 
                        {course.duration}
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className={
                          course.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                          course.category === 'safety' ? 'bg-red-100 text-red-700' :
                          course.category === 'business' ? 'bg-green-100 text-green-700' :
                          'bg-amber-100 text-amber-700'
                        }>
                          {course.category === 'technical' ? 'Technique' :
                          course.category === 'safety' ? 'Sécurité' :
                          course.category === 'business' ? 'Gestion' :
                          'Réglementation'}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="fill-amber-400 stroke-amber-400 w-4 h-4" />
                          <span className="text-sm font-medium ml-1">{course.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mt-2">{course.title}</h3>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students} apprenants
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-grow">
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">{course.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Prochaine session:</p>
                        <div className="flex items-center text-sm text-buedi-blue">
                          <CalendarDays className="w-4 h-4 mr-1.5" />
                          {formatDate(course.nextSession)}
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="border-t pt-4">
                      <div className="flex items-center justify-between w-full">
                        <div className="font-bold text-buedi-blue">
                          {course.price} XAF
                        </div>
                        <Button className="bg-buedi-green hover:bg-buedi-green/90 text-white">
                          S'inscrire
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-courses">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Mes formations en cours
              </h2>
              
              {myCourses.length > 0 ? (
                <div className="space-y-6">
                  {myCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="md:w-1/4 aspect-video md:aspect-auto relative">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        
                        <div className="p-6 flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-xl">{course.title}</h3>
                            <Badge variant="outline" className={
                              course.category === 'safety' ? 'bg-red-100 text-red-700' :
                              'bg-green-100 text-green-700'
                            }>
                              {course.category === 'safety' ? 'Sécurité' : 'Gestion'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progression</span>
                                <span className="font-medium">{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            
                            <div className="flex items-center text-sm text-slate-600">
                              <CheckCircle className="w-4 h-4 mr-1.5 text-buedi-green" />
                              {course.completed} modules sur {course.total} complétés
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium">Prochaine leçon:</p>
                              <p className="text-buedi-blue flex items-center">
                                <Play className="w-4 h-4 mr-1.5" />
                                {course.nextLesson}
                              </p>
                            </div>
                            
                            <div className="pt-2">
                              <Button className="bg-buedi-blue hover:bg-buedi-blue/90 text-white">
                                Continuer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-10 text-center shadow-sm">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-medium mb-2">Aucune formation en cours</h3>
                  <p className="text-slate-500 mb-6">Inscrivez-vous à votre première formation pour commencer à apprendre</p>
                  <Button className="bg-buedi-blue hover:bg-buedi-blue/90 text-white">
                    Explorer les formations
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="certificates">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-800">
                Mes certifications
              </h2>
              
              {certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.map((certificate) => (
                    <Card key={certificate.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-video relative bg-slate-100">
                        <img 
                          src={certificate.image} 
                          alt={certificate.title}
                          className="w-full h-full object-cover opacity-25" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 flex items-center justify-center">
                            <Award className="w-20 h-20 text-buedi-blue opacity-80" stroke="currentColor" strokeWidth={1} />
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="p-6 text-center">
                        <Badge variant="outline" className={
                          certificate.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {certificate.category === 'technical' ? 'Technique' : 'Sécurité'}
                        </Badge>
                        
                        <h3 className="font-semibold text-lg mt-3 mb-2">{certificate.title}</h3>
                        
                        <p className="text-sm text-slate-500 mb-4">
                          Délivré le {formatDate(certificate.issuedDate)}
                        </p>
                        
                        <div className="flex justify-center space-x-3">
                          <Button variant="outline" size="sm" className="border-buedi-blue text-buedi-blue">
                            Télécharger
                          </Button>
                          <Button size="sm" className="bg-buedi-blue hover:bg-buedi-blue/90 text-white">
                            Partager
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-10 text-center shadow-sm">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-xl font-medium mb-2">Aucune certification obtenue</h3>
                  <p className="text-slate-500 mb-6">Complétez des formations certifiantes pour obtenir vos premiers certificats</p>
                  <Button className="bg-buedi-blue hover:bg-buedi-blue/90 text-white">
                    Voir les formations certifiantes
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Training;
