using Assessment.Domain.Entities;

namespace Assessment.Application.Interfaces;

public interface ICoursesRepository
{
    Task<Course?> GetByIdAsync(Guid id);
    Task AddAsync(Course course);
    Task UpdateAsync(Course course);
    Task DeleteAsync(Course course);
}
