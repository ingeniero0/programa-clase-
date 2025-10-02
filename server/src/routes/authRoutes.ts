import { Router } from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Rutas públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Rutas protegidas
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getCurrentUser);

export { router as authRoutes };


