using FinanceTracker.Core;
using FinanceTracker.Web;
using Microsoft.EntityFrameworkCore;

// --- Start of the fix ---

// First, determine the correct WebRootPath based on the environment.
string? webRootPath = null;
if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") != "Development")
{
    var executableLocation = AppContext.BaseDirectory;
    webRootPath = Path.GetFullPath(Path.Combine(executableLocation, "..", "frontend"));
}

// Now, create the WebApplicationOptions and set the WebRootPath inside the initializer.
var options = new WebApplicationOptions
{
    Args = args,
    WebRootPath = webRootPath // This is the corrected line
};

// Create the builder with our pre-configured options.
var builder = WebApplication.CreateBuilder(options);

// --- End of the fix ---

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddCoreServices(builder.Configuration);

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

if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection(); // Disabled for HTTP-only
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

if (app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}

app.Run();