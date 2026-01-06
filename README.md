# Assessment Cursos - Clean Architecture

Course and lesson management system built with Clean Architecture using .NET 8 and React.

## 🚀 Technologies

### Backend
- **.NET 8** - Main framework
- **Entity Framework Core 8** - ORM with PostgreSQL
- **ASP.NET Core Identity** - User authentication
- **JWT Bearer** - Authentication tokens
- **MediatR** - CQRS/Mediator pattern
- **FluentValidation** - Validations
- **Swagger/OpenAPI** - API documentation
- **xUnit + Moq** - Testing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **TailwindCSS** - CSS framework
- **Axios** - HTTP client
- **React Router** - Navigation

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Nginx** - Web server and reverse proxy
- **PostgreSQL** - Database

## 🐳 Running with Docker (Recommended)

The easiest way to run the application is using Docker Compose. This will start the database, backend, and frontend in isolated containers.

### Prerequisites
- Docker and Docker Compose installed

### Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/dressoasis/AssessmentCursos.git
   cd AssessmentCursos
   ```

2. **Start the services**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000/swagger](http://localhost:5000/swagger)

   > **Note:** The database will initialize automatically and migrations will be applied on startup.

4. **Stop the services**
   ```bash
   docker-compose down
   ```

## ⚙️ Local Development

If you prefer to run the services manually on your machine:

### Prerequisites
- .NET SDK 8.0
- Node.js (v18+)
- PostgreSQL running locally

### Steps

1. **Configure the database**
   Edit `src/Assessment.Api/appsettings.json` with your local connection string.

2. **Backend**
   ```bash
   cd src/Assessment.Api
   dotnet restore
   dotnet run
   ```
   The API will be available at `http://localhost:5000`.

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

## 📁 Project Structure

```
AssessmentCursos/
│
├── src/
│   ├── Assessment.Api/            ← Entry point, Controllers, Config
│   ├── Assessment.Application/    ← Use cases, DTOs, Interfaces
│   ├── Assessment.Domain/         ← Entities, Enums, Business rules
│   └── Assessment.Infrastructure/ ← DB implementation, Repositories
│
├── frontend/                      ← React + Vite application
│
├── tests/                         ← Unit and integration tests
│
├── docker-compose.yml             ← Container orchestration
└── README.md                      ← Documentation
```

## 📚 Main Features

- **Dashboard:** Metrics overview with real-time statistics (total courses, lessons, published/draft counts)
- **Course Management:** Create, edit, delete, and list courses
- **Lesson Management:** Add and organize lessons within courses
- **Global Lessons View:** View all lessons across all courses
- **Course States:**
  - `Draft`: Initial state
  - `Published`: Only possible if the course has active lessons
- **Authentication:** Registration and Login with JWT
- **Role-Based Access:** Admin/User roles

## 🧪 Tests

To run backend tests:

```bash
dotnet test
```

## 📄 License

MIT License
