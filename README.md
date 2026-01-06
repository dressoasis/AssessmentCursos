# Assessment Cursos - Clean Architecture

Sistema de gestión de cursos y lecciones desarrollado con Clean Architecture en .NET 8 y React.

## 🚀 Tecnologías

### Backend
- **.NET 8** - Framework principal
- **Entity Framework Core 8** - ORM con PostgreSQL
- **ASP.NET Core Identity** - Autenticación de usuarios
- **JWT Bearer** - Tokens de autenticación
- **MediatR** - Patrón CQRS/Mediator
- **FluentValidation** - Validaciones
- **Swagger/OpenAPI** - Documentación de API
- **xUnit + Moq** - Testing

### Frontend
- **React** - Librería de UI
- **Vite** - Build tool
- **TailwindCSS** - Framework de estilos
- **Axios** - Cliente HTTP
- **React Router** - Navegación

### Infraestructura
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación
- **Nginx** - Servidor web y proxy inverso
- **PostgreSQL** - Base de datos

## 🐳 Ejecución con Docker (Recomendado)

La forma más sencilla de ejecutar la aplicación es utilizando Docker Compose. Esto levantará la base de datos, el backend y el frontend en contenedores aislados.

### Prerrequisitos
- Docker y Docker Compose instalados.

### Instrucciones
1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/dressoasis/AssessmentCursos.git
   cd AssessmentCursos
   ```

2. **Iniciar los servicios**
   ```bash
   docker-compose up --build -d
   ```

3. **Acceder a la aplicación**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000/swagger](http://localhost:5000/swagger) (accesible internamente en el puerto 8080)

   > **Nota:** La base de datos se inicializará automáticamente y se aplicarán las migraciones al inicio.

4. **Detener los servicios**
   ```bash
   docker-compose down
   ```

## ⚙️ Ejecución Local (Desarrollo)

Si prefieres ejecutar los servicios manualmente en tu máquina:

### Prerrequisitos
- .NET SDK 8.0
- Node.js (v18+)
- PostgreSQL corriendo localmente

### Pasos

1. **Configurar la base de datos**
   Editar `src/Assessment.Api/appsettings.json` con tu cadena de conexión local.

2. **Backend**
   ```bash
   cd src/Assessment.Api
   dotnet restore
   dotnet run
   ```
   La API estará en `http://localhost:5000`.

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   El frontend estará en `http://localhost:5173`.

## 📁 Estructura del Proyecto

```
AssessmentCursos/
│
├── src/
│   ├── Assessment.Api/            ← Entry point, Controllers, Config
│   ├── Assessment.Application/    ← Casos de uso, DTOs, Interfaces
│   ├── Assessment.Domain/         ← Entidades, Enums, Reglas de negocio
│   └── Assessment.Infrastructure/ ← Implementación de DB, Repositorios
│
├── frontend/                      ← Aplicación React + Vite
│
├── tests/                         ← Pruebas unitarias e integración
│
├── docker-compose.yml             ← Orquestación de contenedores
└── README.md                      ← Documentación
```

## 📚 Funcionalidades Principales

- **Gestión de Cursos:** Crear, editar, eliminar y listar cursos.
- **Gestión de Lecciones:** Agregar lecciones a los cursos.
- **Estados del Curso:**
  - `Draft`: Estado inicial.
  - `Published`: Solo posible si el curso tiene lecciones activas.
- **Autenticación:** Registro y Login con JWT.
- **Roles:** Sistema de roles (Admin/User).

## 🧪 Tests

Para ejecutar las pruebas del backend:

```bash
dotnet test
```

## 📄 Licencia

MIT License
