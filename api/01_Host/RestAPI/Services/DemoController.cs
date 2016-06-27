using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace RestAPI.Controllers
{
    public class DemoController : ApiController
    {
        

       

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        [HttpGet]
        public string info(int id)
        {
            return "demo1";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}