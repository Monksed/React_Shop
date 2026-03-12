using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CoreData.Contexts;
using CoreData.Models;

namespace ShopBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly React_ShopContext _db;
    private readonly IConfiguration _config;

    public AuthController(React_ShopContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    //POST /api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email и пароль обязательны" });

        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            return BadRequest(new { message = "Email уже занят" });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Username = request.Email.Split('@')[0],
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreateDate = DateTime.UtcNow,
            UpdateDate = DateTime.UtcNow,
            IsActive = true,
            Score = 0,
            TelegramId = 0,
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateToken(user);
        return Ok(new { token, userId = user.Id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest(new { message = "Email и пароль обязательны" });

        var user = await _db.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

        if (user == null || string.IsNullOrEmpty(user.PasswordHash))
            return Unauthorized(new { message = "Неверный email или пароль" });

        var token = GenerateToken(user);
        return Ok(new { token, userId = user.Id });
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!)
        );
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email ?? ""),
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(30),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}


public record AuthRequest(string Email, string Password);