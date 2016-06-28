using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.WebApi;
using Domain.Basic;
namespace RestAPI
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterAllAutofac();
        }

        /// <summary>
        /// 注入资料
        /// https://blogs.msdn.microsoft.com/roncain/2012/07/16/dependency-injection-with-asp-net-web-api-and-autofac/
        /// </summary>
        private void RegisterAllAutofac()
        {
            var builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;

            //手动注入
            // builder.RegisterInstance<Domain.Financial.Service.IMarketBehaviorService>(new Domain.Financial.Core.MarketBehaviorService());

            //属性注入
            builder.RegisterType<IDependency>().PropertiesAutowired();

            //*自动注入
            //*找到程序下的所有 引用DLL
            Assembly[] assemblies = System.IO.Directory.GetFiles(AppDomain.CurrentDomain.RelativeSearchPath, "*.dll")
                .Select(m => Assembly.LoadFrom(m)).ToArray();

            builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly()).Where(t => typeof(ApiController).IsAssignableFrom(t) && !t.IsAbstract);

            //筛选符合类型的进行注册
            builder.RegisterAssemblyTypes(assemblies)
                .Where(type => typeof(IDependency).IsAssignableFrom(type) && !type.IsAbstract)
                .AsSelf()   //自身服务，用于没有接口的类
                .AsImplementedInterfaces()  //接口服务
                .PropertiesAutowired()  //属性注入
                .InstancePerLifetimeScope()    //保证生命周期基于请求
                .InstancePerMatchingLifetimeScope(AutofacWebApiDependencyResolver.ApiRequestTag);

            var container = builder.Build();
            var resolver = new AutofacWebApiDependencyResolver(container);
            config.DependencyResolver = resolver;

        }
    }
}