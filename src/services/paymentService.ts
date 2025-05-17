import api from './api';
import { Payment, PaymentIntent, Invoice, PaymentMethod } from '@/types/payment';

export const paymentService = {
  // Créer une intention de paiement
  async createPaymentIntent(amount: number, currency: string, description: string): Promise<PaymentIntent> {
    try {
      const response = await api.post('/payments/intent', { amount, currency, description });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la création de l\'intention de paiement');
    }
  },

  // Confirmer un paiement
  async confirmPayment(paymentIntentId: string, paymentMethod: PaymentMethod): Promise<Payment> {
    try {
      const response = await api.post(`/payments/confirm/${paymentIntentId}`, { paymentMethod });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la confirmation du paiement');
    }
  },

  // Récupérer un paiement
  async getPayment(paymentId: string): Promise<Payment> {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération du paiement');
    }
  },

  // Créer une facture
  async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    try {
      const response = await api.post('/invoices', invoice);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la création de la facture');
    }
  },

  // Récupérer une facture
  async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const response = await api.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de la facture');
    }
  },

  // Mettre à jour une facture
  async updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<Invoice> {
    try {
      const response = await api.patch(`/invoices/${invoiceId}`, updates);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour de la facture');
    }
  },

  // Annuler une facture
  async voidInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const response = await api.post(`/invoices/${invoiceId}/void`);
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de l\'annulation de la facture');
    }
  },

  // Rembourser un paiement
  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, { amount });
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors du remboursement');
    }
  },

  // Récupérer l'historique des paiements
  async getPaymentHistory(): Promise<Payment[]> {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'historique des paiements');
    }
  },

  // Récupérer l'historique des factures
  async getInvoiceHistory(): Promise<Invoice[]> {
    try {
      const response = await api.get('/invoices/history');
      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'historique des factures');
    }
  }
};