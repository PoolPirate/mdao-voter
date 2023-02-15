using Common.Extensions;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.EntityFrameworkCore;
using MDAOVoter.Configuration;
using MDAOVoter.Database;

namespace MDAOVoter;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication(Configuration, options =>
        {
            options.UseServiceLevels = false;
            options.ValidateServiceLevelsOnInitialize = true;
            options.IgnoreIServiceWithoutLifetime = false;
        },
        Program.Assembly);

        services.AddControllers();

        services.AddResponseCaching();

        services.AddDbContext<ProposalContext>((provider, options) =>
        {
            var dbOptions = provider.GetRequiredService<DatabaseOptions>();
            options.UseNpgsql(dbOptions.AppConnectionString);
        });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void ConfigurePipeline(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(policy =>
        {
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
            policy.AllowAnyOrigin();
        });

        app.UseStaticFiles();

        var options = new RewriteOptions()
            .AddRewrite("^(?!api\\/|Api\\/)(.+)\\/$", "$1.html", true)
            .AddRewrite("^(?!api\\/|Api\\/)(.+)", "$1.html", true);

        app.UseRewriter(options);

        app.UseStaticFiles();

        app.UseResponseCaching();

        app.UseRouting();
    }

    public void ConfigureRoutes(IEndpointRouteBuilder routes)
    {
        routes.MapControllers();

        routes.MapFallbackToFile("index.html");
    }
}