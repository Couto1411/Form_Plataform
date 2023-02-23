using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                        Titulo = Form.titulo,
                        ResponsavelId = (uint) Id
                    };
                    ProjetoDbContext.Formularios.Add(entity);
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
                        entity.Titulo = Form.titulo;
                        entity.ResponsavelId = Form.responsavelId;
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
        [HttpGet("forms")]
        public async Task<ActionResult<List<FormularioDTO>>> GetForms()
        {
            try
            {
                var List = await ProjetoDbContext.Formularios.Select(
                    s => new FormularioDTO
                    {
                        id = s.Id,
                        responsavelId = s.ResponsavelId,
                        titulo = s.Titulo,
                    }
                ).ToListAsync();

                if (List.Count < 0) return NotFound(); 
                else return List;
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
                        responsavelId = s.ResponsavelId
                    })
                    .Where(s => s.responsavelId == Id)
                    .ToListAsync();
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
