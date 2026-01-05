namespace Assessment.Application.DTOs.Courses;

public record CreateCourseRequest(string Title);
public record UpdateCourseRequest(string Title, Assessment.Domain.Enums.CourseStatus Status);
