
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-buedi-blue">
      <div className="absolute inset-0 bg-gradient-to-r from-buedi-blue/95 to-buedi-blue/80">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      </div>
      
      <div className="container relative mx-auto px-6 py-16 md:py-24 lg:px-8 lg:py-32">
        <div className="md:w-3/5">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">BUEDI</span>
            <span className="block text-buedi-orange">La plateforme BTP du Gabon</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl text-white opacity-90">
            Connectez-vous avec des professionnels qualifiés, trouvez des matériaux et financez vos projets de construction en toute simplicité.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-buedi-orange hover:bg-buedi-orange/90 text-white">
              <Link to="/publish-project">Publier un projet</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white text-buedi-blue hover:bg-slate-100">
              <Link to="/find-professionals">Trouver des artisans</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
