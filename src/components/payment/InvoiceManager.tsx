import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { paymentService } from '@/services/paymentService';
import { Invoice } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { InvoiceDetails } from './InvoiceDetails';
import { Icons } from '@/components/ui/icons';

export const InvoiceManager = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await paymentService.getInvoiceHistory();
      setInvoices(data);
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoidInvoice = async (invoiceId: string) => {
    try {
      await paymentService.voidInvoice(invoiceId);
      await loadInvoices(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la facture:', error);
    }
  };

  const downloadInvoice = (invoice: Invoice) => {
    // Implémenter la logique de téléchargement PDF
    console.log('Téléchargement de la facture:', invoice.id);
  };

  const getStatusBadgeColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'void':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Factures</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Icons.spinner className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.number}</TableCell>
                    <TableCell>
                      {format(new Date(invoice.createdAt), 'PPP', { locale: fr })}
                    </TableCell>
                    <TableCell>{invoice.total.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(invoice.status)}`}>
                        {invoice.status === 'paid' && 'Payée'}
                        {invoice.status === 'sent' && 'Envoyée'}
                        {invoice.status === 'draft' && 'Brouillon'}
                        {invoice.status === 'void' && 'Annulée'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Icons.eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(invoice)}
                        >
                          <Icons.download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'void' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVoidInvoice(invoice.id)}
                          >
                            <Icons.x className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl">
              <InvoiceDetails
                invoice={selectedInvoice}
                onClose={() => setIsDialogOpen(false)}
                onDownload={downloadInvoice}
              />
            </DialogContent>
      </Dialog>
    </div>
  );
};