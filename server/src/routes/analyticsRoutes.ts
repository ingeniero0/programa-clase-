import { Router } from 'express';
import { getAnalytics, getGlobalAnalytics } from '../controllers/analyticsController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Analíticas del usuario actual
router.get('/', getAnalytics);

// Analíticas globales (solo administradores)
router.get('/global', requireRole(['admin']), getGlobalAnalytics);

export { router as analyticsRoutes };


