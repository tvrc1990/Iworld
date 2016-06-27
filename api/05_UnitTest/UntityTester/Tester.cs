using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;
using BF.Unity.Extension;
using Newtonsoft.Json;
namespace UntityTester
{
    public class Test
    {
        public int Age { set; get; }
        private string Name { set; get; }
    }



    [TestClass]
    public class Tester
    {
        [TestMethod]
        public void SerializeTest()
        {
            var obj = new Test() { Age = 12 };
            var result = obj.ToXml();
            if (string.IsNullOrWhiteSpace(result) && result.Length>0)
            {
                Assert.Fail();
            }
        }


        string i = "a";
        string j = "a";
        [TestMethod]
        public void TestMethod1()
        {
            var a1 = new b();
            a1.n = 1;
            var b1 = (b)a1;
            a1.n = 2;
            var o = b1.n;
            var resrult = i.Equals(j, StringComparison.OrdinalIgnoreCase);

        }
    }

    public class a
    {
        public int n { set; get; }
    }

    public class b : a
    {
        public int u { set; get; }
    }
}
