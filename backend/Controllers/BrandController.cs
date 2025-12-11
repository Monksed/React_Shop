using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoreData.Contexts;
using CoreData.Models;
using ShopBackend.Dto;

namespace ShopBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly React_ShopContext _context;

        public BrandController(React_ShopContext context)
        {
            _context = context;
        }

        [HttpGet("All")]
        public async Task<ActionResult<IEnumerable<BrandDTO>>> GetAllBrands()
        {
            var brands = await _context.Brands
                .Where(brand => brand.IsActive)
                .Select(brand => new BrandDTO
                {
                    Id = brand.Id,
                    Title = brand.Title,
                    Image = brand.Image
                })
                .OrderBy(brand => brand.Title)
                .ToListAsync();

            return Ok(brands);
        }

        [HttpGet("One/{id}")]
        public async Task<ActionResult<BrandDTO>> GetBrand(Guid id)
        {
            var brand = await _context.Brands
                .Where(b => b.IsActive)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (brand == null)
                return NotFound(new { message = "Бренд не найден" });

            var dto = new BrandDTO
            {
                Id = brand.Id,
                Title = brand.Title,
                Image = brand.Image
            };

            return Ok(dto);
        }

        [HttpGet("{id}/products")]
        public async Task<IActionResult> GetBrandWithProducts(Guid id)
        {
            var brand = await _context.Brands
                .Where(brand => brand.IsActive && brand.Id == id)
                .Select(brand => new
                {
                    Brand = new BrandDTO
                    {
                        Id = brand.Id,
                        Title = brand.Title,
                        Image = brand.Image
                    },
                    Products = brand.Products
                        .Where(product => product.IsActive)
                        .Select(product => new ProductDto
                        {
                            Id = product.Id,
                            Name = product.Name,
                            Description = product.Description,
                            Price = product.Price,
                            Image = product.Image,
                            Bonus = product.Bonus,
                            BrandId = product.BrandId
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (brand == null)
                return NotFound(new { message = "Бренд не найден или неактивен" });

            return Ok(brand);
        }
    }
}