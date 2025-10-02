# Guía de Inicio Rápido

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/data-analytics-platform.git
cd data-analytics-platform
```

2. **Instalar dependencias**
```bash
npm run install-all
```

3. **Configurar variables de entorno**
```bash
# Servidor
cp server/env.example server/.env

# Cliente  
cp client/env.example client/.env
```

4. **Iniciar la aplicación**
```bash
npm run dev
```

## 🌐 Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 👤 Usuario de Prueba

Puedes crear una cuenta nueva desde la página de registro o usar estas credenciales de prueba:

- **Email**: test@example.com
- **Contraseña**: password123

## 📊 Características

- ✅ Dashboard interactivo con gráficos
- ✅ Sistema de autenticación seguro
- ✅ Formularios para ingreso de datos
- ✅ Análisis y visualizaciones
- ✅ Diseño responsive con Bootstrap
- ✅ API REST con Node.js y Express

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript 5, Bootstrap 5, Chart.js
- **Backend**: Node.js, Express.js, TypeScript, JWT, bcryptjs
- **Base de Datos**: Memoria (para desarrollo)

## 📚 Documentación

- [README.md](README.md) - Documentación principal
- [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Documentación técnica detallada

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.


