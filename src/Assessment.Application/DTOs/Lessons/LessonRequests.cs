namespace Assessment.Application.DTOs.Lessons;

public record CreateLessonRequest(string Title, int Order);
public record UpdateLessonRequest(string Title, int Order);
public record ReorderLessonRequest(int NewOrder);
