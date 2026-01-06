using Assessment.Application.Exceptions;
using Assessment.Application.Interfaces;

namespace Assessment.Application.UseCases.Lessons;

public class ReorderLessons
{
    private readonly ILessonsRepository _repository;

    public ReorderLessons(ILessonsRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(Guid courseId, Guid lessonId, int newOrder)
    {
        var lessons = (await _repository.GetByCourseIdAsync(courseId))
            .OrderBy(l => l.Order)
            .ToList();

        var lessonToMove = lessons.FirstOrDefault(l => l.Id == lessonId);
        if (lessonToMove == null) return;

        int currentOrder = lessonToMove.Order;
        if (currentOrder == newOrder) return;

        if (newOrder < currentOrder)
        {
            // Moving up: Increment order of lessons between newOrder and currentOrder - 1
            var affectedLessons = lessons.Where(l => l.Order >= newOrder && l.Order < currentOrder).ToList();
            foreach (var l in affectedLessons)
            {
                l.ChangeOrder(l.Order + 1);
                await _repository.UpdateAsync(l);
            }
        }
        else
        {
            // Moving down: Decrement order of lessons between currentOrder + 1 and newOrder
            var affectedLessons = lessons.Where(l => l.Order > currentOrder && l.Order <= newOrder).ToList();
            foreach (var l in affectedLessons)
            {
                l.ChangeOrder(l.Order - 1);
                await _repository.UpdateAsync(l);
            }
        }

        lessonToMove.ChangeOrder(newOrder);
        await _repository.UpdateAsync(lessonToMove);
    }
}
