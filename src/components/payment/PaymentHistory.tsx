import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Payment } from '@/types/payment';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

interface PaymentHistoryProps {
  payments: Payment[];
  loading: boolean;
}

export const PaymentHistory = ({ payments, loading }: PaymentHistoryProps) => {
  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPaymentMethodIcon = (method: Payment['method']) => {
    switch (method) {
      case 'airtel_money':
        return <Icons.airtel className="h-4 w-4" />;
      case 'moov_money':
        return <Icons.moov className="h-4 w-4" />;
      case 'bank_transfer':
        return <Icons.bank className="h-4 w-4" />;
      case 'card':
        return <Icons.card className="h-4 w-4" />;
      default:
        return <Icons.dollar className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'failed':
        return 'Échoué';
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'refunded':
        return 'Remboursé';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {format(new Date(payment.createdAt), 'PPP', { locale: fr })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(payment.method)}
                    <span>
                      {payment.method === 'airtel_money' && 'Airtel Money'}
                      {payment.method === 'moov_money' && 'Moov Money'}
                      {payment.method === 'bank_transfer' && 'Virement bancaire'}
                      {payment.method === 'card' && 'Carte bancaire'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{payment.description}</TableCell>
                <TableCell>{payment.amount.toLocaleString()} FCFA</TableCell>
                <TableCell>
                  <span className={getStatusColor(payment.status)}>
                    {getStatusText(payment.status)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};