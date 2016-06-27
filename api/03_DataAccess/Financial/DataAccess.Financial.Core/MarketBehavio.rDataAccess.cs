using Domain.Financial.Model;
using Domain.Financial.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Financial.Core
{
    public class MarketBehaviorDataAccess : IMarketBehaviorRepository
    {

        public IEnumerable<MarketInfo> Query(DateTime time, int interval)
        {
            var result = new List<MarketInfo>(){
                new MarketInfo(){
                     ProductName="Market 1",
                     Time=DateTime.Now,
                     NewPrice=14.6m,
                     OpeningPrice =13m,
                     ClosingPrice =12m,
                     HighestPrice=16m,
                     LowestPrice= 12m,
                     TotalTradingAmount=28371.12m,
                     TotalTradingVolume=8473
                },
                new MarketInfo(){
                     ProductName="Market 2",
                     Time=DateTime.Now,
                     NewPrice=14.6m,
                     OpeningPrice =13m,
                     ClosingPrice =12m,
                     HighestPrice=16m,
                     LowestPrice= 12m,
                     TotalTradingAmount=28371.12m,
                     TotalTradingVolume=8473
                },new MarketInfo(){
                     ProductName="Market 3",
                     Time=DateTime.Now,
                     NewPrice=14.6m,
                     OpeningPrice =13m,
                     ClosingPrice =12m,
                     HighestPrice=16m,
                     LowestPrice= 12m,
                     TotalTradingAmount=28371.12m,
                     TotalTradingVolume=8473
                },
                new MarketInfo(){
                     ProductName="Market 4",
                     Time=DateTime.Now,
                     NewPrice=14.6m,
                     OpeningPrice =13m,
                     ClosingPrice =12m,
                     HighestPrice=16m,
                     LowestPrice= 12m,
                     TotalTradingAmount=28371.12m,
                     TotalTradingVolume=8473
                }
            };
            return result;
        }
    }
}
