
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Building, ShoppingBag } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-buedi-orange" />,
      value: "1,500+",
      label: "Utilisateurs inscrits"
    },
    {
      icon: <FileText className="h-8 w-8 text-buedi-orange" />,
      value: "850+",
      label: "Projets réalisés"
    },
    {
      icon: <Building className="h-8 w-8 text-buedi-orange" />,
      value: "300+",
      label: "Entreprises certifiées"
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-buedi-orange" />,
      value: "50+",
      label: "Fournisseurs partenaires"
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-slate-50 hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-buedi-blue">{stat.value}</div>
                <div className="text-sm text-slate-600 text-center">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
