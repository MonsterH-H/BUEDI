
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Star, 
  MapPin, 
  Wrench, 
  Clock, 
  Shield, 
  Award,
  Pencil,
  Trash2,
  Phone,
  Mail,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Eye
} from "lucide-react";
import { Professional } from "@/services/professionalService";

interface ProfessionalCardProps {
  professional: Professional;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onContact: (professional: Professional) => void;
  onViewProfile: (id: number) => void;
  isAdmin?: boolean;
}

const ProfessionalCard = ({
  professional,
  onEdit,
  onDelete,
  onContact,
  onViewProfile,
  isAdmin = false
}: ProfessionalCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-md transition-all h-full">
        <CardContent className="p-0 flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/3 aspect-square md:aspect-auto relative">
            <img 
              src={professional.photo} 
              alt={professional.name}
              className="w-full h-full object-cover" 
            />
            {professional.certified && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-[#fcd116] text-black font-semibold flex items-center gap-1">
                  <Award className="w-3 h-3" /> Certifié
                </Badge>
              </div>
            )}
          </div>
          
          <div className="p-5 flex-1 flex flex-col">
            <div className="mb-1">
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {professional.category}
              </Badge>
            </div>
            
            <h3 className="text-xl font-semibold mb-1">{professional.name}</h3>
            <p className="text-sm text-slate-500 mb-2">{professional.company}</p>
            
            <div className="flex items-center mb-3">
              <div className="flex items-center text-amber-500 mr-3">
                <Star className="fill-current w-4 h-4 mr-1" />
                <span className="font-medium">{professional.rating}</span>
                <span className="text-xs text-slate-500 ml-1">({professional.reviews} avis)</span>
              </div>
              
              <div className="flex items-center text-slate-600 text-sm">
                <MapPin className="w-4 h-4 mr-1 text-[#009e60]" />
                {professional.location}
              </div>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">{professional.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {professional.specialties.map((specialty, index) => (
                <div key={index} className="bg-slate-100 px-3 py-1 rounded text-xs">
                  {specialty}
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center">
                <Wrench className="w-4 h-4 mr-1 text-[#009e60]" />
                {professional.projects} projets
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-[#fcd116]" />
                {professional.yearsExp} ans d'expérience
              </div>
              {professional.verified && (
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-[#3a75c4]" />
                  Vérifié
                </div>
              )}
            </div>

            {showDetails && (
              <motion.div 
                className="bg-slate-50 p-3 rounded-lg mb-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-medium text-sm mb-2">Coordonnées</h4>
                <div className="space-y-2">
                  {professional.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-slate-500" />
                      <span>{professional.phone}</span>
                    </div>
                  )}
                  {professional.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-slate-500" />
                      <span>{professional.email}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            <div className="flex flex-wrap gap-3 mt-auto">
              <Button 
                className="flex-1 bg-[#3a75c4] hover:bg-[#3a75c4]/90 text-white flex items-center gap-1"
                onClick={() => onContact(professional)}
              >
                <MessageSquare className="w-4 h-4" /> Contacter
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-[#009e60] text-[#009e60] flex items-center gap-1"
                onClick={() => onViewProfile(professional.id)}
              >
                <Eye className="w-4 h-4" /> Voir profil
              </Button>
              
              {isAdmin && (
                <>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-amber-600"
                    onClick={() => onEdit(professional.id)}
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-red-600"
                    onClick={() => onDelete(professional.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              <Button 
                size="sm" 
                variant="link" 
                className={`ml-auto flex items-center gap-1 ${showDetails ? 'text-slate-700' : 'text-[#3a75c4]'}`}
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <>
                    Masquer <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Détails <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfessionalCard;
