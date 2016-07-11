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

        public Result Resopnse { set; get; }

        public Result Reply
        {
            get
            {
                //Resopnse.Data = Resopnse.Data.ToString();
                return Resopnse;
            }
        }

        public RestAPIController()
        {
            Resopnse = new Result() { Code = MessageType.Successful.GetValue().ToString(), Message = MessageType.Successful.GetName<MessageType>() };
        }



    }


}