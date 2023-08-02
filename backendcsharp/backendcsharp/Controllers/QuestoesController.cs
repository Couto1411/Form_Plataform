using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

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
                Handlers.ExistsOrError(Quest.Numero.ToString(), "Numero da questão não informado");
                Handlers.ExistsOrError(Quest.Enunciado, "Enunciado não informado");
                Handlers.ExistsOrError(Quest.Type.ToString(), "Tipo da questão não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Quest.FormId = ((uint)FormId);
                if (Quest.Id is null)
                {
                    var entity = new Questoes()
                    {
                        Numero = Quest.Numero,
                        Type = Quest.Type,
                        FormId = Quest.FormId,
                        Enunciado = Quest.Enunciado is null?"":Quest.Enunciado,
                        DerivadaDeId = Quest.DerivadaDeId,
                        DerivadaDeOpcao = Quest.DerivadaDeOpcao,
                        Opcao1 = Quest.Opcao1,
                        Opcao2 = Quest.Opcao2,
                        Opcao3 = Quest.Opcao3,
                        Opcao4 = Quest.Opcao4,
                        Opcao5 = Quest.Opcao5,
                        Opcao6 = Quest.Opcao6,
                        Opcao7 = Quest.Opcao7,
                        Opcao8 = Quest.Opcao8,
                        Opcao9 = Quest.Opcao9,
                        Opcao10 = Quest.Opcao10
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
                Handlers.ExistsOrError(Quest.Numero.ToString(), "Numero da questão não informado");
                Handlers.ExistsOrError(Quest.Enunciado, "Enunciado não informado");
                Handlers.ExistsOrError(Quest.Type.ToString(), "Tipo da questão não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(QuestaoId.ToString(), "Id da questão não informado");
                Handlers.IdNegative(QuestaoId, "Id da questão inválido");
                Quest.Id = ((uint)QuestaoId);
                Quest.FormId = ((uint)FormId);
                if (Quest.Id is not null)
                {
                    var entity = await ProjetoDbContext.Questoes.FirstOrDefaultAsync(s => s.Id == QuestaoId);
                    if (entity != null)
                    {
                        entity.Numero = Quest.Numero;
                        entity.Type = Quest.Type;
                        entity.FormId = Quest.FormId;
                        entity.Enunciado = Quest.Enunciado is null?"":Quest.Enunciado;
                        entity.Opcao1 = Quest.Opcao1;
                        entity.Opcao2 = Quest.Opcao2;
                        entity.Opcao3 = Quest.Opcao3;
                        entity.Opcao4 = Quest.Opcao4;
                        entity.Opcao5 = Quest.Opcao5;
                        entity.Opcao6 = Quest.Opcao6;
                        entity.Opcao7 = Quest.Opcao7;
                        entity.Opcao8 = Quest.Opcao8;
                        entity.Opcao9 = Quest.Opcao9;
                        entity.Opcao10 = Quest.Opcao10;
                        if (Quest.Opcao1 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 1));
                        if (Quest.Opcao2 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 2));
                        if (Quest.Opcao3 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 3));
                        if (Quest.Opcao4 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 4));
                        if (Quest.Opcao5 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 5));
                        if (Quest.Opcao6 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 6));
                        if (Quest.Opcao7 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 7));
                        if (Quest.Opcao8 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 8));
                        if (Quest.Opcao9 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 9));
                        if (Quest.Opcao10 == "") ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.DerivadaDeId == QuestaoId && s.DerivadaDeOpcao == 10));
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
                        Id = s.Id,
                        DerivadoDeId = s.DerivadoDeId,
                    })
                    .Where(s => s.Id == FormId)
                    .FirstOrDefaultAsync() ?? throw new Exception("Não encontrou formulário");
                FormId = Form.DerivadoDeId is not null? (int)Form.DerivadoDeId:FormId;
                var Questoes = await ProjetoDbContext.Questoes
                    .Select(s => new QuestoesDTO
                    {
                        Id = s.Id,
                        Numero = s.Numero,
                        Type = s.Type,
                        FormId = s.FormId,
                        Enunciado = s.Enunciado,
                        DerivadaDeId = s.DerivadaDeId,
                        Opcao1 = s.Opcao1,
                        Opcao2 = s.Opcao2,
                        Opcao3 = s.Opcao3,
                        Opcao4 = s.Opcao4,
                        Opcao5 = s.Opcao5,
                        Opcao6 = s.Opcao6,
                        Opcao7 = s.Opcao7,
                        Opcao8 = s.Opcao8,
                        Opcao9 = s.Opcao9,
                        Opcao10 = s.Opcao10
                    })
                    .Where(s => s.FormId == FormId && s.DerivadaDeId == null)
                    .ToListAsync();
                foreach (var item in Questoes)
                {
                    item.Derivadas = item.DerivadaDeId is not null ? new List<QuestoesDTO>() : await ProjetoDbContext.Questoes
                    .Select(s => new QuestoesDTO
                    {
                        Id = s.Id,
                        Numero = s.Numero,
                        Type = s.Type,
                        FormId = s.FormId,
                        Enunciado = s.Enunciado,
                        DerivadaDeId = s.DerivadaDeId,
                        DerivadaDeOpcao = s.DerivadaDeOpcao,
                        Opcao1 = s.Opcao1,
                        Opcao2 = s.Opcao2,
                        Opcao3 = s.Opcao3,
                        Opcao4 = s.Opcao4,
                        Opcao5 = s.Opcao5,
                        Opcao6 = s.Opcao6,
                        Opcao7 = s.Opcao7,
                        Opcao8 = s.Opcao8,
                        Opcao9 = s.Opcao9,
                        Opcao10 = s.Opcao10
                    })
                    .Where(s => s.DerivadaDeId == item.Id)
                    .ToListAsync();
                }
                if (Questoes.Count < 0) return NotFound();
                else return Questoes;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar questões por ID do Usuário
        [HttpGet("questoes/user/{UserId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<QuestoesDTO>>> GetQuestaoByUserId([FromRoute] int UserId)
        {
            try
            {
                Handlers.ExistsOrError(UserId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(UserId, "Id do formulário inválido");
                var Questoes = await
                    (from questao in ProjetoDbContext.Questoes
                    join formulario in ProjetoDbContext.Formularios on questao.FormId equals formulario.Id
                    join user in ProjetoDbContext.Users on formulario.ResponsavelId equals user.Id
                    where user.Id == UserId && questao.DerivadaDeId == null && questao.Type!=2 && questao.Type!=4
                    select new QuestoesDTO
                    {
                        Id = questao.Id,
                        Numero = questao.Numero,
                        Type = questao.Type,
                        FormId = questao.FormId,
                        Enunciado = questao.Enunciado,
                        DerivadaDeOpcao = questao.DerivadaDeOpcao,
                        Opcao1 = questao.Opcao1,
                        Opcao2 = questao.Opcao2,
                        Opcao3 = questao.Opcao3,
                        Opcao4 = questao.Opcao4,
                        Opcao5 = questao.Opcao5,
                        Opcao6 = questao.Opcao6,
                        Opcao7 = questao.Opcao7,
                        Opcao8 = questao.Opcao8,
                        Opcao9 = questao.Opcao9,
                        Opcao10 = questao.Opcao10
                    }).ToListAsync();
                foreach (var item in Questoes)
                {
                    item.Derivadas = item.DerivadaDeId is not null ? new List<QuestoesDTO>() : await ProjetoDbContext.Questoes
                    .Select(s => new QuestoesDTO
                    {
                        Id = s.Id,
                        Numero = s.Numero,
                        Type = s.Type,
                        FormId = s.FormId,
                        Enunciado = s.Enunciado,
                        DerivadaDeId = s.DerivadaDeId,
                        DerivadaDeOpcao = s.DerivadaDeOpcao,
                        Opcao1 = s.Opcao1,
                        Opcao2 = s.Opcao2,
                        Opcao3 = s.Opcao3,
                        Opcao4 = s.Opcao4,
                        Opcao5 = s.Opcao5,
                        Opcao6 = s.Opcao6,
                        Opcao7 = s.Opcao7,
                        Opcao8 = s.Opcao8,
                        Opcao9 = s.Opcao9,
                        Opcao10 = s.Opcao10
                    })
                    .Where(s => (s.DerivadaDeId == item.Id && s.Type!=2 && s.Type!=4))
                    .ToListAsync();
                }
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
                switch (Questao.Type)
                {
                    case 9:
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
