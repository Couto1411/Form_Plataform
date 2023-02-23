namespace backendcsharp.Entities
{
    public class TiposCursos
    {
        public uint Id { get; set; }
        public uint? ResponsavelId { get; set; }
        public string TipoCurso { get; set; } = null!;
        public virtual Users? Responsavel { get; set; }
    }
}
