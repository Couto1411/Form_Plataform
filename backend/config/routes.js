const admin = require('./admin')

module.exports = app => {

    app.route('/teste').post(app.api.user.teste)
    app.post('/signup', admin(app.api.user.save))
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .post(app.api.user.save)
        .get(admin(app.api.user.get))
    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .get(app.api.user.getById)
        .delete(admin(app.api.user.erase))

    app.route('/forms')
        .all(app.config.passport.authenticate())
        .get(admin(app.api.formularios.get))
    app.route('/users/:id/forms')
        .all(app.config.passport.authenticate())
        .post(app.api.formularios.save)
        .get(app.api.formularios.getById)
    
    app.route('/users/:id/forms/:formId')
        .all(app.config.passport.authenticate())
        .post(app.api.questoes.save)
        .put(app.api.formularios.save)
        .delete(app.api.formularios.erase)
    
    app.route('/users/:id/forms/:formId/:questaoId')
        .all(app.config.passport.authenticate())
        .put(app.api.questoes.edit)
        .delete(app.api.questoes.erase)

    app.route('/users/:id/forms/:formId/enviados')
        .all(app.config.passport.authenticate())
        .get(app.api.enviados.getById)
        .post(app.api.enviados.save)
    
    app.route('/users/:id/forms/:formId/enviados/:respostaId')
        .all(app.config.passport.authenticate())
        .put(app.api.enviados.edit)
        .delete(app.api.enviados.erase)
        
    app.route('/users/:id/forms/:formId/respostas')
        .all(app.config.passport.authenticate())
        .get(app.api.respostas.getByForm)

    app.route('/users/:id/forms/:formId/respostas/:enviadoId')
        .all(app.config.passport.authenticate())
        .get(app.api.respostas.getByEnviadoId)

    app.route('enviados/:formId')
        .post(app.api.respostas.save)

    app.route('questoes/:formId')
        .get(app.api.questoes.getById)

    app.route('/resposta/:formId/email/:email')
        .get(app.api.enviados.checkUser)

    app.route('/enviar')
        .all(app.config.passport.authenticate())
        .post(app.api.send.enviar)
}