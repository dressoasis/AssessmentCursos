namespace Assessment.Application.DTOs.Courses;

public class CourseSearchResultDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime UpdatedAt { get; set; }
}
