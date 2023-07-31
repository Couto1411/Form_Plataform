namespace backendcsharp.Entities
{
    public class Modalidades
    {
        public uint Id { get; set; }
        public uint? ResponsavelId { get; set; }
        public string Modalidade { get; set; } = null!;
        public virtual Users? Responsavel { get; set; }
    }
}
