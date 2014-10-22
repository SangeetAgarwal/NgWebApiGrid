using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(NgWebApiGrid.Web.Startup))]
namespace NgWebApiGrid.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
