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
            .where({email:resp.email, respondido:0, formId:req.params.formId})
            .catch(err =>{
                res.status(402).send("Email não presente nos enviados")
            })
        if (enviado) {
            for (let i = 0; i < resp.respostas.length; i++) {
                element=resp.respostas[i]
                element.respostaId=enviado.id
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
            res.statusMessage = "Usuario nao permitido para responder ou Formulario ja respondido por usuario";
            res.status(402).send();
        }
    }

    const getByEnviadoId = async (req, res) => {
        let response = {respostas: []}
        let questoes = await app.db('questoes')
            .select('*')
            .where({formId:req.params.formId})
            .orderBy('numero')
            .then((result)=> JSON.parse(JSON.stringify(result)));
        console.log(questoes)
        for(let element of questoes){
            switch (element.type) {
                case 1:
                    const radio = {}
                    if(element.opcao1){
                        radio.radio=await app.db('radiobox')
                            .select('radio')
                            .where({questaoId: element.id, respostaId: req.params.enviadoId})
                            .first()
                            .then((result)=>result.radio)
                            .catch(err => res.status(500).send(err))
                        radio.radio=eval('element.opcao'+radio.radio)
                    }
                    radio.enunciado=element.enunciado
                    radio.id=element.id
                    radio.type=element.type
                    radio.numero=element.numero
                    response.respostas.push(radio)
                    break;
                case 2:
                    const text = {}
                    text.texto=await app.db('text')
                        .select('texto')
                        .where({questaoId: element.id, respostaId: req.params.enviadoId})
                        .first()
                        .then((result)=>result.texto)
                        .catch(err => res.status(500).send(err))
                    text.enunciado=element.enunciado
                    text.id=element.id
                    text.type=element.type
                    text.numero=element.numero
                    response.respostas.push(text)
                    break;
                case 3:
                    const check = {}
                    if (element.opcao1) {
                        check.opcoes=await app.db('checkbox')
                            .select('opcao1','opcao2','opcao3','opcao4','opcao5','opcao6','opcao7','opcao8','opcao9','opcao10')
                            .first()
                            .where({questaoId: element.id, respostaId: req.params.enviadoId})
                            .then((result)=>JSON.parse(JSON.stringify(result)))
                            .catch(err => res.status(500).send(err))
                        check.opcoes=Object.values(check.opcoes)
                        for (let index = 0; index < check.opcoes.length; index++){
                            check.opcoes[index]?check.opcoes[index]=eval('element.opcao'+(index+1)):check.opcoes[index]=null
                        }
                        check.opcoes=check.opcoes.filter(n=>n!=null)
                    }
                        check.enunciado=element.enunciado
                        check.id=element.id
                        check.type=element.type
                        check.numero=element.numero
                        response.respostas.push(check)
                    break;
                default:
                    break;
            }
        }
        res.json(response)
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
        let response = []
        let questoes = await app.db('questoes')
            .select('*')
            .where({formId:req.params.formId})
            .orderBy('numero')
            .then((result)=> JSON.parse(JSON.stringify(result)))
            .catch(err => res.status(500).send(err))
        for(let element of questoes){
            switch (element.type) {
                case 1:
                    if(element.opcao1){
                        const radio = {}
                        radio.resposta=await app.db('radiobox')
                            .select('radio')
                            .count('radio as quantidade')
                            .where({questaoId: element.id})
                            .groupBy('radio')
                            .then((result)=>JSON.parse(JSON.stringify(result)))
                            .catch(err => res.status(500).send(err))
                        radio.resposta.sort((a, b) => {return a.radio - b.radio;});
                        for (let index = 1; index <= 10; index++){
                            if (radio.resposta[index-1]&&radio.resposta[index-1].radio===index) {
                                let temp=radio.resposta[index-1].quantidade
                                radio.resposta[index-1]={}
                                radio.resposta[index-1].texto=eval('element.opcao'+(index))
                                radio.resposta[index-1].quantidade=temp
                            }else if(radio.resposta[index-1]){
                                radio.resposta.splice([index-1], 0, {quantidade:0});
                            }
                        }
                        radio.enunciado=element.enunciado
                        radio.id=element.id
                        radio.type=element.type
                        radio.numero=element.numero
                        response.push(radio)
                    }
                    break;
                case 3:
                    if(element.opcao1){
                        const check = {}
                        check.resposta=await app.db('checkbox')
                            .count('opcao1')
                            .count('opcao2')
                            .count('opcao3')
                            .count('opcao4')
                            .count('opcao5')
                            .count('opcao6')
                            .count('opcao7')
                            .count('opcao8')
                            .count('opcao9')
                            .count('opcao10')
                            .where({questaoId: element.id})
                            .first()
                            .then((result)=>JSON.parse(JSON.stringify(result)))
                            .catch(err => res.status(500).send(err))
                        check.resposta=Object.values(check.resposta)
                        for (let index = 0; index < check.resposta.length; index++){ 
                            let temp=check.resposta[index]
                            check.resposta[index]={}
                            check.resposta[index].texto=eval('element.opcao'+(index+1))
                            check.resposta[index].quantidade=temp
                        }
                        check.enunciado=element.enunciado
                        check.id=element.id
                        check.type=element.type
                        check.numero=element.numero
                        response.push(check)
                    }
                    break;
                default:
                    break;
            }
        }
        res.json(response)
    }

    return { validateEmail, save, getByEnviadoId, getByForm, erase }
}