using Assessment.Application.DTOs.Courses;
using Assessment.Application.DTOs.Lessons;

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
}
