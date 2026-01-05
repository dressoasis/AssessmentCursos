using Assessment.Application.Interfaces;
using Assessment.Domain.Entities;

namespace Assessment.Application.UseCases.Courses;

public class CreateCourse
{
    private readonly ICoursesRepository _repository;

    public CreateCourse(ICoursesRepository repository)
    {
        _repository = repository;
    }

    public async Task<Guid> ExecuteAsync(string title)
    {
        var course = new Course(title);
        await _repository.AddAsync(course);
        return course.Id;
    }
}
