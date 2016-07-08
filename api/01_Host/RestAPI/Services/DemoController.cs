using BF.Unity.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RestAPI.Controllers
{
    public class DemoController : RestAPIController
    {


        [HttpGet]
        public Result InitRSA(string token)
        {
            var result=RSAHelper.InitRSA(token);
            Reply.Data = result;
            return Reply;
        }

        [HttpGet]
        public Result Decrypt(string value, string token)
        {
            Reply.Data = value.Decrypt(token);
            return Reply;
        }

    }
}