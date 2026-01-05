using Assessment.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Assessment.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager)
    {
        // await context.Database.MigrateAsync();

        // =========================
        // ROLES
        // =========================
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new IdentityRole("Admin"));

        if (!await roleManager.RoleExistsAsync("User"))
            await roleManager.CreateAsync(new IdentityRole("User"));

        // =========================
        // ADMIN USER
        // =========================
        const string adminEmail = "admin@admin.com";
        const string adminPassword = "Admin123";

        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };

            await userManager.CreateAsync(adminUser, adminPassword);
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }

        // =========================
        // TEST USER (TU USUARIO ORIGINAL)
        // =========================
        const string testEmail = "test@test.com";
        const string testPassword = "Test123";

        var testUser = await userManager.FindByEmailAsync(testEmail);

        if (testUser == null)
        {
            testUser = new ApplicationUser
            {
                UserName = testEmail,
                Email = testEmail,
                EmailConfirmed = true
            };

            await userManager.CreateAsync(testUser, testPassword);
            await userManager.AddToRoleAsync(testUser, "User");
        }
    }
}
