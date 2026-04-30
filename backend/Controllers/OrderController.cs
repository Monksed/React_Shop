using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using CoreData.Contexts;
using CoreData.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBackend.DTO;
namespace ShopBackend.Controllers;

[Route("api/[controller]")]
[ApiController]

public class OrderController : ControllerBase
{

    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {

        _orderService = orderService;
    }

    // GET api/order/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<OrderDTO>> GetOrderById(Guid id)
    {
        var order = await _orderService.GetOrderById(id);

        if (order == null)
        {
            return NotFound(new { message = "Заказ не найден" });
        }
        return Ok(order);
    }

    // GET api/order/my
    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<List<OrderDTO>>> GetMyOrders()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();
        var result = await _orderService.GetUserOrders(userId);

        if (result == null) return NotFound(new { message = "Заказы не найдены" });

        return Ok(result);
    }

    // POST api/order
    [HttpPost("create")]
    [Authorize]
    public async Task<ActionResult<OrderDTO>> CreateOrder([FromBody] CreateOrderDTO dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            return Unauthorized();
        var order = await _orderService.CreateOrder(dto, userId);

        return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
    }

    // DELETE api/order/{id}
    [HttpDelete("delete/{id:guid}")]
    public async Task<IActionResult> CancelOrder(Guid id)
    {
        var order = await _orderService.GetOrderById(id);
        if (order == null) return NotFound(new { message = "Заказ не найден" });

        await _orderService.CancelOrder(id);

        return NoContent();
    }
}