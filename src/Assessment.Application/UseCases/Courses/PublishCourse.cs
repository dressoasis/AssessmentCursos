using Assessment.Application.Exceptions;
using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Courses;

public class PublishCourse
{
    private readonly ICoursesRepository _coursesRepository;

    public PublishCourse(ICoursesRepository coursesRepository)
    {
        _coursesRepository = coursesRepository;
    }

    public async Task ExecuteAsync(Guid courseId)
    {
        var course = await _coursesRepository.GetByIdAsync(courseId)
            ?? throw new BusinessException("Course not found");

        try
        {
            course.Publish();
        }
        catch (InvalidOperationException ex)
        {
            throw new BusinessException(ex.Message);
        }

        await _coursesRepository.UpdateAsync(course);
    }
}
