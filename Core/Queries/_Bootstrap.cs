using Microsoft.Extensions.DependencyInjection;

namespace FinanceTracker.Core.Queries;

public static class Bootstrap
{
    public static IServiceCollection AddCoreViews(this IServiceCollection services)
    {
        return services
            .AddScoped<AssetsPerDateQuery>()
            .AddScoped<DebtsPerDateQuery>()
            .AddScoped<PortfolioPerDateQuery>()
            .AddScoped<WalletsPerDateQuery>()
            .AddScoped<WalletsSummaryPerDateQuery>();
    }
}