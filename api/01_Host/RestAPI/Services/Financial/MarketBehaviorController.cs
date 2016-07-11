using Autofac;
using BF.Unity.Common;
using Domain.Financial.Model;
using Domain.Financial.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RestAPI.Services.Financial
{
    public class MarketBehaviorController : RestAPIController
    {
        IMarketBehaviorService marketBehaviorService = null;

        public MarketBehaviorController(IMarketBehaviorService _marketBehaviorService)
        {
            this.marketBehaviorService = _marketBehaviorService;
        }


        [HttpGet]
        public IEnumerable<MarketInfo> Get()
        {
            var result = marketBehaviorService.Query(DateTime.Now, 1);

            return result;
        }

    }
}
