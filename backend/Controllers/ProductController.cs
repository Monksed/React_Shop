using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoreData.Contexts;
using CoreData.Models;
using ShopBackend.DTO;

namespace ShopBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly React_ShopContext _context;

        public ProductController(React_ShopContext context)
        {
            _context = context;
        }

        [HttpGet("One/{id}")]
        public async Task<IActionResult> GetOneProduct(Guid id)
        {
            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);

            if (product == null)
                return NotFound(new { message = "Товар не найден" });

            var dto = new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Image = product.Image,
                Bonus = product.Bonus,
                BrandId = product.BrandId
            };

            return Ok(dto);
        }

        [HttpGet("All")]
        public async Task<IActionResult> GetAllProducts()
        {
            var listProducts = await _context.Products
                .Select(product => new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Price = product.Price,
                    Image = product.Image,
                    Bonus = product.Bonus,
                    BrandId = product.BrandId
                })
                .ToListAsync();

            return Ok(listProducts);
        }
        [HttpPost("Buy/{id}")]
        public async Task<IActionResult> BuyProduct(Guid id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound(new { message = "Товар не найден" });

            //TODO Логика покупки/добавления в корзину

            return Ok(new { message = "Товар успешно добавлен в корзину", productId = id });
        }
    }
}