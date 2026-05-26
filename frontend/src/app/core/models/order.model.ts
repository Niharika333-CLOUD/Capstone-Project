import { Product } from './product.model';
import { Address } from './user.model';

export interface Order {
  _id: string;
  user: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentInfo: PaymentInfo;
  pricing: OrderPricing;
  coupon?: Coupon;
  orderStatus: OrderStatus;
  statusHistory: StatusHistory[];
  shipping: ShippingInfo;
  cancellation?: Cancellation;
  return?: ReturnInfo;
  giftPointsEarned: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: Product | string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface PaymentInfo {
  method: 'card' | 'wallet' | 'cod' | 'upi';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: Date;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  giftPointsUsed: number;
  total: number;
}

export interface Coupon {
  code: string;
  discount: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'returned';

export interface StatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface ShippingInfo {
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: {
    min: Date;
    max: Date;
  };
  actualDelivery?: Date;
  shippingRate?: number;
}

export interface Cancellation {
  isCancelled: boolean;
  cancelledAt?: Date;
  reason?: string;
  cancelledBy?: 'customer' | 'admin';
}

export interface ReturnInfo {
  isReturned: boolean;
  returnedAt?: Date;
  reason?: string;
  status?: 'requested' | 'approved' | 'rejected' | 'completed';
}

export interface CreateOrderRequest {
  shippingAddress: Address;
  paymentMethod: 'card' | 'wallet' | 'cod' | 'upi';
  useGiftPoints?: number;
  couponCode?: string;
}

export interface PaymentRequest {
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
  nameOnCard?: string;
}

// Made with Bob
