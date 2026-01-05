using Assessment.Application.Exceptions;
using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Lessons;

public class DeleteLesson
{
    private readonly ILessonsRepository _repository;

    public DeleteLesson(ILessonsRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid lessonId)
    {
        var lesson = await _repository.GetByIdAsync(lessonId)
            ?? throw new BusinessException("Lesson not found");

        lesson.SoftDelete();
        await _repository.UpdateAsync(lesson);
    }
}
