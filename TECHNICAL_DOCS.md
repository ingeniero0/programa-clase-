# Documentación Técnica - Plataforma de Analítica de Datos

## Arquitectura del Sistema

### Frontend (Cliente React)
- **Framework**: React 18 con TypeScript 5
- **UI Framework**: Bootstrap 5
- **Gráficos**: Chart.js con react-chartjs-2
- **Routing**: React Router v6
- **Estado**: Context API para autenticación
- **Formularios**: React Hook Form con validación Yup
- **HTTP Client**: Axios con interceptores
- **Notificaciones**: React Toastify

### Backend (Servidor Node.js)
- **Runtime**: Node.js con TypeScript
- **Framework**: Express.js
- **Autenticación**: JWT con bcryptjs para cifrado
- **Validación**: Express Validator
- **Seguridad**: Helmet, CORS, Rate Limiting
- **Manejo de Errores**: Middleware personalizado

## Características Implementadas

### ✅ Autenticación y Seguridad
- Registro de usuarios con validación
- Login con JWT y cifrado de contraseñas
- Middleware de autenticación
- Rate limiting para prevenir ataques
- Validación de entrada en todas las rutas

### ✅ Interfaz de Usuario
- Diseño responsive con Bootstrap 5
- Navbar dinámico con menú contextual
- Footer informativo
- Cards con efectos hover
- Gradientes y animaciones CSS

### ✅ Dashboard y Analíticas
- Métricas principales (total, promedio, categorías)
- Gráficos interactivos (barras, líneas, dona, dispersión)
- Visualizaciones por categoría y tiempo
- Tabla detallada con progreso visual

### ✅ Gestión de Datos
- CRUD completo para entradas de datos
- Formularios con validación en tiempo real
- Modal para edición inline
- Confirmación de eliminación

### ✅ Manejo de Excepciones
- Try-catch en todas las operaciones async
- Middleware de manejo de errores global
- Validación de entrada con mensajes descriptivos
- Interceptores de Axios para errores HTTP

### ✅ Concurrencias
- Rate limiting para prevenir spam
- Validación de permisos por usuario
- Manejo seguro de tokens JWT
- Prevención de acceso no autorizado

## Estructura de Archivos

```
data-analytics-platform/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── contexts/      # Context API
│   │   ├── services/      # Servicios API
│   │   ├── types/         # Tipos TypeScript
│   │   └── utils/         # Utilidades
│   └── public/            # Archivos estáticos
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores de rutas
│   │   ├── middleware/    # Middleware personalizado
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Definición de rutas
│   │   └── types/         # Tipos TypeScript
│   └── uploads/           # Archivos subidos
└── docs/                  # Documentación
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/auth/me` - Usuario actual

### Datos
- `GET /api/data` - Obtener entradas del usuario
- `POST /api/data` - Crear nueva entrada
- `PUT /api/data/:id` - Actualizar entrada
- `DELETE /api/data/:id` - Eliminar entrada

### Analíticas
- `GET /api/analytics` - Analíticas del usuario
- `GET /api/analytics/global` - Analíticas globales (admin)

## Tecnologías Utilizadas

### Frontend
- React 18.2.0
- TypeScript 4.9.5
- Bootstrap 5.3.2
- Chart.js 4.4.0
- React Router 6.20.1
- Axios 1.6.2
- React Hook Form 7.48.2
- Yup 1.3.3
- React Toastify 9.1.3

### Backend
- Node.js
- Express 4.18.2
- TypeScript 5.3.3
- bcryptjs 2.4.3
- jsonwebtoken 9.0.2
- cors 2.8.5
- helmet 7.1.0
- express-rate-limit 7.1.5
- express-validator 7.0.1
- uuid 9.0.1

## Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd data-analytics-platform
```

2. **Instalar dependencias**
```bash
npm run install-all
```

3. **Configurar variables de entorno**
```bash
# Copiar archivos de ejemplo
cp server/env.example server/.env
cp client/env.example client/.env

# Editar las variables según sea necesario
```

4. **Iniciar en modo desarrollo**
```bash
npm run dev
```

### Variables de Entorno

#### Servidor (.env)
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=tu_jwt_secret_super_seguro
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

#### Cliente (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

## Scripts Disponibles

### Scripts Principales
- `npm run dev` - Inicia cliente y servidor en modo desarrollo
- `npm run install-all` - Instala todas las dependencias
- `npm run build` - Construye el cliente para producción

### Scripts del Cliente
- `npm run start` - Inicia el cliente React
- `npm run build` - Construye para producción
- `npm run test` - Ejecuta tests

### Scripts del Servidor
- `npm run dev` - Inicia servidor en modo desarrollo
- `npm run build` - Compila TypeScript
- `npm start` - Inicia servidor en producción

## Despliegue

### Desarrollo Local
1. Ejecutar `npm run dev`
2. Cliente disponible en http://localhost:3000
3. API disponible en http://localhost:5000/api

### Producción
1. Ejecutar `npm run build` para compilar cliente
2. Compilar servidor con `cd server && npm run build`
3. Configurar variables de entorno de producción
4. Iniciar servidor con `npm start`

## Seguridad

### Implementadas
- Cifrado de contraseñas con bcryptjs
- Tokens JWT con expiración
- Rate limiting para prevenir ataques
- Validación de entrada en todas las rutas
- Headers de seguridad con Helmet
- CORS configurado correctamente

### Recomendaciones para Producción
- Usar HTTPS
- Configurar JWT_SECRET seguro
- Implementar base de datos real
- Configurar logs de seguridad
- Implementar backup de datos

## Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.


