using Microsoft.Extensions.DependencyInjection;

namespace FinanceTracker.Core.Views;

public static class Bootstrap
{
    public static IServiceCollection AddCoreViews(this IServiceCollection services)
    {
        return services
            .AddScoped<AssetsPerDateView>()
            .AddScoped<DebtsPerDateView>()
            .AddScoped<PortfolioPerDateView>()
            .AddScoped<WalletsPerDateView>()
            .AddScoped<WalletsSummaryPerDateView>();
    }
}