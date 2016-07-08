using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Runtime.Caching;
namespace RestAPI
{
    public class RSAKey
    {
        public string PrimaryKey{ set; get; }
        public string PrivateKey { set; get; }
        public string PublicKeyExponent { set; get; }
        public string PublicKeyModulus { set; get; }
    }

    public static class RSAHelper
    {
        private static RSACryptoServiceProvider _RSAProvider;

        private static RSACryptoServiceProvider RSAProvider
        {
            get
            {
                if (_RSAProvider == null)
                {
                    _RSAProvider = new RSACryptoServiceProvider();
                }
                return _RSAProvider;
            }
        }

        private static string BytesToHexString(byte[] bytes)
        {
            StringBuilder hexString = new StringBuilder(64);

            for (int i = 0; i < bytes.Length; i++)
            {
                hexString.Append(String.Format("{0:X2}", bytes[i]));
            }
            return hexString.ToString();
        }

        private static byte[] HexStringToBytes(string strObj)
        {
            if (strObj.Length == 0)
            {
                return new byte[] { 0 };
            }

            if (strObj.Length % 2 == 1)
            {
                strObj = "0" + strObj;
            }

            byte[] result = new byte[strObj.Length / 2];

            for (int i = 0; i < strObj.Length / 2; i++)
            {
                result[i] = byte.Parse(strObj.Substring(2 * i, 2), System.Globalization.NumberStyles.AllowHexSpecifier);
            }

            return result;
        }

        public static RSAKey InitRSA(string primaryKey)
        {       
            var privateKey= RSAProvider.ToXmlString(true);
            MemoryCache.Default.Set(primaryKey, privateKey, DateTimeOffset.MaxValue);

            var parameter = RSAProvider.ExportParameters(true);
            var publicKeyExponent = BytesToHexString(parameter.Exponent);
            var publicKeyModulus = BytesToHexString(parameter.Modulus);

            return new RSAKey() { PublicKeyExponent = publicKeyExponent, PublicKeyModulus = publicKeyModulus, PrivateKey = privateKey };
        }

        public static string Decrypt(this string strObj, string primaryKey)
        {
            var privateKey = MemoryCache.Default.Get(primaryKey);
            RSAProvider.FromXmlString(privateKey.ToString());
            var result = RSAProvider.Decrypt(HexStringToBytes(strObj), false);
            return new ASCIIEncoding().GetString(result);
        }


    }
}