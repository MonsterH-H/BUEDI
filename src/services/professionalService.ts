
import { toast } from "sonner";

export interface Professional {
  id: number;
  name: string;
  company: string;
  category: string;
  specialties: string[];
  description: string;
  location: string;
  rating: number;
  reviews: number;
  verified: boolean;
  certified: boolean;
  projects: number;
  yearsExp: number;
  photo: string;
  email?: string;
  phone?: string;
}

// Données initiales (remplacer par API/base de données dans une version production)
const initialProfessionals: Professional[] = [
  {
    id: 1,
    name: "Jean Koumba",
    company: "Constructions Koumba",
    category: "masonry",
    specialties: ["maçonnerie générale", "béton armé", "fondations"],
    description: "Maçon avec plus de 15 ans d'expérience dans la construction de villas et petits immeubles. Travail soigné et respectueux des délais.",
    location: "Libreville",
    rating: 4.8,
    reviews: 47,
    verified: true,
    certified: true,
    projects: 58,
    yearsExp: 15,
    photo: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=300&auto=format",
    email: "j.koumba@example.com",
    phone: "+241 66 12 34 56"
  },
  {
    id: 2,
    name: "Marie Obame",
    company: "Électricité Moderne",
    category: "electrical",
    specialties: ["installation électrique", "dépannage", "mise aux normes"],
    description: "Électricienne certifiée spécialisée dans les installations électriques résidentielles et commerciales. Certification en électricité bâtiment.",
    location: "Port-Gentil",
    rating: 4.9,
    reviews: 32,
    verified: true,
    certified: true,
    projects: 45,
    yearsExp: 8,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format",
    email: "m.obame@example.com",
    phone: "+241 66 78 90 12"
  },
  {
    id: 3,
    name: "Pascal Ndong",
    company: "Menuiserie Ndong & Fils",
    category: "carpentry",
    specialties: ["meubles sur mesure", "portes", "fenêtres"],
    description: "Menuisier ébéniste de père en fils. Fabrication de meubles sur mesure et installation de menuiseries en tous genres. Travail du bois local.",
    location: "Franceville",
    rating: 4.7,
    reviews: 29,
    verified: true,
    certified: false,
    projects: 36,
    yearsExp: 12,
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format",
    email: "p.ndong@example.com",
    phone: "+241 66 23 45 67"
  },
  {
    id: 4,
    name: "Sophie Moussavou",
    company: "SP Peinture Déco",
    category: "painting",
    specialties: ["peinture intérieure", "peinture extérieure", "revêtements décoratifs"],
    description: "Peintre professionnelle spécialisée dans les finitions haut de gamme et les techniques décoratives. Conseils en couleurs et ambiances.",
    location: "Libreville",
    rating: 4.9,
    reviews: 54,
    verified: true,
    certified: true,
    projects: 72,
    yearsExp: 7,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format",
    email: "s.moussavou@example.com",
    phone: "+241 66 34 56 78"
  },
  {
    id: 5,
    name: "Pierre Mba",
    company: "Plomberie Express",
    category: "plumbing",
    specialties: ["installation sanitaire", "dépannage", "chauffe-eau solaire"],
    description: "Plombier disponible 7j/7 pour tous vos travaux de plomberie et sanitaires. Spécialiste des installations écologiques et économes en eau.",
    location: "Oyem",
    rating: 4.6,
    reviews: 18,
    verified: true,
    certified: false,
    projects: 24,
    yearsExp: 5,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format",
    email: "p.mba@example.com",
    phone: "+241 66 45 67 89"
  },
  {
    id: 6,
    name: "Fabrice Ondo",
    company: "Carrelages & Co",
    category: "tiling",
    specialties: ["pose de carrelage", "mosaïque", "pierre naturelle"],
    description: "Carreleur minutieux pour tous vos projets de sol et mur. Spécialiste des grands formats, mosaïques et pierre naturelle. Conseil et devis gratuit.",
    location: "Lambaréné",
    rating: 4.7,
    reviews: 26,
    verified: true,
    certified: true,
    projects: 31,
    yearsExp: 9,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format",
    email: "f.ondo@example.com",
    phone: "+241 66 56 78 90"
  }
];

