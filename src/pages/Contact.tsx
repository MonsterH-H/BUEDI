
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schéma de validation du formulaire
const formSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  subject: z.string().min(5, "Le sujet doit comporter au moins 5 caractères"),
  message: z.string().min(10, "Le message doit comporter au moins 10 caractères"),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simuler un envoi de formulaire
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.");
      form.reset();
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  }

  // Coordonnées des bureaux
  const offices = [
    {
      name: "Siège Social - Libreville",
      address: "123 Boulevard Triomphal, Libreville, Gabon",
      phone: "+241 77 12 34 56",
      email: "contact@buedi.ga",
      hours: "Lundi - Vendredi: 8h00 - 17h00"
    },
    {
      name: "Agence de Port-Gentil",
      address: "45 Rue du Commerce, Port-Gentil, Gabon",
      phone: "+241 66 78 90 12",
      email: "portgentil@buedi.ga",
      hours: "Lundi - Vendredi: 8h30 - 16h30"
    },
    {
      name: "Agence de Franceville",
      address: "78 Avenue des Mines, Franceville, Gabon",
      phone: "+241 65 43 21 98",
      email: "franceville@buedi.ga",
      hours: "Lundi - Vendredi: 8h00 - 16h00"
    }
  ];

  return (
    <PageLayout>
      {/* Hero section */}
      <div className="relative bg-buedi-blue py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2684')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Contactez BUEDI
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-6">
              Notre équipe est à votre écoute pour répondre à toutes vos questions concernant vos projets de construction et de rénovation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white hover:bg-white/90 text-buedi-blue">
                Appeler maintenant
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                Consulter la FAQ
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-buedi-blue mb-6 flex items-center">
              <Send className="mr-2 h-5 w-5" />
              Envoyez-nous un message
            </h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Pendy le big" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="+241 0405458534" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sujet</FormLabel>
                        <FormControl>
                          <Input placeholder="Demande de devis..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Détails de votre demande..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-buedi-blue hover:bg-buedi-blue/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Envoi en cours...</>
                    ) : isSubmitted ? (
                      <><CheckCircle className="mr-2 h-4 w-4" /> Message envoyé</>
                    ) : (
                      <>Envoyer le message</>
                    )}
                  </Button>
                  <FormDescription className="text-center mt-2">
                    Nous respectons votre vie privée et ne partagerons jamais vos informations.
                  </FormDescription>
                </div>
              </form>
            </Form>
          </div>

          {/* Informations de contact */}
          <div>
            <h2 className="text-2xl font-bold text-buedi-blue mb-6 flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Nos bureaux
            </h2>
            
            <Tabs defaultValue={offices[0].name} className="w-full">
              <TabsList className="w-full mb-6 overflow-x-auto flex flex-nowrap">
                {offices.map((office) => (
                  <TabsTrigger key={office.name} value={office.name} className="flex-shrink-0">
                    {office.name.split(" - ")[1] || office.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {offices.map((office) => (
                <TabsContent key={office.name} value={office.name}>
                  <Card>
                    <CardContent className="p-6 space-y-5">
                      <h3 className="text-xl font-semibold">{office.name}</h3>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-buedi-blue mt-0.5" />
                        <p>{office.address}</p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Phone className="h-5 w-5 text-buedi-blue mt-0.5" />
                        <p>{office.phone}</p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Mail className="h-5 w-5 text-buedi-blue mt-0.5" />
                        <p>{office.email}</p>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-buedi-blue mt-0.5" />
                        <p>{office.hours}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Google Map */}
                  <div className="h-[300px] bg-slate-200 rounded-lg mt-6 overflow-hidden relative">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127504.42092981144!2d9.395277041796866!3d0.4164225000000056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x107f3b8b4d71e391%3A0xb9d07153e82bc11a!2sLibreville%2C%20Gabon!5e0!3m2!1sfr!2sfr!4v1683989640349!5m2!1sfr!2sfr" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Map"
                      className="absolute inset-0"
                    ></iframe>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">Horaires d'ouverture</h3>
              <ul className="space-y-2">
                <li className="flex justify-between border-b pb-2">
                  <span className="font-medium">Lundi - Vendredi</span>
                  <span>8h00 - 17h00</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="font-medium">Samedi</span>
                  <span>9h00 - 13h00</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="font-medium">Dimanche</span>
                  <span>Fermé</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
    </PageLayout>
  );
}
