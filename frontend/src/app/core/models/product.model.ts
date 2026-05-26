export interface Product {
  _id: string;
  title: string;
  description: string;
  author: string;
  isbn?: string;
  category: Category | string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: ProductImage[];
  ratings: ProductRatings;
  reviews: ProductReview[];
  specifications: ProductSpecifications;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  deliveryTime: DeliveryTime;
  relatedProducts: Product[] | string[];
  upSaleProducts: Product[] | string[];
  crossSaleProducts: Product[] | string[];
  viewCount: number;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductRatings {
  average: number;
  count: number;
}

export interface ProductReview {
  _id?: string;
  user: string | { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface ProductSpecifications {
  pages?: number;
  language?: string;
  publisher?: string;
  publicationDate?: Date;
  dimensions?: string;
  weight?: string;
}

export interface DeliveryTime {
  min: number;
  max: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: ProductImage;
  parent?: string;
  isActive: boolean;
  order: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}

// Made with Bob
