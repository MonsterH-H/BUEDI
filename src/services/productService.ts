import api from './api';
import { Product, ProductCreate, ProductUpdate } from '@/types/product';

export const productService = {
  async getAllProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: string;
  }): Promise<{ products: Product[]; total: number }> {
    const response = await api.get('/products', { params });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: ProductCreate): Promise<Product> {
    const response = await api.post('/products', data);
    return response.data;
  },

  async updateProduct(id: string, data: ProductUpdate): Promise<Product> {
    const response = await api.patch(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async uploadProductImage(id: string, file: File): Promise<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getProductCategories(): Promise<string[]> {
    const response = await api.get('/products/categories');
    return response.data;
  },

  async getRelatedProducts(id: string): Promise<Product[]> {
    const response = await api.get(`/products/${id}/related`);
    return response.data;
  }
}; 