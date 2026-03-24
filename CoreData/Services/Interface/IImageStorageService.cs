using Microsoft.AspNetCore.Mvc;

namespace CoreData.Services.Interface
{
    public interface IImageStorageService
    {
        FileStreamResult? GetImage(string relativePath);
    }
}