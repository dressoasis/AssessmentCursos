using Assessment.Application.DTOs.Courses;
using Assessment.Application.DTOs.Lessons;
using Assessment.Application.DTOs.Dashboard;
using Assessment.Application.Interfaces;
using Assessment.Domain.Enums;
using Assessment.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Assessment.Infrastructure.Queries;

public class CourseQueries : ICourseQueries
{
    private readonly AppDbContext _context;

    public CourseQueries(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CourseSearchResultDto>> SearchAsync(
        string? q,
        string? status,
        int page,
        int pageSize)
    {
        var query = _context.Courses.AsQueryable();

        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(c => c.Title.ToLower().Contains(q.ToLower()));

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<Assessment.Domain.Enums.CourseStatus>(status, true, out var statusEnum))
            query = query.Where(c => c.Status == statusEnum);

        return await query
            .OrderByDescending(c => c.UpdatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CourseSearchResultDto
            {
                Id = c.Id,
                Title = c.Title,
                Status = c.Status.ToString(),
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<CourseSummaryDto?> GetSummaryAsync(Guid courseId)
    {
        return await _context.Courses
            .Where(c => c.Id == courseId)
            .Select(c => new CourseSummaryDto
            {
                Id = c.Id,
                Title = c.Title,
                Status = c.Status.ToString(),
                TotalLessons = c.Lessons.Count,
                UpdatedAt = c.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<LessonDto>> GetLessonsByCourseAsync(Guid courseId)
    {
        return await _context.Lessons
            .Where(l => l.CourseId == courseId && !l.IsDeleted)
            .OrderBy(l => l.Order)
            .Select(l => new LessonDto
            {
                Id = l.Id,
                CourseId = l.CourseId,
                Title = l.Title,
                Order = l.Order,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt
            })
            .ToListAsync();
    }
    public async Task<List<LessonWithCourseDto>> GetAllLessonsAsync()
    {
        return await _context.Lessons
            .Include(l => l.Course)
            .Where(l => !l.IsDeleted && !l.Course.IsDeleted)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new LessonWithCourseDto
            {
                Id = l.Id,
                CourseId = l.CourseId,
                Title = l.Title,
                Order = l.Order,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt,
                CourseTitle = l.Course.Title
            })
            .ToListAsync();
    }

    public async Task<DashboardMetricsDto> GetDashboardMetricsAsync()
    {
        var totalCourses = await _context.Courses
            .Where(c => !c.IsDeleted)
            .CountAsync();

        var totalLessons = await _context.Lessons
            .Where(l => !l.IsDeleted)
            .CountAsync();

        var publishedCourses = await _context.Courses
            .Where(c => !c.IsDeleted && c.Status == CourseStatus.Published)
            .CountAsync();

        var draftCourses = await _context.Courses
            .Where(c => !c.IsDeleted && c.Status == CourseStatus.Draft)
            .CountAsync();

        return new DashboardMetricsDto
        {
            TotalCourses = totalCourses,
            TotalLessons = totalLessons,
            PublishedCourses = publishedCourses,
            DraftCourses = draftCourses
        };
    }
}
