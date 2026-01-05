using Assessment.Application.UseCases.Lessons;
using Assessment.Application.DTOs.Lessons;
using Assessment.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Assessment.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/courses/{courseId}/lessons")]
public class LessonsController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(
        Guid courseId,
        [FromBody] CreateLessonRequest request,
        [FromServices] CreateLesson useCase)
    {
        var id = await useCase.ExecuteAsync(courseId, request.Title, request.Order);
        return Ok(id);
    }

    [HttpPut("{lessonId}")]
    public async Task<IActionResult> Update(
        Guid courseId,
        Guid lessonId,
        [FromBody] UpdateLessonRequest request,
        [FromServices] UpdateLesson useCase)
    {
        await useCase.ExecuteAsync(courseId, lessonId, request.Title, request.Order);
        return NoContent();
    }

    [HttpDelete("{lessonId}")]
    public async Task<IActionResult> Delete(
        Guid courseId,
        Guid lessonId,
        [FromServices] DeleteLesson useCase)
    {
        await useCase.ExecuteAsync(lessonId);
        return NoContent();
    }

    [HttpPatch("{lessonId}/reorder")]
    public async Task<IActionResult> Reorder(
        Guid courseId,
        Guid lessonId,
        [FromBody] ReorderLessonRequest request,
        [FromServices] ReorderLessons useCase)
    {
        await useCase.ExecuteAsync(courseId, lessonId, request.NewOrder);
        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetByCourseId(
        Guid courseId,
        [FromServices] ICourseQueries queries)
    {
        var lessons = await queries.GetLessonsByCourseAsync(courseId);
        return Ok(lessons);
    }
}
