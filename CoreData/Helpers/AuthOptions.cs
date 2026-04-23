using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace CoreData.Helpers
{
    public class AuthOptions
    {
        public const string ISSUER = "ShopMarketExample";
        public const string AUDIENCE = "MobileClient";
        public const int LIFETIME = 30; // дней

        public static SymmetricSecurityKey GetSymmetricSecurityKey(string key) =>
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    }
}