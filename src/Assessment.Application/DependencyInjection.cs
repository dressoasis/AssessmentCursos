using Microsoft.Extensions.DependencyInjection;
using Assessment.Application.UseCases.Courses;
using Assessment.Application.UseCases.Lessons;

namespace Assessment.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Courses Use Cases
        services.AddScoped<CreateCourse>();
        services.AddScoped<PublishCourse>();
        services.AddScoped<UnpublishCourse>();
        services.AddScoped<DeleteCourse>();
        services.AddScoped<HardDeleteCourse>();
        services.AddScoped<UpdateCourse>();

        // Lessons Use Cases
        services.AddScoped<CreateLesson>();
        services.AddScoped<UpdateLesson>();
        services.AddScoped<DeleteLesson>();
        services.AddScoped<ReorderLessons>();

        return services;
    }
}
