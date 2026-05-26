export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'guest';
  phone?: string;
  addresses: Address[];
  giftPoints: number;
  wallet: Wallet;
  orderHistory: string[];
  wishlist: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  _id?: string;
  addressType: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  date: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    giftPoints?: number;
  };
}

// Made with Bob
