
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Calendar, FileText, ShieldCheck, GraduationCap } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Users className="h-10 w-10 text-buedi-orange" />,
      title: "Mise en relation intelligente",
      description: "Trouvez des professionnels qualifiés selon vos critères spécifiques et votre localisation."
    },
    {
      icon: <Calendar className="h-10 w-10 text-buedi-orange" />,
      title: "Suivi de projet",
      description: "Suivez l'avancement de vos projets en temps réel avec des mises à jour photos et validation par étapes."
    },
    {
      icon: <FileText className="h-10 w-10 text-buedi-orange" />,
      title: "Devis et contrats simplifiés",
      description: "Générez et comparez des devis, signez des contrats numériques rapidement et en toute sécurité."
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-buedi-orange" />,
      title: "Paiements sécurisés",
      description: "Utilisez nos solutions de paiement mobile intégrées (Airtel Money, Moov Money, Orange Money)."
    },
    {
      icon: <GraduationCap className="h-10 w-10 text-buedi-orange" />,
      title: "Formation et certification",
      description: "Accédez à des formations pour améliorer vos compétences et obtenez des certifications reconnues."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-buedi-orange" />,
      title: "Notation transparente",
      description: "Basez vos choix sur les avis vérifiés des clients précédents pour une confiance totale."
    }
  ];

  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-buedi-darkgray">
            Pourquoi choisir BUEDI ?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Notre plateforme offre de nombreux avantages pour tous les acteurs du secteur BTP au Gabon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
