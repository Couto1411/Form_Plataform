namespace backendcsharp.DTO
{
    public class TiposCursosDTO
    {
        public uint? id { get; set; }
        public uint? responsavelId { get; set; } = null!;
        public string? tipoCurso { get; set; } = null!;
        public virtual UsersDTO? responsavel { get; set; } = null!;
    }
}
