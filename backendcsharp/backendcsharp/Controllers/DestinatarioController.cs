using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System.Linq;

namespace backendcsharp.Controllers
{
    public class DestinatarioController : ControllerBase
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public DestinatarioController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }

        // Adicionar destinatario
        [HttpPost("users/{Id}/forms/{FormId}/enviados")]
        [Authorize("Bearer")]
        public async Task<ActionResult<uint>> InsertDestinatario([FromBody] DestinatarioDTO Destinatario, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(Destinatario.Email, "Email não informado");
                if (Destinatario.Id is null)
                {
                    HashSet<Tuple<string?, string?>> destinatariosDB = new(await ProjetoDbContext.Destinatarios.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync()) ;
                    Destinatario.Nome=String.IsNullOrEmpty(Destinatario.Nome) ? null : Destinatario.Nome;
                    Destinatario.Matricula = String.IsNullOrEmpty(Destinatario.Matricula) ? null : Destinatario.Matricula;
                    Destinatario.Telefone1 = String.IsNullOrEmpty(Destinatario.Telefone1) ? null : Destinatario.Telefone1;
                    Destinatario.Telefone2 = String.IsNullOrEmpty(Destinatario.Telefone2) ? null : Destinatario.Telefone2;
                    Destinatario.Curso = String.IsNullOrEmpty(Destinatario.Curso) ? null : Destinatario.Curso;
                    Destinatario.Modalidade = String.IsNullOrEmpty(Destinatario.Modalidade) ? null : Destinatario.Modalidade;
                    Destinatario.Cpf = String.IsNullOrEmpty(Destinatario.Cpf) ? null : Destinatario.Cpf;
                    // Chega a partir de uma hash se o usuario e matricula estão presentes no banco
                    if (!destinatariosDB.Contains(new Tuple<string?, string?>(Destinatario.Email, Destinatario.Matricula)))
                    {
                        // Adiciona destinatario no form original
                        var entity = new Destinatario()
                        {
                            Email = Destinatario.Email,
                            Matricula = Destinatario.Matricula,
                            Respondido = Destinatario.Respondido,
                            FormId = ((uint)FormId),
                            Nome = Destinatario.Nome,
                            Curso = Destinatario.Curso,
                            Modalidade = Destinatario.Modalidade,
                            DataColacao = Destinatario.DataColacao,
                            Telefone1 = Destinatario.Telefone1,
                            Telefone2 = Destinatario.Telefone2,
                            Sexo = Destinatario.Sexo,
                            Cpf = Destinatario.Cpf
                        };
                        destinatariosDB.Add(new Tuple<string?, string?>(Destinatario.Email, Destinatario.Matricula));
                        ProjetoDbContext.Destinatarios.Add(entity);

                        // Adiciona destinatario nos forms derivados
                        var FormsDerivados = await ProjetoDbContext.Formularios
                            .Select(s => new FormularioDTO
                            {
                                Id = s.Id,
                                DerivadoDeId = s.DerivadoDeId,
                            })
                            .Where(s => s.DerivadoDeId == FormId && s.DerivadoDeId != null)
                            .ToListAsync();
                        foreach (var item in FormsDerivados)
                        {
                            var entityDerivado = new Destinatario()
                            {
                                Respondido = Destinatario.Respondido,
                                FormId = item.Id ?? throw new Exception("Form id não existe"),
                                Nome = Destinatario.Nome,
                                Email = Destinatario.Email,
                                Matricula = Destinatario.Matricula,
                                Curso = Destinatario.Curso,
                                Modalidade = Destinatario.Modalidade,
                                DataColacao = Destinatario.DataColacao,
                                Telefone1 = Destinatario.Telefone1,
                                Telefone2 = Destinatario.Telefone2,
                                Sexo = Destinatario.Sexo,
                                Cpf = Destinatario.Cpf
                            };
                            ProjetoDbContext.Destinatarios.Add(entityDerivado);
                        }
                        // Salva no banco
                        await ProjetoDbContext.SaveChangesAsync();

                        return entity.Id;
                    }
                    else throw new Exception("Combinação de email+mtricula ja existe no formulario");
                }
                else throw new Exception("Id do email já existe");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        public class ModeloCefet
        {
            public string? Id_discente { get; set; } = null!;
            public string? Nome { get; set; } = null!;
            public string? Email { get; set; } = null!;
            public string? Telefone { get; set; } = null!;
            public string? Matricula { get; set; } = null!;
            public string? Cpf { get; set; } = null!;
            public string? Sexo { get; set; } = null!;
            public string? Curso { get; set; } = null!;
            public string? Modalidade { get; set; } = null!;
            public string? Data_colacao_grau { get; set; } = null!;
        }

        // Adicionar Emails a partir de modelo Cefet
        [HttpPost("users/{Id}/forms/{FormId}/cefetModel")]
        [Authorize("Bearer")]
        public async Task<ActionResult> InsertCefetEnvios([FromBody] List<ModeloCefet> Destinatarios, [FromRoute] int Id, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do usuário não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                if (Destinatarios is not null)
                {
                    HashSet<string> cursosDB = new(await ProjetoDbContext.Cursos.Where(s => s.ResponsavelId == Id).Select(c => c.Curso).ToListAsync());
                    HashSet<string> cursos = new();
                    HashSet<string> modalidadesDB = new(await ProjetoDbContext.Modalidades.Where(s => s.ResponsavelId == Id).Select(c => c.Modalidade).ToListAsync());
                    HashSet<string> modalidades = new();
                    HashSet<Tuple<string?, string?>> contatosDB = new(await ProjetoDbContext.Destinatarios.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync());
                    foreach (var item in Destinatarios)
                    {
                        item.Email = item.Email == "NULL" || item.Email == "null" ? null : item.Email;
                        item.Telefone = item.Telefone == "NULL" || item.Telefone == "null" ? null : item.Telefone;
                        if (item.Curso is not null) cursos.Add(item.Curso);
                        if (item.Modalidade is not null) modalidades.Add(item.Modalidade);
                        if (!contatosDB.Contains(new Tuple<string?, string?>(item.Email, item.Matricula)))
                        {
                            var entity = new Destinatario()
                            {
                                Email = item.Email,
                                Matricula = item.Matricula,
                                Respondido = 0,
                                FormId = ((uint)FormId),
                                Nome = item.Nome,
                                Curso = item.Curso,
                                DataColacao = item.Data_colacao_grau is not null ? DateTime.Parse(item.Data_colacao_grau) : null,
                                Modalidade = item.Modalidade,
                                Telefone1 = item.Telefone,
                                Sexo = item.Sexo,
                                Cpf = item.Cpf
                            };
                            contatosDB.Add(new Tuple<string?, string?>(item.Email, item.Matricula));
                            ProjetoDbContext.Destinatarios.Add(entity);
                        }
                    }
                    foreach (var item in cursos)
                    {
                        var entity = new Cursos()
                        {
                            Curso = item is not null ? item : throw new Exception("Um dos itens não possui nome do curso"),
                            ResponsavelId = (uint)Id
                        };
                        if (!cursosDB.Contains(entity.Curso))
                        {
                            ProjetoDbContext.Cursos.Add(entity);
                        }
                    }
                    foreach (var item in modalidades)
                    {
                        var entity = new Modalidades()
                        {
                            Modalidade = item is not null ? item : throw new Exception("Um dos itens não possui nome da modalidade"),
                            ResponsavelId = (uint)Id
                        };
                        if (!modalidadesDB.Contains(entity.Modalidade))
                        {
                            ProjetoDbContext.Modalidades.Add(entity);
                        }
                    }
                    await ProjetoDbContext.SaveChangesAsync();
                    return StatusCode(204);
                }
                else { throw new Exception("Lista vazia ou incorreta"); }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Modificar destinatario
        [HttpPut("users/{Id}/forms/{FormId}/enviados/{DestinatarioId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<DestinatarioDTO>> UpdateDestinatario([FromBody] DestinatarioDTO Destinatario,[FromRoute] int FormId, [FromRoute] int DestinatarioId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(DestinatarioId.ToString(), "Id do email não informado");
                Handlers.IdNegative(DestinatarioId, "Id do email inválido");
                Handlers.ExistsOrError(Destinatario.Email, "Email não informado");
                Destinatario.Id = ((uint)DestinatarioId);
                Destinatario.FormId = ((uint)FormId);
                if (Destinatario.Id is not null)
                {
                    HashSet<Tuple<string?, string?>> contatosDB = new(await ProjetoDbContext.Destinatarios.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync());
                    var Form = await ProjetoDbContext.Formularios.FirstOrDefaultAsync(s => s.Id == FormId);
                    if (Form is not null && Form.DerivadoDeId==null)
                    {
                        var Contato = await ProjetoDbContext.Destinatarios.FirstOrDefaultAsync(s => s.Id == DestinatarioId);
                        if (Contato != null)
                        {
                            if (Contato.Email == Destinatario.Email || !contatosDB.Contains(new Tuple<string?, string?>(Destinatario.Email, Destinatario.Matricula)))
                            {
                                // Modifica destinatario nos forms derivados
                                var FormsDerivados = await ProjetoDbContext.Formularios.Where(s => s.DerivadoDeId == FormId && s.DerivadoDeId != null).ToListAsync();
                                foreach (var item in FormsDerivados)
                                {
                                    var ContatoDerivado = await ProjetoDbContext.Destinatarios.FirstOrDefaultAsync(s => s.FormId == item.Id && s.Email == Contato.Email);
                                    if (ContatoDerivado != null)
                                    {
                                        if (ContatoDerivado.Respondido==0|| ContatoDerivado.Respondido == 1)
                                        {
                                            ContatoDerivado.Email = Destinatario.Email;
                                            ContatoDerivado.Nome = Destinatario.Nome;
                                            ContatoDerivado.Matricula = Destinatario.Matricula;
                                            ContatoDerivado.Curso = Destinatario.Curso;
                                            ContatoDerivado.Modalidade = Destinatario.Modalidade;
                                            ContatoDerivado.DataColacao = Destinatario.DataColacao;
                                            ContatoDerivado.Telefone1 = Destinatario.Telefone1;
                                            ContatoDerivado.Telefone2 = Destinatario.Telefone2;
                                            ContatoDerivado.Sexo = Destinatario.Sexo;
                                            ContatoDerivado.Cpf = Destinatario.Cpf;
                                        }
                                        else return StatusCode(402);
                                    }
                                    else throw new Exception("Email não presente nos formulários derivados");
                                }

                                // Modifica contato no form original
                                if (Contato.Respondido == 0 || Contato.Respondido == 1)
                                {
                                    Contato.Email = Destinatario.Email;
                                    Contato.Nome = Destinatario.Nome;
                                    Contato.Matricula = Destinatario.Matricula;
                                    Contato.Curso = Destinatario.Curso;
                                    Contato.Modalidade = Destinatario.Modalidade;
                                    Contato.DataColacao = Destinatario.DataColacao;
                                    Contato.Telefone1 = Destinatario.Telefone1;
                                    Contato.Telefone2 = Destinatario.Telefone2;
                                    Contato.Sexo = Destinatario.Sexo;
                                    Contato.Cpf = Destinatario.Cpf;
                                }
                                else return StatusCode(402);
                                await ProjetoDbContext.SaveChangesAsync();
                                return StatusCode(204);
                            }
                            else throw new Exception("Combinação de email+mtricula ja existe no formulario");
                        }
                        else throw new Exception("Id não encontrado (UpdateDestinatario)");
                    }
                    else throw new Exception("Formulário ñão é original");
                }
                else throw new Exception("Email de destinatario não existe");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar destinatarios por ID do formulário
        [HttpGet("users/{Id}/forms/{FormId}/enviados")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<DestinatarioDTO>>> GetDestinatariosById([FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                var form = await ProjetoDbContext.Formularios.FirstOrDefaultAsync(s => s.Id == FormId) ?? throw new Exception("Formulário não encontrado");
                form.Notificacao = 0;
                await ProjetoDbContext.SaveChangesAsync();
                var Destinatarios = await ProjetoDbContext.Destinatarios
                    .Select(s => new DestinatarioDTO
                    {
                        Id = s.Id,
                        Email= s.Email,
                        Nome = s.Nome,
                        Respondido = s.Respondido,
                        FormId = s.FormId,
                        Matricula = s.Matricula,
                        Curso = s.Curso,
                        Modalidade = s.Modalidade,
                        DataColacao = s.DataColacao,
                        Telefone1 = s.Telefone1,
                        Telefone2 = s.Telefone2,
                        Sexo = s.Sexo,
                        Cpf = s.Cpf
                    })
                    .Where(s => s.FormId == FormId)
                    .ToListAsync();
                if (Destinatarios.Count <= 0) return NotFound();
                else return Destinatarios;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Deleta destinatarios (E todas as respostas) ou apenas as repostas
        [HttpDelete("users/{Id}/forms/{FormId}/enviados/{RespostaId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteDestinatario([FromRoute] int RespostaId, [FromRoute] int FormId, [FromQuery] string deleta)
        {
            try
            {
                Handlers.ExistsOrError(RespostaId.ToString(), "Id do destinatario não informado");
                Handlers.ExistsOrError(deleta.ToString(), "Query de deletar não informada");
                Handlers.IdNegative(RespostaId, "Id do destinatario inválido");
                ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.RespostaId == RespostaId));
                ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.RespostaId == RespostaId));
                ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.RespostaId == RespostaId));
                var Contato = await ProjetoDbContext.Destinatarios.FirstOrDefaultAsync(s => s.Id == RespostaId);
                if (Contato != null)
                {
                    // Deleta destinatario
                    if (deleta == "true")
                    {
                        var FormsDerivados = await ProjetoDbContext.Formularios
                            .Select(s => new FormularioDTO
                            {
                                Id = s.Id,
                                DerivadoDeId = s.DerivadoDeId,
                            })
                            .Where(s => s.DerivadoDeId == FormId && s.DerivadoDeId != null)
                            .ToListAsync();
                        foreach (var item in FormsDerivados)
                        {
                            var ContatoDerivado = await ProjetoDbContext.Destinatarios.FirstOrDefaultAsync(s => s.FormId == item.Id && s.Email==Contato.Email);
                            if(ContatoDerivado is not null) ProjetoDbContext.Destinatarios.Remove(ContatoDerivado);
                        }
                        ProjetoDbContext.Destinatarios.Remove(Contato);
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    // Deleta resposta e torna envio possível
                    else
                    {
                        if (Contato.Respondido==2)
                        {
                            Contato.Respondido = 0;
                            await ProjetoDbContext.SaveChangesAsync();
                            return StatusCode(204);
                        }
                        else throw new Exception("Email não respondeu");
                    }
                }
                else throw new Exception("Id não encontrado (DeleteDestinatario)");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Ver se email pode ter acesso às questões
        [HttpGet("resposta/{FormId}/email/{Email}")]
        public async Task<ActionResult<DestinatarioDTO>> CheckUser([FromRoute] int FormId, [FromRoute] string Email)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(Email, "Email a ser checado não informado");
                var Destinatarios = await ProjetoDbContext.Destinatarios
                    .Select(s => new DestinatarioDTO
                    {
                        Id = s.Id,
                        Email = s.Email,
                        Respondido = s.Respondido,
                        FormId = s.FormId
                    })
                    .Where(s => (s.FormId == FormId && s.Email==Email && (s.Respondido==0 || s.Respondido==1)))
                    .FirstOrDefaultAsync();
                if (Destinatarios is null) return NotFound();
                else return Destinatarios;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
