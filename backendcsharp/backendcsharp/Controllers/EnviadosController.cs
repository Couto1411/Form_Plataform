using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace backendcsharp.Controllers
{
    public class EnviadosController : ControllerBase
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public EnviadosController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }

        // Adicionar Email a ser enviado
        [HttpPost("users/{Id}/forms/{FormId}/enviados")]
        [Authorize("Bearer")]
        public async Task<ActionResult<EnviadoDTO>> InsertEnvio([FromBody] EnviadoDTO Envio, [FromRoute] int Id, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(Envio.email, "Email não informado");
                if (Envio.id is null)
                {
                    var entity = new Enviado()
                    {
                        Respondido = Envio.respondido,
                        FormId = ((uint)FormId),
                        Nome = Envio.nome,
                        Email = Envio.email,
                        Matricula = Envio.matricula,
                        Curso = Envio.curso,
                        TipoDeCurso = Envio.tipoDeCurso,
                        DataColacao = Envio.dataColacao,
                        Telefone1 = Envio.telefone1,
                        Telefone2 = Envio.telefone2,
                        Sexo = Envio.sexo,
                        Cpf = Envio.cpf
                    };
                    ProjetoDbContext.Enviados.Add(entity);
                    await ProjetoDbContext.SaveChangesAsync();

                    return StatusCode(204);
                }
                else throw new Exception("Id do email já existe");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        public class ModeloCefet
        {
            public string? id_discente { get; set; } = null!;
            public string? nome { get; set; } = null!;
            public string? email { get; set; } = null!;
            public string? telefone { get; set; } = null!;
            public string? matricula { get; set; } = null!;
            public string? cpf { get; set; } = null!;
            public string? sexo { get; set; } = null!;
            public string? curso { get; set; } = null!;
            public string? modalidade { get; set; } = null!;
            public string? data_colacao_grau { get; set; } = null!;
        }

        // Adicionar Emails a partir de modelo Cefet
        [HttpPost("users/{Id}/forms/{FormId}/cefetModel")]
        [Authorize("Bearer")]
        public async Task<ActionResult> InsertCefetEnvios([FromBody] List<ModeloCefet> Envio, [FromRoute] int Id, [FromRoute] int FormId)
        {
            try
            {
                HashSet<string> cursosDB = new HashSet<string>(await ProjetoDbContext.Cursos.Where(s => s.ResponsavelId == Id).Select(c=>c.Curso).ToListAsync());
                HashSet<string> cursos = new HashSet<string>();
                HashSet<string> tipoCursosDB = new HashSet<string>(await ProjetoDbContext.TiposCursos.Where(s => s.ResponsavelId == Id).Select(c => c.TipoCurso).ToListAsync());
                HashSet<string> tiposCursos = new HashSet<string>();
                Handlers.ExistsOrError(Id.ToString(), "Id do usuário não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                if (Envio is not null)
                {
                    foreach (var item in Envio)
                    {   
                        if (item.curso is not null) cursos.Add(item.curso);
                        if (item.modalidade is not null) tiposCursos.Add(item.modalidade);
                        var entity = new Enviado()
                        {
                            Respondido = false,
                            FormId = ((uint)FormId),
                            Nome = item.nome,
                            Email = item.email,
                            Matricula = item.matricula,
                            Curso = item.curso,
                            DataColacao = item.data_colacao_grau is not null ? DateTime.Parse(item.data_colacao_grau) :null,
                            TipoDeCurso = item.modalidade,
                            Telefone1 = item.telefone,
                            Sexo = item.sexo,
                            Cpf = item.cpf
                        };
                        ProjetoDbContext.Enviados.Add(entity);
                    }
                    foreach (var item in cursos)
                    {
                        var entity = new Cursos()
                        {
                            Curso = item is not null ? item : throw new Exception("Um dos itens não possui nome do curso"),
                            ResponsavelId = (uint)Id
                        };
                        if (!cursosDB.Contains(entity.Curso))
                        {
                            ProjetoDbContext.Cursos.Add(entity);
                        }
                    }
                    foreach (var item in tiposCursos)
                    {
                        var entity = new TiposCursos()
                        {
                            TipoCurso = item is not null ? item : throw new Exception("Um dos itens não possui nome do tipo do curso"),
                            ResponsavelId = (uint)Id
                        };
                        if (!tipoCursosDB.Contains(entity.TipoCurso))
                        {
                            ProjetoDbContext.TiposCursos.Add(entity);
                        }
                    }
                    await ProjetoDbContext.SaveChangesAsync();
                    return StatusCode(204);
                }
                else { throw new Exception("Lista vazia ou incorreta"); }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Modificar Email a ser enviado
        [HttpPut("users/{Id}/forms/{FormId}/enviados/{EnviadoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<EnviadoDTO>> UpdateEnvio([FromBody] EnviadoDTO Envio,[FromRoute] int FormId, [FromRoute] int EnviadoId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(EnviadoId.ToString(), "Id do email não informado");
                Handlers.IdNegative(EnviadoId, "Id do email inválido");
                Handlers.ExistsOrError(Envio.email, "Email não informado");
                Envio.id = ((uint)EnviadoId);
                Envio.formId = ((uint)FormId);
                if (Envio.id is not null)
                {
                    var entity = await ProjetoDbContext.Enviados.FirstOrDefaultAsync(s => s.Id == EnviadoId);
                    if (entity != null)
                    {
                        if (!entity.Respondido)
                        {
                            entity.FormId = Envio.formId;
                            entity.Email = Envio.email;
                            entity.Nome = Envio.nome;
                            entity.Matricula = Envio.matricula;
                            entity.Curso = Envio.curso;
                            entity.TipoDeCurso = Envio.tipoDeCurso;
                            entity.DataColacao = Envio.dataColacao;
                            entity.Telefone1 = Envio.telefone1;
                            entity.Telefone2 = Envio.telefone2;
                            entity.Sexo = Envio.sexo;
                            entity.Cpf = Envio.cpf;
                            await ProjetoDbContext.SaveChangesAsync();
                            return StatusCode(204);
                        }
                        else throw new Exception("Email já respondeu");
                    }
                    else throw new Exception("Id não encontrado (UpdateEnvio)");
                }
                else throw new Exception("Email de envio já existente");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar emails a responder por ID do formulário
        [HttpGet("users/{Id}/forms/{FormId}/enviados")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<EnviadoDTO>>> GetEnviosById([FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                var Envios = await ProjetoDbContext.Enviados
                    .Select(s => new EnviadoDTO
                    {
                        id = s.Id,
                        email= s.Email,
                        nome = s.Nome,
                        respondido = s.Respondido,
                        formId = s.FormId,
                        matricula = s.Matricula,
                        curso = s.Curso,
                        tipoDeCurso = s.TipoDeCurso,
                        dataColacao = s.DataColacao,
                        telefone1 = s.Telefone1,
                        telefone2 = s.Telefone2,
                        sexo = s.Sexo,
                        cpf = s.Cpf
                    })
                    .Where(s => s.formId == FormId)
                    .ToListAsync();
                if (Envios.Count <= 0) return NotFound();
                else return Envios;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Deleta Emails enviados (E todas as respostas) ou apenas as repostas
        [HttpDelete("users/{Id}/forms/{FormId}/enviados/{RespostaId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteEnvio([FromRoute] int RespostaId, [FromQuery] string deleta)
        {
            try
            {
                Handlers.ExistsOrError(RespostaId.ToString(), "Id do envio não informado");
                Handlers.ExistsOrError(deleta.ToString(), "Query de deletar não informada");
                Handlers.IdNegative(RespostaId, "Id do envio inválido");
                ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.RespostaId == RespostaId));
                ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.RespostaId == RespostaId));
                ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.RespostaId == RespostaId));
                // Deleta envio
                if (deleta == "true")
                {
                    var entity = new Enviado()
                    {
                        Id = ((uint)RespostaId)
                    };
                    ProjetoDbContext.Enviados.Remove(entity);
                    await ProjetoDbContext.SaveChangesAsync();
                    return StatusCode(204);
                }
                // Deleta resposta e torna envio possível
                else
                {
                    var entity = await ProjetoDbContext.Enviados.FirstOrDefaultAsync(s => s.Id == RespostaId);
                    if (entity != null)
                    {
                        if (entity.Respondido)
                        {
                            entity.Respondido = false;
                            await ProjetoDbContext.SaveChangesAsync();
                            return StatusCode(204);
                        }
                        else throw new Exception("Email não respondeu");
                    }
                    else throw new Exception("Id não encontrado (DeletaEnvio)");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar emails a responder por ID do formulário
        [HttpGet("resposta/{FormId}/email/{Email}")]
        public async Task<ActionResult<EnviadoDTO>> CheckUser([FromRoute] int FormId, [FromRoute] string Email)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(Email, "Email a ser checado não informado");
                var Envios = await ProjetoDbContext.Enviados
                    .Select(s => new EnviadoDTO
                    {
                        id = s.Id,
                        email = s.Email,
                        respondido = s.Respondido,
                        formId = s.FormId
                    })
                    .Where(s => (s.formId == FormId && s.email==Email && s.respondido==false))
                    .FirstOrDefaultAsync();
                if (Envios is null) return NotFound();
                else return Envios;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
