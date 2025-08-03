using FinanceTracker.Core.Commands;
using FinanceTracker.Core.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace FinanceTracker.Core;

public static class Bootstrap
{
    public static IServiceCollection AddCoreCommandsAndQueries(this IServiceCollection services)
    {
        return services
            // Commands
            .AddScoped<DeleteValuesForDate>()
            .AddScoped<DeleteEntityCommand>()
            .AddScoped<SetEntityValueCommand>()
            .AddScoped<UpsertEntityCommand>()
            // Queries
            .AddScoped<ConfigQueries>()
            .AddScoped<ValueHistoryQueries>();
    }
}