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
                    Id = s.Id,
                    Nome = s.Nome,
                    Email = s.Email,
                    Admin = s.Admin,
                    AppPassword = s.AppPassword,
                    Universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.Id == Id);
                if (Admin is null) return NotFound();
                if (Admin.Admin)
                {
                    var List = await ProjetoDbContext.Users.Select(
                        s => new UsersDTO
                        {
                            Id = s.Id,
                            Nome = s.Nome,
                            Email = s.Email,
                            AppPassword = s.AppPassword,
                            Admin = s.Admin,
                            Universidade = s.Universidade
                        }
                    ).Where(x=>x.Id!=1).ToListAsync();
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
                    Id = s.Id,
                    Nome = s.Nome,
                    Email = s.Email,
                    Admin = s.Admin,
                    AppPassword = s.AppPassword,
                    Universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.Id == Id);
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
                    Id = s.Id,
                    Nome = s.Nome,
                    Email = s.Email,
                    Admin = s.Admin,
                    AppPassword = s.AppPassword,
                    Universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.Id == Id);
                if (Admin is null) return NotFound();
                if (Admin.Admin)
                {
                    if (User.Id is not null) throw new Exception("Usuário já existente");
                    else
                    {
                        Handlers.ExistsOrError(User.Nome, "Nome não informado");
                        if (!Handlers.IsValidGmail(User.Email)) return StatusCode(501);
                        Handlers.ExistsOrError(User.AppPassword, "Senha não informado");
                        Handlers.ExistsOrError(User.Universidade, "Universidade não informada");
                        Handlers.ExistsOrError(User.Senha, "Senha não informada");
                        // Salva usuário no banco MySQL
                        var entity = new Users()
                        {
                            Nome = User.Nome ?? "",
                            Email = User.Email ?? "",
                            Universidade = User.Universidade ?? "",
                            AppPassword = User.AppPassword ?? "",
                            Senha = BCrypt.Net.BCrypt.HashPassword(User.Senha),
                            Admin = User.Admin,
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
                    Id = s.Id,
                    Nome = s.Nome,
                    Email = s.Email,
                    Admin = s.Admin,
                    AppPassword = s.AppPassword,
                    Universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.Id == Id);
                if (Admin is null) return NotFound();
                if (Admin.Admin)
                {
                    Handlers.ExistsOrError(User.Id.ToString(), "Id do responsável não informado");
                    Handlers.IdNegative(User.Id is not null ? (int)User.Id : throw new Exception("Usuário Encontrado, porém não id, entrar em contato"), "Id do usuário inválido");
                    var entity = await ProjetoDbContext.Users.FirstOrDefaultAsync(s => s.Id == User.Id);
                    if (entity != null)
                    {
                        entity.Nome = User.Nome ?? entity.Nome;
                        entity.Universidade = User.Universidade ?? entity.Universidade;
                        entity.Email = User.Email ?? entity.Email;
                        entity.Admin = User.Admin;
                        if (User.Senha is not null) entity.Senha = BCrypt.Net.BCrypt.HashPassword(User.Senha);
                        entity.AppPassword = User.AppPassword ?? throw new Exception("Senha do gmail não informada não informada");
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
                    entity.Nome = User.Nome ?? throw new Exception("Nome não informado");
                    entity.Universidade = User.Universidade ?? throw new Exception("Universidade não informada");
                    if (User.Senha is not null) entity.Senha = BCrypt.Net.BCrypt.HashPassword(User.Senha);
                    entity.AppPassword = User.AppPassword ?? throw new Exception("Senha do gmail não informada não informada");
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
                    Id = s.Id,
                    Nome = s.Nome,
                    Email = s.Email,
                    Admin = s.Admin,
                    AppPassword = s.AppPassword,
                    Universidade = s.Universidade
                }).FirstOrDefaultAsync(s => s.Id == AdminId);
                if (Admin is null) return NotFound();
                if (Admin.Admin)
                {
                    var FormsOrig = await ProjetoDbContext.Formularios.Where(s => s.ResponsavelId == Id && s.DerivadoDeId == null).ToListAsync();
                    foreach (var form in FormsOrig)
                    {
                        var FormsDeriv = await ProjetoDbContext.Formularios.Where(s => s.DerivadoDeId == form.Id).ToListAsync();
                        foreach (var item in FormsDeriv)
                        {
                            var destinatarios = await ProjetoDbContext.Destinatarios.Where(s => s.FormId == item.Id).ToListAsync();
                            foreach (var envio in destinatarios)
                            {
                                ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.RespostaId == envio.Id));
                                ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.RespostaId == envio.Id));
                                ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.RespostaId == envio.Id));
                            }
                            ProjetoDbContext.Destinatarios.RemoveRange(ProjetoDbContext.Destinatarios.Where(s => s.FormId == item.Id));
                            ProjetoDbContext.Formularios.Remove(item);
                        }
                        var questoes = await ProjetoDbContext.Questoes
                            .Select(s => new QuestoesDTO
                            {
                                Id = s.Id,
                                FormId = s.FormId
                            })
                            .Where(s => s.FormId == form.Id)
                            .ToListAsync();
                        foreach (var item in questoes)
                        {
                            ProjetoDbContext.Radioboxes.RemoveRange(ProjetoDbContext.Radioboxes.Where(s => s.QuestaoId == item.Id));
                            ProjetoDbContext.Texts.RemoveRange(ProjetoDbContext.Texts.Where(s => s.QuestaoId == item.Id));
                            ProjetoDbContext.Checkboxes.RemoveRange(ProjetoDbContext.Checkboxes.Where(s => s.QuestaoId == item.Id));
                        }
                        ProjetoDbContext.Destinatarios.RemoveRange(ProjetoDbContext.Destinatarios.Where(s => s.FormId == form.Id));
                        ProjetoDbContext.Questoes.RemoveRange(ProjetoDbContext.Questoes.Where(s => s.FormId == form.Id));
                        ProjetoDbContext.Formularios.Remove(form);
                    }
                    ProjetoDbContext.Cursos.RemoveRange(ProjetoDbContext.Cursos.Where(s => s.ResponsavelId == Id));
                    ProjetoDbContext.Modalidades.RemoveRange(ProjetoDbContext.Modalidades.Where(s => s.ResponsavelId == Id));

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
                        Id = s.Id,
                        Email = s.Email,
                        Senha = s.Senha,
                        Admin = s.Admin
                    }
                ).Where(s => s.Email == usuario.email).FirstOrDefaultAsync();
                if (Usuario is not null)
                {
                    usuario.id = Usuario.Id is not null? (int)Usuario.Id:throw new Exception("Usuário Encontrado, porém não id, entrar em contato");
                    usuario.admin = Usuario.Admin;
                }else return StatusCode(400);
                if (BCrypt.Net.BCrypt.Verify(usuario.senha,Usuario.Senha))
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
