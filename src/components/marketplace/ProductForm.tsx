
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { X, Upload, AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema for form validation
const productFormSchema = z.object({
  name: z.string().min(3, { message: "Le nom du produit doit faire au moins 3 caractères" }),
  description: z.string().min(10, { message: "La description doit faire au moins 10 caractères" }),
  price: z.coerce.number().min(100, { message: "Le prix doit être d'au moins 100 XAF" }),
  category: z.string().min(1, { message: "Veuillez sélectionner une catégorie" }),
  quantity: z.coerce.number().min(1, { message: "La quantité doit être d'au moins 1" }),
  unit: z.string().min(1, { message: "Veuillez indiquer l'unité de vente" }),
  location: z.string().min(1, { message: "Veuillez sélectionner une localisation" }),
  featured: z.boolean().default(false),
  discount: z.coerce.number().min(0).max(100).default(0),
  deliveryAvailable: z.boolean().default(true),
  deliveryFee: z.coerce.number().min(0).default(0),
  pickupAvailable: z.boolean().default(true),
  tags: z.string().optional(),
  specifications: z.array(z.object({
    name: z.string(),
    value: z.string()
  })).default([]),
  warranty: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Category options
const categories = [
  { id: "cement", name: "Ciment & béton" },
  { id: "wood", name: "Bois & menuiserie" },
  { id: "plumbing", name: "Plomberie" },
  { id: "electrical", name: "Matériel électrique" },
  { id: "paint", name: "Peinture" },
  { id: "tools", name: "Outillage" },
  { id: "hardware", name: "Quincaillerie" }
];

// Location options
const locations = [
  { id: "libreville", name: "Libreville" },
  { id: "port-gentil", name: "Port-Gentil" },
  { id: "franceville", name: "Franceville" },
  { id: "oyem", name: "Oyem" },
  { id: "moanda", name: "Moanda" },
  { id: "lambarene", name: "Lambaréné" }
];

// Default values for a new product
const defaultValues: Partial<ProductFormValues> = {
  name: "",
  description: "",
  price: 0,
  category: "",
  quantity: 1,
  unit: "",
  location: "",
  featured: false,
  discount: 0,
  deliveryAvailable: true,
  deliveryFee: 0,
  pickupAvailable: true,
  specifications: [],
};

interface ProductFormProps {
  productId?: number; // If provided, we're editing an existing product
  onSuccess?: () => void;
}

const ProductForm = ({ productId, onSuccess }: ProductFormProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<{ file: File | null, preview: string }[]>([
    { file: null, preview: "" },
    { file: null, preview: "" },
    { file: null, preview: "" }
  ]);
  const [specifications, setSpecifications] = useState<{ name: string, value: string }[]>([
    { name: "", value: "" }
  ]);
  const [activeTab, setActiveTab] = useState("details");
  
  // Create form with zod validation
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: productId 
      ? { 
          // Mock data for edit mode - In real app, you'd fetch this from API
          name: "Ciment Gabonais GX500",
          description: "Ciment de haute qualité fabriqué au Gabon, idéal pour tous travaux de maçonnerie générale.",
          price: 7500,
          category: "cement",
          quantity: 350,
          unit: "Sac de 50kg",
          location: "libreville",
          featured: false,
          discount: 0,
          deliveryAvailable: true,
          deliveryFee: 2000,
          pickupAvailable: true,
          tags: "ciment, construction, maçonnerie",
        }
      : defaultValues,
    mode: "onChange",
  });

  // In a real app, you would fetch the product data if editing
  // useEffect(() => {
  //   if (productId) {
  //     // Fetch product and update form values
  //   }
  // }, [productId]);

  const onSubmit = async (values: ProductFormValues) => {
    if (images[0].file === null) {
      toast.error("Au moins une image est requise");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, you'd upload the images and send data to a backend
      // Simulating API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Process specifications
      const validSpecifications = specifications.filter(spec => spec.name && spec.value);
      const productData = {
        ...values,
        specifications: validSpecifications,
        images: images.filter(img => img.file !== null).map(img => img.preview)
      };
      
      console.log("Product data to submit:", productData);
      
      toast.success(
        productId ? "Produit modifié avec succès" : "Produit ajouté avec succès", 
        {
          description: isAdmin 
            ? "Le produit est maintenant visible sur le marketplace" 
            : "Votre produit est en attente de validation"
        }
      );
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/product-management");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Une erreur s'est produite", {
        description: "Veuillez réessayer ultérieurement"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = { 
          file: file,
          preview: reader.result as string 
        };
        setImages(newImages);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = { file: null, preview: "" };
    setImages(newImages);
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const handleRemoveSpecification = (index: number) => {
    const newSpecs = [...specifications];
    newSpecs.splice(index, 1);
    setSpecifications(newSpecs);
  };

  const handleSpecificationChange = (index: number, field: 'name' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{productId ? "Modifier le produit" : "Ajouter un nouveau produit"}</h2>
        <p className="text-slate-500">
          {productId 
            ? "Modifiez les informations de votre produit" 
            : isAdmin 
              ? "Ajoutez un nouveau produit au marketplace" 
              : "Les produits ajoutés seront soumis à validation avant publication"
          }
        </p>
      </div>
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 sm:w-[400px]">
          <TabsTrigger value="details">Détails du produit</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="specifications">Spécifications</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du produit*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Ciment Gabonais GX500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez votre produit en détail..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (XAF)*</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantité en stock*</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unité de vente*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Sac de 50kg, Mètre cube, Unité" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation*</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une localisation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remise (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormDescription>
                        Laissez 0 si aucune remise n'est appliquée
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (facultatif)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: construction, matériaux, qualité (séparés par des virgules)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Les tags aideront les clients à trouver votre produit lors des recherches
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Options de livraison et retrait</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="deliveryAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Livraison disponible</FormLabel>
                          <FormDescription>
                            Ce produit peut être livré au client
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pickupAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Retrait sur place</FormLabel>
                          <FormDescription>
                            Ce produit peut être retiré à votre adresse
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                {form.watch("deliveryAvailable") && (
                  <FormField
                    control={form.control}
                    name="deliveryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frais de livraison (XAF)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          Indiquez 0 pour une livraison gratuite
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              {isAdmin && (
                <>
                  <Separator className="my-4" />
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Produit en vedette</FormLabel>
                          <FormDescription>
                            Mettre ce produit en avant sur la page d'accueil du marketplace
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}
              
              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => setActiveTab("images")}
                >
                  Suivant: Images
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Images</AlertTitle>
                <AlertDescription>
                  Ajoutez au moins une image pour votre produit. La première image sera utilisée comme image principale.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                      {image.preview ? (
                        <>
                          <img 
                            src={image.preview} 
                            alt={`Aperçu ${index + 1}`} 
                            className="w-full h-full object-cover" 
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                          <Upload className="h-8 w-8 text-slate-400 mb-2" />
                          <span className="text-sm text-slate-500">
                            {index === 0 ? 'Image principale*' : `Image ${index + 1}`}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e)}
                          />
                        </label>
                      )}
                    </div>
                    {image.file && (
                      <div className="p-2 bg-slate-50 text-xs truncate">
                        {image.file.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Retour: Détails
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("specifications")}
                >
                  Suivant: Spécifications
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-4">Spécifications techniques (facultatif)</h3>
                <p className="text-slate-500 mb-4">
                  Ajoutez des spécifications techniques pour donner plus de détails sur votre produit.
                </p>
                
                {specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 mb-3">
                    <div className="col-span-2">
                      <Input
                        placeholder="Nom (ex: Dimensions)"
                        value={spec.name}
                        onChange={(e) => handleSpecificationChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Valeur (ex: 100x50x25 cm)"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveSpecification(index)}
                        disabled={specifications.length === 1}
                        className="h-full w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSpecification}
                  className="mt-2"
                >
                  Ajouter une spécification
                </Button>
              </div>
              
              <FormField
                control={form.control}
                name="warranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantie/retour (facultatif)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Garantie 30 jours, retour accepté sous conditions..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Précisez les conditions de garantie et de retour pour ce produit
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("images")}
                >
                  Retour: Images
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Traitement en cours..." : productId ? "Mettre à jour le produit" : "Ajouter le produit"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default ProductForm;
