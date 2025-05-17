import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  QrCode,
  Check
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Carte bancaire",
    description: "Visa, Mastercard, UBA",
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    id: "mobile",
    name: "Mobile Money",
    description: "Airtel Money, Moov Money",
    icon: <Smartphone className="w-5 h-5" />
  },
  {
    id: "cash",
    name: "Paiement à la livraison",
    description: "Paiement en espèces à la réception",
    icon: <Wallet className="w-5 h-5" />
  },
  {
    id: "qr",
    name: "QR Code",
    description: "Scannez pour payer",
    icon: <QrCode className="w-5 h-5" />
  }
];

export const PaymentMethods = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  return (
    <div className="space-y-4">
      <h3 className="font-medium" id="payment-methods-title">Méthode de paiement</h3>
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={setSelectedMethod}
        className="space-y-3"
        aria-labelledby="payment-methods-title"
      >
        {paymentMethods.map((method) => (
          <div key={method.id}>
            <RadioGroupItem
              value={method.id}
              id={`payment-method-${method.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`payment-method-${method.id}`}
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer peer-data-[state=checked]:border-buedi-blue peer-data-[state=checked]:bg-buedi-blue/5 hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg" aria-hidden="true">
                  {method.icon}
                </div>
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
              {selectedMethod === method.id && (
                <div 
                  className="w-5 h-5 rounded-full bg-buedi-blue flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedMethod === "card" && (
        <div 
          className="p-4 border rounded-lg bg-gray-50"
          id="card-payment-info"
          role="region"
          aria-label="Informations de paiement par carte"
        >
          <p className="text-sm text-gray-600">
            Les paiements par carte sont sécurisés et cryptés. Nous acceptons les cartes Visa, Mastercard et UBA.
          </p>
        </div>
      )}

      {selectedMethod === "mobile" && (
        <div 
          className="p-4 border rounded-lg bg-gray-50"
          id="mobile-payment-info"
          role="region"
          aria-label="Informations de paiement mobile"
        >
          <p className="text-sm text-gray-600">
            Sélectionnez votre opérateur mobile money pour effectuer le paiement. Vous recevrez un SMS de confirmation.
          </p>
        </div>
      )}

      {selectedMethod === "cash" && (
        <div 
          className="p-4 border rounded-lg bg-gray-50"
          id="cash-payment-info"
          role="region"
          aria-label="Informations de paiement en espèces"
        >
          <p className="text-sm text-gray-600">
            Payez en espèces à la livraison. Veuillez avoir le montant exact pour faciliter la transaction.
          </p>
        </div>
      )}

      {selectedMethod === "qr" && (
        <div 
          className="p-4 border rounded-lg bg-gray-50"
          id="qr-payment-info"
          role="region"
          aria-label="Informations de paiement par QR code"
        >
          <p className="text-sm text-gray-600">
            Scannez le QR code qui s'affichera à l'étape suivante pour effectuer le paiement avec votre application mobile.
          </p>
        </div>
      )}
    </div>
  );
}; 