using APIs.Security.JWT;
using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Crypto.Digests;
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
            public int? id { get; set; } = null!;
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
                if (Form is not null && enviado is not null) {
                    FormId = Form.derivadoDeId is not null? (int)Form.derivadoDeId:FormId;
                    foreach (var item in Resp.respostas)
                    {
                        var questao = await ProjetoDbContext.Questoes
                            .Select(s => new QuestoesDTO
                            {
                                id = s.Id,
                                formId = s.FormId,
                                numero = s.Numero
                            })
                            .Where(s => (s.formId == FormId && s.id==item.id))
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
                var questoes =await
                       (from questao in ProjetoDbContext.Questoes
                       where questao.FormId == FormId && questao.DerivadaDeId == null
                       select new QuestoesDTO
                       {
                           id = questao.Id,
                           numero = questao.Numero,
                           type = questao.Type,
                           formId = questao.FormId,
                           enunciado = questao.Enunciado,
                           derivadaDeOpcao = questao.DerivadaDeOpcao,
                           opcao1 = questao.Opcao1,
                           opcao2 = questao.Opcao2,
                           opcao3 = questao.Opcao3,
                           opcao4 = questao.Opcao4,
                           opcao5 = questao.Opcao5,
                           opcao6 = questao.Opcao6,
                           opcao7 = questao.Opcao7,
                           opcao8 = questao.Opcao8,
                           opcao9 = questao.Opcao9,
                           opcao10 = questao.Opcao10
                       }).ToListAsync();
                // Adiciona as respostas para cada questão numa lista
                response = await PegarRespostasIndividual(questoes, FormId, EnviadoId);
                 // Retorna resposta
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        public async Task<List<TipoResposta>> PegarRespostasIndividual(List<QuestoesDTO> questoes, int FormId, int EnviadoId)
        {
            List<TipoResposta> response = new List<TipoResposta>();
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
                            var radioBoxDB = await ProjetoDbContext.Radioboxes
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
                        if (textDB is not null)
                        {
                            texto.texto = textDB.texto;
                        }

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
                        }

                        // Informações gerais
                        check.enunciado = item.enunciado;
                        check.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        check.type = item.type;
                        check.numero = item.numero;
                        response.Add(check);
                        break;
                    case 4:
                        TipoResposta descricao = new TipoResposta();
                        descricao.enunciado = item.enunciado;
                        descricao.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        descricao.type = item.type;
                        descricao.numero = item.numero;
                        response.Add(descricao);
                        break;
                    case 9:
                        TipoResposta questaoOrig = new TipoResposta();
                        List<TipoResposta> derivadas = new List<TipoResposta>();
                        if (item.opcao1 is not null)
                        {
                            // Acha a resposta da questão
                            var questaoOrigDB = await ProjetoDbContext.Radioboxes
                                .Select(s => new RadioboxDTO
                                {
                                    radio = s.Radio,
                                    questaoId = s.QuestaoId,
                                    respostaId = s.RespostaId
                                })
                                .Where(s => (s.questaoId == item.id && s.respostaId == EnviadoId))
                                .FirstOrDefaultAsync();
                            if (questaoOrigDB is not null)
                            {
                                // Coloca a opcao respondida na estrutura "TipoResposta"
                                switch (questaoOrigDB.radio)
                                {
                                    case 1:
                                        questaoOrig.radio = item.opcao1;
                                        break;
                                    case 2:
                                        questaoOrig.radio = item.opcao2;
                                        break;
                                    case 3:
                                        questaoOrig.radio = item.opcao3;
                                        break;
                                    case 4:
                                        questaoOrig.radio = item.opcao4;
                                        break;
                                    case 5:
                                        questaoOrig.radio = item.opcao5;
                                        break;
                                    case 6:
                                        questaoOrig.radio = item.opcao6;
                                        break;
                                    case 7:
                                        questaoOrig.radio = item.opcao7;
                                        break;
                                    case 8:
                                        questaoOrig.radio = item.opcao8;
                                        break;
                                    case 9:
                                        questaoOrig.radio = item.opcao9;
                                        break;
                                    case 10:
                                        questaoOrig.radio = item.opcao10;
                                        break;
                                    default:
                                        break;
                                }

                                var questoesDerivadas = await
                                       (from questaodb in ProjetoDbContext.Questoes
                                        where questaodb.FormId == FormId && questaodb.DerivadaDeId == item.id && questaodb.DerivadaDeOpcao == questaoOrigDB.radio
                                        select new QuestoesDTO
                                        {
                                            id = questaodb.Id,
                                            numero = questaodb.Numero,
                                            type = questaodb.Type,
                                            formId = questaodb.FormId,
                                            enunciado = questaodb.Enunciado,
                                            derivadaDeOpcao = questaodb.DerivadaDeOpcao,
                                            opcao1 = questaodb.Opcao1,
                                            opcao2 = questaodb.Opcao2,
                                            opcao3 = questaodb.Opcao3,
                                            opcao4 = questaodb.Opcao4,
                                            opcao5 = questaodb.Opcao5,
                                            opcao6 = questaodb.Opcao6,
                                            opcao7 = questaodb.Opcao7,
                                            opcao8 = questaodb.Opcao8,
                                            opcao9 = questaodb.Opcao9,
                                            opcao10 = questaodb.Opcao10
                                        }).ToListAsync();
                                derivadas = await PegarRespostasIndividual(questoesDerivadas, FormId, EnviadoId);
                            }
                        }

                        // Informações gerais
                        questaoOrig.enunciado = item.enunciado;
                        questaoOrig.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        questaoOrig.type = item.type;
                        questaoOrig.numero = item.numero;
                        response.Add(questaoOrig);
                        foreach (var elemento in derivadas) response.Add(elemento);
                        break;
                    default:
                        throw new Exception("Tipo da questão não existe");
                }
            }

            return response;
        }


        // Texto e quantidade de resposta
        public class TextQuant
        {
            public virtual string texto { get; set; } = null!;
            public virtual int opcao { get; set; }
            public virtual int quantidade { get; set; }
            public TextQuant(string a, int b, int c)
            {
                this.opcao = c;
                this.texto = a;
                this.quantidade = b;
            }

        }
        // Usada para coletar a quantidade de respostas de um fromulário
        public class QuantidadeResposta
        {
            public uint id { get; set; }
            public int? derivadaDeOpcao { get; set; }
            public int type { get; set; }
            public string? enunciado { get; set; } = null!;
            public uint numero { get; set; }
            public List<QuantidadeResposta> derivadas { get; set; } = new List<QuantidadeResposta>();
            public List<TextQuant> resposta { get; set; } = new List<TextQuant>();
        }
        public class RetornoRespostas
        {
            public int quantidadeRespostas { get; set; } = 0;
            public List<QuantidadeResposta> respostas { get; set; } = new List<QuantidadeResposta>();
            public RetornoRespostas(int quantidadeRespostas, List<QuantidadeResposta> respostas)
            {
                this.quantidadeRespostas = quantidadeRespostas;
                this.respostas = respostas;
            }
        }


        // Pegar os contatos de uma certa pergunta e opcao
        [HttpGet("respostas/{QuestId}/{Opcao}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<EnviadoDTO>>> SelecionarContatos([FromRoute] int QuestId, [FromRoute] int Opcao )
        {
            try
            {
                Handlers.ExistsOrError(QuestId.ToString(), "Id da questão não informado");
                Handlers.IdNegative(QuestId, "Id da questão inválido");
                Handlers.ExistsOrError(Opcao.ToString(), "Opção da questão não informado");
                Handlers.IdNegative(Opcao, "Opção da questão inválido");
                var questao = await ProjetoDbContext.Questoes.Where(s => (s.Id == QuestId)).FirstOrDefaultAsync();
                if (questao == null) throw new Exception("Questão não encontrada");
                List<EnviadoDTO> contatos = new();
                if (questao.Type == 1 || questao.Type == 9)
                {
                    contatos = await
                    (from enviado in ProjetoDbContext.Enviados
                     join radio in ProjetoDbContext.Radioboxes on enviado.Id equals radio.RespostaId
                     where radio.QuestaoId==QuestId && radio.Radio==Opcao
                     select new EnviadoDTO
                     {
                         id = enviado.Id,
                         email = enviado.Email,
                         nome = enviado.Nome
                     }).ToListAsync();
                }
                else if (questao.Type == 3)
                {
                    switch (Opcao)
                    {
                        case 1:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao1 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 2:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao2 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 3:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao3 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 4:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao4 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 5:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao5 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 6:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao6 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 7:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao7 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 8:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao8 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 9:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao9 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        case 10:
                            contatos = await
                            (from enviado in ProjetoDbContext.Enviados
                             join check in ProjetoDbContext.Checkboxes on enviado.Id equals check.RespostaId
                             where check.QuestaoId == QuestId && check.Opcao10 == true
                             select new EnviadoDTO { id = enviado.Id, email = enviado.Email, nome = enviado.Nome }).ToListAsync();
                            break;
                        default:
                            break;
                    }
                }
                return contatos;

            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Pegar as respostas de um formulário especifico
        [HttpGet("users/{Id}/forms/{FormId}/respostas")]
        [Authorize("Bearer")]
        public async Task<ActionResult<RetornoRespostas>> GetRespostasByFormId([FromRoute] int FormId)
        {
            try
            {
                List<QuantidadeResposta> response = new List<QuantidadeResposta>();
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                var formulario = await ProjetoDbContext.Formularios.Where(s => (s.Id == FormId)).FirstOrDefaultAsync();
                int FormularioId = FormId;
                if (formulario != null && formulario.DerivadoDeId != null) FormularioId = (int)formulario.DerivadoDeId;

                var questoes = await
                       (from questao in ProjetoDbContext.Questoes
                       where questao.FormId == FormularioId && questao.DerivadaDeId == null
                       select new QuestoesDTO
                       {
                           id = questao.Id,
                           numero = questao.Numero,
                           type = questao.Type,
                           formId = questao.FormId,
                           enunciado = questao.Enunciado,
                           derivadaDeOpcao = questao.DerivadaDeOpcao,
                           opcao1 = questao.Opcao1,
                           opcao2 = questao.Opcao2,
                           opcao3 = questao.Opcao3,
                           opcao4 = questao.Opcao4,
                           opcao5 = questao.Opcao5,
                           opcao6 = questao.Opcao6,
                           opcao7 = questao.Opcao7,
                           opcao8 = questao.Opcao8,
                           opcao9 = questao.Opcao9,
                           opcao10 = questao.Opcao10
                       }).ToListAsync();
                response = await PegarRespostas(questoes, FormId, FormularioId);
                // Pega quantidade de respostas total
                var respostasquant = await
                    (from envio in ProjetoDbContext.Enviados
                     where envio.FormId == FormId && envio.Respondido == true
                     select new { id = envio.Id }
                    ).CountAsync();
                // Retorna resposta
                return new RetornoRespostas(respostasquant, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        public async Task<List<QuantidadeResposta>> PegarRespostas( List<QuestoesDTO> questoes, int FormId, int FormularioId)
        {
            List<QuantidadeResposta> response = new List<QuantidadeResposta>();
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
                            var radioBoxDB =
                                   from radiobox in ProjetoDbContext.Radioboxes
                                   join resposta in ProjetoDbContext.Enviados on radiobox.RespostaId equals resposta.Id
                                   where radiobox.QuestaoId == item.id && resposta.FormId == FormId
                                   select new RadioboxDTO
                                   {
                                       radio = radiobox.Radio,
                                       questaoId = radiobox.QuestaoId
                                   };
                            // Adiciona texto e quantidade de respostas na estrutura "QuantidadeResposta"
                            radio.resposta.Add(new TextQuant(item.opcao1, radioBoxDB.Where(s => s.radio == 1).Count(),1));
                            if (item.opcao2 is not null) radio.resposta.Add(new TextQuant(item.opcao2, radioBoxDB.Where(s => s.radio == 2).Count(),2));
                            if (item.opcao3 is not null) radio.resposta.Add(new TextQuant(item.opcao3, radioBoxDB.Where(s => s.radio == 3).Count(),3));
                            if (item.opcao4 is not null) radio.resposta.Add(new TextQuant(item.opcao4, radioBoxDB.Where(s => s.radio == 4).Count(),4));
                            if (item.opcao5 is not null) radio.resposta.Add(new TextQuant(item.opcao5, radioBoxDB.Where(s => s.radio == 5).Count(),5));
                            if (item.opcao6 is not null) radio.resposta.Add(new TextQuant(item.opcao6, radioBoxDB.Where(s => s.radio == 6).Count(),6));
                            if (item.opcao7 is not null) radio.resposta.Add(new TextQuant(item.opcao7, radioBoxDB.Where(s => s.radio == 7).Count(),7));
                            if (item.opcao8 is not null) radio.resposta.Add(new TextQuant(item.opcao8, radioBoxDB.Where(s => s.radio == 8).Count(),8));
                            if (item.opcao9 is not null) radio.resposta.Add(new TextQuant(item.opcao9, radioBoxDB.Where(s => s.radio == 9).Count(),9));
                            if (item.opcao10 is not null) radio.resposta.Add(new TextQuant(item.opcao10, radioBoxDB.Where(s => s.radio == 10).Count(),10));

                            // Informações gerais
                            radio.derivadaDeOpcao = item.derivadaDeOpcao is not null ? (int)item.derivadaDeOpcao : null;
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
                            var checkBoxDB =
                                   from checkbox in ProjetoDbContext.Checkboxes
                                   join resposta in ProjetoDbContext.Enviados on checkbox.RespostaId equals resposta.Id
                                   where checkbox.QuestaoId == item.id && resposta.FormId == FormId
                                   select new CheckboxDTO
                                   {
                                       opcao1 = checkbox.Opcao1,
                                       opcao2 = checkbox.Opcao2,
                                       opcao3 = checkbox.Opcao3,
                                       opcao4 = checkbox.Opcao4,
                                       opcao5 = checkbox.Opcao5,
                                       opcao6 = checkbox.Opcao6,
                                       opcao7 = checkbox.Opcao7,
                                       opcao8 = checkbox.Opcao8,
                                       opcao9 = checkbox.Opcao9,
                                       opcao10 = checkbox.Opcao10,
                                       questaoId = checkbox.QuestaoId
                                   };
                            // Adiciona texto e quantidade de respostas na estrutura "QuantidadeResposta"
                            check.resposta.Add(new TextQuant(item.opcao1, checkBoxDB.Where(s => s.opcao1 == true).Count(),1));
                            if (item.opcao2 is not null) check.resposta.Add(new TextQuant(item.opcao2, checkBoxDB.Where(s => s.opcao2 == true).Count(),2));
                            if (item.opcao3 is not null) check.resposta.Add(new TextQuant(item.opcao3, checkBoxDB.Where(s => s.opcao3 == true).Count(),3));
                            if (item.opcao4 is not null) check.resposta.Add(new TextQuant(item.opcao4, checkBoxDB.Where(s => s.opcao4 == true).Count(),4));
                            if (item.opcao5 is not null) check.resposta.Add(new TextQuant(item.opcao5, checkBoxDB.Where(s => s.opcao5 == true).Count(),5));
                            if (item.opcao6 is not null) check.resposta.Add(new TextQuant(item.opcao6, checkBoxDB.Where(s => s.opcao6 == true).Count(),6));
                            if (item.opcao7 is not null) check.resposta.Add(new TextQuant(item.opcao7, checkBoxDB.Where(s => s.opcao7 == true).Count(),7));
                            if (item.opcao8 is not null) check.resposta.Add(new TextQuant(item.opcao8, checkBoxDB.Where(s => s.opcao8 == true).Count(),8));
                            if (item.opcao9 is not null) check.resposta.Add(new TextQuant(item.opcao9, checkBoxDB.Where(s => s.opcao9 == true).Count(),9));
                            if (item.opcao10 is not null) check.resposta.Add(new TextQuant(item.opcao10, checkBoxDB.Where(s => s.opcao10 == true).Count(),10));

                            // Informações gerais
                            check.derivadaDeOpcao = item.derivadaDeOpcao is not null ? (int)item.derivadaDeOpcao : null;
                            check.enunciado = item.enunciado;
                            check.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                            check.type = item.type;
                            check.numero = item.numero;
                            response.Add(check);
                        }
                        break;
                    case 9:
                        QuantidadeResposta questao = new QuantidadeResposta();
                        // Acha as respostas da questão
                        var questaoDB =
                               from radiobox in ProjetoDbContext.Radioboxes
                               join resposta in ProjetoDbContext.Enviados on radiobox.RespostaId equals resposta.Id
                               where radiobox.QuestaoId == item.id && resposta.FormId == FormId
                               select new RadioboxDTO
                               {
                                   radio = radiobox.Radio,
                                   questaoId = radiobox.QuestaoId
                               };
                        // Adiciona texto e quantidade de respostas na estrutura "QuantidadeResposta"
                        if (item.opcao1 is not null) questao.resposta.Add(new TextQuant(item.opcao1, questaoDB.Where(s => s.radio == 1).Count(),1));
                        if (item.opcao2 is not null) questao.resposta.Add(new TextQuant(item.opcao2, questaoDB.Where(s => s.radio == 2).Count(),2));
                        if (item.opcao3 is not null) questao.resposta.Add(new TextQuant(item.opcao3, questaoDB.Where(s => s.radio == 3).Count(),3));
                        if (item.opcao4 is not null) questao.resposta.Add(new TextQuant(item.opcao4, questaoDB.Where(s => s.radio == 4).Count(),4));
                        if (item.opcao5 is not null) questao.resposta.Add(new TextQuant(item.opcao5, questaoDB.Where(s => s.radio == 5).Count(),5));
                        if (item.opcao6 is not null) questao.resposta.Add(new TextQuant(item.opcao6, questaoDB.Where(s => s.radio == 6).Count(), 6));
                        if (item.opcao7 is not null) questao.resposta.Add(new TextQuant(item.opcao7, questaoDB.Where(s => s.radio == 7).Count(), 7));
                        if (item.opcao8 is not null) questao.resposta.Add(new TextQuant(item.opcao8, questaoDB.Where(s => s.radio == 8).Count(), 8));
                        if (item.opcao9 is not null) questao.resposta.Add(new TextQuant(item.opcao9, questaoDB.Where(s => s.radio == 9).Count(), 9));
                        if (item.opcao10 is not null) questao.resposta.Add(new TextQuant(item.opcao10, questaoDB.Where(s => s.radio == 10).Count(), 10));

                        var questoesDerivadas = await
                               (from questaodb in ProjetoDbContext.Questoes
                               where questaodb.FormId == FormularioId && questaodb.DerivadaDeId == item.id
                               select new QuestoesDTO
                               {
                                   id = questaodb.Id,
                                   numero = questaodb.Numero,
                                   type = questaodb.Type,
                                   formId = questaodb.FormId,
                                   enunciado = questaodb.Enunciado,
                                   derivadaDeOpcao = questaodb.DerivadaDeOpcao,
                                   opcao1 = questaodb.Opcao1,
                                   opcao2 = questaodb.Opcao2,
                                   opcao3 = questaodb.Opcao3,
                                   opcao4 = questaodb.Opcao4,
                                   opcao5 = questaodb.Opcao5,
                                   opcao6 = questaodb.Opcao6,
                                   opcao7 = questaodb.Opcao7,
                                   opcao8 = questaodb.Opcao8,
                                   opcao9 = questaodb.Opcao9,
                                   opcao10 = questaodb.Opcao10
                               }).ToListAsync();
                        questao.derivadas = await PegarRespostas(questoesDerivadas,FormId,FormularioId);

                        questao.derivadaDeOpcao = item.derivadaDeOpcao is not null ? (int)item.derivadaDeOpcao : null;
                        questao.enunciado = item.enunciado;
                        questao.id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        questao.type = item.type;
                        questao.numero = item.numero;
                        response.Add(questao);
                        break;
                    case 4:
                    case 2:
                        break;
                    default:
                        throw new Exception("Tipo da questão não existe");
                }
            }

            return response;
        }
    }
}
