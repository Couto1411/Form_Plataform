using Microsoft.AspNetCore.Mvc;
using backendcsharp.Entities;
using backendcsharp.DTO;
using Microsoft.AspNetCore.Authorization;
using backendcsharp.Handles;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace backendcsharp.Controllers
{
    [ApiController]
    public class CursosController : Controller
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public CursosController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }
        public class ObjetoCursos
        {
            public uint? userId { get; set; }
            public List<TiposCursosDTO> listaTipoCursos { get; set; } = new List<TiposCursosDTO>();
            public List<CursosDTO> listaCursos { get; set; } = new List<CursosDTO>();
        }

        // Adicionar Cursos e suas modalidades a ser enviado
        [HttpPost("users/{Id}/cursos")]
        [Authorize("Bearer")]
        public async Task<ActionResult> InsertCursos([FromBody] ObjetoCursos ListaCurso, [FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do usuário não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");

                HashSet<string> cursosDB = new HashSet<string>(await ProjetoDbContext.Cursos.Where(s=>s.ResponsavelId==Id).Select(c=>c.Curso).ToListAsync());
                HashSet<string> tipoCursosDB = new HashSet<string>(await ProjetoDbContext.TiposCursos.Where(s => s.ResponsavelId == Id).Select(c => c.TipoCurso).ToListAsync());

                foreach (var item in ListaCurso.listaCursos)
                {
                    var entity = new Cursos()
                    {
                        Curso = item.curso is not null ? item.curso: throw new Exception("Um dos itens não possui nome do curso"),
                        ResponsavelId = (uint)Id
                    };
                    if (!cursosDB.Contains(entity.Curso))
                    {
                        ProjetoDbContext.Cursos.Add(entity);
                    }
                }
                foreach (var item in ListaCurso.listaTipoCursos)
                {
                    var entity = new TiposCursos()
                    {
                        TipoCurso = item.tipoCurso is not null ? item.tipoCurso : throw new Exception("Um dos itens não possui nome do tipo do curso"),
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
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Modificar Curso
        [HttpPut("users/{Id}/curso/{CursoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> UpdateCurso([FromBody] CursosDTO Curso, [FromRoute] int Id, [FromRoute] int CursoId)
        {
            try
            {
                Handlers.ExistsOrError(Curso.curso, "Curso não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(CursoId.ToString(), "Id do curso não informado");
                Handlers.IdNegative(CursoId, "Id do curso inválido");
                Curso.id = ((uint)CursoId);
                Curso.responsavelId = ((uint)Id);
                if (Curso.id is not null)
                {
                    var entity = await ProjetoDbContext.Cursos.FirstOrDefaultAsync(s => s.Id == CursoId);
                    if (entity != null)
                    {
                        entity.Curso = Curso.curso;
                        entity.ResponsavelId = Curso.responsavelId;
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    else throw new Exception("Id não encontrado (UpdateCurso)");
                }
                else throw new Exception("Curso não informado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Modificar Tipo de Curso
        [HttpPut("users/{Id}/tipocurso/{CursoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> UpdateTipoCurso([FromBody] TiposCursosDTO Curso, [FromRoute] int Id, [FromRoute] int CursoId)
        {
            try
            {
                Handlers.ExistsOrError(Curso.tipoCurso, "Tipo do curso não informado");
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                Handlers.ExistsOrError(CursoId.ToString(), "Id do curso não informado");
                Handlers.IdNegative(CursoId, "Id do curso inválido");
                Curso.id = ((uint)CursoId);
                Curso.responsavelId = ((uint)Id);
                if (Curso.id is not null)
                {
                    var entity = await ProjetoDbContext.TiposCursos.FirstOrDefaultAsync(s => s.Id == CursoId);
                    if (entity != null)
                    {
                        entity.TipoCurso = Curso.tipoCurso;
                        entity.ResponsavelId = Curso.responsavelId;
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    else throw new Exception("Id não encontrado (UpdateTipoCurso)");
                }
                else throw new Exception("Tipo do curso não informado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Adicionar Cursos e suas modalidades a ser enviado
        [HttpGet("users/{Id}/cursos")]
        [Authorize("Bearer")]
        public async Task<ActionResult<ObjetoCursos>> GetCursos([FromRoute] int Id)
        {
            try
            {
                ObjetoCursos listaResposta = new ObjetoCursos();
                Handlers.ExistsOrError(Id.ToString(), "Id do usuário não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                var GetCursos = await ProjetoDbContext.Cursos
                    .Select(s => new CursosDTO
                    {
                        id = s.Id,
                        curso = s.Curso,
                        responsavelId = s.ResponsavelId
                    })
                    .Where(s => s.responsavelId == Id)
                    .ToListAsync();
                var GetTipoCursos = await ProjetoDbContext.TiposCursos
                    .Select(s => new TiposCursosDTO
                    {
                        id = s.Id,
                        tipoCurso = s.TipoCurso,
                        responsavelId = s.ResponsavelId
                    })
                    .Where(s => s.responsavelId == Id)
                    .ToListAsync();
                listaResposta.listaCursos = GetCursos;
                listaResposta.listaTipoCursos = GetTipoCursos;
                return listaResposta;
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Deleta Curso 
        [HttpDelete("users/{Id}/curso/{CursoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteCurso([FromRoute] int CursoId)
        {
            try
            {
                Handlers.ExistsOrError(CursoId.ToString(), "Id do curso não informado");
                Handlers.IdNegative(CursoId, "Id do curso inválido");
                var entity = new Cursos()
                {
                    Id = ((uint)CursoId)
                };
                ProjetoDbContext.Cursos.Remove(entity);
                await ProjetoDbContext.SaveChangesAsync();
                return StatusCode(204);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Deleta Tipo de Curso 
        [HttpDelete("users/{Id}/tipocurso/{CursoId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteTipoCurso([FromRoute] int CursoId)
        {
            try
            {
                Handlers.ExistsOrError(CursoId.ToString(), "Id do curso não informado");
                Handlers.IdNegative(CursoId, "Id do curso inválido");
                var entity = new TiposCursos()
                {
                    Id = ((uint)CursoId)
                };
                ProjetoDbContext.TiposCursos.Remove(entity);
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