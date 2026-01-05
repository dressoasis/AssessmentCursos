namespace Assessment.Application.DTOs.Auth;

public record LoginRequest
{
    public string Email { get; init; } = null!;
    public string Password { get; init; } = null!;
}
