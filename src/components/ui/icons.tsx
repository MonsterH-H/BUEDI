import {
  CreditCard,
  Building2,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  X,
  Loader2,
} from 'lucide-react';
import { SVGProps } from 'react';

export const Icons = {
  card: CreditCard,
  bank: Building2,
  dollar: DollarSign,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  clock: Clock,
  download: Download,
  eye: Eye,
  x: X,
  spinner: Loader2,
  dollarSign: DollarSign,
  // Icônes personnalisées pour les opérateurs mobiles
  airtel: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="currentColor"
      />
      <path
        d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
        fill="currentColor"
      />
    </svg>
  ),
  moov: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="currentColor"
      />
      <path
        d="M12 6v12M8 12h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};