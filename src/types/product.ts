export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  seller: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  reviews: number;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'sold_out';
  specifications: Record<string, string>;
  tags: string[];
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  specifications: Record<string, string>;
  tags: string[];
}

export interface ProductUpdate extends Partial<ProductCreate> {
  status?: 'active' | 'inactive' | 'sold_out';
}

export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  status?: 'active' | 'inactive' | 'sold_out';
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  images?: string[];
} 