using FinanceTracker.Core;
using FinanceTracker.Web;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddCoreServices(builder.Configuration);

// Get the web root path from a command-line argument for production
if (!builder.Environment.IsDevelopment())
{
    var webRoot = builder.Configuration.GetValue<string>("webroot");
    if (!string.IsNullOrEmpty(webRoot))
    {
        builder.WebHost.UseWebRoot(webRoot);
    }
}

// This ensures that your production app always listens on this URL
builder.WebHost.UseUrls("http://localhost:5288");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    // app.UseHsts(); // Disabled for HTTP-only
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<FinanceTrackerContext>();    
    await context.Database.MigrateAsync();

    await Seeder.SeedDataIfNecessary(context);
}

// app.UseHttpsRedirection(); // Disabled for HTTP-only
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
