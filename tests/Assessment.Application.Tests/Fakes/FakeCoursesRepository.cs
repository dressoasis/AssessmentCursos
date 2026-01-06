using Assessment.Application.Interfaces;
using Assessment.Domain.Entities;

namespace Assessment.Application.Tests.Fakes;

public class FakeCoursesRepository : ICoursesRepository
{
    public List<Course> Courses { get; } = new();

    public Task<Course?> GetByIdAsync(Guid id)
    {
        return Task.FromResult(Courses.FirstOrDefault(c => c.Id == id));
    }

    public Task AddAsync(Course course)
    {
        Courses.Add(course);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Course course)
    {
        var index = Courses.FindIndex(c => c.Id == course.Id);
        if (index != -1)
        {
            Courses[index] = course;
        }
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Course course)
    {
        Courses.Remove(course);
        return Task.CompletedTask;
    }
}
