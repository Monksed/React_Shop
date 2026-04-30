using CoreData.Contexts;
using CoreData.Models;
using Microsoft.EntityFrameworkCore;
using ShopBackend.DTO;

public interface IOrderService
{
    Task<OrderDTO> CreateOrder(CreateOrderDTO dto, Guid userId);

    Task<IEnumerable<OrderDTO>> GetUserOrders(Guid userId);

    Task CancelOrder(Guid id);

    Task<OrderDTO?> GetOrderById(Guid id);
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
        var productIds = dto.Items.Select(i => i.ProductId);
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Status = "оформлен",
            CreateDate = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified),
            TotalPrice = dto.Items.Sum(i =>
                (products.First(p => p.Id == i.ProductId).Price ?? 0) * i.Quantity),
            OrderItems = dto.Items.Select(i => new OrderItem
            {
                Id = Guid.NewGuid(),
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Price = products.First(p => p.Id == i.ProductId).Price ?? 0,
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

        return orders.Select(MapToDTO);
    }

    public async Task CancelOrder(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) throw new KeyNotFoundException("Заказ не найден");

        _context.RemoveRange(order.OrderItems);
        _context.Remove(order);
        await _context.SaveChangesAsync();
    }

    public async Task<OrderDTO?> GetOrderById(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        return order == null ? null : MapToDTO(order);
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