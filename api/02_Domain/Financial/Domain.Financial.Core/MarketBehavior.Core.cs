using Domain.Financial.Model;
using Domain.Financial.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Domain.Financial.Service;

namespace Domain.Financial.Core
{

    public class MarketBehaviorService : IMarketBehaviorService
    {
        public IMarketBehaviorRepository MarketBehaviorRepository { set; get; }
        public IEnumerable<MarketInfo> Query(DateTime time, int interval)
        {
            var result = MarketBehaviorRepository.Query(time, interval);
            return result;
        }


    }
}
