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
    }
}
