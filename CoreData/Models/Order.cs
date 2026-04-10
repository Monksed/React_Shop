namespace CoreData.Models;

public partial class Order
{
    public Guid Id { get; set; }

    public string? Status { get; set; } = "в корзине";

    public long TotalPrice { get; set; }

    public DateTime CreateDate { get; set; }

    public Guid UserId { get; set; }

    public virtual User? User { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}