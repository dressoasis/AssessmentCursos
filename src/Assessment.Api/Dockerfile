# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY AssessmentCursos.sln .
COPY src/Assessment.Domain/Assessment.Domain.csproj src/Assessment.Domain/
COPY src/Assessment.Application/Assessment.Application.csproj src/Assessment.Application/
COPY src/Assessment.Infrastructure/Assessment.Infrastructure.csproj src/Assessment.Infrastructure/
COPY src/Assessment.Api/Assessment.Api.csproj src/Assessment.Api/

# Restore dependencies
RUN dotnet restore

# Copy source code
COPY src/ src/

# Build and publish
WORKDIR /src/src/Assessment.Api
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "Assessment.Api.dll"]
