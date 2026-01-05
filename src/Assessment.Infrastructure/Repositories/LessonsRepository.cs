using Assessment.Application.Interfaces;
using Assessment.Domain.Entities;
using Assessment.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Assessment.Infrastructure.Repositories;

public class LessonsRepository : ILessonsRepository
{
    private readonly AppDbContext _context;

    public LessonsRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Lesson?> GetByIdAsync(Guid id)
    {
        return await _context.Lessons.FindAsync(id);
    }

    public async Task<List<Lesson>> GetByCourseIdAsync(Guid courseId)
    {
        return await _context.Lessons
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.Order)
            .ToListAsync();
    }

    public async Task<bool> ExistsWithOrderAsync(Guid courseId, int order)
    {
        return await _context.Lessons
            .AnyAsync(l => l.CourseId == courseId && l.Order == order);
    }

    public async Task AddAsync(Lesson lesson)
    {
        await _context.Lessons.AddAsync(lesson);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Lesson lesson)
    {
        _context.Lessons.Update(lesson);
        await _context.SaveChangesAsync();
    }
}
