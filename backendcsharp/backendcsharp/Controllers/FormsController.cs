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
                Handlers.ExistsOrError(Form.Titulo, "Nome não informado");
                Handlers.ExistsOrError(Id.ToString(), "Responsável não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                if (Form.Id is null)
                {
                    var entity = new Formulario()
                    {
                        Titulo = Form.Titulo is null?"":Form.Titulo,
                        ResponsavelId = (uint) Id,
                        MsgEmail = Form.MsgEmail,
                        DerivadoDeId= Form.DerivadoDeId
                    };
                    if (entity.MsgEmail is not null && !entity.MsgEmail.Contains(@" {replaceStringHere} ")) throw new Exception("Mensagem de Email não corresponde ao padrão");
                    ProjetoDbContext.Formularios.Add(entity);
                    await ProjetoDbContext.SaveChangesAsync();
                    if (entity.DerivadoDeId is not null)
                    {
                        var DestinatariosOrig = await ProjetoDbContext.Destinatarios.Where(s => s.FormId == entity.DerivadoDeId).ToListAsync();
                        foreach (var item in DestinatariosOrig)
                        {
                            ProjetoDbContext.Destinatarios.Add(new Destinatario()
                            {
                                Respondido = 0,
                                FormId = entity.Id,
                                Nome = item.Nome,
                                Email = item.Email,
                                Matricula = item.Matricula,
                                Curso = item.Curso,
                                DataColacao = item.DataColacao,
                                Modalidade = item.Modalidade,
                                Telefone1 = item.Telefone1,
                                Telefone2 = item.Telefone2,
                                Sexo = item.Sexo,
                                Cpf = item.Cpf
                            });
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
                Handlers.ExistsOrError(Form.Titulo, "Nome não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Form.Id = ((uint)FormId);
                Form.ResponsavelId = ((uint)Id);
                if (Form.Id is not null)
                {
                    var entity = await ProjetoDbContext.Formularios.FirstOrDefaultAsync(s => s.Id == FormId);
                    if (entity != null)
                    {
                        if(entity.DerivadoDeId is null)
                        {
                            entity.Titulo = Form.Titulo is null ? "" : Form.Titulo;
                        }
                        entity.MsgEmail = Form.MsgEmail;
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
                    Id = s.Id,
                    Nome = s.Nome,
                    Email = s.Email,
                    Admin = s.Admin,
                    AppPassword = s.AppPassword,
                    Universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.Id == Id);
                if (Admin is null) return NotFound();
                if (Admin.Admin)
                {
                    var List = await ProjetoDbContext.Formularios.Select(
                        s => new FormularioDTO
                        {
                            Id = s.Id,
                            ResponsavelId = s.ResponsavelId,
                            MsgEmail = s.MsgEmail,
                            DataEnviado = s.DataEnviado,
                            Titulo = s.Titulo,
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
                        Id = s.Id,
                        Titulo = s.Titulo,
                        DerivadoDeId = s.DerivadoDeId,
                        MsgEmail = s.MsgEmail,
                        DataEnviado = s.DataEnviado,
                        ResponsavelId = s.ResponsavelId
                    })
                    .Where(s => s.ResponsavelId == Id && s.DerivadoDeId == null)
                    .ToListAsync();
                foreach (var item in Forms)
                {
                    var FormsDerivados = await ProjetoDbContext.Formularios
                        .Select(s => new FormularioDTO
                        {
                            Id = s.Id,
                            Titulo = s.Titulo,
                            DerivadoDeId = s.DerivadoDeId,
                            MsgEmail = s.MsgEmail,
                            DataEnviado = s.DataEnviado,
                            ResponsavelId = s.ResponsavelId
                        })
                        .Where(s => s.DerivadoDeId == item.Id && s.DerivadoDeId != null)
                        .ToListAsync();
                    item.Derivados.AddRange(FormsDerivados);
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
                    var destinatarios = await ProjetoDbContext.Destinatarios.Where(s => s.FormId == item.Id).ToListAsync();
                    foreach (var envio in destinatarios)
                    {
                        ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.RespostaId == envio.Id));
                        ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.RespostaId == envio.Id));
                        ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.RespostaId == envio.Id));
                    }
                    ProjetoDbContext.Destinatarios.RemoveRange(ProjetoDbContext.Destinatarios.Where(s => s.FormId == item.Id));
                    ProjetoDbContext.Formularios.Remove(item);
                }
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                var questoes = await ProjetoDbContext.Questoes
                    .Select(s => new QuestoesDTO
                    {
                        Id = s.Id,
                        FormId = s.FormId
                    })
                    .Where(s => s.FormId==FormId)
                    .ToListAsync();
                foreach (var item in questoes)
                {
                    ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.QuestaoId == item.Id));
                    ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.QuestaoId == item.Id));
                    ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.QuestaoId == item.Id));
                }
                ProjetoDbContext.Destinatarios.RemoveRange(ProjetoDbContext.Destinatarios.Where(s => s.FormId == FormId));
                ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.FormId == FormId));
                ProjetoDbContext.Formularios.Remove(new Formulario() { Id = ((uint)FormId) });
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
