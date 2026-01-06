using Assessment.Application.DTOs.Courses;
using Assessment.Application.DTOs.Lessons;
using Assessment.Application.DTOs.Dashboard;

namespace Assessment.Application.Interfaces;

public interface ICourseQueries
{
    Task<List<CourseSearchResultDto>> SearchAsync(
        string? q,
        string? status,
        int page,
        int pageSize);

    Task<CourseSummaryDto?> GetSummaryAsync(Guid courseId);

    Task<List<LessonDto>> GetLessonsByCourseAsync(Guid courseId);

    Task<List<LessonWithCourseDto>> GetAllLessonsAsync();
    Task<DashboardMetricsDto> GetDashboardMetricsAsync();
}
