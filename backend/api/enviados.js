module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const save = async (req, res) => {
        const retorno = { ...req.body }
        try {
            existsOrError(retorno.email, 'Email não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }
        retorno.formId=req.params.formId
        if(retorno.id){
            app.db('enviados').
                select('respondido').
                where({ id: retorno.id })
                .then(_ =>{
                    if(_!==1){
                        app.db('enviados')
                            .update(retorno)
                            .where({ id: retorno.id })
                            .catch(err => res.status(500).send(err))
                    }else{
                        res.status(400).send(err)
                    }
                })
                .catch(err => res.status(500).send(err))
        } else {
            app.db('enviados')
                .insert(retorno)
                .catch(err => res.status(500).send(err))
        };
        res.status(204).send()
    }

    const edit = (req,res) =>{
        const enviado = { ...req.body }
        app.db('enviados')
            .update(enviado)
            .where({ id: enviado.id })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

    const erase = (req,res)=>{
        app.db('radiobox')
            .where({respostaId: req.params.respostaId})
            .del()
            .catch(err => res.status(500).send("Faltou id da questão"))
        app.db('text')
            .where({respostaId: req.params.respostaId})
            .del()
            .catch(err => res.status(500).send("Faltou id da questão"))
        app.db('checkbox')
            .where({respostaId: req.params.respostaId})
            .del()
            .catch(err => res.status(500).send("Faltou id da questão"))
        if (req.query.deleta==='true') {
            console.log("delete",req.query.deleta)
            app.db('enviados')
                .where({id: req.params.respostaId})
                .del()
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Faltou id da questão"))
        }else{
            console.log("update",req.query.deleta)
            app.db('enviados')
                .update({respondido:0})
                .where({id: req.params.respostaId})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send("Faltou id da questão"))
        }
    }

    const checkUser = (req,res) => {
        app.db('enviados')
            .select('*')
            .where({ formId:req.params.formId, email: req.params.email,respondido:0 })
            .first()
            .then(_ => res.json(_))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('enviados')
            .select('*')
            .where({formId: req.params.formId})
            .then(quest => res.json(quest))
            .catch(err => res.status(500).send(err))
    }

    return { save, checkUser, edit, getById, erase }
}