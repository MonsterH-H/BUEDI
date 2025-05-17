
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Professional } from "@/services/professionalService";
import { toast } from "sonner";
import { Phone, Mail } from "lucide-react";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professional: Professional | null;
}

const ContactDialog = ({
  open,
  onOpenChange,
  professional
}: ContactDialogProps) => {
  const [message, setMessage] = useState("");
  
  if (!professional) {
    return null;
  }
  
  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }
    
    // Simuler l'envoi d'un message
    toast.success("Message envoyé avec succès");
    setMessage("");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contacter {professional.name}</DialogTitle>
          <DialogDescription>
            Envoyez un message à {professional.company} pour discuter de votre projet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Coordonnées</h4>
            <div className="space-y-2">
              {professional.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-slate-500" />
                  <span>{professional.phone}</span>
                </div>
              )}
              {professional.email && (
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  <span>{professional.email}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Votre message</h4>
            <Textarea
              placeholder="Écrivez votre message ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSendMessage}>Envoyer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
