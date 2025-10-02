import { Router } from 'express';
import { 
  getDataEntries, 
  createDataEntry, 
  updateDataEntry, 
  deleteDataEntry 
} from '../controllers/dataController';
import { validateDataEntry } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD para entradas de datos
router.get('/', getDataEntries);
router.post('/', validateDataEntry, createDataEntry);
router.put('/:id', validateDataEntry, updateDataEntry);
router.delete('/:id', deleteDataEntry);

export { router as dataRoutes };


