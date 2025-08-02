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
            .AddScoped<DeleteAllEvaluationsForDateCommand>()
            .AddScoped<EvaluateEntityCommand>()
            // Queries
            .AddScoped<ConfigQueries>()
            .AddScoped<SummaryQueries>();
    }
}