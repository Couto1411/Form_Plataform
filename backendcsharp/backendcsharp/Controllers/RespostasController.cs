using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace backendcsharp.Controllers
{
    public class RespostasController : Controller
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public RespostasController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }
        
        // Usada quando cadastra-se uma nova resposta de um email
        public class Resposta
        {
            public int? numero { get; set; } = null!;
            public int? radio { get; set; } = null!;
            public string? texto { get; set; } = null!;
            public virtual List<int> opcoes { get; set; } = new List<int>();
        }
        // Usada quando cadastra-se uma nova resposta de um email
        public partial class ListaResposta
        {
            public string email { get; set; } = null!;
            public virtual ICollection<Resposta> respostas { get; set; } = new List<Resposta>();

        }

        // Adicionar Resposta
        [HttpPost("enviados/{FormId}")]
        public async Task<ActionResult> InsertResposta([FromBody] ListaResposta Resp, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(Resp.email, "Email da resposta não informado");
                var enviado = await ProjetoDbContext.Enviados
                    .Select(s => new EnviadoDTO
                    {
                        id = s.Id,
                        formId = s.FormId,
                        email = s.Email,
                        respondido = s.Respondido
                    })
                    .Where(s => (s.formId == FormId && s.email == Resp.email && s.respondido == false))
                    .FirstOrDefaultAsync();
                if (enviado is not null) {
                    foreach (var item in Resp.respostas)
                    {
                        var questao = await ProjetoDbContext.Questoes
                            .Select(s => new QuestoesDTO
                            {
                                id = s.Id,
                                formId = s.FormId,
                                numero = s.Numero
                            })
                            .Where(s => (s.formId == FormId && s.numero==item.numero))
                            .FirstOrDefaultAsync();
                        if (questao is null) throw new Exception("Questao não encontrada");
                        if (item.radio is not null)
                        {
                            var entity = new Radiobox()
                            {
                                QuestaoId = questao.id != null ? (uint)questao.id : throw new Exception("Questao id nulo"),
                                RespostaId = enviado.id != null ? (uint)enviado.id : throw new Exception("Resposta id nulo"),
                                Radio = item.radio
                            };
                            ProjetoDbContext.Radioboxes.Add(entity);
                        }
                        else if (item.opcoes.Count() > 0)
                        {
                            var entity = new Checkbox()
                            {
                                QuestaoId = questao.id != null ? (uint)questao.id : throw new Exception("Questao id nulo"),
                                RespostaId = enviado.id != null ? (uint)enviado.id : throw new Exception("Resposta id nulo"),
                                Opcao1 = item.opcoes.IndexOf(1) != -1 ? true : null,
                                Opcao2 = item.opcoes.IndexOf(2) != -1 ? true : null,
                                Opcao3 = item.opcoes.IndexOf(3) != -1 ? true : null,
                                Opcao4 = item.opcoes.IndexOf(4) != -1 ? true : null,
                                Opcao5 = item.opcoes.IndexOf(5) != -1 ? true : null,
                                Opcao6 = item.opcoes.IndexOf(6) != -1 ? true : null,
                                Opcao7 = item.opcoes.IndexOf(7) != -1 ? true : null,
                                Opcao8 = item.opcoes.IndexOf(8) != -1 ? true : null,
                                Opcao9 = item.opcoes.IndexOf(9) != -1 ? true : null,
                                Opcao10 = item.opcoes.IndexOf(10) != -1 ? true : null
                            };
                            ProjetoDbContext.Checkboxes.Add(entity);
                        }
                        else if (item.texto is not null)
                        {
                            var entity = new Text()
                            {
                                QuestaoId = questao.id != null ? (uint)questao.id : throw new Exception("Questao id nulo"),
                                RespostaId = enviado.id != null ? (uint)enviado.id : throw new Exception("Resposta id nulo"),
                                Texto = string.IsNullOrEmpty(item.texto)? throw new Exception("Texto vazio") : item.texto
                            };
                            ProjetoDbContext.Texts.Add(entity);
                        }
                        else throw new Exception("Entrada errada");
                    }
                    var enviadoUpdate = await ProjetoDbContext.Enviados.FirstOrDefaultAsync(s => s.Id == enviado.id);
                    if (enviadoUpdate != null)
                    {
                        enviadoUpdate.Respondido = true;
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    else throw new Exception("Id não encontrado (UpdateEnvio)");

                }
                else throw new Exception("Usuario nao permitido para responder ou Formulario ja respondido por usuario");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        // Usada para coletar as respostas de um usuário
        public class TipoResposta
        {
            public uint id { get; set; }
            public int type { get; set; }
            public string? enunciado { get; set; } = null!;
            public uint numero { get; set; }
            public string? radio { get; set; } = null!;
            public string? texto { get; set; } = null!;
            public virtual List<string> opcoes { get; set; } = new List<string>();
        }

        // Pegar as respostas de um email especifico
        [HttpGet("users/{Id}/forms/{FormId}/respostas/{EnviadoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<TipoResposta>>> GetRespostasByEnviadoId([FromRoute] int FormId, [FromRoute] int EnviadoId)
        {
            try
            {
                List<TipoResposta> response = new List<TipoResposta>();
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(EnviadoId.ToString(), "Id do email não informado");
                Handlers.IdNegative(EnviadoId, "Id do email inválido");
                var questoes = await ProjetoDbContext.Questoes
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
                        .Where(s => (s.formId == FormId))
                        .ToListAsync();
                // Adiciona as respostas para cada questão numa lista
                foreach (var item in questoes)
                {
                    switch (item.type)
                    {
                        // Adiciona questões do tipo RadioBox
                        case 1:
                            TipoResposta radio = new TipoResposta();
                            if (item.opcao1 is not null)
                            {
                                // Acha a resposta da questão
                                var radioBoxDB =  await ProjetoDbContext.Radioboxes
                                    .Select(s => new RadioboxDTO
                                    {
                                        radio = s.Radio,
                                        questaoId = s.QuestaoId,
                                        respostaId = s.RespostaId
                                    })
                                    .Where(s => (s.questaoId == item.id && s.respostaId == EnviadoId))
                                    .FirstOrDefaultAsync();
                                if (radioBoxDB is not null)
                                {
                                    // Coloca a opcao respondida na estrutura "TipoResposta"
                                    switch (radioBoxDB.radio)
                                    {
                                        case 1:
                                            radio.radio = item.opcao1;
                                            break;
                                        case 2:
                                            radio.radio = item.opcao2;
                                            break;
                                        case 3:
                                            radio.radio = item.opcao3;
                                            break;
                                        case 4:
                                            radio.radio = item.opcao4;
                                            break;
                                        case 5:
                                            radio.radio = item.opcao5;
                                            break;
                                        case 6:
                                            radio.radio = item.opcao6;
                                            break;
                                        case 7:
                                            radio.radio = item.opcao7;
                                            break;
                                        case 8:
                                            radio.radio = item.opcao8;
                                            break;
                                        case 9:
                                            radio.radio = item.opcao9;
                                            break;
                                        case 10:
                                            radio.radio = item.opcao10;
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                else throw new Exception("Resposta não encontrada (RadioBox)");
                            }

                            // Informações gerais
                            radio.enunciado = item.enunciado;
                            radio.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                            radio.type = item.type;
                            radio.numero = item.numero;
                            response.Add(radio);
                            break;

                        // Adiciona questões do tipo Texto
                        case 2:
                            TipoResposta texto = new TipoResposta();

                            // Acha a resposta da questão
                            var textDB = await ProjetoDbContext.Texts
                                .Select(s => new TextDTO
                                {
                                    texto = s.Texto,
                                    questaoId = s.QuestaoId,
                                    respostaId = s.RespostaId
                                })
                                .Where(s => (s.questaoId == item.id && s.respostaId == EnviadoId))
                                .FirstOrDefaultAsync();

                            // Coloca o texto respondido na estrutura "TipoResposta"
                            texto.texto = textDB is not null ? textDB.texto : throw new Exception("Resposta não encontrada (Text)");
                            
                            // Informações gerais
                            texto.enunciado = item.enunciado;
                            texto.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                            texto.type = item.type;
                            texto.numero = item.numero;
                            response.Add(texto);
                            break;

                        // Adiciona questões do tipo Checkbox
                        case 3:
                            TipoResposta check = new TipoResposta();
                            if (item.opcao1 is not null)
                            {
                                // Acha a resposta da questão
                                var checkBoxDB = await ProjetoDbContext.Checkboxes
                                    .Select(s => new CheckboxDTO
                                    {
                                        opcao1 = s.Opcao1,
                                        opcao2 = s.Opcao2,
                                        opcao3 = s.Opcao3,
                                        opcao4 = s.Opcao4,
                                        opcao5 = s.Opcao5,
                                        opcao6 = s.Opcao6,
                                        opcao7 = s.Opcao7,
                                        opcao8 = s.Opcao8,
                                        opcao9 = s.Opcao9,
                                        opcao10 = s.Opcao10,
                                        questaoId = s.QuestaoId,
                                        respostaId = s.RespostaId
                                    })
                                    .Where(s => (s.questaoId == item.id && s.respostaId == EnviadoId))
                                    .FirstOrDefaultAsync();
                                if (checkBoxDB is not null)
                                {
                                    // Coloca as opcões respondidas na estrutura "TipoResposta"
                                    if (checkBoxDB.opcao1 == true) check.opcoes.Add(item.opcao1);
                                    if (item.opcao2 is not null && checkBoxDB.opcao2 == true) check.opcoes.Add(item.opcao2);
                                    if (item.opcao3 is not null && checkBoxDB.opcao3 == true) check.opcoes.Add(item.opcao3);
                                    if (item.opcao4 is not null && checkBoxDB.opcao4 == true) check.opcoes.Add(item.opcao4);
                                    if (item.opcao5 is not null && checkBoxDB.opcao5 == true) check.opcoes.Add(item.opcao5);
                                    if (item.opcao6 is not null && checkBoxDB.opcao6 == true) check.opcoes.Add(item.opcao6);
                                    if (item.opcao7 is not null && checkBoxDB.opcao7 == true) check.opcoes.Add(item.opcao7);
                                    if (item.opcao8 is not null && checkBoxDB.opcao8 == true) check.opcoes.Add(item.opcao8);
                                    if (item.opcao9 is not null && checkBoxDB.opcao9 == true) check.opcoes.Add(item.opcao9);
                                    if (item.opcao10 is not null && checkBoxDB.opcao10 == true) check.opcoes.Add(item.opcao10);
                                }
                                else throw new Exception("Resposta não encontrada (RadioBox)");
                            }

                            // Informações gerais
                            check.enunciado = item.enunciado;
                            check.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                            check.type = item.type;
                            check.numero = item.numero;
                            response.Add(check);
                            break;
                        default:
                            throw new Exception("Tipo da questão não existe");
                    }
                }
                // Retorna resposta
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Texto e quantidade de resposta
        public class TextQuant
        {
            public virtual string texto { get; set; } = null!;
            public virtual int quantidade { get; set; }
            public TextQuant(string a, int b)
            {
                texto = a;
                quantidade = b;
            }

        }
        // Usada para coletar a quantidade de respostas de um fromulário
        public class QuantidadeResposta
        {
            public uint id { get; set; }
            public int type { get; set; }
            public string? enunciado { get; set; } = null!;
            public uint numero { get; set; }
            public List<TextQuant> resposta { get; set; } = new List<TextQuant>();
        }

        // Pegar as respostas de um formulário especifico
        [HttpGet("users/{Id}/forms/{FormId}/respostas")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<QuantidadeResposta>>> GetRespostasByFormId([FromRoute] int FormId)
        {
            try
            {
                List<QuantidadeResposta> response = new List<QuantidadeResposta>();
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                var questoes = await ProjetoDbContext.Questoes
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
                        .Where(s => (s.formId == FormId))
                        .ToListAsync();
                // Adiciona a quatidade de respostas para cada questão numa lista
                foreach (var item in questoes)
                {
                    switch (item.type)
                    {
                        // Adiciona questões do tipo RadioBox
                        case 1:
                            if (item.opcao1 is not null)
                            {
                                QuantidadeResposta radio = new QuantidadeResposta();

                                // Acha as respostas da questão
                                var radioBoxDB = await ProjetoDbContext.Radioboxes
                                    .Select(s => new RadioboxDTO
                                    {
                                        radio = s.Radio,
                                        questaoId = s.QuestaoId
                                    })
                                    .Where(s => (s.questaoId == item.id))
                                    .ToListAsync();

                                // Adiciona texto e quantidade de respostas na estrutura "QuantidadeResposta"
                                radio.resposta.Add(new TextQuant(item.opcao1, radioBoxDB.Where(s => s.radio == 1).Count()));
                                if (item.opcao2 is not null) radio.resposta.Add(new TextQuant(item.opcao2, radioBoxDB.Where(s => s.radio == 2).Count()));
                                if (item.opcao3 is not null) radio.resposta.Add(new TextQuant(item.opcao3, radioBoxDB.Where(s => s.radio == 3).Count()));
                                if (item.opcao4 is not null) radio.resposta.Add(new TextQuant(item.opcao4, radioBoxDB.Where(s => s.radio == 4).Count()));
                                if (item.opcao5 is not null) radio.resposta.Add(new TextQuant(item.opcao5, radioBoxDB.Where(s => s.radio == 5).Count()));
                                if (item.opcao6 is not null) radio.resposta.Add(new TextQuant(item.opcao6, radioBoxDB.Where(s => s.radio == 6).Count()));
                                if (item.opcao7 is not null) radio.resposta.Add(new TextQuant(item.opcao7, radioBoxDB.Where(s => s.radio == 7).Count()));
                                if (item.opcao8 is not null) radio.resposta.Add(new TextQuant(item.opcao8, radioBoxDB.Where(s => s.radio == 8).Count()));
                                if (item.opcao9 is not null) radio.resposta.Add(new TextQuant(item.opcao9, radioBoxDB.Where(s => s.radio == 9).Count()));
                                if (item.opcao10 is not null) radio.resposta.Add(new TextQuant(item.opcao10, radioBoxDB.Where(s => s.radio == 10).Count()));

                                // Informações gerais
                                radio.enunciado = item.enunciado;
                                radio.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                                radio.type = item.type;
                                radio.numero = item.numero;
                                response.Add(radio);
                            }
                            break;
                        case 3:
                            if (item.opcao1 is not null)
                            {
                                QuantidadeResposta check = new QuantidadeResposta();

                                // Acha a resposta da questão
                                var checkBoxDB = await ProjetoDbContext.Checkboxes
                                    .Select(s => new CheckboxDTO
                                    {
                                        opcao1 = s.Opcao1,
                                        opcao2 = s.Opcao2,
                                        opcao3 = s.Opcao3,
                                        opcao4 = s.Opcao4,
                                        opcao5 = s.Opcao5,
                                        opcao6 = s.Opcao6,
                                        opcao7 = s.Opcao7,
                                        opcao8 = s.Opcao8,
                                        opcao9 = s.Opcao9,
                                        opcao10 = s.Opcao10,
                                        questaoId = s.QuestaoId
                                    })
                                    .Where(s => (s.questaoId == item.id))
                                    .ToListAsync();

                                // Adiciona texto e quantidade de respostas na estrutura "QuantidadeResposta"
                                check.resposta.Add(new TextQuant(item.opcao1, checkBoxDB.Where(s => s.opcao1 == true).Count()));
                                if (item.opcao2 is not null) check.resposta.Add(new TextQuant(item.opcao2, checkBoxDB.Where(s => s.opcao2 == true).Count()));
                                if (item.opcao3 is not null) check.resposta.Add(new TextQuant(item.opcao3, checkBoxDB.Where(s => s.opcao3 == true).Count()));
                                if (item.opcao4 is not null) check.resposta.Add(new TextQuant(item.opcao4, checkBoxDB.Where(s => s.opcao4 == true).Count()));
                                if (item.opcao5 is not null) check.resposta.Add(new TextQuant(item.opcao5, checkBoxDB.Where(s => s.opcao5 == true).Count()));
                                if (item.opcao6 is not null) check.resposta.Add(new TextQuant(item.opcao6, checkBoxDB.Where(s => s.opcao6== true).Count()));
                                if (item.opcao7 is not null) check.resposta.Add(new TextQuant(item.opcao7, checkBoxDB.Where(s => s.opcao7 == true).Count()));
                                if (item.opcao8 is not null) check.resposta.Add(new TextQuant(item.opcao8, checkBoxDB.Where(s => s.opcao8 == true).Count()));
                                if (item.opcao9 is not null) check.resposta.Add(new TextQuant(item.opcao9, checkBoxDB.Where(s => s.opcao9 == true).Count()));
                                if (item.opcao10 is not null) check.resposta.Add(new TextQuant(item.opcao10, checkBoxDB.Where(s => s.opcao10 == true).Count()));

                                // Informações gerais
                                check.enunciado = item.enunciado;
                                check.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                                check.type = item.type;
                                check.numero = item.numero;
                                response.Add(check);
                            }
                            break;
                        case 2:
                            break;
                        default:
                            throw new Exception("Tipo da questão não existe");
                    }
                }
                // Retorna resposta
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
