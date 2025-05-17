import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';

interface PaymentStatsProps {
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
}

export const PaymentStats = ({
  totalAmount,
  successfulPayments,
  failedPayments,
  pendingPayments,
}: PaymentStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total des paiements</CardTitle>
          <Icons.dollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAmount.toLocaleString()} FCFA</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paiements réussis</CardTitle>
          <Icons.checkCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successfulPayments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paiements échoués</CardTitle>
          <Icons.xCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{failedPayments}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
          <Icons.clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingPayments}</div>
        </CardContent>
      </Card>
    </div>
  );
};