import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <div className="bg-buedi-blue py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Rejoignez la communauté BUEDI
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Que vous soyez particulier, artisan ou entreprise, BUEDI vous accompagne dans tous vos projets de construction et rénovation au Gabon.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-buedi-orange hover:bg-buedi-orange/90 text-white">
              <Link to="/publish-project">
                Publier un projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
              <Link to="/create-profile">
                Créer un profil professionnel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
