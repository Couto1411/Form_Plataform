namespace backendcsharp.Handles
{
    public class Handlers
    {
        public static void ExistsOrError(string? value, string msg)
        {
            if(value is null) throw new Exception(msg);
        }
        public static void NotExistsOrError(string? value, string msg)
        {
            if (value is not null) throw new Exception(msg);
        }
        public static void IdNegative(int? value,string msg)
        {
            if (value < 0) throw new Exception(msg);
        }
        public static bool IsValidGmail(string email)
        {
            if (email is null) return false;
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false; // suggested by @TK-421
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                if (addr.Host != "gmail.com") return false;
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
        }
        public static bool IsValidEmail(string email)
        {
            if (email is null) return false;
            var trimmedEmail = email.Trim();

            if (trimmedEmail.EndsWith("."))
            {
                return false; // suggested by @TK-421
            }
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == trimmedEmail;
            }
            catch
            {
                return false;
            }
        }
    }
}
