# Plataforma de Analítica de Datos

Una aplicación web moderna para análisis de datos construida con React, TypeScript, Node.js y Express.

## Características

- 🎨 **Interfaz moderna** con Bootstrap 5
- 🔐 **Sistema de autenticación** seguro con cifrado
- 📊 **Dashboard de analítica** con gráficos interactivos
- 📝 **Formularios dinámicos** para ingreso de datos
- 🚀 **Backend robusto** con Node.js y Express
- ⚡ **Manejo de excepciones** y concurrencias
- 📱 **Responsive design** para todos los dispositivos

## Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript 5
- Bootstrap 5
- Chart.js
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- bcryptjs (cifrado)
- jsonwebtoken
- cors
- helmet

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/data-analytics-platform.git
cd data-analytics-platform
```

2. Instala todas las dependencias:
```bash
npm run install-all
```

3. Inicia la aplicación en modo desarrollo:
```bash
npm run dev
```

## Estructura del Proyecto

```
data-analytics-platform/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── services/      # Servicios API
│   │   ├── utils/         # Utilidades
│   │   └── types/         # Tipos TypeScript
│   └── public/            # Archivos estáticos
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Controladores
│   │   ├── middleware/    # Middleware
│   │   ├── models/        # Modelos de datos
│   │   ├── routes/        # Rutas API
│   │   └── utils/         # Utilidades
│   └── uploads/           # Archivos subidos
└── docs/                  # Documentación
```

## Uso

1. **Registro/Login**: Crea una cuenta o inicia sesión
2. **Dashboard**: Visualiza métricas y gráficos
3. **Ingreso de Datos**: Usa los formularios para agregar información
4. **Análisis**: Explora los datos con las herramientas de visualización

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.


