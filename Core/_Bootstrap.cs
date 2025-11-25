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
                Environment.ExpandEnvironmentVariables(
                    configuration.GetConnectionString("FinanceTracker")!
                )
            ))
            // Commands
            .AddScoped<DeleteValuesForDate>()
            .AddScoped<LedgerCommands>()
            .AddScoped<SetEntityValueCommand>()
            .AddScoped<SetInflationValueCommand>()
            .AddScoped<SetTargetCommand>()
            // Queries
            .AddScoped<ConfigQueries>()
            .AddScoped<LedgerQueries>()
            .AddScoped<ValueHistoryQueries>()
            // Repositories
            .AddScoped<Repository>();
    }
}