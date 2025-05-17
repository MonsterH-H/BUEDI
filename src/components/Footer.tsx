
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const sections = [
    {
      title: "BUEDI",
      links: [
        { label: "À propos", url: "/about" },
        { label: "Comment ça marche", url: "/how-it-works" },
        { label: "Tarifs", url: "/pricing" },
        { label: "Contactez-nous", url: "/contact" }
      ]
    },
    {
      title: "Pour les particuliers",
      links: [
        { label: "Publier un projet", url: "/publish-project" },
        { label: "Trouver des artisans", url: "/find-professionals" },
        { label: "Suivre mon chantier", url: "/project-tracking" },
        { label: "Conseils et guides", url: "/guides" }
      ]
    },
    {
      title: "Pour les professionnels",
      links: [
        { label: "Créer un profil", url: "/create-profile" },
        { label: "Trouver des projets", url: "/find-projects" },
        { label: "Formation et certification", url: "/training" },
        { label: "Assurance et garanties", url: "/insurance" }
      ]
    },
    {
      title: "Légal",
      links: [
        { label: "Conditions d'utilisation", url: "/terms" },
        { label: "Politique de confidentialité", url: "/privacy" },
        { label: "Cookies", url: "/cookies" },
        { label: "Mentions légales", url: "/legal" }
      ]
    }
  ];

  return (
    <footer className="bg-buedi-darkgray text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-buedi-orange">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.url} className="text-slate-300 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-buedi-blue text-white p-1 rounded mr-2">B</div>
              <span className="text-xl font-bold">BUEDI</span>
            </div>
            <div className="text-slate-400 text-sm">
              &copy; {currentYear} BUEDI - La plateforme digitale intelligente du secteur BTP au Gabon. Tous droits réservés.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
