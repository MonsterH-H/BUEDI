
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PageLayout from "@/components/PageLayout";
import { z } from "zod";
import { MapPin, Calendar, Upload, ArrowRight, CheckCircle2, FileText, Building2, HelpCircle, UploadCloud } from "lucide-react";
import { toast } from "sonner";

// Schéma de validation pour le formulaire
const projectFormSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  description: z.string().min(20, "La description doit contenir au moins 20 caractères"),
  budget: z.coerce.number().min(1, "Le budget doit être supérieur à 0"),
  location: z.string().min(3, "Veuillez spécifier une localisation"),
  deadline: z.string().min(1, "Veuillez spécifier une date limite"),
  contactByPhone: z.boolean().default(false),
  phoneNumber: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Couleurs du drapeau gabonais
const COLORS = {
  green: "#009e60",
  yellow: "#fcd116",
  blue: "#3a75c4"
};

const ProjectPublish = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      budget: 0,
      location: "",
      deadline: new Date().toISOString().split('T')[0],
      contactByPhone: false,
      phoneNumber: "",
    },
  });

  // Si l'utilisateur n'est pas connecté, rediriger vers la page d'authentification
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour publier un projet");
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Progression du formulaire
  const calculateProgress = () => {
    return (step / 4) * 100;
  };

  // Gérer le changement d'étape
  const handleNextStep = () => {
    if (step === 1) {
      // Valider les champs de l'étape 1
      form.trigger(["title", "category", "description"]).then((isValid) => {
        if (isValid) setStep(2);
      });
    } else if (step === 2) {
      // Valider les champs de l'étape 2
      form.trigger(["budget", "location", "deadline"]).then((isValid) => {
        if (isValid) setStep(3);
      });
    } else if (step === 3) {
      // Passer à l'étape finale
      setStep(4);
    } else if (step === 4) {
      // Soumettre le formulaire
      form.handleSubmit(onSubmit)();
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Gérer le téléchargement de fichiers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      setFiles(Array.from(selectedFiles));
    }
  };

  // Soumettre le formulaire
  const onSubmit = (data: ProjectFormValues) => {
    console.log("Formulaire soumis:", data);
    console.log("Fichiers:", files);

    // Simuler l'envoi du projet
    setShowDialog(true);
  };

  // Rediriger après la soumission
  const handleDialogClose = () => {
    setShowDialog(false);
    navigate("/");
    toast.success("Votre projet a été publié avec succès!");
  };

  // Si l'utilisateur n'est pas connecté, ne pas afficher le contenu
  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10 pt-24">
        <div className="max-w-3xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Publier un projet</h1>
            <p className="text-slate-600">
              Décrivez votre projet en détail pour recevoir les meilleures offres des professionnels.
            </p>
          </div>

          {/* Progression */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm font-medium">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" style={{ backgroundColor: "#e2e8f0" }}>
              <div 
                className="h-full bg-gradient-to-r from-[#009e60] via-[#fcd116] to-[#3a75c4] rounded-full"
                style={{ width: `${calculateProgress()}%` }}
              />
            </Progress>
          </div>

          {/* Étapes du formulaire */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="pt-6">
              <Form {...form}>
                <form className="space-y-6">
                  {/* Étape 1: Informations de base */}
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-buedi-blue font-medium mb-4">
                        <FileText className="h-5 w-5" />
                        <h2 className="text-xl">Informations de base</h2>
                      </div>

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Titre du projet</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Rénovation d'une salle de bains" {...field} />
                            </FormControl>
                            <FormDescription>
                              Un titre clair et précis pour attirer les professionnels adaptés.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Catégorie</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez une catégorie" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="construction">Construction neuve</SelectItem>
                                <SelectItem value="renovation">Rénovation</SelectItem>
                                <SelectItem value="plumbing">Plomberie</SelectItem>
                                <SelectItem value="electrical">Électricité</SelectItem>
                                <SelectItem value="painting">Peinture</SelectItem>
                                <SelectItem value="flooring">Revêtement de sol</SelectItem>
                                <SelectItem value="tiling">Carrelage</SelectItem>
                                <SelectItem value="roofing">Toiture</SelectItem>
                                <SelectItem value="landscaping">Aménagement paysager</SelectItem>
                                <SelectItem value="other">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description du projet</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Décrivez votre projet en détail (matériaux souhaités, dimensions, état actuel, etc.)" 
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Plus votre description est détaillée, meilleures seront les propositions.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Étape 2: Budget et délais */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-buedi-blue font-medium mb-4">
                        <Building2 className="h-5 w-5" />
                        <h2 className="text-xl">Budget et délais</h2>
                      </div>

                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget estimé (en FCFA)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type="number" min="0" {...field} />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500">
                                  FCFA
                                </div>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Indiquez votre budget approximatif pour ce projet.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Localisation</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input placeholder="Quartier, ville" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Où se situe le projet? (Ex: Libreville, Port-Gentil, etc.)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date limite souhaitée</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <Input type="date" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Quand souhaitez-vous que le projet soit terminé?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactByPhone"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Être contacté par téléphone</FormLabel>
                              <FormDescription>
                                Autorisez les professionnels à vous contacter directement.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {form.watch("contactByPhone") && (
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="+241 XX XXX XXX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}

                  {/* Étape 3: Photos et documents */}
                  {step === 3 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-buedi-blue font-medium mb-4">
                        <Upload className="h-5 w-5" />
                        <h2 className="text-xl">Photos et documents</h2>
                      </div>

                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center space-y-4 bg-slate-50">
                        <div className="mx-auto flex flex-col items-center">
                          <UploadCloud className="h-12 w-12 text-slate-400 mb-4" />
                          <h3 className="text-lg font-medium mb-1">Téléchargez des photos ou documents</h3>
                          <p className="text-sm text-slate-500 mb-4">
                            Glissez-déposez vos fichiers ici, ou cliquez pour parcourir vos fichiers
                          </p>
                          
                          <label className="relative">
                            <Button
                              type="button"
                              variant="outline"
                              className="relative border-buedi-blue text-buedi-blue hover:bg-buedi-blue/10 z-10"
                              size="lg"
                            >
                              Parcourir vos fichiers
                            </Button>
                            <input 
                              type="file" 
                              multiple 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                              onChange={handleFileChange}
                            />
                          </label>
                          
                          <p className="text-xs text-slate-500 mt-4">
                            PNG, JPG, PDF (max. 10MB par fichier)
                          </p>
                        </div>

                        {files.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2 text-left">Fichiers sélectionnés</h4>
                            <ul className="space-y-2">
                              {files.map((file, index) => (
                                <li key={index} className="flex items-center p-2 bg-white border rounded text-left">
                                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-sm truncate flex-1">{file.name}</span>
                                  <span className="text-xs text-slate-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                        <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Pourquoi ajouter des photos?</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Les photos aident les professionnels à mieux comprendre votre projet, 
                            ce qui leur permet de vous fournir des devis plus précis.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étape 4: Récapitulatif */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 text-buedi-green font-medium mb-4">
                        <CheckCircle2 className="h-5 w-5" />
                        <h2 className="text-xl">Récapitulatif</h2>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h3 className="font-medium mb-3">Informations du projet</h3>
                          <dl className="divide-y divide-slate-200">
                            <div className="py-2 grid grid-cols-3">
                              <dt className="text-sm text-slate-500">Titre</dt>
                              <dd className="text-sm col-span-2">{form.getValues("title")}</dd>
                            </div>
                            <div className="py-2 grid grid-cols-3">
                              <dt className="text-sm text-slate-500">Catégorie</dt>
                              <dd className="text-sm col-span-2">{form.getValues("category")}</dd>
                            </div>
                            <div className="py-2 grid grid-cols-3">
                              <dt className="text-sm text-slate-500">Budget</dt>
                              <dd className="text-sm col-span-2">{form.getValues("budget")} FCFA</dd>
                            </div>
                            <div className="py-2 grid grid-cols-3">
                              <dt className="text-sm text-slate-500">Localisation</dt>
                              <dd className="text-sm col-span-2">{form.getValues("location")}</dd>
                            </div>
                            <div className="py-2 grid grid-cols-3">
                              <dt className="text-sm text-slate-500">Date limite</dt>
                              <dd className="text-sm col-span-2">{form.getValues("deadline")}</dd>
                            </div>
                            <div className="py-2 grid grid-cols-3">
                              <dt className="text-sm text-slate-500">Contact téléphonique</dt>
                              <dd className="text-sm col-span-2">
                                {form.getValues("contactByPhone") ? 
                                  form.getValues("phoneNumber") || "Oui" : 
                                  "Non"
                                }
                              </dd>
                            </div>
                          </dl>
                        </div>
                      
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h3 className="font-medium mb-3">Description</h3>
                          <p className="text-sm whitespace-pre-line">{form.getValues("description")}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h3 className="font-medium mb-3">Fichiers ({files.length})</h3>
                          {files.length > 0 ? (
                            <ul className="space-y-2">
                              {files.map((file, index) => (
                                <li key={index} className="text-sm flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-slate-500" />
                                  {file.name}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-500">Aucun fichier téléchargé</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-8 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePreviousStep}
                      disabled={step === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      style={{ 
                        backgroundColor: step === 4 ? COLORS.green : COLORS.blue 
                      }}
                      className="flex items-center gap-1"
                    >
                      {step === 4 ? "Publier le projet" : "Suivant"}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogue de confirmation */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Projet publié avec succès!</DialogTitle>
            <DialogDescription>
              Votre projet a été publié et sera visible par les professionnels qualifiés au Gabon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center mb-4">
              Vous recevrez des notifications dès que des professionnels répondront à votre demande.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleDialogClose}
              className="w-full"
              style={{ backgroundColor: COLORS.green }}
            >
              Revenir à l'accueil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProjectPublish;
