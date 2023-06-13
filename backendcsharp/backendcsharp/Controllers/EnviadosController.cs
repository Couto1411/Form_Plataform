using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
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

        // Adicionar contato a ser enviado
        [HttpPost("users/{Id}/forms/{FormId}/enviados")]
        [Authorize("Bearer")]
        public async Task<ActionResult<uint>> InsertContato([FromBody] EnviadoDTO Envio, [FromRoute] int Id, [FromRoute] int FormId)
        {
            try
            {
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                Handlers.ExistsOrError(Envio.email, "Email não informado");
                if (Envio.id is null)
                {
                    HashSet<Tuple<string?, string?>> contatosDB = new(await ProjetoDbContext.Enviados.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync()) ;
                    Envio.nome=String.IsNullOrEmpty(Envio.nome) ? null : Envio.nome;
                    Envio.matricula = String.IsNullOrEmpty(Envio.matricula) ? null : Envio.matricula;
                    Envio.telefone1 = String.IsNullOrEmpty(Envio.telefone1) ? null : Envio.telefone1;
                    Envio.telefone2 = String.IsNullOrEmpty(Envio.telefone2) ? null : Envio.telefone2;
                    Envio.curso = String.IsNullOrEmpty(Envio.curso) ? null : Envio.curso;
                    Envio.tipoDeCurso = String.IsNullOrEmpty(Envio.tipoDeCurso) ? null : Envio.tipoDeCurso;
                    Envio.cpf = String.IsNullOrEmpty(Envio.cpf) ? null : Envio.cpf;
                    // Chega a partir de uma hash se o usuario e matricula estão presentes no banco
                    if (!contatosDB.Contains(new Tuple<string?, string?>(Envio.email, Envio.matricula)))
                    {
                        // Adiciona contato no form original
                        var entity = new Enviado()
                        {
                            Email = Envio.email,
                            Matricula = Envio.matricula,
                            Respondido = Envio.respondido,
                            FormId = ((uint)FormId),
                            Nome = Envio.nome,
                            Curso = Envio.curso,
                            TipoDeCurso = Envio.tipoDeCurso,
                            DataColacao = Envio.dataColacao,
                            Telefone1 = Envio.telefone1,
                            Telefone2 = Envio.telefone2,
                            Sexo = Envio.sexo,
                            Cpf = Envio.cpf
                        };
                        contatosDB.Add(new Tuple<string?, string?>(Envio.email, Envio.matricula));
                        ProjetoDbContext.Enviados.Add(entity);

                        // Adiciona contato nos forms derivados
                        var FormsDerivados = await ProjetoDbContext.Formularios
                            .Select(s => new FormularioDTO
                            {
                                id = s.Id,
                                derivadoDeId = s.DerivadoDeId,
                            })
                            .Where(s => s.derivadoDeId == FormId && s.derivadoDeId != null)
                            .ToListAsync();
                        foreach (var item in FormsDerivados)
                        {
                            var entityDerivado = new Enviado()
                            {
                                Respondido = Envio.respondido,
                                FormId = item.id,
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
                            ProjetoDbContext.Enviados.Add(entityDerivado);
                        }
                        // Salva no banco
                        await ProjetoDbContext.SaveChangesAsync();

                        return entity.Id;
                    }
                    else throw new Exception("Combinação de email+mtricula ja existe no formulario");
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
                Handlers.ExistsOrError(Id.ToString(), "Id do usuário não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(FormId.ToString(), "Id do formulário não informado");
                Handlers.IdNegative(FormId, "Id do formulário inválido");
                if (Envio is not null)
                {
                    HashSet<string> cursosDB = new(await ProjetoDbContext.Cursos.Where(s => s.ResponsavelId == Id).Select(c => c.Curso).ToListAsync());
                    HashSet<string> cursos = new();
                    HashSet<string> tipoCursosDB = new(await ProjetoDbContext.TiposCursos.Where(s => s.ResponsavelId == Id).Select(c => c.TipoCurso).ToListAsync());
                    HashSet<string> tiposCursos = new();
                    HashSet<Tuple<string?, string?>> contatosDB = new(await ProjetoDbContext.Enviados.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync());
                    foreach (var item in Envio)
                    {
                        item.email = item.email == "NULL" || item.email == "null" ? null : item.email;
                        item.telefone = item.telefone == "NULL" || item.telefone == "null" ? null : item.telefone;
                        if (item.curso is not null) cursos.Add(item.curso);
                        if (item.modalidade is not null) tiposCursos.Add(item.modalidade);
                        if (!contatosDB.Contains(new Tuple<string?, string?>(item.email, item.matricula)))
                        {
                            var entity = new Enviado()
                            {
                                Email = item.email,
                                Matricula = item.matricula,
                                Respondido = false,
                                FormId = ((uint)FormId),
                                Nome = item.nome,
                                Curso = item.curso,
                                DataColacao = item.data_colacao_grau is not null ? DateTime.Parse(item.data_colacao_grau) : null,
                                TipoDeCurso = item.modalidade,
                                Telefone1 = item.telefone,
                                Sexo = item.sexo,
                                Cpf = item.cpf
                            };
                            contatosDB.Add(new Tuple<string?, string?>(item.email, item.matricula));
                            ProjetoDbContext.Enviados.Add(entity);
                        }
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

        // Modificar contato a ser enviado
        [HttpPut("users/{Id}/forms/{FormId}/enviados/{EnviadoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<EnviadoDTO>> UpdateContato([FromBody] EnviadoDTO Envio,[FromRoute] int FormId, [FromRoute] int EnviadoId)
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
                    HashSet<Tuple<string?, string?>> contatosDB = new(await ProjetoDbContext.Enviados.Where(s => s.FormId == FormId).Select(c => new Tuple<string?, string?>(c.Email, c.Matricula)).ToListAsync());
                    var Form = await ProjetoDbContext.Formularios.FirstOrDefaultAsync(s => s.Id == FormId);
                    if (Form is not null && Form.DerivadoDeId==null)
                    {
                        var Contato = await ProjetoDbContext.Enviados.FirstOrDefaultAsync(s => s.Id == EnviadoId);
                        if (Contato != null)
                        {
                            if (Contato.Email == Envio.email || !contatosDB.Contains(new Tuple<string?, string?>(Envio.email, Envio.matricula)))
                            {
                                // Modifica contato nos forms derivados
                                var FormsDerivados = await ProjetoDbContext.Formularios.Where(s => s.DerivadoDeId == FormId && s.DerivadoDeId != null).ToListAsync();
                                foreach (var item in FormsDerivados)
                                {
                                    var ContatoDerivado = await ProjetoDbContext.Enviados.FirstOrDefaultAsync(s => s.FormId == item.Id && s.Email == Contato.Email);
                                    if (ContatoDerivado != null)
                                    {
                                        if (!ContatoDerivado.Respondido)
                                        {
                                            ContatoDerivado.Email = Envio.email;
                                            ContatoDerivado.Nome = Envio.nome;
                                            ContatoDerivado.Matricula = Envio.matricula;
                                            ContatoDerivado.Curso = Envio.curso;
                                            ContatoDerivado.TipoDeCurso = Envio.tipoDeCurso;
                                            ContatoDerivado.DataColacao = Envio.dataColacao;
                                            ContatoDerivado.Telefone1 = Envio.telefone1;
                                            ContatoDerivado.Telefone2 = Envio.telefone2;
                                            ContatoDerivado.Sexo = Envio.sexo;
                                            ContatoDerivado.Cpf = Envio.cpf;
                                        }
                                        else return StatusCode(402);
                                    }
                                    else throw new Exception("Email não presente nos formulários derivados");
                                }

                                // Modifica contato no form original
                                if (!Contato.Respondido)
                                {
                                    Contato.Email = Envio.email;
                                    Contato.Nome = Envio.nome;
                                    Contato.Matricula = Envio.matricula;
                                    Contato.Curso = Envio.curso;
                                    Contato.TipoDeCurso = Envio.tipoDeCurso;
                                    Contato.DataColacao = Envio.dataColacao;
                                    Contato.Telefone1 = Envio.telefone1;
                                    Contato.Telefone2 = Envio.telefone2;
                                    Contato.Sexo = Envio.sexo;
                                    Contato.Cpf = Envio.cpf;
                                }
                                else return StatusCode(402);
                                await ProjetoDbContext.SaveChangesAsync();
                                return StatusCode(204);
                            }
                            else throw new Exception("Combinação de email+mtricula ja existe no formulario");
                        }
                        else throw new Exception("Id não encontrado (UpdateEnvio)");
                    }
                    else throw new Exception("Formulário ñão é original");
                }
                else throw new Exception("Email de envio não existe");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Selecionar contatos a responder por ID do formulário
        [HttpGet("users/{Id}/forms/{FormId}/enviados")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<EnviadoDTO>>> GetContatosById([FromRoute] int FormId)
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

        // Deleta contatos enviados (E todas as respostas) ou apenas as repostas
        [HttpDelete("users/{Id}/forms/{FormId}/enviados/{RespostaId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteContato([FromRoute] int RespostaId, [FromRoute] int FormId, [FromQuery] string deleta)
        {
            try
            {
                Handlers.ExistsOrError(RespostaId.ToString(), "Id do envio não informado");
                Handlers.ExistsOrError(deleta.ToString(), "Query de deletar não informada");
                Handlers.IdNegative(RespostaId, "Id do envio inválido");
                ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.RespostaId == RespostaId));
                ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.RespostaId == RespostaId));
                ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.RespostaId == RespostaId));
                var Contato = await ProjetoDbContext.Enviados.FirstOrDefaultAsync(s => s.Id == RespostaId);
                if (Contato != null)
                {
                    // Deleta envio
                    if (deleta == "true")
                    {
                        var FormsDerivados = await ProjetoDbContext.Formularios
                            .Select(s => new FormularioDTO
                            {
                                id = s.Id,
                                derivadoDeId = s.DerivadoDeId,
                            })
                            .Where(s => s.derivadoDeId == FormId && s.derivadoDeId != null)
                            .ToListAsync();
                        foreach (var item in FormsDerivados)
                        {
                            var ContatoDerivado = await ProjetoDbContext.Enviados.FirstOrDefaultAsync(s => s.FormId == item.id && s.Email==Contato.Email);
                            if(ContatoDerivado is not null) ProjetoDbContext.Enviados.Remove(ContatoDerivado);
                        }
                        ProjetoDbContext.Enviados.Remove(Contato);
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    // Deleta resposta e torna envio possível
                    else
                    {
                        if (Contato.Respondido)
                        {
                            Contato.Respondido = false;
                            await ProjetoDbContext.SaveChangesAsync();
                            return StatusCode(204);
                        }
                        else throw new Exception("Email não respondeu");
                    }
                }
                else throw new Exception("Id não encontrado (DeletaEnvio)");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Ver se email pode ter acesso às questões
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
