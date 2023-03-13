using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backendcsharp.Controllers
{
    [ApiController]
    public class QuestoesController : ControllerBase
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public QuestoesController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }

        // Adicionar Questao
        [HttpPost("users/{Id}/forms/{FormId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<uint>> InsertQuestao([FromBody] QuestoesDTO Quest, [FromRoute] int Id, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(Quest.numero.ToString(), "Numero da questão não informado");
                Handlers.ExistsOrError(Quest.enunciado, "Enunciado não informado");
                Handlers.ExistsOrError(Quest.type.ToString(), "Tipo da questão não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Quest.formId = ((uint)FormId);
                if (Quest.id is null)
                {
                    var entity = new Questoes()
                    {
                        Numero = Quest.numero,
                        Type = Quest.type,
                        FormId = Quest.formId,
                        Enunciado = Quest.enunciado,
                        Opcao1 = Quest.opcao1,
                        Opcao2 = Quest.opcao2,
                        Opcao3 = Quest.opcao3,
                        Opcao4 = Quest.opcao4,
                        Opcao5 = Quest.opcao5,
                        Opcao6 = Quest.opcao6,
                        Opcao7 = Quest.opcao7,
                        Opcao8 = Quest.opcao8,
                        Opcao9 = Quest.opcao9,
                        Opcao10 = Quest.opcao10
                    };
                    ProjetoDbContext.Questoes.Add(entity);
                    await ProjetoDbContext.SaveChangesAsync();

                    return entity.Id;
                }
                else throw new Exception("Id da questão já existe");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Modificar Questao
        [HttpPut("users/{Id}/forms/{FormId}/{QuestaoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<QuestoesDTO>> UpdateQuestao([FromBody] QuestoesDTO Quest, [FromRoute] int FormId, [FromRoute] int Id, [FromRoute] int QuestaoId)
        {
            try
            {
                Handlers.ExistsOrError(Quest.numero.ToString(), "Numero da questão não informado");
                Handlers.ExistsOrError(Quest.enunciado, "Enunciado não informado");
                Handlers.ExistsOrError(Quest.type.ToString(), "Tipo da questão não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(QuestaoId.ToString(), "Id da questão não informado");
                Handlers.IdNegative(QuestaoId, "Id da questão inválido");
                Quest.id = ((uint)QuestaoId);
                Quest.formId = ((uint)FormId);
                if (Quest.id is not null)
                {
                    var entity = await ProjetoDbContext.Questoes.FirstOrDefaultAsync(s => s.Id == QuestaoId);
                    if (entity != null)
                    {
                        entity.Numero = Quest.numero;
                        entity.Type = Quest.type;
                        entity.FormId = Quest.formId;
                        entity.Enunciado = Quest.enunciado;
                        entity.Opcao1 = Quest.opcao1;
                        entity.Opcao2 = Quest.opcao2;
                        entity.Opcao3 = Quest.opcao3;
                        entity.Opcao4 = Quest.opcao4;
                        entity.Opcao5 = Quest.opcao5;
                        entity.Opcao6 = Quest.opcao6;
                        entity.Opcao7 = Quest.opcao7;
                        entity.Opcao8 = Quest.opcao8;
                        entity.Opcao9 = Quest.opcao9;
                        entity.Opcao10 = Quest.opcao10;
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    else throw new Exception("Id não encontrado (UpdateQuestao)");
                }
                else throw new Exception("Id da questão não informado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar questões por ID do formulário
        [HttpGet("questoes/{FormId}")]
        public async Task<ActionResult<List<QuestoesDTO>>> GetQuestaoByFormId([FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                var Form = await ProjetoDbContext.Formularios
                    .Select(s => new FormularioDTO
                    {
                        id = s.Id,
                        derivadoDeId = s.DerivadoDeId,
                    })
                    .Where(s => s.id == FormId)
                    .FirstOrDefaultAsync();
                FormId = Form.derivadoDeId is not null? (int)Form.derivadoDeId:FormId;
                var Questoes = await ProjetoDbContext.Questoes
                    .Select(s => new QuestoesDTO
                    {
                        id = s.Id,
                        numero = s.Numero,
                        type = s.Type,
                        formId = s.FormId,
                        enunciado = s.Enunciado,
                        opcao1 = s.Opcao1,
                        opcao2 = s.Opcao2,
                        opcao3 = s.Opcao3,
                        opcao4 = s.Opcao4,
                        opcao5 = s.Opcao5,
                        opcao6 = s.Opcao6,
                        opcao7 = s.Opcao7,
                        opcao8 = s.Opcao8,
                        opcao9 = s.Opcao9,
                        opcao10 = s.Opcao10
                    })
                    .Where(s => s.formId == FormId)
                    .ToListAsync();
                if (Questoes.Count < 0) return NotFound();
                else return Questoes;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Deleta Questao (E todas as respostas)
        [HttpDelete("users/{Id}/forms/{FormId}/{QuestaoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteQuest([FromBody] QuestoesDTO Questao,[FromRoute] int QuestaoId)
        {
            try
            {
                Handlers.ExistsOrError(QuestaoId.ToString(), "Id da questão não informado");
                Handlers.IdNegative(QuestaoId, "Id da questão inválido");
                switch (Questao.type)
                {
                    case 1:
                        ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.QuestaoId == QuestaoId));
                        break;
                    case 2:
                        ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.QuestaoId == QuestaoId));
                        break;
                    case 3:
                        ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.QuestaoId == QuestaoId));
                        break;
                    case 4:
                        break;
                    default:
                        throw new Exception("Tipo da questão inválido");
                }
                var entity = new Questoes()
                {
                    Id = ((uint)QuestaoId)
                };
                ProjetoDbContext.Questoes.Remove(entity);
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
