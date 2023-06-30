import React, {useEffect,useState}from 'react'
import axios from "axios";
import './FormularioResp.css'
import baseUrl from "../../config/api";
import {useParams} from 'react-router-dom';
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import {
    MDBInput, MDBInputGroup, MDBTextArea, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalBody, MDBModalFooter, MDBModalHeader} from 'mdb-react-ui-kit';

export default function FormularioResposta(props){    
    const [questoes, setQuestoes] = useState(null);
    const [emailChecker, setEmailChecker] = useState(true);
    const [concluded, setConcluded] = useState(false);
    const [user, setUser] = useState();
    const { formId } = useParams();


    useEffect(() => {
        async function CarregaQuestoes(){
            let res = await axios.get(baseUrl+"/questoes/"+formId)
            .catch((error) => {
                if (error.response.status!==404) {console.log(error)}
            })
            res.data.sort((a,b) => a.numero - b.numero);
            setQuestoes(res.data)
        }
        CarregaQuestoes()

    }, [formId]);

    // Questões
    function renderizaQuestoes(listaQuestoes,derivada){
        if(!listaQuestoes)listaQuestoes=questoes
        return listaQuestoes?.map(element => {
            switch (element.type) {
                case 1:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={derivada?'rounded-3 mb-3 opcao1':'rounded-3 mb-3'}>
                            <div className='mt-1 rounded-3'>
                                <MDBInputGroup id={element.id} className='mb-2 rounded-3'>
                                    <MDBBtn disabled color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input className='form-control' type='text' id={'questao'+element.id} value={element.enunciado} disabled/>
                                </MDBInputGroup>
                            </div>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={1} inline/>{element.opcao1}</div>:questoes[questoes.map(object => object.id).indexOf(element.id)].semQuestao=true}
                                {element.opcao2?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={2} inline/>{element.opcao2}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao3?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={3} inline/>{element.opcao3}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao4?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={4} inline/>{element.opcao4}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao5?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={5} inline/>{element.opcao5}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao6?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={6} inline/>{element.opcao6}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao7?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={7} inline/>{element.opcao7}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao8?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={8} inline/>{element.opcao8}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao9?<div className='d-flex'><MDBRadio name={'radioNoLabel'+element.id} value={9} inline/>{element.opcao9}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao10?<div className='d-flex mb-1'><MDBRadio name={'radioNoLabel'+element.id} vlue={10} inline/>{element.opcao10}</div>:<div className='mb-1 erro'></div>}
                            </div>
                        </MDBListGroupItem>
                    )
                case 2:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={derivada?'rounded-3 mb-3 opcao1':'rounded-3 mb-3'}>
                            <div className='mt-1 rounded-3'>
                                <MDBInputGroup id={element.id} className='mb-2 rounded-3'>
                                    <MDBBtn disabled color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input className='form-control' type='text' id={'questao'+element.id} value={element.enunciado} disabled/>
                                </MDBInputGroup>
                            </div>
                            <MDBTextArea id={"open"+element.id} rows={4} label='Resposta' className='mb-2'/>
                        </MDBListGroupItem>
                    )
                case 3:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={derivada?'rounded-3 mb-3 opcao1':'rounded-3 mb-3'}>
                            <div className='mt-1 rounded-3' >
                                <MDBInputGroup id={element.id} className='mb-2 rounded-3'>
                                    <MDBBtn disabled color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input className='form-control' type='text' id={'questao'+element.id} value={element.enunciado} disabled/>
                                </MDBInputGroup>
                            </div>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={1} inline/>{element.opcao1}</div>:questoes[questoes.map(object => object.id).indexOf(element.id)].semQuestao=true}
                                {element.opcao2?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={2} inline/>{element.opcao2}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao3?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={3} inline/>{element.opcao3}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao4?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={4} inline/>{element.opcao4}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao5?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={5} inline/>{element.opcao5}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao6?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={6} inline/>{element.opcao6}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao7?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={7} inline/>{element.opcao7}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao8?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={8} inline/>{element.opcao8}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao9?<div className='d-flex'><MDBCheckbox name={'checkNoLabel'+element.id} value={9} inline/>{element.opcao9}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao10?<div className='d-flex mb-1'><MDBCheckbox name={'checkNoLabel'+element.id} value={10} inline/>{element.opcao10}</div>:<div className='mb-1 erro'></div>}
                            </div>
                        </MDBListGroupItem>
                    )
                case 4:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={derivada?'rounded-3 mb-3 opcao1':'rounded-3 mb-3'}>
                            <MDBTextArea rows={4} id={'questao'+element.id} defaultValue={element.enunciado} readOnly className='mb-2'/>
                        </MDBListGroupItem>
                    )
                case 9:
                    return(
                        <div  key={element.id}>
                        <MDBListGroupItem noBorders className='rounded-3 mb-3 opcao10'>
                            <div className='mt-1 rounded-3'>
                                <MDBInputGroup id={element.id} className='mb-2 rounded-3'>
                                    <MDBBtn disabled color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input className='form-control' type='text' id={'questao'+element.id} value={element.enunciado} disabled/>
                                </MDBInputGroup>
                            </div>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,1)}} name={'radioNoLabel'+element.id} value={1} inline/>{element.opcao1}</div>:questoes[questoes.map(object => object.id).indexOf(element.id)].semQuestao=true}
                                {element.opcao2?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,2)}} name={'radioNoLabel'+element.id} value={2} inline/>{element.opcao2}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao3?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,3)}} name={'radioNoLabel'+element.id} value={3} inline/>{element.opcao3}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao4?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,4)}} name={'radioNoLabel'+element.id} value={4} inline/>{element.opcao4}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao5?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,5)}} name={'radioNoLabel'+element.id} value={5} inline/>{element.opcao5}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao6?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,6)}} name={'radioNoLabel'+element.id} value={6} inline/>{element.opcao6}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao7?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,7)}} name={'radioNoLabel'+element.id} value={7} inline/>{element.opcao7}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao8?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,8)}} name={'radioNoLabel'+element.id} value={8} inline/>{element.opcao8}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao9?<div className='d-flex'><MDBRadio onClick={e=>{showDerivada(element.id,9)}} name={'radioNoLabel'+element.id} value={9} inline/>{element.opcao9}</div>:<div className='mb-1 erro'></div>}
                                {element.opcao10?<div className='d-flex mb-1'><MDBRadio onClick={e=>{showDerivada(element.id,10)}} name={'radioNoLabel'+element.id} vlue={10} inline/>{element.opcao10}</div>:<div className='mb-1 erro'></div>}
                            </div>
                        </MDBListGroupItem>
                        {renderizaDerivadas(element)}
                        </div>
                    )
                default:
                    return(
                        <div className='mb-1'></div>
                    )
            }
        });
    }
    function showDerivada(questaoId,opcao){
        let opcoes = [1,2,3,4,5,6,7,8,9,10]
        document.getElementById(questaoId+'opcao'+opcao).style.display='block'
        opcoes.filter(e=>e!==opcao).forEach(element=>{document.getElementById(questaoId+'opcao'+element).style.display='none'})
    }
    function renderizaDerivadas(questao){
        let opcoes = [1,2,3,4,5,6,7,8,9,10]
        return opcoes.map(element=> { 
            return(
                <MDBListGroup id={questao.id+'opcao'+element} key={questao.id+'opcao'+element} style={{display: 'none'}} small>
                    {questao.derivadas?.filter(s=>s.derivadaDeOpcao===element)?.length?renderizaQuestoes(questao.derivadas?.filter(s=>s.derivadaDeOpcao===element),true):null}
                </MDBListGroup>
            )
        })
    }

    async function checkUser(email){
        await axios.get(baseUrl+"/resposta/"+formId+"/email/"+email,)
            .then(resp=>{resp.data?setEmailChecker(false):document.getElementById("email").classList.add('is-invalid')})
            .catch((error) => {console.log(error)})
    }

    function verificaUsuario(elemento){
        setUser(elemento.value)
        checkUser(elemento.value)
    }

    async function sendResposta(){
        let respostas=[]
        let enviar=true
        let temp = questoes
        for (let index = 0; index < temp.length; index++) {
            const element = temp[index];
            element?.derivadas?.forEach(el =>  temp.push(el));
            element.derivadas = []
            if(!element.semQuestao){
                switch (element.type) {
                    case 1:
                        let radio= document.querySelector(`input[name="radioNoLabel${element.id}"]:checked`)
                        if (radio) {
                            document.getElementById(element.id).style.border='none'
                            respostas.push({
                                id: element.id,
                                radio: +radio.value
                            })
                        }else{
                            document.getElementById(element.id).style.border='1px solid rgb(255, 43, 43)'
                            enviar=false
                        }
                        break
                    case 2:
                        let text= document.getElementById(`open${element.id}`).value
                        if (text) {
                            document.getElementById(element.id).style.border='none'
                            respostas.push({
                                id: element.id,
                                texto: text
                            })
                        }else{
                            document.getElementById(element.id).style.border='1px solid rgb(255, 43, 43)'
                            enviar=false
                        }
                        break
                    case 3:
                        let check=[]
                        let markCheck = document.getElementsByName('checkNoLabel'+element.id);  
                        for (let checkbox of markCheck) {  
                            if (checkbox.checked) check.push(+checkbox.value);  
                        } 
                        if (check.length!==0) {
                            document.getElementById(element.id).style.border='none'
                            respostas.push({
                                id: element.id,
                                opcoes: check
                            })
                        }else{
                            document.getElementById(element.id).style.border='1px solid rgb(255, 43, 43)'
                            enviar=false
                        }
                        break
                    case 9:
                        let questao= document.querySelector(`input[name="radioNoLabel${element.id}"]:checked`)
                        if (questao) {
                            document.getElementById(element.id).style.border='none'
                            respostas.push({
                                id: element.id,
                                radio: +questao.value
                            })
                            let array = element.derivadas?.filter(e=>e.derivadaDeOpcao===questao.value)
                            for (let indice = 0; indice < array.length; indice++) {
                                const item = array[indice];
                                switch (item.type) {
                                    case 1:
                                        let radio= document.querySelector(`input[name="radioNoLabel${item.id}"]:checked`)
                                        if (radio) {
                                            document.getElementById(item.id).style.border='none'
                                            respostas.push({
                                                id: item.id,
                                                radio: +radio.value
                                            })
                                        }else{
                                            document.getElementById(item.id).style.border='1px solid rgb(255, 43, 43)'
                                            enviar=false
                                        }
                                        break
                                    case 2:
                                        let text= document.getElementById(`open${item.id}`).value
                                        if (text) {
                                            document.getElementById(item.id).style.border='none'
                                            respostas.push({
                                                id: item.id,
                                                texto: text
                                            })
                                        }else{
                                            document.getElementById(item.id).style.border='1px solid rgb(255, 43, 43)'
                                            enviar=false
                                        }
                                        break
                                    case 3:
                                        let check=[]
                                        let markCheck = document.getElementsByName('checkNoLabel'+item.id);  
                                        for (let checkboxDer of markCheck) {  
                                            if (checkboxDer.checked) check.push(+checkboxDer.value);  
                                        } 
                                        if (check.length!==0) {
                                            document.getElementById(item.id).style.border='none'
                                            respostas.push({
                                                id: item.id,
                                                opcoes: check
                                            })
                                        }else{
                                            document.getElementById(item.id).style.border='1px solid rgb(255, 43, 43)'
                                            enviar=false
                                        }
                                        break
                                    default:
                                        break
                                    }
                            }
                        }else{
                            document.getElementById(element.id).style.border='1px solid rgb(255, 43, 43)'
                            enviar=false
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        if(enviar){
            document.getElementById("desabilita").disabled=true
            await axios.post(baseUrl+"/enviados/"+formId,
            {
                email:user,
                respostas: respostas
            })
            .then(reposta =>{
                setConcluded(true);
            })
            .catch(erro=>{
                console.log(erro)
            })
        }
    }

    return(
        <section>
            {Navbar(1,true)}
            <main className='mt-3 centralize'>
                {Title("Questões")}

                <MDBListGroup small className='mt-3' >
                    <fieldset id="desabilita">
                        {renderizaQuestoes()}
                    </fieldset>
                </MDBListGroup>
                <MDBBtn onClick={e=>{sendResposta()}} color='success' className='my-3'>Enviar</MDBBtn>
            </main>
            <MDBModal staticBackdrop tabIndex='-1' show={emailChecker} setShow={setEmailChecker}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <form onSubmit={e=>{
                                    e.preventDefault()
                                    let x=document.getElementById("email")
                                    x.value?verificaUsuario(x):x.classList.add('is-invalid')
                                }}>
                            <MDBModalHeader className='py-2'>
                                Insira seu email, caso aprovado, poderá responder o questionário
                            </MDBModalHeader>
                            <MDBModalBody className='py-2'>
                                <MDBInput label='Email' id={"email"} type='text' onChange={e=>{e.target.classList.remove('is-invalid')}}/>
                            </MDBModalBody>
                            <MDBModalFooter className='py-2'>
                                <MDBBtn type='submit'>Enviar</MDBBtn>
                            </MDBModalFooter>
                        </form>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            
            <MDBModal staticBackdrop tabIndex='-1' show={concluded} setShow={setConcluded}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader className='py-2'>
                            Pesquisa concluída
                        </MDBModalHeader>
                        <MDBModalBody className='py-2'>
                            Em caso de dúvidas entre em contato com o remetente disponível em seu email.
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </section>
    )
}