using FinanceTracker.Core;
using FinanceTracker.Web;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

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

// --- ADD THIS BLOCK ---
// In production, we need to serve the static files from our 'frontend' folder.
if (!app.Environment.IsDevelopment())
{
    // The path to the static files is relative to the backend executable.
    // In the packaged app, the structure is:
    //   - backend/ (where the .exe runs)
    //   - frontend/ (where the vite build output is)
    var frontendPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../frontend"));
    
    // Serve index.html for the root path
    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = new PhysicalFileProvider(frontendPath)
    });

    // Serve all other static files (js, css, etc.)
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(frontendPath)
    });
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