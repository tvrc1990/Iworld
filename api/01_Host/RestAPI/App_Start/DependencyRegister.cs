using Autofac;
using Autofac.Integration.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;

using DataAccess.Financial.Core;
using Domain.Financial.Service;

namespace RestAPI.App_Start
{
    //https://blogs.msdn.microsoft.com/roncain/2012/07/16/dependency-injection-with-asp-net-web-api-and-autofac/
    public class DependencyRegister
    {
        private ContainerBuilder builder = null;
        public DependencyRegister()
        {
            builder = new ContainerBuilder();
            var config = GlobalConfiguration.Configuration;

            RegisterType();

            //*找到程序下的所有 引用DLL
            Assembly[] assemblies = System.IO.Directory.GetFiles(AppDomain.CurrentDomain.RelativeSearchPath, "*.dll")
                .Select(m => Assembly.LoadFrom(m)).ToArray();

            builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly()).Where(t => typeof(ApiController).IsAssignableFrom(t) && !t.IsAbstract);

            //筛选符合类型的进行注册
            builder.RegisterAssemblyTypes(assemblies)
                .Where(type => type.Name.EndsWith("Service") && !type.IsAbstract)
                .AsSelf()   //自身服务，用于没有接口的类
                .AsImplementedInterfaces()  //接口服务
                .PropertiesAutowired()  //属性注入
                .InstancePerLifetimeScope()    //保证生命周期基于请求
                .InstancePerMatchingLifetimeScope(AutofacWebApiDependencyResolver.ApiRequestTag);

            var container = builder.Build();
            var resolver = new AutofacWebApiDependencyResolver(container);
            config.DependencyResolver = resolver;
        }

        public void RegisterType()
        {
            Financial_Regist();
        }

        private void Financial_Regist()
        {
            builder.RegisterType<MarketBehaviorDataAccess>().As<IMarketBehaviorRepository>().PropertiesAutowired();
        }
    }
}