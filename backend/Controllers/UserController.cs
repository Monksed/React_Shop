using CoreData.Contexts;
using CoreData.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBackend.DTO;

namespace ShopBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly React_ShopContext _context;

    public UserController(React_ShopContext context)
    {
        _context = context;
    }

    [HttpGet("user/{id:guid}")]
    public async Task<ActionResult<UserDTO>> GetById(Guid id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id && u.IsActive);

        return user is null ? NotFound() : Ok(MapToDto(user));
    }

    [HttpPost("RegisterOrLogin")]
    public async Task<ActionResult<UserDTO>> RegisterOrLogin([FromBody] RegisterRequest request)
    {

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.TelegramId == request.TelegramId);

        if (user is null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                TelegramId = request.TelegramId,
                Username = request.Username,
                Fio = request.Fio,
                Score = 0,
                IsActive = true,
                CreateDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
                UpdateDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
            };
            _context.Users.Add(user);
        }
        else
        {
            user.Username = request.Username ?? user.Username;
            user.Fio = request.Fio ?? user.Fio;
            user.UpdateDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);
        }

        await _context.SaveChangesAsync();
        return Ok(MapToDto(user));
    }

    [HttpPost("Update")]
    public async Task<ActionResult<UserDTO>> Update([FromBody] UserUpdateDTO dto)
    {
        if (dto.Id == Guid.Empty)
            return BadRequest("Id обязателен");

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == dto.Id && u.IsActive);

        if (user is null)
            return NotFound();

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

public class RegisterRequest
{
    public long? TelegramId { get; set; }
    public string? Username { get; set; }
    public string? Fio { get; set; }
}