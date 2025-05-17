import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Invoice } from '@/types/payment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onClose: () => void;
  onDownload: (invoice: Invoice) => void;
}

export const InvoiceDetails = ({ invoice, onClose, onDownload }: InvoiceDetailsProps) => {
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'sent':
        return 'text-blue-600';
      case 'void':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Facture #{invoice.number}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(invoice)}
            >
              <Icons.download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <Icons.x className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Date de création</h4>
              <p>{format(new Date(invoice.createdAt), 'PPP', { locale: fr })}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Date d'échéance</h4>
              <p>{format(new Date(invoice.dueDate), 'PPP', { locale: fr })}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Statut</h4>
              <p className={getStatusColor(invoice.status)}>
                {invoice.status === 'paid' && 'Payée'}
                {invoice.status === 'sent' && 'Envoyée'}
                {invoice.status === 'draft' && 'Brouillon'}
                {invoice.status === 'void' && 'Annulée'}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">ID Client</h4>
              <p>{invoice.customerId}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Articles</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {item.unitPrice.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                      {item.total.toLocaleString()} FCFA
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Sous-total
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.subtotal.toLocaleString()} FCFA
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    TVA
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice.tax.toLocaleString()} FCFA
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {invoice.total.toLocaleString()} FCFA
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {invoice.notes && (
            <div>
              <h4 className="font-medium mb-1">Notes</h4>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};