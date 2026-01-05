using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Assessment.Application.Interfaces;
using Assessment.Infrastructure.Identity;
using Assessment.Infrastructure.Persistence;
using Assessment.Infrastructure.Queries;
using Assessment.Infrastructure.Repositories;

namespace Assessment.Infrastructure;

/// <summary>
/// Extensión para registrar servicios de Infrastructure.
/// </summary>
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // DbContext
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Identity
        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 8;
            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        // Repositories
        services.AddScoped<ICoursesRepository, CoursesRepository>();
        services.AddScoped<ILessonsRepository, LessonsRepository>();

        // Queries
        services.AddScoped<ICourseQueries, CourseQueries>();

        // Services
        services.AddScoped<IJwtService, JwtService>();

        return services;
    }
}
