using BF.Unity.Common;
using BF.Unity.Extension;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RestAPI.Controllers
{
    public class A
    {
        public string value { set; get; }
        public string token { set; get; }
    }
    public class DemoController : RestAPIController
    {

        [HttpGet]
        public object InitRSA(string token)
        {
            var result = RSAHelper.InitRSA(token);

            Result.Data = new { PublicKeyModulus = result.PublicKeyModulus, PublicKeyExponent = result.PublicKeyExponent };

            return Result.ToJson();//Reply();
        }

        [HttpPost]
        public object Den(A a)
        {
            var result = a.value.Decrypt(a.token);

            Result.Data = result;

            return Result.ToJson();
        }

    }
}