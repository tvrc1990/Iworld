using Domain.Basic;
using Domain.Financial.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Financial.Service
{

    public interface IMarketBehaviorRepository : IDepend
    {
        IEnumerable<MarketInfo> Query(DateTime time, int interval);
    }
}
