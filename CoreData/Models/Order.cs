namespace CoreData.Models;

public partial class Order
{
    public int Id { get; set; }
    public string Status { get; set; } = "в корзине";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }

    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
}