namespace Assessment.Domain.Entities;

public class Lesson
{
    public Guid Id { get; private set; }
    public Guid CourseId { get; private set; }
    public string Title { get; private set; } = null!;
    public int Order { get; private set; }
    public bool IsDeleted { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    protected Lesson() { }

    public Lesson(Guid courseId, string title, int order)
    {
        Id = Guid.NewGuid();
        CourseId = courseId;
        Title = title;
        Order = order;
        IsDeleted = false;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(string title, int order)
    {
        Title = title;
        Order = order;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeOrder(int newOrder)
    {
        Order = newOrder;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete()
    {
        IsDeleted = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
