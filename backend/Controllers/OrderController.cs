using System.Net;
using System.Runtime.CompilerServices;
using CoreData.Contexts;
using CoreData.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBackend.DTO;
namespace ShopBackend.Controllers;

[Route("api/[controller]")]
[ApiController]

public class OrderController : ControllerBase
{
    private readonly React_ShopContext _context;


    public OrderController(React_ShopContext context)
    {
        _context = context;
    }

    // GET api/order/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderDTO>> GetOrderById(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = "Заказ не найден" });

        return Ok(MapToDTO(order));
    }

    // GET api/order/my/{userId}
    [HttpGet("my/{userId:guid}")]
    public async Task<ActionResult<List<OrderDTO>>> GetMyOrders(Guid userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .ToListAsync();

        return Ok(orders.Select(MapToDTO));
    }

    // POST api/order
    [HttpPost("create")]
    public async Task<ActionResult<OrderDTO>> CreateOrder([FromBody] CreateOrderDTO dto, Guid userId)
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Status = "в корзине",
            CreateDate = DateTime.Now,
            TotalPrice = dto.Items.Sum(i => i.Price * i.Quantity),
            OrderItems = dto.Items.Select(i => new OrderItem
            {
                Id = Guid.NewGuid(),
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Price = i.Price,
                Quantity = i.Quantity,
                SelectedSize = i.SelectedSize,
                Image = i.Image,
            }).ToList()
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, MapToDTO(order));
    }

    // DELETE api/order/{id}
    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var order = await _context.Orders
        .Include(o => o.OrderItems)
        .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = "Заказ не найден" });

        _context.RemoveRange(order.OrderItems);
        _context.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static OrderDTO MapToDTO(Order order) => new()
    {
        Id = order.Id,
        UserId = order.UserId,
        Status = order.Status,
        TotalPrice = order.TotalPrice,
        CreateDate = order.CreateDate,
        Items = order.OrderItems.Select(i => new OrderItemDTO
        {
            Id = i.Id,
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            Price = i.Price,
            Quantity = i.Quantity,
            SelectedSize = i.SelectedSize,
            Image = i.Image,
        }).ToList()
    };
}