module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = async (req, res) => {
        const form = { ...req.body }
        if(req.params.formId) form.id = req.params.formId
        try {
            existsOrError(form.titulo, 'Nome não informado')
            existsOrError(req.params.id, 'Responsável não informado')
            form.responsavelId=req.params.id
        } catch(msg) {
            return res.status(400).send(msg)
        }
        if(form.id) {
            app.db('formularios')
                .update(form)
                .where({ id: form.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('formularios')
                .insert(form)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db
            .select('nome', 'titulo')
            .from('users')
            .join('formularios', 'users.id', '=', 'formularios.responsavelId')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const erase = (req,res)=>{
        app.db('questoes')
            .where({formId: req.params.formId})
            .del()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        app.db('formularios')
            .where({id: req.params.formId})
            .del()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('formularios')
            .select('id','titulo')
            .where({ responsavelId: req.params.id})
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getInfoById = (req, res) => {
        app.db('formularios')
            .where({responsavelId: req.params.id, id: req.params.formId})
            .first()
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }
    return { save, get, getById, erase, getInfoById }
}