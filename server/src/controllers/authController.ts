import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/UserModel';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password }: RegisterRequest = req.body;

  // Verificar si el usuario ya existe
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    res.status(400).json({
      success: false,
      message: 'El usuario ya existe con este email'
    });
    return;
  }

  // Cifrar contraseña
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Crear usuario
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role: 'user'
  });

  // Generar token JWT
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

  // Configurar cookie HttpOnly
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    path: '/'
  };

  res.cookie('token', token, cookieOptions);

  // Remover contraseña de la respuesta
  const { password: _, ...userWithoutPassword } = user;

  const response: AuthResponse = {
    user: userWithoutPassword,
    token: '' // No enviar token en el body por seguridad
  };

  res.status(201).json({
    success: true,
    data: response,
    message: 'Usuario creado exitosamente'
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginRequest = req.body;

  // Buscar usuario
  const user = await userModel.findByEmail(email);
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
    return;
  }

  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    res.status(401).json({
      success: false,
      message: 'Credenciales inválidas'
    });
    return;
  }

  // Generar token JWT
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

  // Configurar cookie HttpOnly
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    path: '/'
  };

  res.cookie('token', token, cookieOptions);

  // Remover contraseña de la respuesta
  const { password: _, ...userWithoutPassword } = user;

  const response: AuthResponse = {
    user: userWithoutPassword,
    token: '' // No enviar token en el body por seguridad
  };

  res.json({
    success: true,
    data: response,
    message: 'Login exitoso'
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Limpiar cookie HttpOnly
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  if (!userId) {
    res.status(401).json({
      success: false,
      message: 'Usuario no autenticado'
    });
    return;
  }

  const user = await userModel.findById(userId);
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'Usuario no encontrado'
    });
    return;
  }

  // Remover contraseña de la respuesta
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    success: true,
    data: userWithoutPassword
  });
});


