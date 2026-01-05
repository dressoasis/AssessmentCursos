using Assessment.Domain.Enums;

namespace Assessment.Domain.Entities;

public class Course
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = null!;
    public CourseStatus Status { get; private set; }
    public bool IsDeleted { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private readonly List<Lesson> _lessons = new();
    public IReadOnlyCollection<Lesson> Lessons => _lessons.AsReadOnly();

    protected Course() { }

    public Course(string title)
    {
        Id = Guid.NewGuid();
        Title = title;
        Status = CourseStatus.Draft;
        IsDeleted = false;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(string title, CourseStatus status)
    {
        if (status == CourseStatus.Published && !_lessons.Any(l => !l.IsDeleted))
        {
            throw new InvalidOperationException("Course must have at least one active lesson to be published.");
        }

        Title = title;
        Status = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateTitle(string title)
    {
        Title = title;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddLesson(Lesson lesson)
    {
        _lessons.Add(lesson);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Publish()
    {
        if (Status == CourseStatus.Published)
            throw new InvalidOperationException("Course is already published.");

        if (!_lessons.Any(l => !l.IsDeleted))
            throw new InvalidOperationException("Course must have at least one active lesson to be published.");

        Status = CourseStatus.Published;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Unpublish()
    {
        Status = CourseStatus.Draft;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete()
    {
        IsDeleted = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
