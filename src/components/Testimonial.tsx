import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const Testimonial = () => {
  const testimonials = [
    {
      name: "Marie Nkoghe",
      role: "Particulier",
      location: "Libreville",
      avatar: "https://ui-avatars.com/api/?name=Marie+Nkoghe&background=009e60&color=fff",
      rating: 5,
      content: "BUEDI m'a permis de trouver rapidement un artisan qualifié pour la rénovation de ma maison. Le suivi du chantier était impeccable et le résultat est au-delà de mes attentes."
    },
    {
      name: "Pierre Mba",
      role: "Artisan",
      location: "Port-Gentil",
      avatar: "https://ui-avatars.com/api/?name=Pierre+Mba&background=3a75c4&color=fff",
      rating: 5,
      content: "Depuis que j'ai créé mon profil sur BUEDI, j'ai pu développer mon activité et trouver de nouveaux clients. La plateforme est vraiment adaptée aux besoins des artisans."
    },
    {
      name: "Sarah Ondo",
      role: "Entrepreneur",
      location: "Franceville",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Ondo&background=fcd116&color=000",
      rating: 5,
      content: "En tant que chef d'entreprise dans le BTP, BUEDI m'a permis d'optimiser la gestion de mes chantiers et de trouver de nouveaux projets. Une vraie révolution !"
    }
  ];

  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-buedi-darkgray">
            Ce qu'en disent nos utilisateurs
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez les retours d'expérience de nos utilisateurs satisfaits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-slate-500">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

