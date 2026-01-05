using Assessment.Application.Exceptions;
using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Lessons;

public class ReorderLessons
{
    private readonly ILessonsRepository _repository;

    public ReorderLessons(ILessonsRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid courseId, Guid lessonId, int newOrder)
    {
        var lessons = await _repository.GetByCourseIdAsync(courseId);

        if (lessons.Any(l => l.Order == newOrder && l.Id != lessonId))
            throw new BusinessException("Duplicate lesson order detected");

        var lesson = lessons.First(x => x.Id == lessonId);
        lesson.ChangeOrder(newOrder);

        await _repository.UpdateAsync(lesson);
    }
}
