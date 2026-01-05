namespace Assessment.Application.DTOs.Auth;

public record RegisterRequest
{
    public string Email { get; init; } = null!;
    public string Password { get; init; } = null!;
    public string Nombre { get; init; } = null!;
}
