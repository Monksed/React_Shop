
using Microsoft.AspNetCore.Mvc;
using ShopBackend.Helpers;

namespace ShopBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        [HttpGet("One/{id}")]
        public IActionResult GetOneProducts(int id)
        {
            var product = FakeDatabase._products.FirstOrDefault(x => x.Id == id);
            if (product == null)
            {
                return NotFound(new { message = "Товар не найден" });
            }
            return Ok(product);
        }
        [HttpPost("Buy/{id}")]
        public IActionResult BuyProduct(int id)
        {
            var product = FakeDatabase._products.FirstOrDefault(x => x.Id == id);
            if (product == null)
            {
                return NotFound(new { message = "Товар не найден" });
            }
            if (product.Quantity <= 0)
            {
                return BadRequest(new { message = "Нет в наличии" });
            }
            product.Quantity -= 1;
            return Ok(new { message = "Товар куплен", product });
        }

        [HttpGet("All")]
        public IActionResult GetAllProduct()
        {
            var listProducts = FakeDatabase._products.ToList();
            return Ok(listProducts);
        }
    }
}