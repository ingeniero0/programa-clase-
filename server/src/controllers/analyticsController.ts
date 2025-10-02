import { Request, Response } from 'express';
import { dataEntryModel } from '../models/DataEntryModel';
import { asyncHandler } from './errorHandler';

export const getAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
    return;
  }

  const analyticsData = await dataEntryModel.getAnalyticsData(userId);
  
  res.json({
    success: true,
    data: analyticsData
  });
});

export const getGlobalAnalytics = asyncHandler(async (req: Request, res: Response) => {
  // Solo administradores pueden ver analíticas globales
  const userRole = req.user?.role;
  
  if (userRole !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'Permisos insuficientes para ver analíticas globales'
    });
    return;
  }

  const analyticsData = await dataEntryModel.getAnalyticsData();
  
  res.json({
    success: true,
    data: analyticsData
  });
});


