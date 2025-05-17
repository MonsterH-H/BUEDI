import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentDashboard } from '@/components/payment/PaymentDashboard';
import { InvoiceManager } from '@/components/payment/InvoiceManager';
import { PaymentForm } from '@/components/payment/PaymentForm';

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Gestion des Paiements</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="new-payment">Nouveau paiement</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <PaymentDashboard />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <InvoiceManager />
        </TabsContent>

        <TabsContent value="new-payment" className="space-y-4">
          <div className="max-w-2xl mx-auto">
            <PaymentForm
              amount={50000} // Exemple de montant
              description="Paiement test"
              onSuccess={() => {
                setActiveTab('dashboard');
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManagement;