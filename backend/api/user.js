const bcrypt = require('bcrypt-nodejs')
module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id

        try {
            console.log(user.nome)
            existsOrError(user.nome, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.universidade, 'Universidade não informada')
            existsOrError(user.senha, 'Senha não informada')
            existsOrError(user.confirmaSenha, 'Confirmação de Senha inválida')
            equalsOrError(user.senha, user.confirmaSenha, 'Senhas não conferem')

            const userFromDB = await app.db('users').where({ email: user.email }).first()
            if(!user.id) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }
        user.senha = encryptPassword(user.senha)
        delete user.confirmaSenha
        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'nome', 'universidade', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const erase = (req,res) =>{
        app.db('users')
            .where({id: req.params.id})
            .del()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('nome', 'universidade', 'email', 'admin')
            .where({ id: req.params.id})
            .first()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const teste = (req, res) =>{
        const corpo = {...req.body}
        corpo.formId= req.params.formId
        res.json(corpo)
    }
    return { save, get, erase, getById, teste }
}