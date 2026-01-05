# Assessment Cursos - Clean Architecture

Sistema de gestión de cursos y lecciones desarrollado con Clean Architecture en .NET 8.

## 📁 Estructura del Proyecto

```
AssessmentCursos/
│
├── src/
│   ├── Assessment.Api/            ← ASP.NET API (Controllers, JWT, Auth)
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── CoursesController.cs
│   │   │   └── LessonsController.cs
│   │   ├── Middleware/
│   │   ├── Services/
│   │   └── Program.cs
│   │
│   ├── Assessment.Application/    ← Casos de uso + reglas de negocio
│   │   ├── Common/
│   │   │   ├── Behaviors/
│   │   │   ├── Exceptions/
│   │   │   ├── Interfaces/
│   │   │   ├── Mappings/
│   │   │   └── Models/
│   │   └── Features/
│   │       ├── Courses/
│   │       └── Lessons/
│   │
│   ├── Assessment.Domain/         ← Entidades + Enums (puras)
│   │   ├── Entities/
│   │   │   ├── BaseEntity.cs
│   │   │   ├── Course.cs
│   │   │   └── Lesson.cs
│   │   └── Enums/
│   │       └── CourseStatus.cs
│   │
│   └── Assessment.Infrastructure/ ← EF Core, Identity, Repositorios
│       ├── Identity/
│       ├── Persistence/
│       │   └── Configurations/
│       └── Repositories/
│
├── tests/
│   └── Assessment.Application.Tests/
│
└── frontend/
```

## 📊 Modelo de Dominio

### Entidades

#### Course
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | GUID | Identificador único |
| Title | string | Título del curso |
| Status | CourseStatus | Estado (Draft, Published) |
| IsDeleted | bool | Soft delete flag |
| CreatedAt | DateTime | Fecha de creación |
| UpdatedAt | DateTime | Fecha de actualización |

#### Lesson
| Campo | Tipo | Descripción |
|-------|------|-------------|
| Id | GUID | Identificador único |
| CourseId | GUID | FK al curso |
| Title | string | Título de la lección |
| Order | int | Orden de la lección |
| IsDeleted | bool | Soft delete flag |
| CreatedAt | DateTime | Fecha de creación |
| UpdatedAt | DateTime | Fecha de actualización |

### Enums

#### CourseStatus
- `Draft` (0) - Borrador
- `Published` (1) - Publicado

### Relaciones
- Un **Course** puede tener muchas **Lessons**
- Una **Lesson** pertenece a un solo **Course**

## 🚀 Tecnologías

- **.NET 8** - Framework principal
- **Entity Framework Core 8** - ORM con PostgreSQL
- **ASP.NET Core Identity** - Autenticación de usuarios
- **JWT Bearer** - Tokens de autenticación
- **MediatR** - Patrón CQRS/Mediator
- **FluentValidation** - Validaciones
- **Swagger/OpenAPI** - Documentación de API
- **xUnit + Moq** - Testing

## ⚙️ Configuración

1. **Configurar la base de datos**
   
   Editar `src/Assessment.Api/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=assessment_db;Username=postgres;Password=tu_password"
     }
   }
   ```

2. **Ejecutar migraciones**
   ```bash
   cd src/Assessment.Api
   dotnet ef migrations add InitialCreate --project ../Assessment.Infrastructure
   dotnet ef database update
   ```

3. **Ejecutar la API (Backend)**
   ```bash
   cd src/Assessment.Api
   dotnet run
   ```
   La API estará disponible en `http://localhost:5000`.

4. **Ejecutar el Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`.

## 📚 API Endpoints

### Auth
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Registro de usuario | No |
| POST | /api/auth/login | Inicio de sesión | No |

### Courses
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/courses | Listar courses (paginado, filtros) | No |
| GET | /api/courses/{id} | Obtener course | No |
| GET | /api/courses/{id}/summary | Obtener resumen de course | Sí |
| POST | /api/courses | Crear course | Sí |
| PUT | /api/courses/{id} | Actualizar course | Sí |
| DELETE | /api/courses/{id} | Eliminar course | Sí |
| PATCH | /api/courses/{id}/publish | Publicar course | Sí |
| PATCH | /api/courses/{id}/unpublish | Despublicar course | Sí |

### Lessons
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | /api/lessons/course/{courseId} | Listar lessons | No |
| POST | /api/lessons | Crear lesson | Sí |
| DELETE | /api/lessons/{id} | Eliminar lesson | Sí |

## 🧪 Tests

```bash
dotnet test
```

## 🐳 Docker

```bash
docker-compose up -d
```

## 📄 Licencia

MIT License
