using Assessment.Application.Exceptions;
using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Lessons;

public class UpdateLesson
{
    private readonly ILessonsRepository _repository;

    public UpdateLesson(ILessonsRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(
        Guid courseId,
        Guid lessonId,
        string title,
        int order)
    {
        var lessons = await _repository.GetByCourseIdAsync(courseId);

        var lesson = lessons.FirstOrDefault(l => l.Id == lessonId)
            ?? throw new BusinessException("Lesson not found");

        // Validar order único (excepto la misma lección)
        if (lessons.Any(l => l.Order == order && l.Id != lessonId))
            throw new BusinessException("Lesson order must be unique per course");

        lesson.Update(title, order);
        await _repository.UpdateAsync(lesson);
    }
}
