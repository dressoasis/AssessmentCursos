namespace Assessment.Application.DTOs.Lessons;

public record LessonWithCourseDto : LessonDto
{
    public string CourseTitle { get; init; } = string.Empty;
}
