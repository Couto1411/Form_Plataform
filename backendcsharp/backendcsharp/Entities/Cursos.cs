namespace backendcsharp.Entities
{
    public class Cursos
    {
        public uint Id { get; set; }
        public uint? ResponsavelId { get; set; }
        public string Curso { get; set; } = null!;
        public virtual Users? Responsavel { get; set; }
    }
}
