using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Courses;

public class DeleteCourse
{
    private readonly ICoursesRepository _repository;

    public DeleteCourse(ICoursesRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid courseId)
    {
        var course = await _repository.GetByIdAsync(courseId)
            ?? throw new Exception("Course not found");

        course.SoftDelete();
        await _repository.UpdateAsync(course);
    }
}
