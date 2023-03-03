namespace backendcsharp.DTO
{
    public class UsersDTO
    {
        public uint? id { get; set; } = null!;

        public string? nome { get; set; } = null!;

        public string? email { get; set; } = null!;

        public string? senha { get; set; } = null!;
        public string? confirmaSenha { get; set; } = null!;

        public string? universidade { get; set; } = null!;
        public string? appPassword { get; set; } = null!;

        public bool admin { get; set; } = false!;

        public virtual ICollection<FormularioDTO>? Formularios { get; } = new List<FormularioDTO>();
        public virtual ICollection<CursosDTO>? Cursos { get; } = new List<CursosDTO>();
        public virtual ICollection<TiposCursosDTO>? TiposCursos { get; } = new List<TiposCursosDTO>();
    }
}
