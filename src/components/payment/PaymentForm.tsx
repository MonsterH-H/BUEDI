import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';
import { PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

interface PaymentFormProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const PaymentForm = ({ amount, description, onSuccess, onError }: PaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch } = useForm();
  const selectedMethod = watch('paymentMethod');

  interface PaymentFormData {
    paymentMethod: PaymentMethod;
  }

  const handlePayment = async (data: PaymentFormData) => {
    try {
      setIsLoading(true);
      
      // Créer l'intention de paiement
      const paymentIntent = await paymentService.createPaymentIntent(
        amount,
        'XAF', // Franc CFA
        description
      );

      // Confirmer le paiement
      const payment = await paymentService.confirmPayment(
        paymentIntent.id,
        data.paymentMethod as PaymentMethod
      );

      toast.success('Paiement effectué avec succès!');
      onSuccess?.();
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast.error('Erreur lors du paiement');
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit(handlePayment)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Paiement</h2>
          <p className="text-gray-500">Montant à payer: {amount.toLocaleString()} FCFA</p>
        </div>

        <div className="space-y-4">
          <Label>Méthode de paiement</Label>
          <RadioGroup defaultValue="airtel_money" className="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem
                value="airtel_money"
                id="airtel_money"
                {...register('paymentMethod')}
              />
              <Label htmlFor="airtel_money" className="flex items-center gap-2">
                <Icons.airtel className="h-4 w-4" />
                Airtel Money
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="moov_money"
                id="moov_money"
                {...register('paymentMethod')}
              />
              <Label htmlFor="moov_money" className="flex items-center gap-2">
                <Icons.moov className="h-4 w-4" />
                Moov Money
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="bank_transfer"
                id="bank_transfer"
                {...register('paymentMethod')}
              />
              <Label htmlFor="bank_transfer" className="flex items-center gap-2">
                <Icons.bank className="h-4 w-4" />
                Virement bancaire
              </Label>
            </div>

            <div>
              <RadioGroupItem
                value="card"
                id="card"
                {...register('paymentMethod')}
              />
              <Label htmlFor="card" className="flex items-center gap-2">
                <Icons.card className="h-4 w-4" />
                Carte bancaire
              </Label>
            </div>
          </RadioGroup>
        </div>

        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                {...register('cardNumber')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Date d'expiration</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  {...register('expiryDate')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  maxLength={4}
                  {...register('cvv')}
                />
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Traitement en cours...
            </>
          ) : (
            <>Payer {amount.toLocaleString()} FCFA</>
          )}
        </Button>
      </form>
    </Card>
  );
};