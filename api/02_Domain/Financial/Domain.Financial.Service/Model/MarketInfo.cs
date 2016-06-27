using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Financial.Model
{
    public class MarketInfo
    {
        public string ProductName { set; get; }
        public DateTime Time { set; get; }
        public decimal NewPrice { set; get; }
        public decimal OpeningPrice { set; get; }
        public decimal ClosingPrice { set; get; }
        public decimal HighestPrice { set; get; }
        public decimal LowestPrice { set; get; }

        public decimal TotalTradingAmount { set; get; }
        public long TotalTradingVolume { set; get; }
        public MarketStatus Status { set; get; }
    }

    public enum MarketStatus
    {
        Trading = 1,
        Closed = 2
    }
}


