using Microsoft.AspNetCore.Mvc;
using backendcsharp.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Net.Mail;
using System.Net;
using backendcsharp.DTO;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using backendcsharp.Handles;

namespace backendcsharp.Controllers
{
    [ApiController]
    public class EmailController : Controller
    {
        private readonly ProjetoDbContext ProjetoDbContext;

        public EmailController(ProjetoDbContext ProjetoDbContext)
        {
            this.ProjetoDbContext = ProjetoDbContext;
        }

        public class ModeloEmail
        {
            public int? UserId { get; set; }
            public int? FormId { get; set; }
            public int? EmailId { get; set; } = null!;
        }


        // Enviar Formuláros
        [HttpPost("enviar")]
        [Authorize("Bearer")]
        public async Task<ActionResult> EnviaEmail([FromBody] ModeloEmail model)
        {
            try
            {
                var User = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id= s.Id,
                    email = s.Email,
                    nome = s.Nome,
                    universidade = s.Universidade,
                    appPassword = s.AppPassword,

                }).FirstOrDefaultAsync(s => s.id == model.UserId);
                if (User == null) throw new Exception("Usuário não encontrado");
                else {
                    if (User.appPassword is null) return StatusCode(402);
                    // Busca emails dos destinatários 
                    var Envios = await ProjetoDbContext.Enviados
                        .Select(s => new EnviadoDTO
                        {
                            email = s.Email,
                            formId = s.FormId,
                            respondido = s.Respondido
                        })
                        .Where(s => s.formId == model.FormId)
                        .ToListAsync();

                    if (Envios == null) throw new Exception("Formulário não possui emails");
                    else {
                        var Form = await ProjetoDbContext.Formularios
                            .Where(s => s.Id == model.FormId)
                            .FirstOrDefaultAsync();

                        // Configura SMTP
                        SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com", 587);
                        SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                        MailMessage email = new MailMessage();

                        // Começo da configuração do EMAIL

                        // Seta remetente
                        email.From = new MailAddress(User.email);

                        // Seta destinatários
                        foreach (var item in Envios)
                        {
                            if (!item.respondido) { 
                                if(Handlers.IsValidEmail(item.email)) email.To.Add(item.email);
                            }
                        }
                        //email.To.Add("gabriel.couto14@hotmail.com");

                        // Faz cópia do email para o remetente
                        email.CC.Add(User.email);

                        // Seta o título do formulário como assunto
                        email.Subject = Form.Titulo;
                        // Seta a mensagem do email
                        email.Body = "Olá, <br/> Você foi selecionado para responder uma pesquisa do(a) "+User.universidade+",<br/><br/>A pesquisa é sobre:<br/><br/>"+"---"+"<br/><br/>Segue link para resposta:<br/>"+"---"+"<br/><br/>"+User.nome+",<br/>"+User.universidade+", "+ DateTime.Now.ToString("dddd, dd MMMM yyyy", new CultureInfo("pt-BR"));
                        //END
                        email.IsBodyHtml = true;
                        SmtpServer.Timeout = 5000;
                        SmtpServer.EnableSsl = true;
                        SmtpServer.UseDefaultCredentials = false;
                        SmtpServer.Credentials = new NetworkCredential(User.email, User.appPassword);
                        await SmtpServer.SendMailAsync(email);
                        Form.DataEnviado = DateTime.Now;
                        await ProjetoDbContext.SaveChangesAsync();
                        return StatusCode(204);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        // Enviar Formuláros
        [HttpPost("enviarUnico")]
        [Authorize("Bearer")]
        public async Task<ActionResult> EnviaEmailUnico([FromBody] ModeloEmail model)
        {
            try
            {
                var User = await ProjetoDbContext.Users.Select(s => new UsersDTO
                {
                    id = s.Id,
                    email = s.Email,
                    nome = s.Nome,
                    universidade = s.Universidade,
                    appPassword = s.AppPassword,

                }).FirstOrDefaultAsync(s => s.id == model.UserId);
                if (User == null) throw new Exception("Usuário não encontrado");
                else
                {
                    if (User.appPassword is null) return StatusCode(402);
                    else
                    {
                        var Form = await ProjetoDbContext.Formularios
                            .Select(s => new FormularioDTO
                            {
                                id = s.Id,
                                titulo = s.Titulo,
                            })
                            .Where(s => s.id == model.FormId)
                            .FirstOrDefaultAsync();

                        // Configura SMTP
                        SmtpClient SmtpServer = new SmtpClient("smtp.gmail.com", 587);
                        SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                        MailMessage email = new MailMessage();

                        // Começo da configuração do EMAIL

                        // Seta remetente
                        email.From = new MailAddress(User.email);

                        // Seta destinatário
                        var enviado = await ProjetoDbContext.Enviados.Where(s => s.Id == model.EmailId).FirstOrDefaultAsync();
                        if (Handlers.IsValidEmail(enviado.Email)) email.To.Add(enviado.Email);
                        //email.To.Add("gabriel.couto14@hotmail.com");

                        // Faz cópia do email para o remetente
                        email.CC.Add(User.email);

                        // Seta o título do formulário como assunto
                        email.Subject = Form.titulo;
                        // Seta a mensagem do email
                        email.Body = "Olá, <br/> Você foi selecionado para responder uma pesquisa do(a) " + User.universidade + ",<br/><br/>A pesquisa é sobre:<br/><br/>" + "---" + "<br/><br/>Segue link para resposta:<br/>" + "---" + "<br/><br/>" + User.nome + ",<br/>" + User.universidade + ", " + DateTime.Now.ToString("dddd, dd MMMM yyyy", new CultureInfo("pt-BR"));
                        //END
                        email.IsBodyHtml = true;
                        SmtpServer.Timeout = 5000;
                        SmtpServer.EnableSsl = true;
                        SmtpServer.UseDefaultCredentials = false;
                        SmtpServer.Credentials = new NetworkCredential(User.email, User.appPassword);
                        await SmtpServer.SendMailAsync(email);

                        return StatusCode(204);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}