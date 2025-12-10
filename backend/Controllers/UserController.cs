using CoreData.Contexts;
using CoreData.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBackend.DTO;
namespace ShopBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly React_ShopContext _context;
        public UserController(React_ShopContext context)
        {
            _context = context;
        }
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetOneUser(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound(new { message = "������������ �� ������" });
            var userDto = new UserDTO()
            {
                Id = user.Id,
                Username = user.Username,
                Score = user.Score,
                Fio = user.Fio,
                Email = user.Email,
                Phone = user.Phone,
            };

            return Ok(userDto);
        }

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] UserDTO dto)
        {
            var user = await _context.Users.Where(x => x.Id == dto.Id).FirstOrDefaultAsync();

            if (user == null) return BadRequest(new { error = true, message = "������������ �� ������" });

            user.Email = dto.Email;
            user.Phone = dto.Phone;
            user.Fio = dto.Fio;
            user.Adress = dto.Address;
            user.Image = dto.Image;
            user.Username = dto.Username;
            user.UpdateDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}