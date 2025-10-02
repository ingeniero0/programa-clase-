import { Request, Response } from 'express';
import { dataEntryModel } from '../models/DataEntryModel';
import { DataEntryRequest } from '../types';
import { asyncHandler, withRetry, withTimeout, AppError, DatabaseError, ConcurrencyError } from './errorHandler';

export const getDataEntries = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    throw new AppError('Usuario no autenticado', 401);
  }

  try {
    const entries = await withTimeout(
      withRetry(() => dataEntryModel.findByUserId(userId)),
      10000 // 10 segundos timeout
    );
    
    res.json({
      success: true,
      data: entries,
      timestamp: new Date().toISOString(),
      count: entries.length
    });
  } catch (error: any) {
    if (error.message.includes('timeout')) {
      throw new AppError('Tiempo de espera agotado al obtener datos', 408);
    }
    throw new DatabaseError('Error al obtener entradas de datos');
  }
});

export const createDataEntry = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    throw new AppError('Usuario no autenticado', 401);
  }

  const { category, value, description, date, priority, tags }: DataEntryRequest = req.body;

  // Validaciones adicionales
  if (!category || !value || !description || !date) {
    throw new AppError('Faltan campos requeridos', 400);
  }

  if (typeof value !== 'number' || value <= 0) {
    throw new AppError('El valor debe ser un número positivo', 400);
  }

  if (description.length < 10) {
    throw new AppError('La descripción debe tener al menos 10 caracteres', 400);
  }

  try {
    const entry = await withTimeout(
      withRetry(() => dataEntryModel.create({
        category,
        value: parseFloat(value.toString()),
        description,
        date: new Date(date),
        userId,
        priority: priority || 'medium',
        tags: tags || ''
      })),
      15000 // 15 segundos timeout
    );

    res.status(201).json({
      success: true,
      data: entry,
      message: 'Entrada creada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    if (error.message.includes('concurrent') || error.message.includes('conflict')) {
      throw new ConcurrencyError('Conflicto de concurrencia al crear entrada');
    }
    if (error.message.includes('timeout')) {
      throw new AppError('Tiempo de espera agotado al crear entrada', 408);
    }
    throw new DatabaseError('Error al crear entrada de datos');
  }
});

export const updateDataEntry = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const entryId = req.params.id;
  
  if (!userId) {
    throw new AppError('Usuario no autenticado', 401);
  }

  if (!entryId) {
    throw new AppError('ID de entrada requerido', 400);
  }

  try {
    // Verificar que la entrada pertenece al usuario con retry
    const existingEntry = await withRetry(() => dataEntryModel.findById(entryId));
    
    if (!existingEntry) {
      throw new AppError('Entrada no encontrada', 404);
    }

    if (existingEntry.userId !== userId) {
      throw new AppError('No tienes permisos para modificar esta entrada', 403);
    }

    const updateData: Partial<DataEntryRequest> = req.body;
    
    // Validaciones de datos de actualización
    if (updateData.value !== undefined && (typeof updateData.value !== 'number' || updateData.value <= 0)) {
      throw new AppError('El valor debe ser un número positivo', 400);
    }

    if (updateData.description !== undefined && updateData.description.length < 10) {
      throw new AppError('La descripción debe tener al menos 10 caracteres', 400);
    }

    const updatedEntry = await withTimeout(
      withRetry(() => dataEntryModel.update(entryId, {
        ...updateData,
        value: updateData.value ? parseFloat(updateData.value.toString()) : undefined,
        date: updateData.date ? new Date(updateData.date) : undefined
      })),
      15000
    );

    res.json({
      success: true,
      data: updatedEntry,
      message: 'Entrada actualizada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error.message.includes('concurrent') || error.message.includes('conflict')) {
      throw new ConcurrencyError('Conflicto de concurrencia al actualizar entrada');
    }
    if (error.message.includes('timeout')) {
      throw new AppError('Tiempo de espera agotado al actualizar entrada', 408);
    }
    throw new DatabaseError('Error al actualizar entrada de datos');
  }
});

export const deleteDataEntry = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const entryId = req.params.id;
  
  if (!userId) {
    throw new AppError('Usuario no autenticado', 401);
  }

  if (!entryId) {
    throw new AppError('ID de entrada requerido', 400);
  }

  try {
    // Verificar que la entrada pertenece al usuario con retry
    const existingEntry = await withRetry(() => dataEntryModel.findById(entryId));
    
    if (!existingEntry) {
      throw new AppError('Entrada no encontrada', 404);
    }

    if (existingEntry.userId !== userId) {
      throw new AppError('No tienes permisos para eliminar esta entrada', 403);
    }

    const deleted = await withTimeout(
      withRetry(() => dataEntryModel.delete(entryId)),
      10000
    );

    if (!deleted) {
      throw new DatabaseError('Error al eliminar la entrada');
    }

    res.json({
      success: true,
      message: 'Entrada eliminada exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }
    if (error.message.includes('concurrent') || error.message.includes('conflict')) {
      throw new ConcurrencyError('Conflicto de concurrencia al eliminar entrada');
    }
    if (error.message.includes('timeout')) {
      throw new AppError('Tiempo de espera agotado al eliminar entrada', 408);
    }
    throw new DatabaseError('Error al eliminar entrada de datos');
  }
});


