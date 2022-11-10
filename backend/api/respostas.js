const { format } = require("mysql")

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const validateEmail = async (req,res) =>{
        const user = await app.db('respostas')
            .where({ formId: req.params.formId,email: req.body.email })
            .first()
        if (!user) return res.status(400).send('Usuário não encontrado!')
    }

    const save = async (req, res) => {
        const resp = { ...req.body }
        let element ={}
        let enviado= await app.db('enviados').select('*').first()
            .where({email:resp.email})
            .then((result) => result)
            .catch(err =>{
                console.error("Email não presente nos enviados")
                res.status(402).send(err)
            })
        element.repostaId=enviado.id
        if (!enviado.respondido) {
            for (let i = 0; i < resp.respostas.length; i++) {
                element=resp.respostas[i]
                element.questaoId= await app.db('questoes').select('id').first()
                    .where({formId:req.params.formId,numero:element.numero})
                    .then((result)=>result.id);
                delete element.numero
                if(element.radio){
                    app.db('radiobox')
                        .insert(element)
                        .catch(err => res.status(500).send(err))
                } else if(element.opcoes){
                    element.opcoes.forEach(opcao => {
                        switch (opcao) {
                            case 1:
                                element.opcao1=true
                                break;
                            case 2:
                                element.opcao2=true
                                break;
                            case 3:
                                element.opcao3=true
                                break;
                            case 4:
                                element.opcao4=true
                                break;
                            case 5:
                                element.opcao5=true
                                break;
                            case 6:
                                element.opcao6=true
                                break;
                            case 7:
                                element.opcao7=true
                                break;
                            case 8:
                                element.opcao8=true
                                break;
                            case 9:
                                element.opcao9=true
                                break;
                            case 10:
                                element.opcao10=true
                                break;
                            default:
                                break;
                        }
                    });
                    delete element.opcoes
                    app.db('checkbox')
                        .insert(element)
                        .catch(err => res.status(500).send(err))
                } else{
                    app.db('text')
                        .insert(element)
                        .catch(err => res.status(500).send(err))
                }
            };
            enviado.respondido=true
            app.db('enviados')
                .update(enviado)
                .where({id:enviado.id})
                .then(_ => res.status(204).send())
        }else{
            res.statusMessage = "Formulario ja respondido por usuario";
            res.status(400).send();
        }
    }

    const get = (req, res) => {
        app.db('repostas')
            .select('*')
            .then(repostas => res.json(repostas))
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

    const getByForm = async (req, res) => {
        let radiobox = await app.db('rabiobox')
            .select('numero, radio')
            .join('questoes')
            .where(`radiobox.questaoId=questoes.id and questoes.formId=${req.params.formId}`)
            .orderBy('questaoId')
            .then((result)=>result)
            .catch(err => res.status(500).send(err))
        console.log(radiobox)
        res.status(204).send()
    }

    return { validateEmail, save, get, getByForm, erase }
}