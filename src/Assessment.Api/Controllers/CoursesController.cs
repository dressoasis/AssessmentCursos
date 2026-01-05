using Assessment.Application.Interfaces;
using Assessment.Application.UseCases.Courses;
using Assessment.Application.DTOs.Courses;
using Assessment.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Assessment.Api.Controllers;

[ApiController]
[Route("api/courses")]
[Authorize] // 🔐 JWT obligatorio
public class CoursesController : ControllerBase
{
    // =========================
    // CREATE COURSE
    // =========================
    [HttpPost("create")]
    public async Task<IActionResult> CreateCourse(
        [FromBody] CreateCourseRequest request,
        [FromServices] CreateCourse useCase)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest("Title is required");

        var courseId = await useCase.ExecuteAsync(request.Title);
        return Ok(courseId);
    }

    // =========================
    // UPDATE COURSE (FULL)
    // =========================
    [HttpPut("{courseId}/update")]
    public async Task<IActionResult> UpdateCourse(
        Guid courseId,
        [FromBody] UpdateCourseRequest request,
        [FromServices] UpdateCourse useCase)
    {
        await useCase.ExecuteAsync(
            courseId,
            request.Title,
            request.Status);

        return NoContent();
    }

    // =========================
    // SOFT DELETE (USER)
    // =========================
    [HttpDelete("{courseId}/delete")]
    public async Task<IActionResult> SoftDeleteCourse(
        Guid courseId,
        [FromServices] DeleteCourse useCase)
    {
        await useCase.ExecuteAsync(courseId);
        return NoContent();
    }

    // =========================
    // HARD DELETE (ADMIN ONLY)
    // =========================
    [Authorize(Roles = "Admin")]
    [HttpDelete("{courseId}/delete-permanent")]
    public async Task<IActionResult> HardDeleteCourse(
        Guid courseId,
        [FromServices] HardDeleteCourse useCase)
    {
        await useCase.ExecuteAsync(courseId);
        return NoContent();
    }

    // =========================
    // PUBLISH COURSE
    // =========================
    [HttpPatch("{courseId}/publish")]
    public async Task<IActionResult> PublishCourse(
        Guid courseId,
        [FromServices] PublishCourse useCase)
    {
        await useCase.ExecuteAsync(courseId);
        return NoContent();
    }

    // =========================
    // UNPUBLISH COURSE
    // =========================
    [HttpPatch("{courseId}/unpublish")]
    public async Task<IActionResult> UnpublishCourse(
        Guid courseId,
        [FromServices] UnpublishCourse useCase)
    {
        await useCase.ExecuteAsync(courseId);
        return NoContent();
    }

    // =========================
    // SEARCH COURSES
    // =========================
    [HttpGet("search")]
    public async Task<IActionResult> SearchCourses(
        [FromServices] ICourseQueries queries,
        [FromQuery] string? q,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await queries.SearchAsync(
            q,
            status,
            page,
            pageSize);

        return Ok(result);
    }

    // =========================
    // COURSE SUMMARY
    // =========================
    [HttpGet("{courseId}/summary")]
    public async Task<IActionResult> GetSummary(
        Guid courseId,
        [FromServices] ICourseQueries queries)
    {
        var summary = await queries.GetSummaryAsync(courseId);

        if (summary == null)
            return NotFound();

        return Ok(summary);
    }
}
