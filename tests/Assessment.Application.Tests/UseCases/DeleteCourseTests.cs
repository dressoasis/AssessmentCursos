using Assessment.Application.Tests.Fakes;
using Assessment.Application.UseCases.Courses;
using Assessment.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace Assessment.Application.Tests.UseCases;

public class DeleteCourseTests
{
    private readonly FakeCoursesRepository _repository;
    private readonly DeleteCourse _useCase;

    public DeleteCourseTests()
    {
        _repository = new FakeCoursesRepository();
        _useCase = new DeleteCourse(_repository);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldSoftDeleteCourse_WhenCourseExists()
    {
        // Arrange
        var course = new Course("Test Course");
        await _repository.AddAsync(course);

        // Act
        await _useCase.ExecuteAsync(course.Id);

        // Assert
        var updatedCourse = await _repository.GetByIdAsync(course.Id);
        updatedCourse!.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowException_WhenCourseNotFound()
    {
        // Act
        var act = () => _useCase.ExecuteAsync(Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<Exception>()
            .WithMessage("Course not found");
    }
}
