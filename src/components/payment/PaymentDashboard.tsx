import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { paymentService } from '@/services/paymentService';
import { Payment } from '@/types/payment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentStats } from './PaymentStats';
import { PaymentHistory } from './PaymentHistory';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Icons } from '@/components/ui/icons';

export const PaymentDashboard = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAmount: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await paymentService.getPaymentHistory();
      setPayments(data);
      
      // Calculer les statistiques
      const stats = data.reduce((acc, payment) => {
        if (payment.status === 'completed') {
          acc.totalAmount += payment.amount;
          acc.successfulPayments++;
        } else if (payment.status === 'failed') {
          acc.failedPayments++;
        } else if (payment.status === 'pending') {
          acc.pendingPayments++;
        }
        return acc;
      }, {
        totalAmount: 0,
        successfulPayments: 0,
        failedPayments: 0,
        pendingPayments: 0
      });
      
      setStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="space-y-6">
      <PaymentStats
        totalAmount={stats.totalAmount}
        successfulPayments={stats.successfulPayments}
        failedPayments={stats.failedPayments}
        pendingPayments={stats.pendingPayments}
      />

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentHistory payments={payments} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
};