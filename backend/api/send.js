module.exports = app =>{
    var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

    const enviar = async (req, res) => {
        const corpo = {...req.body}
        let titulo = await app.db('formularios')
            .select('titulo')
            .where({id:corpo.formId})
            .first()
            .then(_ => JSON.parse(JSON.stringify(_)))
            .catch(err => res.status(500).send(err))
        let user = await app.db('users')
            .select('nome','universidade')
            .where({id:corpo.userId})
            .first()
            .then(_ => JSON.parse(JSON.stringify(_)))
            .catch(err => res.status(500).send(err))
        let enviados = await app.db('enviados')
            .select('email')
            .where({formId:corpo.formId})
            .then(_ => JSON.parse(JSON.stringify(_)).map(a=>a.id))
            .catch(err => res.status(500).send(err))
        let corpoEmail = "Você recebeu uma pesquisa da pltaforma de formulários, essa pesquisa foi enviada por "+user.nome+" da universidade "+user.universidade
        // Email.send({
        //     SecureToken : "57839cea-a044-45e2-95b9-4a23651f3527",
        //     To : '<whom you want to send>',
        //     From : "gabriel.mine14@hotmail.com",
        //     Subject : titulo,
        //     Body : corpoEmail
        // }).then(
        // message => alert("mail has been sent sucessfully")
        // );
        console.log(titulo,user,enviados)
        res.send(204)
    }


    /* SmtpJS.com - v3.0.0 */
    return { enviar}
}