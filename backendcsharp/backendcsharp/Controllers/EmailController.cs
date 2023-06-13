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
                        if (Form == null) throw new Exception("Formulário não encontrado");

                        // Configura SMTP
                        SmtpClient SmtpServer = new("smtp.gmail.com", 587)
                        {
                            DeliveryMethod = SmtpDeliveryMethod.Network
                        };
                        MailMessage email = new();

                        // Começo da configuração do EMAIL

                        // Seta remetente
                        if(User.email is not null) email.From = new MailAddress(User.email);
                        else throw new Exception("Sem email de remetente");

                        // Seta destinatários
                        foreach (var item in Envios)
                        {
                            if (!item.respondido) { 
                                if(Handlers.IsValidEmail(item.email)) email.Bcc.Add(item.email);
                            }
                        }
                        //email.To.Add("gabriel.couto14@hotmail.com");

                        // Faz cópia do email para o remetente
                        email.CC.Add(User.email);

                        // Seta o título do formulário como assunto
                        email.Subject = Form.Titulo;
                        // Seta a mensagem do email
                        email.Body = Form.MsgEmail is not null? Form.MsgEmail.Replace(@" {replaceStringHere} ", @"<br/><br/>https://formplataform-4ac81.web.app/" + Form.Id+ "<br/><br/>").Replace("\n", @"<br/>"):"";
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
                                msgEmail = s.MsgEmail,
                                titulo = s.Titulo,
                            })
                            .Where(s => s.id == model.FormId)
                            .FirstOrDefaultAsync();
                        if (Form == null) throw new Exception("Formulário não encontrado");

                        // Configura SMTP
                        SmtpClient SmtpServer = new("smtp.gmail.com", 587)
                        {
                            DeliveryMethod = SmtpDeliveryMethod.Network
                        };
                        MailMessage email = new();

                        // Começo da configuração do EMAIL

                        // Seta remetente
                        if (User.email is not null) email.From = new MailAddress(User.email);
                        else throw new Exception("Sem email de remetente");

                        // Seta destinatário
                        var enviado = await ProjetoDbContext.Enviados.Where(s => s.Id == model.EmailId).FirstOrDefaultAsync();
                        if (enviado is not null && Handlers.IsValidEmail(enviado.Email)) email.To.Add(enviado.Email);
                        //email.To.Add("gabriel.couto14@hotmail.com");

                        // Faz cópia do email para o remetente
                        email.CC.Add(User.email);

                        // Seta o título do formulário como assunto
                        email.Subject = Form.titulo;
                        // Seta a mensagem do email
                        email.Body = Form.msgEmail is not null?Form.msgEmail.Replace(@" {replaceStringHere} ", @"<br/><br/>https://formplataform-4ac81.web.app/" + Form.id + "<br/><br/>").Replace("\n",@"<br/>"):"";
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