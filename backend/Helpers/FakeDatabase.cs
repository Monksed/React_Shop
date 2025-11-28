using System.Xml.Linq;

namespace ShopBackend.Helpers
{
    public static class FakeDatabase
    {
        public static List<Product> _products = new List<Product>()
        {
            new Product()
            {
                Id = 1,
                Image = "rick.png",
                Title = "Rick Owens",
                Description = "Кроссовки Rick Owens Low-Top Sneakers Black",
                Price = 55000,
                Quantity = 5
            },
            new Product()
            {
                Id = 2,
                Image = "2002r.png",
                Title = "New Balance 2002R",
                Description = "Кроссовки New Balance 2002R Phantom Black",
                Price = 15000,
                Quantity = 0
            },
            new Product()
            {
                Id = 3,
                Image = "gazelle.png",
                Title = "Adidas Gazelle",
                Description = "Кроссовки Adidas Gazelle Gazelle W Brown",
                Price = 15000,
                Quantity = 4
            },
            new Product()
            {
                Id = 4,
                Image = "aj4.png",
                Title = "Air Jordan 4",
                Description = "Кроссовки Air Jordan 4 Retro Taupe Haze",
                Price = 38000,
                Quantity = 3
            }
        };
    }

    public class Product
    {
        public int Id { get; set; }
        public string Image { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public int Price { get; set; }
        public int Quantity { get; set; }

    }
}
