import { v4 as uuidv4 } from 'uuid';
import { DataEntry } from '../types';

// Simulación de base de datos en memoria para entradas de datos
class DataEntryModel {
  private entries: DataEntry[] = [];

  async create(entryData: Omit<DataEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataEntry> {
    const entry: DataEntry = {
      id: uuidv4(),
      ...entryData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.entries.push(entry);
    return entry;
  }

  async findById(id: string): Promise<DataEntry | null> {
    return this.entries.find(entry => entry.id === id) || null;
  }

  async findByUserId(userId: string): Promise<DataEntry[]> {
    return this.entries.filter(entry => entry.userId === userId);
  }

  async update(id: string, updateData: Partial<Omit<DataEntry, 'id' | 'createdAt'>>): Promise<DataEntry | null> {
    const entryIndex = this.entries.findIndex(entry => entry.id === id);
    if (entryIndex === -1) return null;

    this.entries[entryIndex] = {
      ...this.entries[entryIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return this.entries[entryIndex];
  }

  async delete(id: string): Promise<boolean> {
    const entryIndex = this.entries.findIndex(entry => entry.id === id);
    if (entryIndex === -1) return false;

    this.entries.splice(entryIndex, 1);
    return true;
  }

  async getAll(): Promise<DataEntry[]> {
    return [...this.entries];
  }

  async getByCategory(category: string): Promise<DataEntry[]> {
    return this.entries.filter(entry => entry.category === category);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<DataEntry[]> {
    return this.entries.filter(entry => 
      entry.date >= startDate && entry.date <= endDate
    );
  }

  async count(): Promise<number> {
    return this.entries.length;
  }

  async getTotalValue(): Promise<number> {
    return this.entries.reduce((total, entry) => total + entry.value, 0);
  }

  async getAverageValue(): Promise<number> {
    if (this.entries.length === 0) return 0;
    return this.getTotalValue() / this.entries.length;
  }

  // Método para obtener datos de analítica
  async getAnalyticsData(userId?: string): Promise<any> {
    const userEntries = userId ? 
      this.entries.filter(entry => entry.userId === userId) : 
      this.entries;

    if (userEntries.length === 0) {
      return {
        totalEntries: 0,
        totalValue: 0,
        averageValue: 0,
        categoryBreakdown: [],
        monthlyTrend: []
      };
    }

    // Agrupar por categoría
    const categoryMap = new Map<string, { count: number; totalValue: number }>();
    userEntries.forEach(entry => {
      const existing = categoryMap.get(entry.category) || { count: 0, totalValue: 0 };
      categoryMap.set(entry.category, {
        count: existing.count + 1,
        totalValue: existing.totalValue + entry.value
      });
    });

    const totalValue = userEntries.reduce((sum, entry) => sum + entry.value, 0);
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      totalValue: data.totalValue,
      percentage: (data.totalValue / totalValue) * 100
    }));

    // Agrupar por mes
    const monthlyMap = new Map<string, { count: number; value: number }>();
    userEntries.forEach(entry => {
      const monthKey = entry.date.toISOString().substring(0, 7); // YYYY-MM
      const existing = monthlyMap.get(monthKey) || { count: 0, value: 0 };
      monthlyMap.set(monthKey, {
        count: existing.count + 1,
        value: existing.value + entry.value
      });
    });

    const monthlyTrend = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      count: data.count,
      value: data.value
    })).sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalEntries: userEntries.length,
      totalValue,
      averageValue: totalValue / userEntries.length,
      categoryBreakdown,
      monthlyTrend
    };
  }
}

export const dataEntryModel = new DataEntryModel();


