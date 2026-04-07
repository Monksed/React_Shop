namespace Shopbackend.DTO;

public class OrderDTO
{
    public Guid Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal TotalPrice { get; set; }

    public List<OrderItemDTO> Items { get; set; } = new List<OrderItemDTO>();

}

public class OrderItemDTO
{
    public Guid Id { get; set; }

    public string? ProductName { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }


}
public class CreateOrderItemDTO
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
}

public class CreateOrderDTO
{
    public List<CreateOrderItemDTO> Items { get; set; } = new List<CreateOrderItemDTO>();
}