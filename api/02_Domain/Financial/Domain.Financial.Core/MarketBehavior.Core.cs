using Domain.Financial.Model;
using Domain.Financial.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Financial.Core
{
    public class MarketBehaviorService : IMarketBehaviorService
    {
        public IEnumerable<MarketInfo> Query(DateTime time, int interval)
        {
            var result = new List<MarketInfo>(){
                new MarketInfo(){ProductName="MarketBehavior 1"},
                new MarketInfo(){ProductName="MarketBehavior 2"}
            };
            return result;
        }


    }
}
