using Assessment.Application.Exceptions;
using Assessment.Application.Tests.Fakes;
using Assessment.Application.UseCases.Courses;
using Assessment.Domain.Entities;
using Assessment.Domain.Enums;
using FluentAssertions;
using Xunit;

namespace Assessment.Application.Tests.UseCases;

public class PublishCourseTests
{
    private readonly FakeCoursesRepository _repository;
    private readonly PublishCourse _useCase;

    public PublishCourseTests()
    {
        _repository = new FakeCoursesRepository();
        _useCase = new PublishCourse(_repository);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldPublishCourse_WhenCourseExistsAndIsDraft()
    {
        // Arrange
        var course = new Course("Test Course");
        course.AddLesson(new Lesson(course.Id, "Lesson 1", 1));
        await _repository.AddAsync(course);

        // Act
        await _useCase.ExecuteAsync(course.Id);

        // Assert
        var updatedCourse = await _repository.GetByIdAsync(course.Id);
        updatedCourse!.Status.Should().Be(CourseStatus.Published);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowBusinessException_WhenCourseNotFound()
    {
        // Act
        var act = () => _useCase.ExecuteAsync(Guid.NewGuid());

        // Assert
        await act.Should().ThrowAsync<BusinessException>()
            .WithMessage("Course not found");
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowBusinessException_WhenCourseAlreadyPublished()
    {
        // Arrange
        var course = new Course("Test Course");
        course.AddLesson(new Lesson(course.Id, "Lesson 1", 1));
        course.Publish();
        await _repository.AddAsync(course);

        // Act
        var act = () => _useCase.ExecuteAsync(course.Id);

        // Assert
        await act.Should().ThrowAsync<BusinessException>();
    }
}
