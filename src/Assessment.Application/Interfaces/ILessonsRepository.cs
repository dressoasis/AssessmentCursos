using Assessment.Domain.Entities;

namespace Assessment.Application.Interfaces;

public interface ILessonsRepository
{
    Task<Lesson?> GetByIdAsync(Guid id);
    Task<List<Lesson>> GetByCourseIdAsync(Guid courseId);
    Task<bool> ExistsWithOrderAsync(Guid courseId, int order);
    Task AddAsync(Lesson lesson);
    Task UpdateAsync(Lesson lesson);
}
