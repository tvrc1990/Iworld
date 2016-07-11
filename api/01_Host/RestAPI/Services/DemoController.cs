using BF.Unity.Common;
using BF.Unity.Extension;
using BF.Unity.Helper;
using BF.Core.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RestAPI.Controllers
{
    public class DecryptInfo
    {
        public string value { set; get; }
        public string token { set; get; }
    }
    public class DemoController : RestAPIController
    {

        [HttpGet]
        public Result InitRSA(string token)
        {
            var result = RSAHelper.InitRSA(token);
            CacheProvider<string>.MemoryCache.Set(token, result.PrivateKey);
            Resopnse.Data = new { PublicKeyModulus = result.PublicKeyModulus, PublicKeyExponent = result.PublicKeyExponent };

            return Reply;
        }

        [HttpPost]
        public Result RSADecrypt(DecryptInfo info)
        {
            var privateKey = CacheProvider<string>.MemoryCache.Get(info.token);
            var result = info.value.Decrypt(privateKey);
            Resopnse.Data = result;
            return Reply;
        }

    }
}