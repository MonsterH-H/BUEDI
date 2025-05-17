
import PageLayout from "@/components/PageLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { MultiStepForm, MultiStepFormHeader, MultiStepFormBody, MultiStepFormFooter, StepIndicator } from "@/components/ui/multi-step-form";
import BasicInfoForm from "@/components/profile/BasicInfoForm";
import SkillsForm from "@/components/profile/SkillsForm";
import PortfolioForm from "@/components/profile/PortfolioForm";
import CertificationsForm from "@/components/profile/CertificationsForm";
import PricingForm from "@/components/profile/PricingForm";
import { ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { professionalService } from "@/services/professionalService";

// Gabonese flag colors for styling
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

// Schema for the form
const formSchema = z.object({
  // Basic Info
  companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
  fullName: z.string().min(2, "Votre nom complet est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  location: z.string().min(1, "La localisation est requise"),
  description: z.string().min(10, "Veuillez fournir une description plus détaillée"),
  
  // Skills & Experience
  specialties: z.array(z.string()).min(1, "Sélectionnez au moins une spécialité"),
  experience: z.string().min(1, "Les années d'expérience sont requises"),
  
  // Portfolio
  projects: z.array(z.object({
    title: z.string().min(2, "Le titre du projet est requis"),
    description: z.string(),
    location: z.string(),
    year: z.string(),
    images: z.array(z.string()).optional()
  })).optional(),
  
  // Certifications
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    year: z.string()
  })).optional(),
  
  // Pricing
  hourlyRate: z.string().optional(),
  dailyRate: z.string().optional(),
  projectBasedRates: z.boolean().optional(),
  freeEstimate: z.boolean().optional()
});

export default function CreateProfile() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      fullName: "",
      email: "",
      phone: "",
      location: "",
      description: "",
      specialties: [],
      experience: "",
      projects: [],
      certifications: [],
      hourlyRate: "",
      dailyRate: "",
      projectBasedRates: true,
      freeEstimate: true
    },
    mode: "onChange"
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Convertir les données du formulaire au format attendu par professionalService
    const professional = {
      name: data.fullName,
      company: data.companyName,
      category: data.specialties[0] || "masonry", // On utilise la première spécialité comme catégorie principale
      specialties: data.specialties,
      description: data.description,
      location: data.location,
      rating: 4.5, // Valeur par défaut pour un nouveau professionnel
      reviews: 0,
      verified: false,
      certified: false,
      projects: data.projects?.length || 0,
      yearsExp: parseInt(data.experience) || 0,
      photo: "https://images.unsplash.com/photo-1516822669470-7f8f2f790046?q=80&w=300&auto=format", // Photo par défaut
      email: data.email,
      phone: data.phone
    };

    // Ajouter le professionnel via le service
    try {
      professionalService.add(professional);
      
      // Montrer un toast de succès
      toast({
        title: "Profil créé avec succès",
        description: "Votre profil professionnel a été créé. Vous allez maintenant pouvoir recevoir des demandes de projets.",
      });
      
      // Rediriger vers la page des professionnels
      setTimeout(() => {
        navigate("/find-professionals");
      }, 1500);
    } catch (error) {
      toast({
        title: "Erreur lors de la création du profil",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const nextStep = async () => {
    // Valider l'étape actuelle
    let fieldsToValidate: string[] = [];
    switch (step) {
      case 1:
        fieldsToValidate = ['companyName', 'fullName', 'email', 'phone', 'location', 'description'];
        break;
      case 2:
        fieldsToValidate = ['specialties', 'experience'];
        break;
      // Pour les étapes 3 et 4, on leur permet de continuer même s'ils n'ont rien ajouté
    }
    
    const result = await form.trigger(fieldsToValidate as unknown);
    if (result) {
      setStep(current => Math.min(current + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(current => Math.max(current - 1, 1));
  };

  const stepLabels = ["Informations", "Compétences", "Portfolio", "Certifications", "Tarifs"];

  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Gabonese flag colors stripe */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4]"></div>
        
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-buedi-blue mb-2">
              Créer votre profil professionnel
            </h1>
            <p className="text-center text-slate-600 mb-12">
              Présentez vos compétences et trouvez de nouveaux projets au Gabon
            </p>
            
            <div className="bg-white shadow-lg rounded-xl p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <MultiStepForm currentStep={step} totalSteps={totalSteps}>
                    <MultiStepFormHeader>
                      <StepIndicator 
                        currentStep={step} 
                        totalSteps={totalSteps}
                        labels={stepLabels}
                      />
                    </MultiStepFormHeader>
                    
                    {/* Step 1: Basic Info */}
                    <MultiStepFormBody showContent={step === 1}>
                      <BasicInfoForm form={form} />
                    </MultiStepFormBody>
                    
                    {/* Step 2: Skills */}
                    <MultiStepFormBody showContent={step === 2}>
                      <SkillsForm form={form} />
                    </MultiStepFormBody>
                    
                    {/* Step 3: Portfolio */}
                    <MultiStepFormBody showContent={step === 3}>
                      <PortfolioForm form={form} />
                    </MultiStepFormBody>
                    
                    {/* Step 4: Certifications */}
                    <MultiStepFormBody showContent={step === 4}>
                      <CertificationsForm form={form} />
                    </MultiStepFormBody>
                    
                    {/* Step 5: Pricing */}
                    <MultiStepFormBody showContent={step === 5}>
                      <PricingForm form={form} />
                    </MultiStepFormBody>
                    
                    <MultiStepFormFooter>
                      <div className="flex justify-between w-full">
                        {step > 1 ? (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={prevStep}
                            className="flex items-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" /> Précédent
                          </Button>
                        ) : (
                          <div></div>
                        )}
                        
                        {step < totalSteps ? (
                          <Button 
                            type="button" 
                            onClick={nextStep}
                            className="bg-buedi-blue hover:bg-buedi-blue/90 text-white flex items-center gap-2"
                          >
                            Suivant <ArrowRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            type="submit"
                            className="bg-buedi-green hover:bg-buedi-green/90 text-white flex items-center gap-2"
                          >
                            Créer mon profil <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </MultiStepFormFooter>
                  </MultiStepForm>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
