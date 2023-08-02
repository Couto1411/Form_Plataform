using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            public int? Id { get; set; } = null!;
            public int? Radio { get; set; } = null!;
            public string? Texto { get; set; } = null!;
            public virtual List<int> Opcoes { get; set; } = new List<int>();
        }
        // Usada quando cadastra-se uma nova resposta de um email
        public partial class ListaResposta
        {
            public string Email { get; set; } = null!;
            public virtual ICollection<Resposta> Respostas { get; set; } = new List<Resposta>();

        }

        // Adicionar Resposta
        [HttpPost("enviados/{FormId}")]
        public async Task<ActionResult> InsertResposta([FromBody] ListaResposta Resp, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(Resp.Email, "Email da resposta não informado");
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
                var destinatario = await ProjetoDbContext.Destinatarios
                    .Select(s => new DestinatarioDTO
                    {
                        id = s.Id,
                        formId = s.FormId,
                        email = s.Email,
                        respondido = s.Respondido
                    })
                    .Where(s => (s.formId == FormId && s.email == Resp.Email && (s.respondido == 0 || s.respondido == 1)))
                    .FirstOrDefaultAsync();
                if (Form is not null && destinatario is not null) {
                    FormId = Form.derivadoDeId is not null? (int)Form.derivadoDeId:FormId;
                    foreach (var item in Resp.Respostas)
                    {
                        var questao = await ProjetoDbContext.Questoes
                            .Select(s => new QuestoesDTO
                            {
                                id = s.Id,
                                formId = s.FormId,
                                numero = s.Numero
                            })
                            .Where(s => (s.formId == FormId && s.id==item.Id))
                            .FirstOrDefaultAsync() ?? throw new Exception("Questao não encontrada");
                        if (item.Radio is not null)
                        {
                            var entity = new Radiobox()
                            {
                                QuestaoId = questao.id != null ? (uint)questao.id : throw new Exception("Questao id nulo"),
                                RespostaId = destinatario.id != null ? (uint)destinatario.id : throw new Exception("Resposta id nulo"),
                                Radio = item.Radio
                            };
                            ProjetoDbContext.Radioboxes.Add(entity);
                        }
                        else if (item.Opcoes.Count > 0)
                        {
                            var entity = new Checkbox()
                            {
                                QuestaoId = questao.id != null ? (uint)questao.id : throw new Exception("Questao id nulo"),
                                RespostaId = destinatario.id != null ? (uint)destinatario.id : throw new Exception("Resposta id nulo"),
                                Opcao1 = item.Opcoes.IndexOf(1) != -1 ? true : null,
                                Opcao2 = item.Opcoes.IndexOf(2) != -1 ? true : null,
                                Opcao3 = item.Opcoes.IndexOf(3) != -1 ? true : null,
                                Opcao4 = item.Opcoes.IndexOf(4) != -1 ? true : null,
                                Opcao5 = item.Opcoes.IndexOf(5) != -1 ? true : null,
                                Opcao6 = item.Opcoes.IndexOf(6) != -1 ? true : null,
                                Opcao7 = item.Opcoes.IndexOf(7) != -1 ? true : null,
                                Opcao8 = item.Opcoes.IndexOf(8) != -1 ? true : null,
                                Opcao9 = item.Opcoes.IndexOf(9) != -1 ? true : null,
                                Opcao10 = item.Opcoes.IndexOf(10) != -1 ? true : null
                            };
                            ProjetoDbContext.Checkboxes.Add(entity);
                        }
                        else if (item.Texto is not null)
                        {
                            var entity = new Text()
                            {
                                QuestaoId = questao.id != null ? (uint)questao.id : throw new Exception("Questao id nulo"),
                                RespostaId = destinatario.id != null ? (uint)destinatario.id : throw new Exception("Resposta id nulo"),
                                Texto = string.IsNullOrEmpty(item.Texto)? throw new Exception("Texto vazio") : item.Texto
                            };
                            ProjetoDbContext.Texts.Add(entity);
                        }
                        else throw new Exception("Entrada errada");
                    }
                    var destinatarioUpdate = await ProjetoDbContext.Destinatarios.FirstOrDefaultAsync(s => s.Id == destinatario.id);
                    if (destinatarioUpdate != null)
                    {
                        destinatarioUpdate.Respondido = 2;
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    else throw new Exception("Id não encontrado (InsertResposta)");

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
            public uint Id { get; set; }
            public int Type { get; set; }
            public string? Enunciado { get; set; } = null!;
            public uint Numero { get; set; }
            public string? Radio { get; set; } = null!;
            public string? Texto { get; set; } = null!;
            public virtual List<string> Opcoes { get; set; } = new List<string>();
        }

        public class RespostaIndividual
        {
            public List<TipoResposta> Respostas { get; set; } = new();
            public string? Nome { get; set; } = "";
        }

        // Pegar as respostas de um email especifico
        [HttpGet("users/{Id}/forms/{FormId}/respostas/{DestinatarioId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<RespostaIndividual>> GetRespostasByDestinatarioId([FromRoute] int FormId, [FromRoute] int DestinatarioId)
        {
            try
            {
                RespostaIndividual response = new();
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(DestinatarioId.ToString(), "Id do email não informado");
                Handlers.IdNegative(DestinatarioId, "Id do email inválido");
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
                response.Respostas = await PegarRespostasIndividual(questoes, FormId, DestinatarioId);
                // Retorna resposta
                response.Nome = await (from destinatario in ProjetoDbContext.Destinatarios where destinatario.Id == DestinatarioId select destinatario.Nome).FirstOrDefaultAsync();
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        public async Task<List<TipoResposta>> PegarRespostasIndividual(List<QuestoesDTO> questoes, int FormId, int DestinatarioId)
        {
            List<TipoResposta> response = new();
            foreach (var item in questoes)
            {
                switch (item.type)
                {
                    // Adiciona questões do tipo RadioBox
                    case 1:
                        TipoResposta radio = new();
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
                                .Where(s => (s.questaoId == item.id && s.respostaId == DestinatarioId))
                                .FirstOrDefaultAsync();
                            if (radioBoxDB is not null)
                            {
                                // Coloca a opcao respondida na estrutura "TipoResposta"
                                switch (radioBoxDB.radio)
                                {
                                    case 1:
                                        radio.Radio = item.opcao1;
                                        break;
                                    case 2:
                                        radio.Radio = item.opcao2;
                                        break;
                                    case 3:
                                        radio.Radio = item.opcao3;
                                        break;
                                    case 4:
                                        radio.Radio = item.opcao4;
                                        break;
                                    case 5:
                                        radio.Radio = item.opcao5;
                                        break;
                                    case 6:
                                        radio.Radio = item.opcao6;
                                        break;
                                    case 7:
                                        radio.Radio = item.opcao7;
                                        break;
                                    case 8:
                                        radio.Radio = item.opcao8;
                                        break;
                                    case 9:
                                        radio.Radio = item.opcao9;
                                        break;
                                    case 10:
                                        radio.Radio = item.opcao10;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }

                        // Informações gerais
                        radio.Enunciado = item.enunciado;
                        radio.Id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        radio.Type = item.type;
                        radio.Numero = item.numero;
                        response.Add(radio);
                        break;

                    // Adiciona questões do tipo Texto
                    case 2:
                        TipoResposta texto = new();

                        // Acha a resposta da questão
                        var textDB = await ProjetoDbContext.Texts
                            .Select(s => new TextDTO
                            {
                                texto = s.Texto,
                                questaoId = s.QuestaoId,
                                respostaId = s.RespostaId
                            })
                            .Where(s => (s.questaoId == item.id && s.respostaId == DestinatarioId))
                            .FirstOrDefaultAsync();

                        // Coloca o texto respondido na estrutura "TipoResposta"
                        if (textDB is not null)
                        {
                            texto.Texto = textDB.texto;
                        }

                        // Informações gerais
                        texto.Enunciado = item.enunciado;
                        texto.Id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        texto.Type = item.type;
                        texto.Numero = item.numero;
                        response.Add(texto);
                        break;

                    // Adiciona questões do tipo Checkbox
                    case 3:
                        TipoResposta check = new();
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
                                .Where(s => (s.questaoId == item.id && s.respostaId == DestinatarioId))
                                .FirstOrDefaultAsync();
                            if (checkBoxDB is not null)
                            {
                                // Coloca as opcões respondidas na estrutura "TipoResposta"
                                if (checkBoxDB.opcao1 == true) check.Opcoes.Add(item.opcao1);
                                if (item.opcao2 is not null && checkBoxDB.opcao2 == true) check.Opcoes.Add(item.opcao2);
                                if (item.opcao3 is not null && checkBoxDB.opcao3 == true) check.Opcoes.Add(item.opcao3);
                                if (item.opcao4 is not null && checkBoxDB.opcao4 == true) check.Opcoes.Add(item.opcao4);
                                if (item.opcao5 is not null && checkBoxDB.opcao5 == true) check.Opcoes.Add(item.opcao5);
                                if (item.opcao6 is not null && checkBoxDB.opcao6 == true) check.Opcoes.Add(item.opcao6);
                                if (item.opcao7 is not null && checkBoxDB.opcao7 == true) check.Opcoes.Add(item.opcao7);
                                if (item.opcao8 is not null && checkBoxDB.opcao8 == true) check.Opcoes.Add(item.opcao8);
                                if (item.opcao9 is not null && checkBoxDB.opcao9 == true) check.Opcoes.Add(item.opcao9);
                                if (item.opcao10 is not null && checkBoxDB.opcao10 == true) check.Opcoes.Add(item.opcao10);
                            }
                        }

                        // Informações gerais
                        check.Enunciado = item.enunciado;
                        check.Id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        check.Type = item.type;
                        check.Numero = item.numero;
                        response.Add(check);
                        break;
                    case 4:
                        TipoResposta descricao = new()
                        {
                            Enunciado = item.enunciado,
                            Id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado"),
                            Type = item.type,
                            Numero = item.numero
                        };
                        response.Add(descricao);
                        break;
                    case 9:
                        TipoResposta questaoOrig = new();
                        List<TipoResposta> derivadas = new();
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
                                .Where(s => (s.questaoId == item.id && s.respostaId == DestinatarioId))
                                .FirstOrDefaultAsync();
                            if (questaoOrigDB is not null)
                            {
                                // Coloca a opcao respondida na estrutura "TipoResposta"
                                switch (questaoOrigDB.radio)
                                {
                                    case 1:
                                        questaoOrig.Radio = item.opcao1;
                                        break;
                                    case 2:
                                        questaoOrig.Radio = item.opcao2;
                                        break;
                                    case 3:
                                        questaoOrig.Radio = item.opcao3;
                                        break;
                                    case 4:
                                        questaoOrig.Radio = item.opcao4;
                                        break;
                                    case 5:
                                        questaoOrig.Radio = item.opcao5;
                                        break;
                                    case 6:
                                        questaoOrig.Radio = item.opcao6;
                                        break;
                                    case 7:
                                        questaoOrig.Radio = item.opcao7;
                                        break;
                                    case 8:
                                        questaoOrig.Radio = item.opcao8;
                                        break;
                                    case 9:
                                        questaoOrig.Radio = item.opcao9;
                                        break;
                                    case 10:
                                        questaoOrig.Radio = item.opcao10;
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
                                derivadas = await PegarRespostasIndividual(questoesDerivadas, FormId, DestinatarioId);
                            }
                        }

                        // Informações gerais
                        questaoOrig.Enunciado = item.enunciado;
                        questaoOrig.Id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                        questaoOrig.Type = item.type;
                        questaoOrig.Numero = item.numero;
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
            public virtual string Texto { get; set; } = null!;
            public virtual int Opcao { get; set; }
            public virtual int Quantidade { get; set; }
            public List<DestinatarioDTO> Destinatarios { get; set; } = new List<DestinatarioDTO>();
            public TextQuant(string a, int c, List<DestinatarioDTO> respostas)
            {
                Opcao = c;
                Texto = a;
                Destinatarios = respostas;
                Quantidade = respostas.Count();
            }

        }
        // Usada para coletar a quantidade de respostas de um fromulário
        public class QuantidadeResposta
        {
            public uint Id { get; set; }
            public int? DerivadaDeOpcao { get; set; }
            public int Type { get; set; }
            public string? Enunciado { get; set; } = null!;
            public uint Numero { get; set; }
            public List<QuantidadeResposta> Derivadas { get; set; } = new List<QuantidadeResposta>();
            public List<TextQuant> Resposta { get; set; } = new List<TextQuant>();
        }
        public class RetornoRespostas
        {
            public int QuantidadeRespostas { get; set; } = 0;
            public List<QuantidadeResposta> Respostas { get; set; } = new List<QuantidadeResposta>();
            public RetornoRespostas(int quantidadeRespostas, List<QuantidadeResposta> respostas)
            {
                this.QuantidadeRespostas = quantidadeRespostas;
                this.Respostas = respostas;
            }
        }
        // Pegar as respostas de um formulário especifico
        [HttpGet("users/{Id}/forms/{FormId}/respostas")]
        [Authorize("Bearer")]
        public async Task<ActionResult<RetornoRespostas>> GetRespostasByFormId([FromRoute] int FormId)
        {
            try
            {
                List<QuantidadeResposta> response = new();
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
                    (from destinatario in ProjetoDbContext.Destinatarios
                     where destinatario.FormId == FormId && destinatario.Respondido == 2
                     select new { id = destinatario.Id }
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
            List<QuantidadeResposta> response = new();
            foreach (var item in questoes)
            {
                switch (item.type)
                {
                    // Adiciona questões do tipo RadioBox
                    case 9:
                    case 1:
                        if (item.opcao1 is not null)
                        {
                            QuantidadeResposta radio = new();

                            // Acha as respostas da questão
                            var radioBoxDB =
                                   from radiobox in ProjetoDbContext.Radioboxes
                                   join resposta in ProjetoDbContext.Destinatarios on radiobox.RespostaId equals resposta.Id
                                   where radiobox.QuestaoId == item.id && resposta.FormId == FormId
                                   select new
                                   {
                                       destinatario = new DestinatarioDTO(resposta),
                                       radio = radiobox.Radio,
                                       questaoId = radiobox.QuestaoId
                                   };
                            // Adiciona texto e quantidade de respostas na estrutura "QuantidadeResposta"
                            radio.Resposta.Add(new TextQuant(item.opcao1,1, radioBoxDB.Where(s => s.radio == 1).Select(s=>s.destinatario).ToList()));
                            if (item.opcao2 is not null)  radio.Resposta.Add(new TextQuant(item.opcao2,  2,  radioBoxDB.Where(s => s.radio == 2) .Select(x => x.destinatario).ToList()));
                            if (item.opcao3 is not null)  radio.Resposta.Add(new TextQuant(item.opcao3,  3,  radioBoxDB.Where(s => s.radio == 3) .Select(x => x.destinatario).ToList()));
                            if (item.opcao4 is not null)  radio.Resposta.Add(new TextQuant(item.opcao4,  4,  radioBoxDB.Where(s => s.radio == 4) .Select(x => x.destinatario).ToList()));
                            if (item.opcao5 is not null)  radio.Resposta.Add(new TextQuant(item.opcao5,  5,  radioBoxDB.Where(s => s.radio == 5) .Select(x => x.destinatario).ToList()));
                            if (item.opcao6 is not null)  radio.Resposta.Add(new TextQuant(item.opcao6,  6,  radioBoxDB.Where(s => s.radio == 6) .Select(x => x.destinatario).ToList()));
                            if (item.opcao7 is not null)  radio.Resposta.Add(new TextQuant(item.opcao7,  7,  radioBoxDB.Where(s => s.radio == 7) .Select(x => x.destinatario).ToList()));
                            if (item.opcao8 is not null)  radio.Resposta.Add(new TextQuant(item.opcao8,  8,  radioBoxDB.Where(s => s.radio == 8) .Select(x => x.destinatario).ToList()));
                            if (item.opcao9 is not null)  radio.Resposta.Add(new TextQuant(item.opcao9,  9,  radioBoxDB.Where(s => s.radio == 9) .Select(x => x.destinatario).ToList()));
                            if (item.opcao10 is not null) radio.Resposta.Add(new TextQuant(item.opcao10, 10, radioBoxDB.Where(s => s.radio == 10).Select(x => x.destinatario).ToList()));

                            // Adiciona derivadas caso seja questão funcional
                            if (item.type==9)
                            {
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
                                radio.Derivadas = await PegarRespostas(questoesDerivadas, FormId, FormularioId);
                            }

                            // Informações gerais
                            radio.DerivadaDeOpcao = item.derivadaDeOpcao is not null ? (int)item.derivadaDeOpcao : null;
                            radio.Enunciado = item.enunciado;
                            radio.Id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                            radio.Type = item.type;
                            radio.Numero = item.numero;
                            response.Add(radio);
                        }
                        break;
                    case 3:
                        if (item.opcao1 is not null)
                        {
                            QuantidadeResposta check = new();

                            // Acha a resposta da questão
                            var checkBoxDB =
                                   from checkbox in ProjetoDbContext.Checkboxes
                                   join resposta in ProjetoDbContext.Destinatarios on checkbox.RespostaId equals resposta.Id
                                   where checkbox.QuestaoId == item.id && resposta.FormId == FormId
                                   select new
                                   {
                                       destinatario = new DestinatarioDTO(resposta),
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
                            check.Resposta.Add(new TextQuant(item.opcao1, 1, checkBoxDB.Where(s => s.opcao1 == true).Select(x=>x.destinatario).ToList()));
                            if (item.opcao2 is not null)  check.Resposta.Add(new TextQuant(item.opcao2,  2,  checkBoxDB.Where(s => s.opcao2 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao3 is not null)  check.Resposta.Add(new TextQuant(item.opcao3,  3,  checkBoxDB.Where(s => s.opcao3 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao4 is not null)  check.Resposta.Add(new TextQuant(item.opcao4,  4,  checkBoxDB.Where(s => s.opcao4 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao5 is not null)  check.Resposta.Add(new TextQuant(item.opcao5,  5,  checkBoxDB.Where(s => s.opcao5 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao6 is not null)  check.Resposta.Add(new TextQuant(item.opcao6,  6,  checkBoxDB.Where(s => s.opcao6 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao7 is not null)  check.Resposta.Add(new TextQuant(item.opcao7,  7,  checkBoxDB.Where(s => s.opcao7 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao8 is not null)  check.Resposta.Add(new TextQuant(item.opcao8,  8,  checkBoxDB.Where(s => s.opcao8 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao9 is not null)  check.Resposta.Add(new TextQuant(item.opcao9,  9,  checkBoxDB.Where(s => s.opcao9 == true) .Select(x => x.destinatario).ToList()));
                            if (item.opcao10 is not null) check.Resposta.Add(new TextQuant(item.opcao10, 10, checkBoxDB.Where(s => s.opcao10 == true).Select(x => x.destinatario).ToList()));

                            // Informações gerais
                            check.DerivadaDeOpcao = item.derivadaDeOpcao is not null ? (int)item.derivadaDeOpcao : null;
                            check.Enunciado = item.enunciado;
                            check.Id = item.id != null ? (uint)item.id : throw new Exception("Id da questão não encontrado");
                            check.Type = item.type;
                            check.Numero = item.numero;
                            response.Add(check);
                        }
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
