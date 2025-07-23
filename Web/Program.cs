using FinanceTracker.Web;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<FinanceTrackerContext>(options => options.UseSqlite(
    builder.Configuration.GetConnectionString("FinanceTracker")
));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<FinanceTrackerContext>();    
    await context.Database.MigrateAsync();

    // var testPortfolio = FinanceTrackerContext.BuildTestPortfolio();
    //
    // var testPortfolioExists = await context.Portfolios.AnyAsync(portfolio => portfolio.Name == testPortfolio.Name);
    //
    // if (testPortfolioExists == false)
    // {
    //     await context.Portfolios.AddAsync(testPortfolio);
    //     await context.SaveChangesAsync();   
    // }
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