// Stockage local des données (à remplacer par API)
let professionals = [...initialProfessionals];

// Service pour la gestion des professionnels
export const professionalService = {
  // Récupérer tous les professionnels
  getAll: () => {
    return [...professionals];
  },
  
  // Récupérer un professionnel par son ID
  getById: (id: number) => {
    return professionals.find(p => p.id === id);
  },
  
  // Ajouter un nouveau professionnel
  add: (professional: Omit<Professional, "id">) => {
    try {
      const newId = Math.max(...professionals.map(p => p.id), 0) + 1;
      const newProfessional = { ...professional, id: newId };
      professionals = [...professionals, newProfessional];
      toast.success("Professionnel ajouté avec succès");
      return newProfessional;
    } catch (error) {
      toast.error("Erreur lors de l'ajout du professionnel");
      throw error;
    }
  },
  
  // Mettre à jour un professionnel existant
  update: (id: number, updates: Partial<Professional>) => {
    try {
      const index = professionals.findIndex(p => p.id === id);
      if (index === -1) {
        toast.error("Professionnel non trouvé");
        return null;
      }
      
      const updatedProfessional = { ...professionals[index], ...updates };
      professionals = [
        ...professionals.slice(0, index),
        updatedProfessional,
        ...professionals.slice(index + 1)
      ];
      
      toast.success("Professionnel mis à jour avec succès");
      return updatedProfessional;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du professionnel");
      throw error;
    }
  },
  
  // Supprimer un professionnel
  delete: (id: number) => {
    try {
      const index = professionals.findIndex(p => p.id === id);
      if (index === -1) {
        toast.error("Professionnel non trouvé");
        return false;
      }
      
      professionals = [
        ...professionals.slice(0, index),
        ...professionals.slice(index + 1)
      ];
      
      toast.success("Professionnel supprimé avec succès");
      return true;
    } catch (error) {
      toast.error("Erreur lors de la suppression du professionnel");
      throw error;
    }
  },
  
  // Filtrer les professionnels selon différents critères
  filter: (params: {
    category?: string;
    location?: string;
    query?: string;
    certified?: boolean;
  }) => {
    let filtered = [...professionals];
    
    const { category, location, query, certified } = params;
    
    if (category && category !== "all") {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (location) {
      filtered = filtered.filter(p => p.location === location);
    }
    
    if (query) {
      const search = query.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.company.toLowerCase().includes(search) ||
        p.specialties.some(s => s.toLowerCase().includes(search)) ||
        p.description.toLowerCase().includes(search)
      );
    }
    
    if (certified) {
      filtered = filtered.filter(p => p.certified);
    }
    
    return filtered;
  },
  
  // Exporter les données en CSV
  exportCSV: () => {
    try {
      const headers = [
        "ID", "Nom", "Entreprise", "Catégorie", "Spécialités", 
        "Description", "Localisation", "Note", "Avis", 
        "Vérifié", "Certifié", "Projets", "Expérience", "Email", "Téléphone"
      ];
      
      const rows = professionals.map(p => [
        p.id,
        p.name,
        p.company,
        p.category,
        p.specialties.join(", "),
        p.description,
        p.location,
        p.rating,
        p.reviews,
        p.verified ? "Oui" : "Non",
        p.certified ? "Oui" : "Non",
        p.projects,
        p.yearsExp + " ans",
        p.email || "N/A",
        p.phone || "N/A"
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "professionnels.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Données exportées avec succès");
      return true;
    } catch (error) {
      toast.error("Erreur lors de l'exportation");
      return false;
    }
  }
};
