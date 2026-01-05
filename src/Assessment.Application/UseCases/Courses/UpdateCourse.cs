using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Courses;

public class UpdateCourse
{
    private readonly ICoursesRepository _repository;

    public UpdateCourse(ICoursesRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid id, string title, Assessment.Domain.Enums.CourseStatus status)
    {
        var course = await _repository.GetByIdAsync(id);
        if (course == null)
        {
            throw new KeyNotFoundException($"Course with ID {id} not found.");
        }

        course.Update(title, status);
        await _repository.UpdateAsync(course);
    }
}
