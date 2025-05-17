
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Calendar, 
  BanknoteIcon, 
  Filter, 
  Tag, 
  Clock,
  Search
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Gabonese flag colors
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

const projectCategories = [
  { id: "all", name: "Tous les projets" },
  { id: "construction", name: "Construction" },
  { id: "renovation", name: "Rénovation" },
  { id: "plumbing", name: "Plomberie" },
  { id: "electrical", name: "Électricité" },
  { id: "painting", name: "Peinture" },
  { id: "carpentry", name: "Menuiserie" }
];

const projectLocations = [
  "Libreville", "Port-Gentil", "Franceville", "Oyem", "Lambaréné", "Moanda"
];

const projects = [
  {
    id: 1,
    title: "Construction d'une terrasse couverte",
    category: "construction",
    description: "Besoin de construire une terrasse couverte de 20m² avec toiture en tôle isolée et sol carrelé. Les piliers devront être en béton avec finition en peinture.",
    location: "Libreville",
    budget: "500000-800000",
    postedDate: "2025-04-25",
    deadline: "2025-05-15",
    skills: ["maçonnerie", "carrelage", "toiture"],
    urgency: "Normale"
  },
  {
    id: 2,
    title: "Rénovation salle de bain complète",
    category: "renovation",
    description: "Rénovation complète d'une salle de bain de 8m² comprenant remplacement de la baignoire par une douche à l'italienne, nouveaux carrelages murs et sol, nouveau meuble vasque.",
    location: "Port-Gentil",
    budget: "1200000-1800000",
    postedDate: "2025-04-28",
    deadline: "2025-06-10",
    skills: ["plomberie", "carrelage", "électricité"],
    urgency: "Haute"
  },
  {
    id: 3,
    title: "Installation électrique nouvelle villa",
    category: "electrical",
    description: "Installation électrique complète pour une villa de 150m² comprenant tableau électrique, prises, interrupteurs, éclairages. Certification électrique demandée.",
    location: "Franceville",
    budget: "900000-1300000",
    postedDate: "2025-04-30",
    deadline: "2025-05-30",
    skills: ["électricité", "domotique"],
    urgency: "Normale"
  },
  {
    id: 4,
    title: "Peinture extérieure bâtiment commercial",
    category: "painting",
    description: "Peinture extérieure d'un bâtiment commercial de 2 étages. Surface totale d'environ 450m². Préparation des surfaces et application de 2 couches de peinture.",
    location: "Libreville",
    budget: "1500000-2000000",
    postedDate: "2025-05-01",
    deadline: "2025-06-01",
    skills: ["peinture", "échafaudage"],
    urgency: "Basse"
  },
  {
    id: 5,
    title: "Fabrication et installation de mobilier sur mesure",
    category: "carpentry",
    description: "Conception, fabrication et installation de meubles sur mesure pour un salon et une salle à manger. Inclut une bibliothèque murale et une table avec bancs.",
    location: "Oyem",
    budget: "700000-1100000",
    postedDate: "2025-04-27",
    deadline: "2025-06-15",
    skills: ["menuiserie", "ébénisterie", "design"],
    urgency: "Normale"
  },
  {
    id: 6,
    title: "Installation plomberie pour nouvelle cuisine",
    category: "plumbing",
    description: "Installation complète de la plomberie pour une cuisine neuve : alimentation eau chaude/froide, évacuations, raccordement électroménagers.",
    location: "Moanda",
    budget: "400000-600000",
    postedDate: "2025-04-29",
    deadline: "2025-05-20",
    skills: ["plomberie", "raccordement"],
    urgency: "Haute"
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'Haute':
      return 'bg-red-100 text-red-700';
    case 'Normale':
      return 'bg-amber-100 text-amber-700';
    case 'Basse':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-blue-100 text-blue-700';
  }
};

const FindProjects = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeCategory === "all" || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === "" || project.location === selectedLocation;
    return matchesCategory && matchesSearch && matchesLocation;
  });

  return (
    <PageLayout>
      {/* Hero section */}
      <div 
        className="relative bg-buedi-blue py-12 md:py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trouvez des projets à proximité
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              Accédez aux demandes des clients et développez votre activité au Gabon.
            </p>
            <div className="relative">
              <Input 
                placeholder="Rechercher des projets par mot-clé..."
                className="w-full py-6 pl-5 pr-12 rounded-lg bg-white/95 shadow-lg text-base focus-visible:ring-[#fcd116]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white shadow-sm sticky top-16 z-30 overflow-x-auto scrollbar-none">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex space-x-4 overflow-x-auto">
              {projectCategories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
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
            
            <select
              className="bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-buedi-blue"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Toutes les villes</option>
              {projectLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            {filteredProjects.length} projets disponibles
          </h2>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-all border-l-4" style={{ borderLeftColor: COLORS.blue }}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className={getUrgencyColor(project.urgency)}>
                            {project.urgency}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-100 text-blue-700">
                            {project.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-xl mb-2">{project.title}</h3>
                        <p className="text-slate-600 mb-4">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.skills.map((skill, index) => (
                            <div key={index} className="bg-slate-100 px-3 py-1 rounded text-xs flex items-center">
                              <Tag className="w-3 h-3 mr-1" />
                              {skill}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-buedi-blue" />
                            {project.location}
                          </div>
                          <div className="flex items-center">
                            <BanknoteIcon className="w-4 h-4 mr-1 text-buedi-green" />
                            {project.budget} XAF
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-buedi-orange" />
                            Deadline: {formatDate(project.deadline)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-slate-400" />
                            Publié le {formatDate(project.postedDate)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                        <Button className="bg-buedi-green hover:bg-buedi-green/90 text-white">
                          Proposer un devis
                        </Button>
                        <Button variant="outline" className="border-buedi-blue text-buedi-blue">
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-10 text-center shadow-sm">
            <div className="text-4xl mb-4">😢</div>
            <h3 className="text-xl font-medium mb-2">Aucun projet trouvé</h3>
            <p className="text-slate-500">Essayez d'autres critères de recherche</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default FindProjects;
