using Assessment.Application.Interfaces;
using Assessment.Domain.Entities;

namespace Assessment.Application.Tests.Fakes;

public class FakeLessonsRepository : ILessonsRepository
{
    public List<Lesson> Lessons { get; } = new();

    public Task<Lesson?> GetByIdAsync(Guid id)
    {
        return Task.FromResult(Lessons.FirstOrDefault(l => l.Id == id));
    }

    public Task<List<Lesson>> GetByCourseIdAsync(Guid courseId)
    {
        return Task.FromResult(Lessons.Where(l => l.CourseId == courseId).ToList());
    }

    public Task<bool> ExistsWithOrderAsync(Guid courseId, int order)
    {
        return Task.FromResult(Lessons.Any(l => l.CourseId == courseId && l.Order == order));
    }

    public Task AddAsync(Lesson lesson)
    {
        Lessons.Add(lesson);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Lesson lesson)
    {
        var index = Lessons.FindIndex(l => l.Id == lesson.Id);
        if (index != -1)
        {
            Lessons[index] = lesson;
        }
        return Task.CompletedTask;
    }
}
