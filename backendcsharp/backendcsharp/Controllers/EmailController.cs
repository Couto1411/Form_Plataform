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
        public static IEnumerable<List<T>> SplitList<T>(List<T> locations, int nSize = 30)
        {
            for (int i = 0; i < locations.Count; i += nSize)
            {
                yield return locations.GetRange(i, Math.Min(nSize, locations.Count - i));
            }
        }

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
                    Id= s.Id,
                    Email = s.Email,
                    Nome = s.Nome,
                    Universidade = s.Universidade,
                    AppPassword = s.AppPassword,

                }).FirstOrDefaultAsync(s => s.Id == model.UserId);
                if (User == null) throw new Exception("Usuário não encontrado");
                else {
                    if (User.AppPassword is null) return StatusCode(402);
                    // Busca emails dos destinatários 
                    var Destinatarios = await ProjetoDbContext.Destinatarios
                        .Select(s => new DestinatarioDTO
                        {
                            Id = s.Id,
                            Email = s.Email,
                            FormId = s.FormId,
                            Respondido = s.Respondido
                        })
                        .Where(s => s.FormId == model.FormId)
                        .ToListAsync();

                    if (Destinatarios == null) throw new Exception("Formulário não possui emails");
                    else {
                        var Form = await ProjetoDbContext.Formularios
                            .Where(s => s.Id == model.FormId)
                            .FirstOrDefaultAsync() ?? throw new Exception("Formulário não encontrado");

                        // Configura SMTP
                        SmtpClient SmtpServer = new("smtp.gmail.com", 587)
                        {
                            DeliveryMethod = SmtpDeliveryMethod.Network
                        };
                        var DestinatariosPartidos = SplitList(Destinatarios, 100);
                        foreach (var destinatario in DestinatariosPartidos)
                        {
                            MailMessage email = new();

                            // Começo da configuração do EMAIL

                            // Seta remetente
                            if(User.Email is not null) email.From = new MailAddress(User.Email);
                            else throw new Exception("Sem email de remetente");

                            // Seta destinatários
                            foreach (var element in destinatario)
                            {
                                if (element.Respondido == 0) {
                                    var contato = await ProjetoDbContext.Destinatarios.Where(s => s.Id == element.Id).FirstOrDefaultAsync();
                                    if (contato is not null) contato.Respondido = 1;
                                    if (Handlers.IsValidEmail(element.Email)) email.Bcc.Add(element.Email);
                                }
                            }

                            // Faz cópia do email para o remetente
                            email.CC.Add(User.Email);

                            // Seta o título do formulário como assunto
                            email.Subject = Form.Titulo;
                            // Seta a mensagem do email
                            email.Body = Form.MsgEmail is not null? Form.MsgEmail.Replace(@" {replaceStringHere} ", @"<br/><br/>https://formplataform-4ac81.web.app/" + Form.Id+ "<br/><br/>").Replace("\n", @"<br/>"):"";
                            email.Body += "<br/><br/> Caso link não funcione, cole-o no browser de sua escolha.";
                            //END
                            email.IsBodyHtml = true;
                            email.BodyEncoding = System.Text.Encoding.UTF8;
                            SmtpServer.Timeout = 5000;
                            SmtpServer.EnableSsl = true;
                            SmtpServer.UseDefaultCredentials = false;
                            SmtpServer.Credentials = new NetworkCredential(User.Email, User.AppPassword);
                            await SmtpServer.SendMailAsync(email);
                        }
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
                    Id = s.Id,
                    Email = s.Email,
                    Nome = s.Nome,
                    Universidade = s.Universidade,
                    AppPassword = s.AppPassword,

                }).FirstOrDefaultAsync(s => s.Id == model.UserId);
                if (User == null) throw new Exception("Usuário não encontrado");
                else
                {
                    if (User.AppPassword is null) return StatusCode(402);
                    else
                    {
                        var Form = await ProjetoDbContext.Formularios
                            .Select(s => new FormularioDTO
                            {
                                Id = s.Id,
                                MsgEmail = s.MsgEmail,
                                Titulo = s.Titulo,
                            })
                            .Where(s => s.Id == model.FormId)
                            .FirstOrDefaultAsync() ?? throw new Exception("Formulário não encontrado");

                        // Configura SMTP
                        SmtpClient SmtpServer = new("smtp.gmail.com", 587)
                        {
                            DeliveryMethod = SmtpDeliveryMethod.Network
                        };
                        MailMessage email = new();

                        // Começo da configuração do EMAIL

                        // Seta remetente
                        if (User.Email is not null) email.From = new MailAddress(User.Email);
                        else throw new Exception("Sem email de remetente");

                        // Seta destinatário
                        var destinatario = await ProjetoDbContext.Destinatarios.Where(s => s.Id == model.EmailId).FirstOrDefaultAsync();
                        if (destinatario is not null) { 
                            if (Handlers.IsValidEmail(destinatario.Email)) email.To.Add(destinatario.Email);
                            destinatario.Respondido = 1;
                        }
                        //email.To.Add("gabriel.couto14@hotmail.com");

                        // Faz cópia do email para o remetente
                        email.CC.Add(User.Email);

                        // Seta o título do formulário como assunto
                        email.Subject = Form.Titulo;
                        // Seta a mensagem do email
                        email.Body = Form.MsgEmail is not null?Form.MsgEmail.Replace(@" {replaceStringHere} ", @"<br/><br/>https://formplataform-4ac81.web.app/" + Form.Id + "<br/><br/>").Replace("\n",@"<br/>"):"";
                        email.Body += "<br/><br/> Caso link não funcione, cole-o no browser de sua escolha.";
                        //END
                        email.IsBodyHtml = true;
                        SmtpServer.Timeout = 5000;
                        SmtpServer.EnableSsl = true;
                        SmtpServer.UseDefaultCredentials = false;
                        SmtpServer.Credentials = new NetworkCredential(User.Email, User.AppPassword);
                        await SmtpServer.SendMailAsync(email);
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
    }
}