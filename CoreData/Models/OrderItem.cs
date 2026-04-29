namespace CoreData.Models;

public partial class OrderItem
{
    public Guid Id { get; set; }

    public string? ProductName { get; set; }

    public long Price { get; set; }

    public int Quantity { get; set; }

    public string? SelectedSize { get; set; }

    public string? Image { get; set; }

    public Guid OrderId { get; set; }
    
    public Guid ProductId { get; set; }

    public virtual Order? Order { get; set; }
    public virtual Product? Product { get; set; }
}