export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface DataEntry {
  id: string;
  category: string;
  value: number;
  date: Date;
  description: string;
  userId: string;
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

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface DataEntryFormData {
  category: string;
  value: number;
  description: string;
  date: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}


