import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'express-validator';

// Clases de error personalizadas
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationAppError extends AppError {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Datos de entrada inválidos', 400);
    this.errors = errors;
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Error de base de datos') {
    super(message, 500);
  }
}

export class ConcurrencyError extends AppError {
  constructor(message: string = 'Conflicto de concurrencia detectado') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Límite de solicitudes excedido') {
    super(message, 429);
  }
}

// Función para logging avanzado
const logError = (error: Error, req: Request) => {
  const timestamp = new Date().toISOString();
  const requestInfo = {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as any).user?.userId || 'anonymous'
  };

  console.error(`[${timestamp}] ERROR:`, {
    message: error.message,
    stack: error.stack,
    request: requestInfo,
    type: error.constructor.name
  });
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logError(error, req);

  // Error personalizado de la aplicación
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(error instanceof ValidationAppError && { errors: error.errors }),
      timestamp: new Date().toISOString(),
      path: req.path
    });
    return;
  }

  // Error de validación de express-validator
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Datos de entrada inválidos',
      error: error.message,
      timestamp: new Date().toISOString(),
      path: req.path
    });
    return;
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
      timestamp: new Date().toISOString(),
      path: req.path
    });
    return;
  }

  // Error de JWT expirado
  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expirado',
      timestamp: new Date().toISOString(),
      path: req.path
    });
    return;
  }

  // Error de sintaxis JSON
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      success: false,
      message: 'JSON inválido en el cuerpo de la petición',
      timestamp: new Date().toISOString(),
      path: req.path
    });
    return;
  }

  // Error de límite de tamaño
  if (error.message.includes('request entity too large')) {
    res.status(413).json({
      success: false,
      message: 'Archivo o datos demasiado grandes',
      timestamp: new Date().toISOString(),
      path: req.path
    });
    return;
  }

  // Error de timeout
  if (error.message.includes('timeout')) {
    res.status(408).json({
      success: false,
      message: 'Tiempo de espera agotado',
      timestamp: new Date().toISOString(),
      path: req.path
    });
    return;
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal',
    timestamp: new Date().toISOString(),
    path: req.path
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
    path: req.path
  });
};

// Wrapper mejorado para funciones async con manejo de errores
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Función para manejo de concurrencias con retry
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error = new Error('Operación no ejecutada');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Si es un error de concurrencia y no es el último intento, reintentar
      if (error.code === 'ECONFLICT' || error.message.includes('concurrent') || error.message.includes('conflict')) {
        if (attempt < maxRetries) {
          console.warn(`Intento ${attempt} fallido, reintentando en ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          continue;
        }
      }
      
      // Si no es un error de concurrencia o es el último intento, lanzar el error
      throw error;
    }
  }
  
  throw new ConcurrencyError(`Operación fallida después de ${maxRetries} intentos: ${lastError.message}`);
};

// Función para manejo de timeouts
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new AppError('Operación timeout', 408));
      }, timeoutMs);
    })
  ]);
};

// Función para validación de concurrencia
export const checkConcurrency = (req: Request, res: Response, next: NextFunction): void => {
  const concurrentRequests = (global as any).concurrentRequests || 0;
  const maxConcurrent = parseInt(process.env.MAX_CONCURRENT_REQUESTS || '100');
  
  if (concurrentRequests >= maxConcurrent) {
    throw new RateLimitError('Servidor sobrecargado, intenta más tarde');
  }
  
  // Incrementar contador
  (global as any).concurrentRequests = concurrentRequests + 1;
  
  // Decrementar cuando termine la request
  res.on('finish', () => {
    (global as any).concurrentRequests = Math.max(0, ((global as any).concurrentRequests || 1) - 1);
  });
  
  next();
};

// Función para logging de requests
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
    
    console.log(`${statusColor} [${timestamp}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};


