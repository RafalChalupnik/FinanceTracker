using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Queries;
using FinanceTracker.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FinanceTracker.Core;

public static class Bootstrap
{
    public static void AddCoreServices(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        services
            // Database
            .AddDbContext<FinanceTrackerContext>(options => options.UseSqlite(
                configuration.GetConnectionString("FinanceTracker")
                // builder => builder.MigrationsAssembly(typeof(FinanceTrackerContext).Assembly.GetName().Name)
            ))
            // Commands
            .AddScoped<DeleteValuesForDate>()
            .AddScoped<DeleteEntityCommand>()
            .AddScoped<SetEntityValueCommand>()
            .AddScoped<SetInflationValueCommand>()
            .AddScoped<SetTargetCommand>()
            .AddScoped<UpsertEntityCommand>()
            // Queries
            .AddScoped<ConfigQueries>()
            .AddScoped<ValueHistoryQueries>()
            // Repositories
            .AddScoped<Repository>()
            .AddScoped<GroupTypeRepository>();
    }
}