using System;
using System.Collections.Generic;

namespace backendcsharp.Entities;

public partial class Users
{
    public uint Id { get; set; }

    public string Nome { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Senha { get; set; } = null!;

    public string Universidade { get; set; } = null!;

    public bool Admin { get; set; }

    public string AppPassword { get; set; } = null!;

    public virtual ICollection<Formulario> Formularios { get; } = new List<Formulario>();
    public virtual ICollection<Cursos> Cursos { get; } = new List<Cursos>();
    public virtual ICollection<Modalidades> Modalidades { get; } = new List<Modalidades>();
}
