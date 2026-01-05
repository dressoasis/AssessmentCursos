namespace Assessment.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(string userId, string email, string name, string role);
    string GenerateRefreshToken();
    bool ValidateToken(string token);
}
