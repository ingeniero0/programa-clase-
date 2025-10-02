export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface DataEntry {
  id: string;
  category: string;
  value: number;
  date: Date;
  description: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsData {
  totalEntries: number;
  totalValue: number;
  averageValue: number;
  categoryBreakdown: CategoryData[];
  monthlyTrend: MonthlyData[];
}

export interface CategoryData {
  category: string;
  count: number;
  totalValue: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  value: number;
  count: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DataEntryRequest {
  category: string;
  value: number;
  description: string;
  date: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}


