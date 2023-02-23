using Microsoft.AspNetCore.Http;
using Amazon;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using backendcsharp.Entities;
using backendcsharp.DTO;
using Microsoft.AspNetCore.Authorization;

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
        // use the verified sender identity
        static readonly string senderEmail = "formsplataform@gmail.com";

        // the recipient email address of the email (verify if sandbox)
        static readonly string recievier = "gabriel.mine14@hotmail.com";

        // configure the email subjectstatic readonly string subject = "Sending Email using SES";

        // configure the message for non-html email clients
        static readonly string textMessage = "Hello World, from SES!";

        // configure the HTML message (default)
        static readonly string emailMessage = "<h1>Hello World!</h1>";

        // Enviar Formuláros
        [HttpPost("enviar")]
        [Authorize("Bearer")]
        public async Task<ActionResult>  EnviaEmail()
        {
            try
            {
                // create the email client for SES, use the Region you configured SES in
                var client = new AmazonSimpleEmailServiceClient(RegionEndpoint.USEast1);

                var sendRequest = new SendEmailRequest
                {
                    // verified sender
                    Source = senderEmail,
                    Destination = new Destination
                    {
                        // configure recipients
                        ToAddresses = new List<string> { recievier }
                    },
                    Message = new Message
                    {
                        // email subject
                        Subject = new Content(""),
                        Body = new Body
                        {
                            // HTML body for HTML Renderers
                            Html = new Content
                            {
                                Charset = "UTF-8",
                                Data = emailMessage
                            },
                            // Plain text for non-html renderes
                            Text = new Content
                            {
                                Charset = "UTF-8",
                                Data = textMessage
                            }
                        }
                    },
                };
                // send the configured email via SDK
                await client.SendEmailAsync(sendRequest);
                return StatusCode(204);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}