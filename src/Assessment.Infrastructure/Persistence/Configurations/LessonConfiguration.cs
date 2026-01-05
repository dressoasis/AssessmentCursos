using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Assessment.Domain.Entities;

namespace Assessment.Infrastructure.Persistence.Configurations;

/// <summary>
/// Configuración de EF Core para la entidad Lesson.
/// </summary>
public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
{
    public void Configure(EntityTypeBuilder<Lesson> builder)
    {
        builder.ToTable("Lessons");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(l => l.Order)
            .IsRequired();

        builder.Property(l => l.IsDeleted)
            .HasDefaultValue(false);

        builder.HasQueryFilter(l => !l.IsDeleted);

        builder.HasOne<Course>()
            .WithMany(c => c.Lessons)
            .HasForeignKey(l => l.CourseId)
            .IsRequired();
    }
}
