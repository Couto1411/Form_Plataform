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
                Handlers.ExistsOrError(Destinatario.email, "Email não informado");
                if (Destinatario.id is null)
                {
                    HashSet<Tuple<string?, string?>> destinatariosDB = new(await ProjetoDbContext.Destinatarios.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync()) ;
                    Destinatario.nome=String.IsNullOrEmpty(Destinatario.nome) ? null : Destinatario.nome;
                    Destinatario.matricula = String.IsNullOrEmpty(Destinatario.matricula) ? null : Destinatario.matricula;
                    Destinatario.telefone1 = String.IsNullOrEmpty(Destinatario.telefone1) ? null : Destinatario.telefone1;
                    Destinatario.telefone2 = String.IsNullOrEmpty(Destinatario.telefone2) ? null : Destinatario.telefone2;
                    Destinatario.curso = String.IsNullOrEmpty(Destinatario.curso) ? null : Destinatario.curso;
                    Destinatario.modalidade = String.IsNullOrEmpty(Destinatario.modalidade) ? null : Destinatario.modalidade;
                    Destinatario.cpf = String.IsNullOrEmpty(Destinatario.cpf) ? null : Destinatario.cpf;
                    // Chega a partir de uma hash se o usuario e matricula estão presentes no banco
                    if (!destinatariosDB.Contains(new Tuple<string?, string?>(Destinatario.email, Destinatario.matricula)))
                    {
                        // Adiciona destinatario no form original
                        var entity = new Destinatario()
                        {
                            Email = Destinatario.email,
                            Matricula = Destinatario.matricula,
                            Respondido = Destinatario.respondido,
                            FormId = ((uint)FormId),
                            Nome = Destinatario.nome,
                            Curso = Destinatario.curso,
                            Modalidade = Destinatario.modalidade,
                            DataColacao = Destinatario.dataColacao,
                            Telefone1 = Destinatario.telefone1,
                            Telefone2 = Destinatario.telefone2,
                            Sexo = Destinatario.sexo,
                            Cpf = Destinatario.cpf
                        };
                        destinatariosDB.Add(new Tuple<string?, string?>(Destinatario.email, Destinatario.matricula));
                        ProjetoDbContext.Destinatarios.Add(entity);

                        // Adiciona destinatario nos forms derivados
                        var FormsDerivados = await ProjetoDbContext.Formularios
                            .Select(s => new FormularioDTO
                            {
                                id = s.Id,
                                derivadoDeId = s.DerivadoDeId,
                            })
                            .Where(s => s.derivadoDeId == FormId && s.derivadoDeId != null)
                            .ToListAsync();
                        foreach (var item in FormsDerivados)
                        {
                            var entityDerivado = new Destinatario()
                            {
                                Respondido = Destinatario.respondido,
                                FormId = item.id,
                                Nome = Destinatario.nome,
                                Email = Destinatario.email,
                                Matricula = Destinatario.matricula,
                                Curso = Destinatario.curso,
                                Modalidade = Destinatario.modalidade,
                                DataColacao = Destinatario.dataColacao,
                                Telefone1 = Destinatario.telefone1,
                                Telefone2 = Destinatario.telefone2,
                                Sexo = Destinatario.sexo,
                                Cpf = Destinatario.cpf
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
            public string? id_discente { get; set; } = null!;
            public string? nome { get; set; } = null!;
            public string? email { get; set; } = null!;
            public string? telefone { get; set; } = null!;
            public string? matricula { get; set; } = null!;
            public string? cpf { get; set; } = null!;
            public string? sexo { get; set; } = null!;
            public string? curso { get; set; } = null!;
            public string? modalidade { get; set; } = null!;
            public string? data_colacao_grau { get; set; } = null!;
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
                        item.email = item.email == "NULL" || item.email == "null" ? null : item.email;
                        item.telefone = item.telefone == "NULL" || item.telefone == "null" ? null : item.telefone;
                        if (item.curso is not null) cursos.Add(item.curso);
                        if (item.modalidade is not null) modalidades.Add(item.modalidade);
                        if (!contatosDB.Contains(new Tuple<string?, string?>(item.email, item.matricula)))
                        {
                            var entity = new Destinatario()
                            {
                                Email = item.email,
                                Matricula = item.matricula,
                                Respondido = 0,
                                FormId = ((uint)FormId),
                                Nome = item.nome,
                                Curso = item.curso,
                                DataColacao = item.data_colacao_grau is not null ? DateTime.Parse(item.data_colacao_grau) : null,
                                Modalidade = item.modalidade,
                                Telefone1 = item.telefone,
                                Sexo = item.sexo,
                                Cpf = item.cpf
                            };
                            contatosDB.Add(new Tuple<string?, string?>(item.email, item.matricula));
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
                Handlers.ExistsOrError(Destinatario.email, "Email não informado");
                Destinatario.id = ((uint)DestinatarioId);
                Destinatario.formId = ((uint)FormId);
                if (Destinatario.id is not null)
                {
                    HashSet<Tuple<string?, string?>> contatosDB = new(await ProjetoDbContext.Destinatarios.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync());
                    var Form = await ProjetoDbContext.Formularios.FirstOrDefaultAsync(s => s.Id == FormId);
                    if (Form is not null && Form.DerivadoDeId==null)
                    {
                        var Contato = await ProjetoDbContext.Destinatarios.FirstOrDefaultAsync(s => s.Id == DestinatarioId);
                        if (Contato != null)
                        {
                            if (Contato.Email == Destinatario.email || !contatosDB.Contains(new Tuple<string?, string?>(Destinatario.email, Destinatario.matricula)))
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
                                            ContatoDerivado.Email = Destinatario.email;
                                            ContatoDerivado.Nome = Destinatario.nome;
                                            ContatoDerivado.Matricula = Destinatario.matricula;
                                            ContatoDerivado.Curso = Destinatario.curso;
                                            ContatoDerivado.Modalidade = Destinatario.modalidade;
                                            ContatoDerivado.DataColacao = Destinatario.dataColacao;
                                            ContatoDerivado.Telefone1 = Destinatario.telefone1;
                                            ContatoDerivado.Telefone2 = Destinatario.telefone2;
                                            ContatoDerivado.Sexo = Destinatario.sexo;
                                            ContatoDerivado.Cpf = Destinatario.cpf;
                                        }
                                        else return StatusCode(402);
                                    }
                                    else throw new Exception("Email não presente nos formulários derivados");
                                }

                                // Modifica contato no form original
                                if (Contato.Respondido == 0 || Contato.Respondido == 1)
                                {
                                    Contato.Email = Destinatario.email;
                                    Contato.Nome = Destinatario.nome;
                                    Contato.Matricula = Destinatario.matricula;
                                    Contato.Curso = Destinatario.curso;
                                    Contato.Modalidade = Destinatario.modalidade;
                                    Contato.DataColacao = Destinatario.dataColacao;
                                    Contato.Telefone1 = Destinatario.telefone1;
                                    Contato.Telefone2 = Destinatario.telefone2;
                                    Contato.Sexo = Destinatario.sexo;
                                    Contato.Cpf = Destinatario.cpf;
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
                var Destinatarios = await ProjetoDbContext.Destinatarios
                    .Select(s => new DestinatarioDTO
                    {
                        id = s.Id,
                        email= s.Email,
                        nome = s.Nome,
                        respondido = s.Respondido,
                        formId = s.FormId,
                        matricula = s.Matricula,
                        curso = s.Curso,
                        modalidade = s.Modalidade,
                        dataColacao = s.DataColacao,
                        telefone1 = s.Telefone1,
                        telefone2 = s.Telefone2,
                        sexo = s.Sexo,
                        cpf = s.Cpf
                    })
                    .Where(s => s.formId == FormId)
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
                                id = s.Id,
                                derivadoDeId = s.DerivadoDeId,
                            })
                            .Where(s => s.derivadoDeId == FormId && s.derivadoDeId != null)
                            .ToListAsync();
                        foreach (var item in FormsDerivados)
                        {
                            var ContatoDerivado = await ProjetoDbContext.Destinatarios.FirstOrDefaultAsync(s => s.FormId == item.id && s.Email==Contato.Email);
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
                        id = s.Id,
                        email = s.Email,
                        respondido = s.Respondido,
                        formId = s.FormId
                    })
                    .Where(s => (s.formId == FormId && s.email==Email && (s.respondido==0 || s.respondido==1)))
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
