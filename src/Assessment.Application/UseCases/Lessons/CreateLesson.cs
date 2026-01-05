using Assessment.Application.Exceptions;
using Assessment.Application.Interfaces;
using Assessment.Domain.Entities;

namespace Assessment.Application.UseCases.Lessons;

public class CreateLesson
{
    private readonly ILessonsRepository _lessonsRepository;

    public CreateLesson(ILessonsRepository lessonsRepository)
    {
        _lessonsRepository = lessonsRepository;
    }

    public async Task<Guid> ExecuteAsync(Guid courseId, string title, int order)
    {
        if (await _lessonsRepository.ExistsWithOrderAsync(courseId, order))
            throw new BusinessException("Lesson order must be unique per course");

        var lesson = new Lesson(courseId, title, order);
        await _lessonsRepository.AddAsync(lesson);

        return lesson.Id;
    }
}
