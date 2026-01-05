using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Courses;

public class HardDeleteCourse
{
    private readonly ICoursesRepository _repository;

    public HardDeleteCourse(ICoursesRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid id)
    {
        var course = await _repository.GetByIdAsync(id);
        if (course == null)
        {
            // If it doesn't exist, we can consider it already deleted or throw NotFound.
            // For idempotency, we'll return.
            return;
        }

        await _repository.DeleteAsync(course);
    }
}
