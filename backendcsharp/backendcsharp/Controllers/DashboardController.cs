using backendcsharp.DTO;
using backendcsharp.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections;
using System.Linq;

namespace backendcsharp.Controllers
{
    [ApiController]
    public class DashboardController : ControllerBase
    {

        private readonly ProjetoDbContext ProjetoDbContext;

        public DashboardController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }

        public class Questao
        {
            public int Numero { get; set; } = 0;
            public string Enunciado { get; set; } = "";
            public List<string> Opcoes { get; set; } = new();
        }

        public class DataGraphics
        {
            public List<Questao> Labels { get; set; } = new();
            public List<List<List<int>>> Data { get; set; } = new();
            public DataGraphics(List<Questao> labels, List<List<List<int>>> data)
            {
                this.Labels = labels;
                this.Data = data;
            }

        }

        // Pegar as respostas de um formulário especifico
        [HttpGet("users/dashboard")]
        [Authorize("Bearer")]
        public async Task<ActionResult<DataGraphics>> GeraDashboard([FromQuery] int? formId, [FromQuery] string? derivados, [FromQuery] string? questoes)
        {
            try
            {
                List<List<List<int>>> DataSets = new();
                List<int>? derivadosId = new();
                if (derivados is not null)
                {
                    derivadosId = JsonConvert.DeserializeObject<List<int>>(derivados);
                }
                derivadosId ??= new();
                if (formId is null) throw new Exception("Id do Formulário não informado na query");
                derivadosId.Insert(0, (int)formId);
                List<int>? questoesId = new();
                if (questoes is not null)
                {
                    questoesId = JsonConvert.DeserializeObject<List<int>>(questoes);
                }
                questoesId ??= new();

                var questoesOpcoes = await
                    (from questao in ProjetoDbContext.Questoes
                     where questoesId.Contains((int)questao.Id)
                     select new
                     {
                         questaoId = questao.Id,
                         enunciado = questao.Enunciado,
                         numero = questao.Numero,
                         tipo = questao.Type,
                         opcao1 = questao.Opcao1 ?? "",
                         opcao2 = questao.Opcao2 ?? "",
                         opcao3 = questao.Opcao3 ?? "",
                         opcao4 = questao.Opcao4 ?? "",
                         opcao5 = questao.Opcao5 ?? "",
                         opcao6 = questao.Opcao6 ?? "",
                         opcao7 = questao.Opcao7 ?? "",
                         opcao8 = questao.Opcao8 ?? "",
                         opcao9 = questao.Opcao9 ?? "",
                         opcao10 = questao.Opcao10 ?? ""
                     }).ToListAsync();
                List<Questao> labels= new();
                foreach (var item in questoesOpcoes)
                {
                    Questao quest = new();
                    if (item.opcao1.Length > 0) quest.Opcoes.Add("Opção 1: " + item.opcao1);
                    if (item.opcao2.Length > 0) quest.Opcoes.Add("Opção 2: " + item.opcao2);
                    if (item.opcao3.Length > 0) quest.Opcoes.Add("Opção 3: " + item.opcao3);
                    if (item.opcao4.Length > 0) quest.Opcoes.Add("Opção 4: " + item.opcao4);
                    if (item.opcao5.Length > 0) quest.Opcoes.Add("Opção 5: " + item.opcao5);
                    if (item.opcao6.Length > 0) quest.Opcoes.Add("Opção 6: " + item.opcao6);
                    if (item.opcao7.Length > 0) quest.Opcoes.Add("Opção 7: " + item.opcao7);
                    if (item.opcao8.Length > 0) quest.Opcoes.Add("Opção 8: " + item.opcao8);
                    if (item.opcao9.Length > 0) quest.Opcoes.Add("Opção 9: " + item.opcao9);
                    if (item.opcao10.Length > 0) quest.Opcoes.Add("Opção 10: " + item.opcao10);
                    quest.Numero = (int)item.numero;
                    quest.Enunciado = item.enunciado;
                    labels.Add(quest);
                }
                foreach (var form in derivadosId)
                {
                    List<List<int>> Dados = new();
                    var respostasCheck = (await
                        (
                            from check in ProjetoDbContext.Checkboxes
                            join destinatario in ProjetoDbContext.Destinatarios on check.RespostaId equals destinatario.Id
                            join formularios in ProjetoDbContext.Formularios on destinatario.FormId equals formularios.Id
                            where formularios.Id == form && questoesId.Contains((int)check.QuestaoId)
                            select new CheckboxDTO
                            {
                                QuestaoId=check.QuestaoId,
                                Opcao1=check.Opcao1 == null?false:check.Opcao1,
                                Opcao2=check.Opcao2 == null ? false : check.Opcao2,
                                Opcao3=check.Opcao3 == null ? false : check.Opcao3,
                                Opcao4=check.Opcao4 == null ? false : check.Opcao4,
                                Opcao5=check.Opcao5 == null ? false : check.Opcao5,
                                Opcao6=check.Opcao6 == null ? false : check.Opcao6,
                                Opcao7=check.Opcao7 == null ? false : check.Opcao7,
                                Opcao8=check.Opcao8 == null ? false : check.Opcao8,
                                Opcao9=check.Opcao9 == null ? false : check.Opcao9,
                                Opcao10= check.Opcao10 == null ? false : check.Opcao10,
                            }
                        ).ToListAsync())
                        .GroupBy(X => X.QuestaoId)
                        .Select(t => new
                        {
                            questaoId = t.Key,
                            opcao1 = t.Count(ta=>ta.Opcao1.HasValue && ta.Opcao1.Value),
                            opcao2 = t.Count(ta=> ta.Opcao2.HasValue && ta.Opcao2.Value),
                            opcao3 = t.Count(ta=>ta.Opcao3.HasValue && ta.Opcao3.Value),
                            opcao4 = t.Count(ta=>ta.Opcao4.HasValue && ta.Opcao4.Value),
                            opcao5 = t.Count(ta=>ta.Opcao5.HasValue && ta.Opcao5.Value),
                            opcao6 = t.Count(ta=>ta.Opcao6.HasValue && ta.Opcao6.Value),
                            opcao7 = t.Count(ta=>ta.Opcao7.HasValue && ta.Opcao7.Value),
                            opcao8 = t.Count(ta=>ta.Opcao8.HasValue && ta.Opcao8.Value),
                            opcao9 = t.Count(ta=>ta.Opcao9.HasValue && ta.Opcao9.Value),
                            opcao10 = t.Count(ta=>ta.Opcao10.HasValue && ta.Opcao10.Value)
                        }).ToList();

                    var respostasRadio = (await
                        (
                            from radio in ProjetoDbContext.Radioboxes
                            join destinatario in ProjetoDbContext.Destinatarios on radio.RespostaId equals destinatario.Id
                            join formularios in ProjetoDbContext.Formularios on destinatario.FormId equals formularios.Id
                            where formularios.Id == form && questoesId.Contains((int)radio.QuestaoId)
                            select new RadioboxDTO
                            {
                                QuestaoId = radio.QuestaoId,
                                Radio = radio.Radio == null ? 0 : radio.Radio
                            }
                        ).ToListAsync())
                        .GroupBy(X => new { X.QuestaoId, X.Radio})
                        .Select(t => new
                        {
                            t.Key.QuestaoId,
                            t.Key.Radio,
                            quantidade = t.Count()
                        }).ToList();

                    foreach (var item in questoesOpcoes)
                    {
                        List<int> Dado = new();
                        if (item.tipo == 3)
                        {
                            var respostasQuestao = respostasCheck.Find(x => x.questaoId == item.questaoId);
                            if (respostasQuestao is not null)
                            {
                                Dado.Add(respostasQuestao.opcao1);
                                Dado.Add(respostasQuestao.opcao2);
                                Dado.Add(respostasQuestao.opcao3);
                                Dado.Add(respostasQuestao.opcao4);
                                Dado.Add(respostasQuestao.opcao5);
                                Dado.Add(respostasQuestao.opcao6);
                                Dado.Add(respostasQuestao.opcao7);
                                Dado.Add(respostasQuestao.opcao8);
                                Dado.Add(respostasQuestao.opcao9);
                                Dado.Add(respostasQuestao.opcao10);
                            }
                            else for (int i = 0; i < 10; i++) Dado.Add(0);
                        }
                        else
                        {
                            var respostasQuestao = respostasRadio.FindAll(x => x.QuestaoId == item.questaoId);
                            if (respostasQuestao is not null)
                            {
                                for (int i = 1; i <= 10; i++)
                                {
                                    var qtd = respostasQuestao.Find(x => x.Radio == i);
                                    if (qtd is not null) Dado.Add(qtd.quantidade);
                                    else Dado.Add(0);
                                }
                            }
                            else for (int i = 0; i < 10; i++) Dado.Add(0);
                        }
                        Dados.Add(Dado);
                    }
                    DataSets.Add(Dados);
                }
                return new DataGraphics(labels,DataSets);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        public class QuestaoFiltro
        {
            public uint Questao { get; set; } = new();
            public List<uint> Opcoes { get; set; } = new();
        }
        public class Respostas : QuestoesDTO
        {
            public string? Radio { get; set; } = "";
            public uint RadioNum { get; set; } = new();
            public string? Texto { get; set; } = "";
            public List<uint> ChecksNum { get; set; } = new();
            public List<string>? Checks { get; set; } = new();
            public Respostas(Questoes questoes, string? texto, int radioNum, string? radio, List<uint> checksNum, List<string>? checks) : base(questoes)
            {
                Radio = radio;
                RadioNum = (uint)radioNum;
                Texto = texto;
                if (checks?.Count(x => x == "") == 10) Checks = null;
                else
                {
                    checks?.RemoveAll(s => string.IsNullOrWhiteSpace(s));
                    Checks = checks;
                    checksNum?.RemoveAll(s => s == 0);
                    ChecksNum = checksNum ?? new();
                }
            }
        }

        public class Relatorio
        {
            public DestinatarioDTO Destinatario { get; set; } = new();
            public List<Respostas> Respostas { get; set; } = new();
            public Relatorio(DestinatarioDTO destinatario, List<Respostas> respostas)
            {
                Destinatario = destinatario;
                Respostas = respostas;
            }

        }
        public class Retorno
        {
            public List<Relatorio> Relatorio { get; set; } = new();
            public string NomePesquisa { get; set; } = "";
            public Retorno(List<Relatorio> relatorio, string nomePesquisa)
            {
                Relatorio = relatorio;
                NomePesquisa = nomePesquisa;
            }
        }

        // Pegar as respostas de um formulário especifico
        [HttpGet("users/relatorio/{FormId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<Retorno>> GeraRelatorio([FromRoute] int? FormId, [FromQuery] bool avancado, [FromQuery] DateTime? dataAntes, [FromQuery] DateTime? dataDepois, 
            [FromQuery] string questoes, [FromQuery] string cursos, [FromQuery] string modalidades, [FromQuery] string questoesfiltros)
        {
            try
            {
                if (FormId is null) throw new Exception("Id do Formulário não informado na query");
                List<uint> questoesId = JsonConvert.DeserializeObject<List<uint>>(questoes) ?? new();
                List<uint> cursosId = JsonConvert.DeserializeObject<List<uint>>(cursos) ?? new();
                List<uint> modalidadesId = JsonConvert.DeserializeObject<List<uint>>(modalidades) ?? new();
                List<QuestaoFiltro> questoesFiltro = JsonConvert.DeserializeObject<List<QuestaoFiltro>>(questoesfiltros) ?? new();

                var nomePesquisa = await (from pesquisa in ProjetoDbContext.Formularios where pesquisa.Id == FormId select pesquisa.Titulo).FirstOrDefaultAsync();

                var cursosNomes = await (
                    from curso in ProjetoDbContext.Cursos
                    where cursosId.Contains(curso.Id)
                    select curso.Curso
                ).ToListAsync();

                var modalidadesNomes = await (
                    from modalidade in ProjetoDbContext.Modalidades
                    where modalidadesId.Contains(modalidade.Id)
                    select modalidade.Modalidade
                ).ToListAsync();

                var destinatariosRespondidos = await (
                    from destinatario in ProjetoDbContext.Destinatarios
                    where destinatario.Respondido == 2 && destinatario.FormId == FormId &&
                    (!avancado || (avancado && 
                        (cursosNomes.Count == 0      || cursosNomes.Contains(destinatario.Curso)) && 
                        (modalidadesNomes.Count == 0 || modalidadesNomes.Contains(destinatario.Modalidade)) && 
                        (dataAntes == null           || destinatario.DataColacao <= dataAntes) &&
                        (dataDepois == null          || destinatario.DataColacao >= dataDepois)
                    ))
                    select new DestinatarioDTO(destinatario)                  
                ).ToListAsync();

                FormId = await (from formulario in ProjetoDbContext.Formularios where formulario.Id == FormId select (int)(formulario.DerivadoDeId ?? formulario.Id)).FirstOrDefaultAsync();

                List<Relatorio> retorno = new();
                foreach (var item in destinatariosRespondidos)
                {
                    var respostas = await (
                        from questao in ProjetoDbContext.Questoes
                        join text in ProjetoDbContext.Texts on questao.Id equals text.QuestaoId into textGroup
                        from t in textGroup.DefaultIfEmpty()
                        join radio in ProjetoDbContext.Radioboxes on questao.Id equals radio.QuestaoId into radioGroup
                        from r in radioGroup.DefaultIfEmpty()
                        join check in ProjetoDbContext.Checkboxes on questao.Id equals check.QuestaoId into checkGroup
                        from c in checkGroup.DefaultIfEmpty()
                        where questoesId.Contains(questao.Id) && questao.FormId == FormId && (t.RespostaId == item.Id || r.RespostaId == item.Id || c.RespostaId == item.Id)
                        select new Respostas(
                            questao,
                            t.Texto,
                            r.Radio??0,
                            r.Radio != null ? (
                            r.Radio == 1  ? questao.Opcao1 :
                            r.Radio == 2  ? questao.Opcao2 :
                            r.Radio == 3  ? questao.Opcao3 :
                            r.Radio == 4  ? questao.Opcao4 :
                            r.Radio == 5  ? questao.Opcao5 :
                            r.Radio == 6  ? questao.Opcao6 :
                            r.Radio == 7  ? questao.Opcao7 :
                            r.Radio == 8  ? questao.Opcao8 :
                            r.Radio == 9  ? questao.Opcao9 :
                            r.Radio == 10 ? questao.Opcao10 : "") : null,
                            new List<uint>()
                            {
                                c.Opcao1  ?? false ? (uint) 1  : 0,
                                c.Opcao2  ?? false ? (uint) 2  : 0,
                                c.Opcao3  ?? false ? (uint) 3  : 0,
                                c.Opcao4  ?? false ? (uint) 4  : 0,
                                c.Opcao5  ?? false ? (uint) 5  : 0,
                                c.Opcao6  ?? false ? (uint) 6  : 0,
                                c.Opcao7  ?? false ? (uint) 7  : 0,
                                c.Opcao8  ?? false ? (uint) 8  : 0,
                                c.Opcao9  ?? false ? (uint) 9  : 0,
                                c.Opcao10 ?? false ? (uint) 10 : 0
                            },
                            new List<string>()
                            {
                                (c.Opcao1  ?? false ? questao.Opcao1  : "") ?? "",
                                (c.Opcao2  ?? false ? questao.Opcao2  : "") ?? "",
                                (c.Opcao3  ?? false ? questao.Opcao3  : "") ?? "",
                                (c.Opcao4  ?? false ? questao.Opcao4  : "") ?? "",
                                (c.Opcao5  ?? false ? questao.Opcao5  : "") ?? "",
                                (c.Opcao6  ?? false ? questao.Opcao6  : "") ?? "",
                                (c.Opcao7  ?? false ? questao.Opcao7  : "") ?? "",
                                (c.Opcao8  ?? false ? questao.Opcao8  : "") ?? "",
                                (c.Opcao9  ?? false ? questao.Opcao9  : "") ?? "",
                                (c.Opcao10 ?? false ? questao.Opcao10 : "") ?? ""
                            }
                    )).ToListAsync();

                    int count = 0;
                    foreach (var questaoF in questoesFiltro)
                    {
                        bool flag = respostas.Any(e => (
                            e.Id == questaoF.Questao && (
                                (e.Type==1||e.Type==9) ?  questaoF.Opcoes.Count == 0 || questaoF.Opcoes.Contains(e.RadioNum): 
                                e.Type != 3            || questaoF.Opcoes.Count == 0 || questaoF.Opcoes.Intersect(e.ChecksNum).Any()
                            )
                        ));;
                        if (flag) count++;
                    }
                    if(count==questoesFiltro.Count) retorno.Add(new Relatorio(item, respostas));
                }

                return new Retorno(retorno, nomePesquisa ?? "");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
