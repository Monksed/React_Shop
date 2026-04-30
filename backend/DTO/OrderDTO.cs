namespace ShopBackend.DTO;

public class OrderDTO
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? Status { get; set; }
    public long TotalPrice { get; set; }
    public DateTime CreateDate { get; set; }
    public List<OrderItemDTO> Items { get; set; } = new();
}

public class OrderItemDTO
{
    public Guid Id { get; set; }
    public string? ProductName { get; set; }
    public long Price { get; set; }
    public int Quantity { get; set; }
    public string? SelectedSize { get; set; }
    public string? Image { get; set; }
    public Guid ProductId { get; set; }
}
public class CreateOrderItemDTO
{
    public Guid ProductId { get; set; }
    public string? ProductName { get; set; }
    public int Quantity { get; set; }
    public string? SelectedSize { get; set; }
    public string? Image { get; set; }
}

public class CreateOrderDTO
{
    public List<CreateOrderItemDTO> Items { get; set; } = new();
}