import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Users, Briefcase, ArrowRight } from "lucide-react";

const UserTypeCards = () => {
  const userTypes = [
    {
      icon: <Building2 className="h-10 w-10 text-buedi-orange" />,
      title: "Particuliers",
      description: "Trouvez des professionnels qualifiés pour vos projets de construction et rénovation.",
      features: [
        "Publiez vos projets gratuitement",
        "Recevez des devis personnalisés",
        "Suivez l'avancement de vos chantiers",
        "Payez en toute sécurité"
      ],
      cta: {
        text: "Publier un projet",
        link: "/publish-project"
      }
    },
    {
      icon: <Briefcase className="h-10 w-10 text-buedi-orange" />,
      title: "Professionnels",
      description: "Développez votre activité en trouvant de nouveaux clients et projets.",
      features: [
        "Créez votre profil professionnel",
        "Accédez à des projets qualifiés",
        "Gérez vos devis et contrats",
        "Formez-vous et certifiez-vous"
      ],
      cta: {
        text: "Créer un profil",
        link: "/create-profile"
      }
    },
    {
      icon: <Users className="h-10 w-10 text-buedi-orange" />,
      title: "Entreprises",
      description: "Optimisez votre gestion de chantier et développez votre réseau.",
      features: [
        "Gérez vos équipes et projets",
        "Accédez à des outils professionnels",
        "Formez vos collaborateurs",
        "Bénéficiez d'une visibilité accrue"
      ],
      cta: {
        text: "En savoir plus",
        link: "/enterprise"
      }
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-buedi-darkgray">
            Pour qui est BUEDI ?
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Notre plateforme s'adresse à tous les acteurs du secteur BTP au Gabon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-2">{type.icon}</div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-slate-600">
                      <ArrowRight className="h-4 w-4 mr-2 text-buedi-orange" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-buedi-orange hover:bg-buedi-orange/90">
                  <Link to={type.cta.link}>
                    {type.cta.text}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTypeCards;
