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

    [HttpGet("order/{id}")]

    public async Task<ActionResult<OrderDTO>> GetOrderById(Guid id)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(x => x.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "заказ не найден" });
        }

        var dto = new OrderDTO
        {
            Id = order.Id,
            Status = order.Status,
            TotalPrice = order.TotalPrice,
            CreateDate = order.CreateDate,
            //! ругается что Order не содержит определения Items 
            // Items = order.Items,

        };
        return Ok(dto);
    }

    [HttpGet("All")]
    public async Task<IActionResult> GetAllOrders()
    {
        var listOrders = await _context.Orders
            .Select(order => new OrderDTO
            {
                Id = order.Id,
                Status = order.Status,
                TotalPrice = order.TotalPrice,
                CreateDate = order.CreateDate,
                //! ругается что Order не содержит определения Items 
                // Items = order.Items,
            })
            .ToListAsync();

        return Ok(listOrders);
    }
}