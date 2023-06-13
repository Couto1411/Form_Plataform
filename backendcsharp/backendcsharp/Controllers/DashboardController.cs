using backendcsharp.DTO;
using backendcsharp.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections;

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
                    if (item.opcao1.Length > 0) quest.Opcoes.Add("Opção1 " + item.opcao1);
                    if (item.opcao2.Length > 0) quest.Opcoes.Add("Opção2 " + item.opcao2);
                    if (item.opcao3.Length > 0) quest.Opcoes.Add("Opção3 " + item.opcao3);
                    if (item.opcao4.Length > 0) quest.Opcoes.Add("Opção4 " + item.opcao4);
                    if (item.opcao5.Length > 0) quest.Opcoes.Add("Opção5 " + item.opcao5);
                    if (item.opcao6.Length > 0) quest.Opcoes.Add("Opção6 " + item.opcao6);
                    if (item.opcao7.Length > 0) quest.Opcoes.Add("Opção7 " + item.opcao7);
                    if (item.opcao8.Length > 0) quest.Opcoes.Add("Opção8 " + item.opcao8);
                    if (item.opcao9.Length > 0) quest.Opcoes.Add("Opção9 " + item.opcao9);
                    if (item.opcao10.Length > 0) quest.Opcoes.Add("Opção10 " + item.opcao10);
                    quest.Numero = (int)item.numero;
                    labels.Add(quest);
                }
                foreach (var form in derivadosId)
                {
                    List<List<int>> Dados = new();
                    var respostasCheck = (await
                        (
                            from check in ProjetoDbContext.Checkboxes
                            join enviados in ProjetoDbContext.Enviados on check.RespostaId equals enviados.Id
                            join formularios in ProjetoDbContext.Formularios on enviados.FormId equals formularios.Id
                            where formularios.Id == form && questoesId.Contains((int)check.QuestaoId)
                            select new CheckboxDTO
                            {
                                questaoId=check.QuestaoId,
                                opcao1=check.Opcao1 == null?false:check.Opcao1,
                                opcao2=check.Opcao2 == null ? false : check.Opcao2,
                                opcao3=check.Opcao3 == null ? false : check.Opcao3,
                                opcao4=check.Opcao4 == null ? false : check.Opcao4,
                                opcao5=check.Opcao5 == null ? false : check.Opcao5,
                                opcao6=check.Opcao6 == null ? false : check.Opcao6,
                                opcao7=check.Opcao7 == null ? false : check.Opcao7,
                                opcao8=check.Opcao8 == null ? false : check.Opcao8,
                                opcao9=check.Opcao9 == null ? false : check.Opcao9,
                                opcao10= check.Opcao10 == null ? false : check.Opcao10,
                            }
                        ).ToListAsync())
                        .GroupBy(X => X.questaoId)
                        .Select(t => new
                        {
                            questaoId = t.Key,
                            opcao1 = t.Count(ta=>ta.opcao1.HasValue && ta.opcao1.Value),
                            opcao2 = t.Count(ta=> ta.opcao2.HasValue && ta.opcao2.Value),
                            opcao3 = t.Count(ta=>ta.opcao3.HasValue && ta.opcao3.Value),
                            opcao4 = t.Count(ta=>ta.opcao4.HasValue && ta.opcao4.Value),
                            opcao5 = t.Count(ta=>ta.opcao5.HasValue && ta.opcao5.Value),
                            opcao6 = t.Count(ta=>ta.opcao6.HasValue && ta.opcao6.Value),
                            opcao7 = t.Count(ta=>ta.opcao7.HasValue && ta.opcao7.Value),
                            opcao8 = t.Count(ta=>ta.opcao8.HasValue && ta.opcao8.Value),
                            opcao9 = t.Count(ta=>ta.opcao9.HasValue && ta.opcao9.Value),
                            opcao10 = t.Count(ta=>ta.opcao10.HasValue && ta.opcao10.Value)
                        }).ToList();

                    var respostasRadio = (await
                        (
                            from radio in ProjetoDbContext.Radioboxes
                            join enviados in ProjetoDbContext.Enviados on radio.RespostaId equals enviados.Id
                            join formularios in ProjetoDbContext.Formularios on enviados.FormId equals formularios.Id
                            where formularios.Id == form && questoesId.Contains((int)radio.QuestaoId)
                            select new RadioboxDTO
                            {
                                questaoId = radio.QuestaoId,
                                radio = radio.Radio == null ? 0 : radio.Radio
                            }
                        ).ToListAsync())
                        .GroupBy(X => new { X.questaoId, X.radio})
                        .Select(t => new
                        {
                            t.Key.questaoId,
                            t.Key.radio,
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
                            var respostasQuestao = respostasRadio.FindAll(x => x.questaoId == item.questaoId);
                            if (respostasQuestao is not null)
                            {
                                for (int i = 1; i <= 10; i++)
                                {
                                    var qtd = respostasQuestao.Find(x => x.radio == i);
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
    }
}
