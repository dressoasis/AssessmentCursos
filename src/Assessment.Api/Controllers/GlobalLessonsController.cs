using Assessment.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Assessment.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/lessons")]
public class GlobalLessonsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromServices] ICourseQueries queries)
    {
        var lessons = await queries.GetAllLessonsAsync();
        return Ok(lessons);
    }
}
