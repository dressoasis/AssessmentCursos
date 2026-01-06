namespace Assessment.Application.DTOs.Dashboard;

public record DashboardMetricsDto
{
    public int TotalCourses { get; init; }
    public int TotalLessons { get; init; }
    public int PublishedCourses { get; init; }
    public int DraftCourses { get; init; }
}
