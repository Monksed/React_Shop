using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Converters;
using CoreData.Contexts;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        options.SerializerSettings.Converters.Add(new StringEnumConverter());
    });

builder.Services.AddDbContext<React_ShopContext>(options => 
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default"))
);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()      
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseStaticFiles();



app.MapControllers();

app.Run();