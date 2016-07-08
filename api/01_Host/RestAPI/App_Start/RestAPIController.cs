using BF.Unity.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace RestAPI
{
    public class RestAPIController : ApiController
    {
        private Result _Reply;
        /// <summary>
        /// API响应客户端的基本结构
        /// </summary>
        public Result Reply
        {
            get { return _Reply == null ? new Result() { Code = "200" } : _Reply; }
            set { _Reply = value; }
        }

    }
}