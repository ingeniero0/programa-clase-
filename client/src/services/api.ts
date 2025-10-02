import axios, { AxiosResponse } from 'axios';
import { LoginFormData, RegisterFormData, User, ApiResponse, DataEntry, AnalyticsData, DataEntryFormData } from '../types/index.ts';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies
});

// Las cookies se envían automáticamente con withCredentials: true

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginFormData): Promise<{ user: User; token: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
        await api.post('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error en el login');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  },

  async register(userData: RegisterFormData): Promise<{ user: User; token: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
        await api.post('/auth/register', userData);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error en el registro');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = 
        await api.get('/auth/me');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al obtener usuario');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error: any) {
      // Incluso si hay error, consideramos el logout exitoso
      console.warn('Error durante logout:', error);
    }
  }
};

export const dataService = {
  async getDataEntries(): Promise<DataEntry[]> {
    try {
      const response: AxiosResponse<ApiResponse<DataEntry[]>> = 
        await api.get('/data');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al obtener datos');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  },

  async createDataEntry(data: DataEntryFormData): Promise<DataEntry> {
    try {
      const response: AxiosResponse<ApiResponse<DataEntry>> = 
        await api.post('/data', data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al crear entrada');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  },

  async updateDataEntry(id: string, data: Partial<DataEntryFormData>): Promise<DataEntry> {
    try {
      const response: AxiosResponse<ApiResponse<DataEntry>> = 
        await api.put(`/data/${id}`, data);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al actualizar entrada');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  },

  async deleteDataEntry(id: string): Promise<void> {
    try {
      const response: AxiosResponse<ApiResponse<void>> = 
        await api.delete(`/data/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al eliminar entrada');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  },

  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response: AxiosResponse<ApiResponse<AnalyticsData>> = 
        await api.get('/analytics');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al obtener analíticas');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
  }
};


