using Microsoft.AspNetCore.Identity;

namespace Assessment.Infrastructure.Identity;

/// <summary>
/// Usuario de Identity para la aplicación.
/// </summary>
public class ApplicationUser : IdentityUser
{
    public string Nombre { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    public bool EstaActivo { get; set; } = true;
}
