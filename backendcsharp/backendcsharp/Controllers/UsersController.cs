using APIs.Security.JWT;
using backendcsharp.DTO;
using backendcsharp.Entities;
using backendcsharp.Handles;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Evaluation;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using System.Collections.Immutable;
using System.Net;
using System.Net.Mail;

namespace backendcsharp.Controllers
{
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public UserController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }

        // Selecionar todos os usuários
        // ADMIN----------------------------------
        [HttpGet("users/admin/{id}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<List<UsersDTO>>> GetUser([FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do responsável inválido");
                var Admin = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    nome = s.Nome,
                    email = s.Email,
                    admin = s.Admin,
                    appPassword = s.AppPassword,
                    universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.id == Id);
                if (Admin is null) return NotFound();
                if (Admin.admin)
                {
                    var List = await ProjetoDbContext.Users.Select(
                        s => new UsersDTO
                        {
                            id = s.Id,
                            nome = s.Nome,
                            email = s.Email,
                            appPassword = s.AppPassword,
                            admin = s.Admin,
                            universidade = s.Universidade
                        }
                    ).Where(x=>x.id!=1).ToListAsync();
                    if (List.Count < 0) return NotFound();
                    else return List;
                }else return StatusCode(401);
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }

        // Selecionar usuários por ID
        [HttpGet("users/{Id}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<UsersDTO>> GetUserById([FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do responsável inválido");
                var User = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    nome = s.Nome,
                    email = s.Email,
                    admin = s.Admin,
                    appPassword = s.AppPassword,
                    universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.id == Id);
                if (User == null)
                {
                    return NotFound();
                }
                else
                {
                    return User;
                }
            }catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Adicionar Usuário
        // ADMIN----------------------------------
        [HttpPost("users/{id}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<UsersDTO>> InsertUser([FromBody] UsersDTO User, [FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do responsável inválido");
                var Admin = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    nome = s.Nome,
                    email = s.Email,
                    admin = s.Admin,
                    appPassword = s.AppPassword,
                    universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.id == Id);
                if (Admin is null) return NotFound();
                if (Admin.admin)
                {
                    if (User.id is not null) throw new Exception("Usuário já existente");
                    else
                    {
                        Handlers.ExistsOrError(User.nome, "Nome não informado");
                        if (!Handlers.IsValidGmail(User.email)) return StatusCode(501);
                        Handlers.ExistsOrError(User.appPassword, "Senha não informado");
                        Handlers.ExistsOrError(User.universidade, "Universidade não informada");
                        Handlers.ExistsOrError(User.senha, "Senha não informada");
                        // Salva usuário no banco MySQL
                        var entity = new Users()
                        {
                            Nome = User.nome,
                            Email = User.email,
                            Universidade = User.universidade,
                            AppPassword = User.appPassword,
                            Senha = BCrypt.Net.BCrypt.HashPassword(User.senha),
                            Admin = User.admin,
                        };
                        ProjetoDbContext.Users.Add(entity);
                        await ProjetoDbContext.SaveChangesAsync();

                        return StatusCode(204);
                    }
                }else return StatusCode(401);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Modificar Usuário
        // ADMIN----------------------------------
        [HttpPut("users/admin/{Id}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<UsersDTO>> UpdateUserAdmin([FromBody] UsersDTO User, [FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do responsável inválido");
                var Admin = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    nome = s.Nome,
                    email = s.Email,
                    admin = s.Admin,
                    appPassword = s.AppPassword,
                    universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.id == Id);
                if (Admin is null) return NotFound();
                if (Admin.admin)
                {
                    Handlers.ExistsOrError(User.id.ToString(), "Id do responsável não informado");
                    Handlers.IdNegative((int)User.id, "Id do usuário inválido");
                    var entity = await ProjetoDbContext.Users.FirstOrDefaultAsync(s => s.Id == User.id);
                    if (entity != null)
                    {
                        entity.Nome = User.nome != null ? User.nome : entity.Nome;
                        entity.Universidade = User.universidade != null ? User.universidade : entity.Universidade;
                        entity.Email = User.email != null ? User.email : entity.Email;
                        entity.Admin = User.admin;
                        if (User.senha is not null) entity.Senha = BCrypt.Net.BCrypt.HashPassword(User.senha);
                        entity.AppPassword = User.appPassword != null ? User.appPassword : throw new Exception("Senha do gmail não informada não informada");
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                    else throw new Exception("Id não encontrado");
                } else return StatusCode(401);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        // Modificar Usuário
        [HttpPut("users/{Id}")]
        [Authorize("Bearer")]
        public async Task<ActionResult<UsersDTO>> UpdateUser([FromBody] UsersDTO User, [FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                var entity = await ProjetoDbContext.Users.FirstOrDefaultAsync(s => s.Id == Id);
                if (entity != null)
                {
                    entity.Nome = User.nome != null ? User.nome : throw new Exception("Nome não informado");
                    entity.Universidade = User.universidade != null ? User.universidade : throw new Exception("Universidade não informada");
                    if (User.senha is not null) entity.Senha = BCrypt.Net.BCrypt.HashPassword(User.senha);
                    entity.AppPassword = User.appPassword != null ? User.appPassword : throw new Exception("Senha do gmail não informada não informada");
                    await ProjetoDbContext.SaveChangesAsync();
                    return StatusCode(204);
                }
                else throw new Exception("Id não encontrado");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Deleta usuário
        // ADMIN----------------------------------
        [HttpDelete("users/{Id}/admin/{AdminId}")]
        [Authorize("Bearer")]
        public async Task<ActionResult> DeleteUser([FromRoute] int AdminId,[FromRoute] int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do responsável inválido");
                Handlers.ExistsOrError(AdminId.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(AdminId, "Id do responsável inválido");
                var Admin = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    nome = s.Nome,
                    email = s.Email,
                    admin = s.Admin,
                    appPassword = s.AppPassword,
                    universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.id == AdminId);
                if (Admin is null) return NotFound();
                if (Admin.admin)
                {
                    var FormsOrig = await ProjetoDbContext.Formularios.Where(s => s.ResponsavelId == Id && s.DerivadoDeId == null).ToListAsync();
                    foreach (var form in FormsOrig)
                    {
                        var FormsDeriv = await ProjetoDbContext.Formularios.Where(s => s.DerivadoDeId == form.Id).ToListAsync();
                        foreach (var item in FormsDeriv)
                        {
                            var envios = await ProjetoDbContext.Enviados.Where(s => s.FormId == item.Id).ToListAsync();
                            foreach (var envio in envios)
                            {
                                ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.RespostaId == envio.Id));
                                ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.RespostaId == envio.Id));
                                ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.RespostaId == envio.Id));
                            }
                            ProjetoDbContext.Enviados.RemoveRange(ProjetoDbContext.Enviados.Where(s => s.FormId == item.Id));
                            ProjetoDbContext.Formularios.Remove(item);
                        }
                        var questoes = await ProjetoDbContext.Questoes
                            .Select(s => new QuestoesDTO
                            {
                                id = s.Id,
                                formId = s.FormId
                            })
                            .Where(s => s.formId == form.Id)
                            .ToListAsync();
                        foreach (var item in questoes)
                        {
                            ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.QuestaoId == item.id));
                            ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.QuestaoId == item.id));
                            ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.QuestaoId == item.id));
                        }
                        ProjetoDbContext.Enviados.RemoveRange(ProjetoDbContext.Enviados.Where(s => s.FormId == form.Id));
                        ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.FormId == form.Id));
                        ProjetoDbContext.Formularios.Remove(form);
                    }
                    ProjetoDbContext.Cursos.RemoveRange(ProjetoDbContext.Cursos.Where(s => s.ResponsavelId == Id));
                    ProjetoDbContext.TiposCursos.RemoveRange(ProjetoDbContext.TiposCursos.Where(s => s.ResponsavelId == Id));

                    var UsuarioDeleta = new Users()
                    {
                        Id = ((uint)Id)
                    };
                    ProjetoDbContext.Users.Remove(UsuarioDeleta);
                    await ProjetoDbContext.SaveChangesAsync();
                    return StatusCode(204);
                }
                else return StatusCode(401);
            }catch(Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("signin")]
        [ProducesResponseType(typeof(AccessToken), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult<AccessToken>> Signin(
        [FromBody] User usuario,
        [FromServices] ILogger<UserController> logger,
        [FromServices] AccessManager accessManager)
        {

            logger.LogInformation($"Recebida solicitação para o usuário: {usuario?.email}");

            if (usuario is not null)
            {
                var Usuario = await ProjetoDbContext.Users.Select(
                    s => new UsersDTO
                    {
                        id = s.Id,
                        email = s.Email,
                        senha = s.Senha,
                        admin = s.Admin
                    }
                ).Where(s => s.email == usuario.email).FirstOrDefaultAsync();
                if (Usuario is not null)
                {
                    usuario.id = (int)Usuario.id;
                    usuario.admin = Usuario.admin;
                }else return StatusCode(400);
                if (BCrypt.Net.BCrypt.Verify(usuario.senha,Usuario.senha))
                {
                    logger.LogInformation($"Sucesso na autenticação do usuário: {usuario.email}");
                    return accessManager.GenerateToken(usuario);
                }
                else
                {
                    logger.LogError($"Falha na autenticação do usuário: {usuario?.email}");
                    return StatusCode(401);
                }
            }
            else
            {
                logger.LogError($"Falha na autenticação do usuário: {usuario?.email}");
                return StatusCode(400);
            }
        }

    }
}
