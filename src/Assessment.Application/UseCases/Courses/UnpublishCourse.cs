using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Courses;

public class UnpublishCourse
{
    private readonly ICoursesRepository _repository;

    public UnpublishCourse(ICoursesRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid courseId)
    {
        var course = await _repository.GetByIdAsync(courseId)
            ?? throw new Exception("Course not found");

        course.Unpublish();
        await _repository.UpdateAsync(course);
    }
}
