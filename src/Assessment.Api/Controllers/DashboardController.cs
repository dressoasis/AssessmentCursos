using Assessment.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Assessment.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics([FromServices] ICourseQueries queries)
    {
        var metrics = await queries.GetDashboardMetricsAsync();
        return Ok(metrics);
    }
}
