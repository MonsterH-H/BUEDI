export type PaymentMethod = 'airtel_money' | 'moov_money' | 'bank_transfer' | 'card';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
  metadata?: Record<string, string | number | boolean | null>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  description: string;
  paymentMethod?: PaymentMethod;
  status: PaymentStatus;
  clientSecret: string;
  metadata?: Record<string, string | number | boolean | null>;
  expiresAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'void';
  dueDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  metadata?: Record<string, string | number | boolean | null>;
}