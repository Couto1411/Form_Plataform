module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = async (req, res) => {
        const retorno = { ...req.body }
        try {
            existsOrError(retorno.questoes, 'Questões não informadas')
            existsOrError(retorno.enviados, 'Não enviando para ninguém')
        } catch(msg) {
            return res.status(400).send(msg)
        }
        retorno.questoes.forEach(element => {
            element.formId=req.params.formId
            if(element.id){
                app.db('questoes')
                    .update(element)
                    .where({ id: element.id })
                    .catch(err => res.status(500).send(err))
            } else {
                app.db('questoes')
                    .insert(element)
                    .catch(err => res.status(500).send(err))
            }
                
        });
        retorno.enviados.forEach(element => {
            const env ={}
            env.email=element
            env.formId=req.params.formId
            if(element.id){
                app.db('enviados')
                    .update(env)
                    .where({ id: element.id })
                    .catch(err => res.status(500).send(err))
            }else{
                app.db('enviados')
                    .insert(env)
                    .catch(err => res.status(500).send(err))
            } 
        })
        res.status(204).send()
    }

    const get = (req, res) => {
        app.db('questoes')
            .select('*')
            .then(quest => res.json(quest))
            .catch(err => res.status(500).send(err))
    }

    const erase = (req,res)=>{
        const quest = { ...req.body }
        app.db('questoes')
            .where({id: quest.id})
            .del()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send("Faltou id da questão"))
    }

    const getById = (req, res) => {
        app.db('questoes')
            .select('*')
            .where({formId: req.params.formId})
            .orderBy('numero')
            .then(quest => res.json(quest))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById, erase }
}