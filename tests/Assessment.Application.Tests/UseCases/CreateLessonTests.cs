using Assessment.Application.Exceptions;
using Assessment.Application.Tests.Fakes;
using Assessment.Application.UseCases.Lessons;
using Assessment.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace Assessment.Application.Tests.UseCases;

public class CreateLessonTests
{
    private readonly FakeLessonsRepository _repository;
    private readonly CreateLesson _useCase;

    public CreateLessonTests()
    {
        _repository = new FakeLessonsRepository();
        _useCase = new CreateLesson(_repository);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldCreateLesson_WhenOrderIsUnique()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var title = "New Lesson";
        var order = 1;

        // Act
        var result = await _useCase.ExecuteAsync(courseId, title, order);

        // Assert
        result.Should().NotBeEmpty();
        var lesson = await _repository.GetByIdAsync(result);
        lesson.Should().NotBeNull();
        lesson!.Title.Should().Be(title);
        lesson.Order.Should().Be(order);
    }

    [Fact]
    public async Task ExecuteAsync_ShouldThrowBusinessException_WhenOrderAlreadyExists()
    {
        // Arrange
        var courseId = Guid.NewGuid();
        var existingLesson = new Lesson(courseId, "Existing", 1);
        await _repository.AddAsync(existingLesson);

        // Act
        var act = () => _useCase.ExecuteAsync(courseId, "New Lesson", 1);

        // Assert
        await act.Should().ThrowAsync<BusinessException>()
            .WithMessage("Lesson order must be unique per course");
    }
}
