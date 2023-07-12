using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;

namespace backendcsharp.Controllers
{
    [ApiController]
    public class FormsController : ControllerBase
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public FormsController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }

        // Adicionar Form
        [HttpPost("users/{Id}/forms")]
        [Authorize("Bearer")]
        public async Task<ActionResult<uint>> InsertForm([FromBody] FormularioDTO Form, [FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Form.titulo, "Nome não informado");
                Handlers.ExistsOrError(Id.ToString(), "Responsável não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                if (Form.id is null)
                {
                    var entity = new Formulario()
                    {
                        Titulo = Form.titulo is null?"":Form.titulo,
                        ResponsavelId = (uint) Id,
                        MsgEmail = Form.msgEmail,
                        DerivadoDeId= Form.derivadoDeId
                    };
                    if (entity.MsgEmail is not null && !entity.MsgEmail.Contains(@" {replaceStringHere} ")) throw new Exception("Mensagem de Email não corresponde ao padrão");
                    ProjetoDbContext.Formularios.Add(entity);
                    await ProjetoDbContext.SaveChangesAsync();
                    if (entity.DerivadoDeId is not null)
                    {
                        var EnviadosOrig = await ProjetoDbContext.Enviados.Where(s => s.FormId == entity.DerivadoDeId).ToListAsync();
                        foreach (var item in EnviadosOrig)
                        {
                            var envio = new Enviado()
                            {
                                Respondido = 0,
                                FormId = entity.Id,
                                Nome = item.Nome,
                                Email = item.Email,
                                Matricula = item.Matricula,
                                Curso = item.Curso,
                                DataColacao = item.DataColacao,
                                TipoDeCurso = item.TipoDeCurso,
                                Telefone1 = item.Telefone1,
                                Telefone2 = item.Telefone2,
                                Sexo = item.Sexo,
                                Cpf = item.Cpf
                            };
                            ProjetoDbContext.Enviados.Add(envio);
                        }
                    }
                    await ProjetoDbContext.SaveChangesAsync();
                    return entity.Id;
                } else throw new Exception("Id do formulário já existe");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Modificar Form
        [HttpPut("users/{Id}/forms/{FormId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<FormularioDTO>> UpdateForm([FromBody] FormularioDTO Form, [FromRoute] int Id, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(Form.titulo, "Nome não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Form.id = ((uint)FormId);
                Form.responsavelId = ((uint)Id);
                if (Form.id is not null)
                {
                    var entity = await ProjetoDbContext.Formularios.FirstOrDefaultAsync(s => s.Id == FormId);
                    if (entity != null)
                    {
                        if(entity.DerivadoDeId is null)
                        {
                            entity.Titulo = Form.titulo is null ? "" : Form.titulo;
                        }
                        entity.MsgEmail = Form.msgEmail;
                        if (entity.MsgEmail is not null && !entity.MsgEmail.Contains(@" {replaceStringHere} ")) throw new Exception("Mensagem de Email não corresponde ao padrão");
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    else throw new Exception("Id não encontrado (UpdateForm)");
                }
                else throw new Exception("Formulário não informado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar todos os formulários
        // ADMIN----------------------------------
        [HttpGet("forms/admin/{Id}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<FormularioDTO>>> GetForms([FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do responsável inválido");
                var Admin = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    nome = s.Nome,
                    email = s.Email,
                    admin = s.Admin,
                    appPassword = s.AppPassword,
                    universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.id == Id);
                if (Admin is null) return NotFound();
                if (Admin.admin)
                {
                    var List = await ProjetoDbContext.Formularios.Select(
                        s => new FormularioDTO
                        {
                            id = s.Id,
                            responsavelId = s.ResponsavelId,
                            msgEmail = s.MsgEmail,
                            dataEnviado = s.DataEnviado,
                            titulo = s.Titulo,
                        }
                    ).ToListAsync();

                    if (List.Count < 0) return NotFound();
                    else return List;
                }
                else return StatusCode(401);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar formulários por ID do responável
        [HttpGet("users/{Id}/forms")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<FormularioDTO>>> GetFormById([FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                var Forms = await ProjetoDbContext.Formularios
                    .Select(s => new FormularioDTO
                    {
                        id = s.Id,
                        titulo = s.Titulo,
                        derivadoDeId = s.DerivadoDeId,
                        msgEmail = s.MsgEmail,
                        dataEnviado = s.DataEnviado,
                        responsavelId = s.ResponsavelId
                    })
                    .Where(s => s.responsavelId == Id && s.derivadoDeId == null)
                    .ToListAsync();
                foreach (var item in Forms)
                {
                    var FormsDerivados = await ProjetoDbContext.Formularios
                        .Select(s => new FormularioDTO
                        {
                            id = s.Id,
                            titulo = s.Titulo,
                            derivadoDeId = s.DerivadoDeId,
                            msgEmail = s.MsgEmail,
                            dataEnviado = s.DataEnviado,
                            responsavelId = s.ResponsavelId
                        })
                        .Where(s => s.derivadoDeId == item.id && s.derivadoDeId != null)
                        .ToListAsync();
                    item.derivados.AddRange(FormsDerivados);
                }
                if (Forms.Count < 0) return NotFound();
                else return Forms;
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Deleta formulário (E tudo incluso nele)
        [HttpDelete("users/{Id}/forms/{FormId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteForm([FromRoute] int FormId)
        {
            try
            {
                var forms = await ProjetoDbContext.Formularios.Where(s => s.DerivadoDeId == FormId).ToListAsync();
                foreach (var item in forms)
                {
                    var envios = await ProjetoDbContext.Enviados.Where(s => s.FormId == item.Id).ToListAsync();
                    foreach (var envio in envios)
                    {
                        ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.RespostaId == envio.Id));
                        ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.RespostaId == envio.Id));
                        ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.RespostaId == envio.Id));
                    }
                    ProjetoDbContext.Enviados.RemoveRange(ProjetoDbContext.Enviados.Where(s => s.FormId == item.Id));
                    ProjetoDbContext.Formularios.Remove(item);
                }
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                var questoes = await ProjetoDbContext.Questoes
                    .Select(s => new QuestoesDTO
                    {
                        id = s.Id,
                        formId = s.FormId
                    })
                    .Where(s => s.formId==FormId)
                    .ToListAsync();
                foreach (var item in questoes)
                {
                    ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.QuestaoId == item.id));
                    ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.QuestaoId == item.id));
                    ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.QuestaoId == item.id));
                }
                ProjetoDbContext.Enviados.RemoveRange(ProjetoDbContext.Enviados.Where(s => s.FormId == FormId));
                ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.FormId == FormId));
                var entity = new Formulario()
                {
                    Id = ((uint)FormId)
                };
                ProjetoDbContext.Formularios.Remove(entity);
                await ProjetoDbContext.SaveChangesAsync();
                return StatusCode(204);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
