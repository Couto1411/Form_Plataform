namespace backendcsharp.DTO
{
    public class UsersDTO
    {
        public uint? Id { get; set; } = null!;

        public string? Nome { get; set; } = null!;

        public string? Email { get; set; } = null!;

        public string? Senha { get; set; } = null!;
        public string? ConfirmaSenha { get; set; } = null!;

        public string? Universidade { get; set; } = null!;
        public string? AppPassword { get; set; } = null!;

        public bool Admin { get; set; } = false!;

        public virtual ICollection<FormularioDTO>? Formularios { get; } = new List<FormularioDTO>();
        public virtual ICollection<CursosDTO>? Cursos { get; } = new List<CursosDTO>();
        public virtual ICollection<ModalidadesDTO>? TiposCursos { get; } = new List<ModalidadesDTO>();
    }
}
