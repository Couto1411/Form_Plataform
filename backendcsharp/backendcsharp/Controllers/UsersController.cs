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
        [HttpGet("users")]
        public async Task<ActionResult<List<UsersDTO>>> GetUser()
        {
            try {
                var List = await ProjetoDbContext.Users.Select(
                    s => new UsersDTO
                    {
                        id = s.Id,
                        nome = s.Nome,
                        email = s.Email,
                        admin = s.Admin,
                        senha = s.Senha,
                        universidade = s.Universidade
                    }
                ).ToListAsync();

                if (List.Count < 0) return NotFound();
                else return List;
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
                UsersDTO User = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    nome = s.Nome,
                    email = s.Email,
                    admin = s.Admin,
                    senha = s.Senha,
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
        [HttpPost("users")]
        public async Task<ActionResult<UsersDTO>> InsertUser([FromBody] UsersDTO User)
        {
            try
            {
                if (User.id is not null) throw new Exception("Usuário já existente");
                else 
                {
                    Handlers.ExistsOrError(User.nome, "Nome não informado");
                    Handlers.ExistsOrError(User.email, "Email não informado");
                    Handlers.ExistsOrError(User.universidade, "Universidade não informada");
                    Handlers.ExistsOrError(User.senha, "Senha não informada");
                    if (User.confirmaSenha is null || User.senha != User.confirmaSenha) throw new Exception("Senhas não conferem");
                    else
                    {
                        // Salva usuário no banco MySQL
                        var entity = new Users()
                        {
                            Nome = User.nome,
                            Email = User.email,
                            Universidade = User.universidade,
                            Senha = BCrypt.Net.BCrypt.HashPassword(User.senha),
                            Admin = User.admin,
                        };
                        ProjetoDbContext.Users.Add(entity);
                        await ProjetoDbContext.SaveChangesAsync();

                        return StatusCode(204);
                    }
                }
            }catch(Exception ex)
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
        [HttpDelete("users/{Id}")]
        public async Task<HttpStatusCode> DeleteUser(int Id)
        {
            try
            {
                Handlers.ExistsOrError(Id.ToString(), "Id do responsável não informado");
                Handlers.IdNegative(Id, "Id do usuário inválido");
                var entity = new Users()
                {
                    Id = ((uint)Id)
                };
                ProjetoDbContext.Users.Attach(entity);
                ProjetoDbContext.Users.Remove(entity);
                await ProjetoDbContext.SaveChangesAsync();
                return HttpStatusCode.OK;
            }catch(Exception ex)
            {
                return HttpStatusCode.InternalServerError;
            }
        }

        [AllowAnonymous]
        [HttpPost("signin")]
        [ProducesResponseType(typeof(AccessToken), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.Unauthorized)]
        public async Task<ActionResult<AccessToken>> Post(
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
                        senha = s.Senha
                    }
                ).Where(s => s.email == usuario.email).FirstOrDefaultAsync();
                usuario.id = Usuario is not null ? (int)Usuario.id : throw new Exception("Usuário não encontrado");
                if (BCrypt.Net.BCrypt.Verify(usuario.senha,Usuario.senha))
                {
                    logger.LogInformation($"Sucesso na autenticação do usuário: {usuario.email}");
                    return accessManager.GenerateToken(usuario);
                }
                else
                {
                    logger.LogError($"Falha na autenticação do usuário: {usuario?.email}");
                    return new UnauthorizedResult();
                }
            }
            else
            {
                logger.LogError($"Falha na autenticação do usuário: {usuario?.email}");
                return new UnauthorizedResult();
            }
        }

        [HttpPost("validateToken")]
        [Authorize("Bearer")]
        public ActionResult<HttpStatusCode> ValidaToken()
        {
            return HttpStatusCode.OK;
        }

    }
}
