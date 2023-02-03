module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const atualizaEnviados = async (id) =>{

    }

    const save = async (req, res) => {
        const retorno = { ...req.body }
        try {
            existsOrError(retorno.numero, 'Numero da questão não informado')
            existsOrError(retorno.enunciado, 'Enunciado não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }
        retorno.formId=req.params.formId
        if(retorno.id){
            app.db('questoes')
                .update(retorno)
                .where({ id: retorno.id })
                .catch(err => res.status(500).send(err))
        } else {
            app.db('questoes')
                .insert(retorno)
                .catch(err => res.status(500).send(err))
        };
        res.status(204).send()
    }

    const edit = (req,res) =>{
        const questao = { ...req.body }
        app.db('questoes')
            .update(questao)
            .where({ id: questao.id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const get = (req, res) => {
        app.db('questoes')
            .select('*')
            .then(quest => res.json(quest))
            .catch(err => res.status(500).send(err))
    }

    const erase = (req,res)=>{
        const questao = { ...req.body }
        switch (questao.type) {
            case 1:
                app.db('radiobox')
                    .where({questaoId: req.params.questaoId})
                    .del()
                    .catch(err => res.status(500).send("Radiobox"))
                break;
            case 2:
                app.db('text')
                    .where({questaoId: req.params.questaoId})
                    .del()
                    .catch(err => res.status(500).send("Aberta"))
                break;
            case 3:
                app.db('checkbox')
                    .where({questaoId: req.params.questaoId})
                    .del()
                    .catch(err => res.status(500).send("Checkbox"))
                break;
            default:
                break;
        }
        app.db('questoes')
            .where({id: req.params.questaoId})
            .del()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send("Questoes"))
    }

    const getById = (req, res) => {
        app.db('questoes')
            .select('*')
            .where({formId: req.params.formId})
            .orderBy('numero')
            .then(quest => res.json(quest))
            .catch(err => res.status(500).send(err))
    }

    return { save, edit, get, getById, erase }
}