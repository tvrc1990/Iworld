using BF.Unity.Extension;
using BF.Unity.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;
using System.Web.Http;

namespace RestAPI
{
    public class RestAPIController : ApiController
    {

        public Result Result { set; get; }

        public RestAPIController()
        {
            Result = new Result() { Code = MessageType.Successful.GetValue().ToString(), Message = MessageType.Successful.GetName<MessageType>() };
        }

        //public object Reply()
        //{
        //    return Result.ToJson();
        //}

    }


    public enum MessageType
    {
        Successful = 200,
        Failure = 500,
        Warning = 201
    }

}