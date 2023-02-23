namespace backendcsharp.DTO
{
    public class CursosDTO
    {
        public uint? id { get; set; }
        public uint? responsavelId { get; set; } = null!;
        public string? curso { get; set; } = null!;
        public virtual UsersDTO? responsavel { get; set; } = null!;
    }
}
