using System.Configuration;
using CoreData.Contexts;
using CoreData.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopBackend.DTO;

public interface IOrderService
{
    Task<OrderDTO> CreateOrder(CreateOrderDTO dto, Guid userId);

    Task<IEnumerable<OrderDTO>> GetUserOrders(Guid userId);

    Task CancelOrder(Guid id);

    Task<OrderDTO>? GetOrderById(Guid id);
}

public class OrderService : IOrderService
{
    private readonly React_ShopContext _context;

    public OrderService(React_ShopContext context)
    {
        _context = context;
    }
    public async Task<OrderDTO> CreateOrder(CreateOrderDTO dto, Guid userId)
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

        return MapToDTO(order);
    }

    public async Task<IEnumerable<OrderDTO>> GetUserOrders(Guid userId)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .ToListAsync();

        var res = orders.Select(MapToDTO);
        return res;
    }
    public async Task CancelOrder(Guid id)
    {
        var order = await _context.Orders
        .Include(o => o.OrderItems)
        .FirstOrDefaultAsync(o => o.Id == id);
        _context.RemoveRange(order!.OrderItems);
        _context.Remove(order);
        await _context.SaveChangesAsync();

    }

    public async Task<OrderDTO>? GetOrderById(Guid id)
    {
        var result = await _context.Orders
           .Include(o => o.OrderItems)
           .FirstOrDefaultAsync(o => o.Id == id);

        if (result != null) return MapToDTO(result);

        else
        {
            return null;
        }
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