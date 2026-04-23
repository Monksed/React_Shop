using CoreData.Contexts;
using CoreData.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ShopBackend.DTO;

namespace ShopBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
    private readonly React_ShopContext _context;

    public UserController(React_ShopContext context)
    {
        _context = context;
    }

    private Guid GetUserId() =>
        Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = GetUserId();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

        if (user is null)
            return NotFound(new { message = "Пользователь не найден" });

        return Ok(MapToDto(user));
    }

    [HttpPost("Update")]
    public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDTO dto)
    {
        var userId = GetUserId();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId && u.IsActive);

        if (user is null)
            return NotFound(new { message = "Пользователь не найден" });

        user.Username = dto.Username ?? user.Username;
        user.Fio = dto.Fio ?? user.Fio;
        user.Email = dto.Email ?? user.Email;
        user.Phone = dto.Phone ?? user.Phone;
        user.Adress = dto.Address ?? user.Adress;
        user.Image = dto.Image ?? user.Image;
        user.UpdateDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

        await _context.SaveChangesAsync();

        return Ok(MapToDto(user));
    }

    private static UserDTO MapToDto(User user) => new()
    {
        Id = user.Id,
        Username = user.Username,
        TelegramId = user.TelegramId,
        Score = user.Score ?? 0,
        Fio = user.Fio,
        Address = user.Adress,
        Email = user.Email,
        Phone = user.Phone,
        Image = user.Image
    };
}