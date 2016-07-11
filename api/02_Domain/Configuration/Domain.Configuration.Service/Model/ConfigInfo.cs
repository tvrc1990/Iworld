using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Configuration.Service.Model
{
    public class ConfigInfo
    {
        public string Key { set; get; }

        public string Type { set; get; }

        public string Content { set; get; }
    }

    public enum ConfigType
    {
        SystemSimple = 0,
        SystemComplex = 1,
        BusinessSimple = 2,
        BusinessComplex = 3
    }
}
