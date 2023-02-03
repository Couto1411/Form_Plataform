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
                .then(_ => res.json(_[0]))
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

    const erase = async(req,res)=>{
        console.log("oi")
        let questoes= await app.db('questoes')
            .select('id')
            .where({formId: req.params.formId})
            .then(_ => JSON.parse(JSON.stringify(_)).map(a=>a.id))
            .catch(err => res.status(500).send(err))
        console.log(questoes)
        for (let i = 0; i < questoes.length; i++) {
            await app.db('radiobox')
                .where({questaoId: questoes[i]})
                .del()
                .catch(err => res.status(500).send("Faltou id da questão"))
            console.log(questoes[i])
            await app.db('text')
                .where({questaoId: questoes[i]})
                .del()
                .catch(err => res.status(500).send("Faltou id da questão"))
            console.log(questoes[i])
            await app.db('checkbox')
                .where({questaoId: questoes[i]})
                .del()
                .catch(err => res.status(500).send("Faltou id da questão"))
            console.log(questoes[i])
        }
        await app.db('enviados')
            .where({formId: req.params.formId})
            .del()
            .catch(err => res.status(500).send(err))
        await app.db('questoes')
            .where({formId: req.params.formId})
            .del()
            .catch(err => res.status(500).send(err))
        await app.db('formularios')
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

    return { save, get, getById, erase }
}