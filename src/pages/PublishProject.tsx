
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Wrench, Image, MapPin, Calendar, FileText, Shield } from "lucide-react";
import { Link } from "react-router-dom";

// Gabonese flag colors
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

const PublishProject = () => {
  const features = [
    {
      icon: <Wrench style={{ stroke: COLORS.green }} />,
      title: "Détaillez votre projet",
      description: "Décrivez précisément vos besoins et le résultat attendu."
    },
    {
      icon: <Image style={{ stroke: COLORS.yellow }} />,
      title: "Ajoutez des photos",
      description: "Téléchargez des images pour aider à comprendre votre projet."
    },
    {
      icon: <MapPin style={{ stroke: COLORS.blue }} />,
      title: "Indiquez la localisation",
      description: "Précisez l'emplacement de votre chantier au Gabon."
    },
    {
      icon: <Calendar style={{ stroke: COLORS.green }} />,
      title: "Définissez le calendrier",
      description: "Spécifiez les délais et les dates importantes de votre projet."
    },
    {
      icon: <FileText style={{ stroke: COLORS.yellow }} />,
      title: "Recevez des devis gratuits",
      description: "Comparez les offres des artisans et entreprises du BTP."
    },
    {
      icon: <Shield style={{ stroke: COLORS.blue }} />,
      title: "Travaillez en confiance",
      description: "Tous nos professionnels sont vérifiés et notés."
    }
  ];

  return (
    <PageLayout>
      <div className="flex-1">
        {/* Hero section with Gabonese-inspired design */}
        <div 
          className="bg-gradient-to-br from-slate-50 to-slate-100 py-12 relative overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='${encodeURIComponent(COLORS.blue)}' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        >
          {/* Gabonese flag colors stripe */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4]"></div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-buedi-blue mb-6">
                Publier un projet
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Décrivez votre projet et recevez des devis gratuits de professionnels qualifiés au Gabon.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="text-lg py-6 px-8 rounded-lg flex items-center gap-2 shadow-lg"
                  style={{ backgroundColor: COLORS.green }}
                >
                  Être notifié au lancement
                  <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-slate-800">
              Comment ça fonctionne ?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-slate-200 transition-all duration-300 hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-800">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="py-16 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <div 
                  className="p-8 md:p-12 bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] text-white relative"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(26,54,93,0.95) 0%, rgba(45,74,124,0.95) 100%), 
                                      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4]"></div>
                  
                  <div className="text-center md:text-left md:flex md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                      <h3 className="text-2xl font-bold mb-2">Vous êtes un professionnel du BTP ?</h3>
                      <p className="text-slate-200">
                        Inscrivez-vous pour recevoir des demandes de devis et développer votre activité.
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button
                        asChild
                        className="text-buedi-blue bg-white hover:bg-slate-100 shadow-lg"
                      >
                        <Link to="/create-profile">
                          Créer mon profil pro
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PublishProject;
