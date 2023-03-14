import React, {useEffect,useState}from 'react'
import './Forms.css'
import axios from "axios";
import * as XLSX from "xlsx";
import baseUrl from "../../config/api";
import {useNavigate} from 'react-router-dom';
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from '../user/UserSection'
import InputMask from 'react-input-mask';
import {
    MDBInputGroup, MDBTextArea, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBInput, MDBFile, MDBProgressBar,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBContainer} from 'mdb-react-ui-kit';

export default function Forms(){
    const navigate = useNavigate();

    // Alert de contato respondido em form derivado
    const [respondidoDerivado, setRespondidoDerivado] = useState(false);
    // Conta cliques para excluir email a ser enviado
    const [click, setClick] = useState([{id:''}]);
    
    // Usado para aparição da NAVBAR
    const [appearing, setAppearing] = useState(false);

    // Aba de respostas da aplicação
    const [respostas, setRespostas] = useState(null);
    // Aba de questoes que mostra todas as questoes do formulario
    const [questoes, setQuestoes] = useState([]);
    // Aba de envios que mostra todos os emails a serem enviados do formulario
    const [contatos, setContatos] = useState([]);
    const [contatosDB, setContatosDB] = useState([]);
    // Responsavel pelo armazenamento das opcões de cursos de envios
    const [cursos, setCursos] = useState(null);
    // Regula novas opcões
    const [input, setInput] = useState([{content:<></>}]);
    // Seta qual página aparece, questoes, repostas ou envios
    const [main, setMain] = useState(1)

    // Modifia visibilidade da area de novo envio
    const [newContato, setNewContato] = useState(<></>);

    // Modifia visibilidade da area de nova questao - 1 parte tipo questao
    const [typeQuestion, setTypeQuestion] = useState(<></>);
    // Modifia visibilidade da area de nova questao - 2 parte enunciado e opcao da questao
    const [newQuestion, setNewQuestion] = useState(<></>);

    // Auxilia no processo de adicao da questao na pagina
    const [novaQuestao, setNovaQuestao] = useState({});

    // Seta qual secao aparece, questoes, repostas ou envios
    const [secao, setsecao] = useState(1)
    // Modifica visibilidade do popup de import de envios
    const [importModal, setImportModal] = useState(false);

    // Usado para paginação
    const [contatosPage, setContatosPage] = useState(1);

    // Usado para busca de contatos
    const [nomeEmail, setNomeEmail] = useState(true);

    async function carregaCursos(){
        await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/cursos",{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(res=>{setCursos(res.data)})
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
    }

    async function carregaEnvios(){
        console.log("oi")
        let reponse = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados",{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{console.log(response.data);setContatos(response.data);setContatosDB(response.data)})
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error);setContatos([])}
        }) 
        carregaCursos()
    }

    async function carregaRespostas(){
        let respon = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/respostas",{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{setRespostas(response.data)})
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error);setRespostas([])}
        })
    }
    
    async function carregaQuestoes(){
        let res = await axios.get(baseUrl+"/questoes/"+sessionStorage.getItem("formId"),{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            response.data.sort((a,b) => a.numero - b.numero);
            setQuestoes(response.data)
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error);setQuestoes([])}
        })
    }

    async function load(){
        carregaQuestoes()
        carregaCursos()
        carregaEnvios()
        carregaRespostas()
    }

    useEffect(() => {
        if (sessionStorage.getItem("token")){
            load()
        }
        else{
            console.warn("Faça o login")
            navigate('/login')
        }

    }, []);

    const searchChange = (e) => {
        var envio = contatosDB.filter((el)=>{
            if (e.target.value === '') {
                return el;
            }
            //return the item which contains the user input
            else {
                if (nomeEmail) {
                    return el.email?.toLowerCase().includes(e.target.value)
                }
                else{
                    return el.nome?.toLowerCase().includes(e.target.value)
                }
            }

        })
        setContatos(envio)
    }; 

    // Questões
    function renderizaQuestoes(){
        return questoes?.map(element => {
            switch (element.type) {
                // Radiobox
                case 1:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn onClick={e=>{
                                        let v=document.getElementById("questao"+element.id)
                                        v.disabled=!v.disabled
                                        var excluiSalva = document.getElementsByClassName("exclui-salva"+element.id)
                                        for (let item of excluiSalva) item.style.display=='none'? item.style.display="inline-block":item.style.display="none"
                                    }} color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled onChange={e=>{questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}/>
                                </MDBInputGroup>
                            </div>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao1}<i role='button' onClick={e=>{editOpcao(element.id,"1")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao2?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao2}<i role='button' onClick={e=>{editOpcao(element.id,"2")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao3?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao3}<i role='button' onClick={e=>{editOpcao(element.id,"3")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao4?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao4}<i role='button' onClick={e=>{editOpcao(element.id,"4")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao5?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao5}<i role='button' onClick={e=>{editOpcao(element.id,"5")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao6?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao6}<i role='button' onClick={e=>{editOpcao(element.id,"6")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao7?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao7}<i role='button' onClick={e=>{editOpcao(element.id,"7")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao8?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao8}<i role='button' onClick={e=>{editOpcao(element.id,"8")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao9?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao9}<i role='button' onClick={e=>{editOpcao(element.id,"9")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao10?<div className='d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao10}<i role='button' onClick={e=>{editOpcao(element.id,"10")}} className='edit editOpcoes mb-2 ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<i role='button' className="addQuestao mx-1 edit fas fa-regular fa-plus" onClick={e=>{addOpcao(element.id)}}></i>}
                                {handleInput(element.id)}
                            </div>
                            <div className='d-flex'>
                                <MDBBtn onClick={e=>{excluiQuestao(element)}} color='danger' className={'ms-auto me-2 exclui-salva'+element.id} style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn onClick={e=>{editaQuestao(element.id)}} className={'exclui-salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                // Text
                case 2:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn onClick={e=>{
                                        let v=document.getElementById("questao"+element.id)
                                        v.disabled=!v.disabled
                                        var excluiSalva = document.getElementsByClassName("exclui-salva"+element.id)
                                        for (let item of excluiSalva) item.style.display=='none'? item.style.display="inline-block":item.style.display="none"
                                    }} color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled onChange={e=>{questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}/>
                                </MDBInputGroup>
                            </div>
                            <MDBTextArea rows={4} label='Resposta' readOnly className='mb-2'/>
                            <div className='d-flex'>
                                <MDBBtn onClick={e=>{excluiQuestao(element)}} color='danger' className={'ms-auto me-2 exclui-salva'+element.id} style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn onClick={e=>{editaQuestao(element.id)}} className={'exclui-salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                // Checkbox
                case 3:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn onClick={e=>{
                                        let v=document.getElementById("questao"+element.id)
                                        v.disabled=!v.disabled
                                        var excluiSalva = document.getElementsByClassName("exclui-salva"+element.id)
                                        for (let item of excluiSalva) item.style.display=='none'? item.style.display="inline-block":item.style.display="none"
                                    }} color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled onChange={e=>{questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}/>
                                </MDBInputGroup>
                            </div>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao1}<i role='button' onClick={e=>{editOpcao(element.id,"1")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao2?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao2}<i role='button' onClick={e=>{editOpcao(element.id,"2")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao3?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao3}<i role='button' onClick={e=>{editOpcao(element.id,"3")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao4?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao4}<i role='button' onClick={e=>{editOpcao(element.id,"4")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao5?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao5}<i role='button' onClick={e=>{editOpcao(element.id,"5")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao6?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao6}<i role='button' onClick={e=>{editOpcao(element.id,"6")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao7?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao7}<i role='button' onClick={e=>{editOpcao(element.id,"7")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao8?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao8}<i role='button' onClick={e=>{editOpcao(element.id,"8")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao9?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao9}<i role='button' onClick={e=>{editOpcao(element.id,"9")}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao10?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao10}<i role='button' onClick={e=>{editOpcao(element.id,"10")}} className='edit editOpcoes mb-2 ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<i role='button' className="addQuestao edit fas fa-regular fa-plus" onClick={e=>{addOpcao(element.id)}}></i>}
                                {handleInput(element.id)}
                            </div>
                            <div className='d-flex'>
                                <MDBBtn onClick={e=>{excluiQuestao(element)}} color='danger' className={'ms-auto me-2 exclui-salva'+element.id} style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn onClick={e=>{editaQuestao(element.id)}} className={'exclui-salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                // Description
                case 4:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <MDBTextArea disabled onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} id={'questao'+element.id}
                                         onChange={e=>{questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}
                                         defaultValue={element.enunciado} rows={4} label='Descrição' className='mb-2'/>
                            <MDBBtn onClick={e=>{
                                let v=document.getElementById("questao"+element.id)
                                v.disabled=!v.disabled
                                var excluiSalva = document.getElementsByClassName("exclui-salva"+element.id)
                                for (let item of excluiSalva) item.style.display=='none'? item.style.display="inline-block":item.style.display="none"
                            }} color='secondary' className='numQuestao'><i className='p-1 fas fa-regular fa-pen'></i></MDBBtn>
                            <div className='d-flex'>
                                <MDBBtn onClick={e=>{excluiQuestao(element)}} color='danger' className={'ms-auto me-2 exclui-salva'+element.id} style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn onClick={e=>{editaQuestao(element.id)}} className={'exclui-salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                default:
                    return(
                        <></>
                    )
            }
        });
    }

    async function addQuestao(){
        novaQuestao.enunciado=document.getElementById("novaQuestaoEnunciado").value
        if(novaQuestao.enunciado){
            if (novaQuestao.type===1||novaQuestao.type===3) {
                novaQuestao.opcao1=document.getElementById("option1").value
                novaQuestao.opcao2=document.getElementById("option2").value
                novaQuestao.opcao3=document.getElementById("option3").value
                novaQuestao.opcao4=document.getElementById("option4").value
                novaQuestao.opcao5=document.getElementById("option5").value
                novaQuestao.opcao6=document.getElementById("option6").value
                novaQuestao.opcao7=document.getElementById("option7").value
                novaQuestao.opcao8=document.getElementById("option8").value
                novaQuestao.opcao9=document.getElementById("option9").value
                novaQuestao.opcao10=document.getElementById("option10").value
            }
            await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId"),novaQuestao,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then(resposta=>{
                console.log(resposta)
                novaQuestao.id=resposta.data
                setQuestoes([
                    ...questoes,
                    novaQuestao
                ])
                setNovaQuestao({})
                setNewQuestion(<></>)
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else{ console.log(error)}
            })
        }else{
            document.getElementById("novaQuestaoEnunciado").classList.add("is-invalid")
        }
    }

    async function editaQuestao(id){
        let dados=questoes[questoes.map(object => object.id).indexOf(id)]
        await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/"+id,dados,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
        document.getElementById("questao"+id).disabled=true
        var excluiSalva = document.getElementsByClassName("exclui-salva"+id)
        for (let item of excluiSalva) item.style.display = "none"
    }

    async function excluiQuestao(element){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/"+element.id,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            },
            data:{
                "type": element.type
            }
        })
        .then((response)=>{
            setQuestoes(questoes.filter(a=> a.id !== element.id))
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
    }

    function addOpcao(id){
        var v = document.getElementsByClassName("addQuestao")
        var opcoes = document.getElementsByClassName("editOpcoes")
        var excluiSalva = document.getElementsByClassName("exclui-salva"+id)
        setInput([
            ...input,{
            id:id,
            content: <div className='my-2'>
                <MDBTextArea onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} id={"questao"+id+"novaopcao"} rows={3} label='Opcao' className='mb-2'/>
                <MDBBtn className='border border-secondary' color='light' onClick={e=>{
                    for (let item of v) item.style.display = "inline-block"
                    for (let item of opcoes) item.style.display = "inline-block"
                    for (let item of excluiSalva) item.style.display = "inline-block"
                    setInput(input.filter(a=> a.id !== id))
                    let index = questoes.map(object => object.id).indexOf(id)
                    let newOption = document.getElementById("questao"+id+"novaopcao").value
                    if(newOption){
                        if (!questoes[index].opcao1) {questoes[index].opcao1=newOption}
                        else if (!questoes[index].opcao2) {questoes[index].opcao2=newOption}
                        else if (!questoes[index].opcao3) {questoes[index].opcao3=newOption}
                        else if (!questoes[index].opcao4) {questoes[index].opcao4=newOption}
                        else if (!questoes[index].opcao5) {questoes[index].opcao5=newOption}
                        else if (!questoes[index].opcao6) {questoes[index].opcao6=newOption}
                        else if (!questoes[index].opcao7) {questoes[index].opcao7=newOption}
                        else if (!questoes[index].opcao8) {questoes[index].opcao8=newOption}
                        else if (!questoes[index].opcao9) {questoes[index].opcao9=newOption}
                        else if (!questoes[index].opcao10) {questoes[index].opcao10=newOption}
                    }
                }}><i className='p-1 fas fa-regular fa-pen'></i></MDBBtn>
            </div>
        }])
        for (let item of v) item.style.display = "none"
        for (let item of opcoes) item.style.display = "none"
        for (let item of excluiSalva) item.style.display = "none"
    }

    function editOpcao(id,opcao){
        var v = document.getElementsByClassName("addQuestao")
        var opcoes = document.getElementsByClassName("editOpcoes")
        var excluiSalva = document.getElementsByClassName("exclui-salva"+id)
        setInput([
            ...input,{
            id:id,
            content:<div className='my-2'>
                <MDBTextArea onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} id={"questao"+id+"novaopcao"} rows={3} label='Opcao' className='mb-2'/>
                <MDBBtn className='border border-secondary' color='light' onClick={e=>{
                    for (let item of v) item.style.display = "inline-block"
                    for (let item of opcoes) item.style.display = "inline-block"
                    for (let item of excluiSalva) item.style.display = "inline-block"
                    setInput(input.filter(a=> a.id !== id))
                    eval("questoes[questoes.map(object => object.id).indexOf(id)].opcao"+opcao+`=document.getElementById("questao"+${id}+"novaopcao").value`)
                }}><i className='p-1 fas fa-regular fa-pen'></i></MDBBtn>
            </div>
        }])
        for (let item of v) item.style.display = "none"
        for (let item of opcoes) item.style.display = "none"
        for (let item of excluiSalva) item.style.display = "none"
    }

    function handleNewQuestion(){
        novaQuestao.type===4?questoes[0]?novaQuestao.numero=questoes.at(-1).numero:novaQuestao.numero=0:questoes[0]?novaQuestao.numero=questoes.at(-1).numero+1:novaQuestao.numero=1
        setTypeQuestion(<></>)
        switch (novaQuestao.type) {
            case 1:
            case 3:
                setNewQuestion(
                    <MDBListGroupItem noBorders key={"novaQuestao"} className='rounded-3 mb-3'>
                        <div className='enunciado mt-1'>
                            <MDBInputGroup className='mb-2'>
                                <MDBBtn color='secondary' className='numQuestao'>{novaQuestao.numero}</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novaQuestaoEnunciado'} defaultValue=''/>
                            </MDBInputGroup>
                        </div>
                        <div id={"novaQuestaoOpcoes"} className='mx-2'>
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 1'><input id='option1' className='form-control' onInput={e=>{document.getElementById("option2").disabled=false}} type='text'/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 2'><input id='option2' className='form-control' onInput={e=>{document.getElementById("option3").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 3'><input id='option3' className='form-control' onInput={e=>{document.getElementById("option4").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 4'><input id='option4' className='form-control' onInput={e=>{document.getElementById("option5").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 5'><input id='option5' className='form-control' onInput={e=>{document.getElementById("option6").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 6'><input id='option6' className='form-control' onInput={e=>{document.getElementById("option7").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 7'><input id='option7' className='form-control' onInput={e=>{document.getElementById("option8").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 8'><input id='option8' className='form-control' onInput={e=>{document.getElementById("option9").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 9'><input id='option9' className='form-control' onInput={e=>{document.getElementById("option10").disabled=false}} type='text' disabled/></MDBInputGroup></div>}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} textBefore='Opção 10'><input id='option10' className='form-control' type='text' disabled/></MDBInputGroup></div>}
                        </div>
                        <div className='d-flex'>
                            <MDBBtn onClick={e=>{setNewQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                            <MDBBtn onClick={e=>{addQuestao()}}>Salvar</MDBBtn>
                        </div>
                    </MDBListGroupItem>
                )
                break;
            case 2:
                setNewQuestion(
                    <MDBListGroupItem noBorders key={"novaQuestao"} className='rounded-3 mb-3'>
                        <div className='enunciado mt-1'>
                            <MDBInputGroup className='mb-2'>
                                <MDBBtn color='secondary' className='numQuestao'>{novaQuestao.numero}</MDBBtn>
                                <input className='form-control' type='text' id={'novaQuestaoEnunciado'} defaultValue=''/>
                            </MDBInputGroup>
                        </div>
                        <MDBTextArea rows={4} label='Resposta' readOnly className='mb-2'/>
                        <div className='d-flex'>
                            <MDBBtn onClick={e=>{setNewQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                            <MDBBtn onClick={e=>{addQuestao()}}>Salvar</MDBBtn>
                        </div>
                    </MDBListGroupItem>
                )
                break;  
            case 4:
                setNewQuestion(
                    <MDBListGroupItem noBorders key={"novaQuestao"} className='rounded-3 mb-3'>
                        <MDBTextArea id='novaQuestaoEnunciado' rows={4} label='Resposta' className='mb-2'/>
                        <div className='d-flex'>
                            <MDBBtn onClick={e=>{setNewQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                            <MDBBtn onClick={e=>{addQuestao()}}>Salvar</MDBBtn>
                        </div>
                    </MDBListGroupItem>
                )
                break;   
            default:
                break;
        }
    }

    function handleNewTypeQuestion(){
        setTypeQuestion(
            <MDBListGroupItem noBorders key={"typequestion"} className='rounded-3 mb-3'>
                <div className='d-flex justify-content-around align-items-center'>
                    <div className='enunciado'>Tipo da Questão:</div>
                    <MDBRadio onClick={e=>{novaQuestao.type=3}} inline name='tipoQuestao' label='Múltipla Escolha'></MDBRadio>
                    <MDBRadio onClick={e=>{novaQuestao.type=1}} inline name='tipoQuestao' label='Caixa de seleção'></MDBRadio>
                    <MDBRadio onClick={e=>{novaQuestao.type=2}} inline name='tipoQuestao' label='Aberta'></MDBRadio>
                    <MDBRadio onClick={e=>{novaQuestao.type=4}} inline name='tipoQuestao' label='Descrição'></MDBRadio>
                </div>
                <hr className='mt-1 mb-1'></hr>
                <div className='d-flex'>
                    <MDBBtn onClick={e=>{setTypeQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                    <MDBBtn onClick={e=>{novaQuestao.type?handleNewQuestion():<></>}}>Proxima</MDBBtn>
                </div>
            </MDBListGroupItem>
        )
    }

    function handleInput(id){
        let x = input.map(object => object.id).indexOf(id)
        if (x>=0) return input[x].content 
        else return <></>
    }

    const secaoQuestoes = <main className='mt-3 principal'>
        {Title("Questões",carregaQuestoes)}

        <MDBListGroup small className='mt-3' >
            {renderizaQuestoes()}
            {typeQuestion}
            {newQuestion}
        </MDBListGroup>
        
        <MDBBtn onClick={e=>{handleNewTypeQuestion()}} color='success' className='mt-2'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
    </main>
    // Questões

    // Contatos
    function renderizaContatos(){
        return contatos?.slice((contatosPage-1)*15,((contatosPage-1)*15)+15).map(element => {
                if(element.respondido===true){
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInputGroup>
                                <MDBBtn onClick={e=>{handleClick(element)}} color='secondary' className='numQuestao'><i className="trashcan fas fa-trash-can"></i></MDBBtn>
                                <input className='form-control' type='text' defaultValue={element.email} disabled/>
                                <div role='button' onClick={e=>{sessionStorage.setItem('enviadoId',element.id);navigate('/resposta')}} color='secondary' className='numQuestao borda-direita' id={'edit'+element.id}><i className='p-2 ms-auto fas fa-solid fa-eye'></i></div>
                            </MDBInputGroup>
                            <div className='d-flex'><div className='text-danger p-1' id={'warning'+element.id} style={{display: 'none'}}>Todas as respostas desse email serão apagadas, se tiver certeza clique novamente</div><a role='button' onClick={e=>{handleClick(element,true)}} id={'cancel'+element.id} style={{display: 'none'}} className='p-1 ms-auto'>Cancelar</a></div>
                        </MDBListGroupItem>
                    )
                }else{
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInputGroup id={'send'+element.id} textAfter={<i title='Enviar formulário para este email' onClick={e=>{sendOneEmail(element.id)}} className="edit fas fa-light fa-paper-plane fa-sm"></i>}>
                                <MDBBtn onClick={e=>{showEditContato(element)}} color='secondary' className='numQuestao'>@</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'contatoEmail'+element.id} defaultValue={element.email} disabled onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].email=e.target.value}}/>
                                <div role='button' onClick={e=>{editaContato(element.id)}} color='secondary' className='numQuestao borda-direita' id={'edit'+element.id} style={{display: 'none'}}><i className='p-2 ms-auto fas fa-regular fa-pen'></i></div>
                                <div role='button' onClick={e=>{excluiContato(element.id)}} className='numQuestao borda-direita' id={'erase'+element.id} style={{display: 'none'}}><i className='p-2 ms-auto trashcan fas fa-trash-can'></i></div>
                            </MDBInputGroup>
                            <MDBContainer fluid className='mt-2' id={'contatoForm'+element.id} style={{display: 'none'}}>
                                <div className='enunciado row'>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoContatoForm px-2'>Nome</MDBBtn>
                                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} defaultValue={element.nome} onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].nome=e.target.value}} className='form-control' type='text'/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoContatoForm px-2'>Matrícula</MDBBtn>
                                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} defaultValue={element.matricula} onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].matricula=e.target.value}} className='form-control' type='text'/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].telefone1=e.target.value}} className='novoContatoForm px-2'>Telefone 1</MDBBtn>
                                            <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'contatoTelefone1'+element.id}/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].telefone2=e.target.value}} className='novoContatoForm px-2'>Telefone 2</MDBBtn>
                                            <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'contatoTelefone2'+element.id}/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoContatoForm px-2'>Curso</MDBBtn>
                                            <select defaultValue={element.curso} onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].curso=e.target.value}} className='selectCurso novoContatoCurso'>
                                                {cursos?.listaCursos?.map(item => {
                                                    return <option key={element.id+"opcaocurso"+item.id} value={item.curso}>{item.curso}</option>
                                                })}
                                            </select>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoContatoForm px-2'>Modalidade do Curso</MDBBtn>
                                            <select defaultValue={element.tipoDeCurso} onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].tipoDeCurso=e.target.value}} className='selectCurso novoContatoTipoCurso'>
                                                {cursos?.listaTipoCursos?.map(item => {
                                                    return <option key={element.id+"opcaotipo"+item.id} value={item.tipoCurso}>{item.tipoCurso}</option>
                                                })}
                                            </select>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoContatoForm px-2'>CPF</MDBBtn>
                                            <InputMask mask='999.999.999-99'  className='form-control' type='text' defaultValue={element.cpf} onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].cpf=e.target.value}} />
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoContatoForm px-2'>Sexo</MDBBtn>
                                            <select  defaultValue={element.sexo} onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].sexo=e.target.value}} className='selectCurso novoContatoSexo'>
                                                <option value="M">Masculino</option>
                                                <option value="F">Feminino</option>
                                                <option value="N">Não informar</option>
                                            </select>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-12 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoContatoForm px-2'>Data de colação</MDBBtn>
                                            <input type="date" className='selectCurso' onChange={e=>{contatos[contatos.map(object => object.id).indexOf(element.id)].dataColacao=e.target.value}} id={'contatoData'+element.id}/>
                                        </MDBInputGroup>
                                    </div>
                                </div>
                            </MDBContainer>
                        </MDBListGroupItem>
                    )
                }
            })
    }

    async function addContato(){
        let novocontato ={}
        novocontato.email=document.getElementById("novoContatoEmail").value
        novocontato.nome=document.getElementById("novoContatoNome").value
        novocontato.matricula=document.getElementById("novoContatoMatricula").value
        novocontato.telefone2=document.getElementById("novoContatoTelefone2").value
        novocontato.telefone1=document.getElementById("novoContatoTelefone1").value
        novocontato.curso=document.getElementById("novoContatoCurso").value
        novocontato.tipoDeCurso=document.getElementById("novoContatoTipoCurso").value
        novocontato.cpf=document.getElementById("novoContatoCpf").value
        novocontato.sexo=document.getElementById("novoContatoSexo").value
        novocontato.dataColacao=document.getElementById("novoContatoData").value
        if(novocontato.email){
            document.getElementById("novoContatoEmail").classList.remove("is-invalid")
            if (novocontato.telefone1 && !/\(\d\d\)\s\d\d\d\d\d\-\d\d\d\d/.test(novocontato.telefone1)) {
                document.getElementById("novoContatoTelefone1").classList.add("is-invalid")
                return
            }else{document.getElementById("novoContatoTelefone1").classList.remove("is-invalid")}
            if (novocontato.telefone2 && !/\(\d\d\)\s\d\d\d\d\d\-\d\d\d\d/.test(novocontato.telefone2)) {
                document.getElementById("novoContatoTelefone2").classList.add("is-invalid")
                return
            }else{document.getElementById("novoContatoTelefone2").classList.remove("is-invalid")}
            if (novocontato.cpf && !/\d\d\d\.\d\d\d\.\d\d\d\-\d\d/.test(novocontato.cpf)) {
                document.getElementById("novoContatoCpf").classList.add("is-invalid")
                return
            }else{document.getElementById("novoContatoCpf").classList.remove("is-invalid")}
            if (!novocontato.dataColacao) novocontato.dataColacao=null
            novocontato.respondido=false
            await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados",novocontato,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then(resposta=>{
                novocontato.id=resposta.data
                setContatos([
                    ...contatos,
                    novocontato
                ])
                setNewContato(<></>)
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else{ console.log(error)}
            })
        }else{
            document.getElementById("novoContatoEmail").classList.add("is-invalid")
        }
    }

    async function editaContato(id){
        let dados=contatos[contatos.map(object => object.id).indexOf(id)]
        await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+id,dados,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(resposta =>{
            document.getElementById("contatoEmail"+id).disabled=true
            document.getElementById("edit"+id).style.display='none'
            document.getElementById("contatoForm"+id).style.display='none'
            let erase=document.getElementById("erase"+id)
            erase.style.display==='none'?erase.style.display='block':erase.style.display='none'
            let send=document.getElementById("send"+id)
            if(send.lastChild.nodeName=='SPAN'){
                send.removeChild(send.lastChild)
            }else{
                let spanBlock = document.createElement('span')
                spanBlock.className = 'input-group-text'
                let sendSymbol = document.createElement('i')
                sendSymbol.title ='Enviar formulário para este email'
                sendSymbol.onclick = function (e) {sendOneEmail(id)}
                sendSymbol.className = 'edit fas fa-light fa-paper-plane fa-sm'
                send.appendChild(spanBlock)
                send.lastChild.appendChild(sendSymbol)
            }
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else if(error.response.status===402){
                setRespondidoDerivado(true)
            }
            else{ console.log(error)}
        })
    } 

    async function excluiContato(id){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+id+"?deleta=true",{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{setContatos(contatos.filter(a=> a.id !== id))})
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
    }

    async function excluiRespostas(elemento){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+elemento.id+"?deleta=false",{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            elemento.respondido=0
            setContatos(contatos.filter(a=> a.id !== elemento.id))
            setContatos([
                ...contatos
            ])
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
    }

    function handleNewContato(){
        return(
            setNewContato(
                <MDBListGroupItem noBorders className='rounded-3 mt-3 mb-3'>
                    <MDBContainer fluid className='mt-2'>
                    <div className='enunciado row'>
                        <div className="col-12 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='numQuestao'>@</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoContatoEmail'}/>
                            </MDBInputGroup>
                        </div> {/* Email */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Nome</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoContatoNome'}/>
                            </MDBInputGroup>
                        </div> {/* Nome */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Matrícula</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoContatoMatricula'}/>
                            </MDBInputGroup>
                        </div> {/* Matrícula */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Telefone 1</MDBBtn>
                                <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'novoContatoTelefone1'}/>
                            </MDBInputGroup>
                        </div> {/* Tel1 */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Telefone 2</MDBBtn>
                                <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'novoContatoTelefone2'}/>
                            </MDBInputGroup>
                        </div> {/* Tel2 */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Curso</MDBBtn>
                                <select id="novoContatoCurso" className='selectCurso novoContatoCurso'>
                                    {cursos?.listaCursos?.map(item => {
                                        return <option key={"newopcaocurso"+item.id} value={item.curso}>{item.curso}</option>
                                    })}
                                </select>
                            </MDBInputGroup>
                        </div> {/* Curso */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Modalidade do Curso</MDBBtn>
                                <select id="novoContatoTipoCurso" className='selectCurso novoContatoTipoCurso'>
                                    {cursos?.listaTipoCursos?.map(item => {
                                        return <option key={"newopcaotipo"+item.id} value={item.tipoCurso}>{item.tipoCurso}</option>
                                    })}
                                </select>
                            </MDBInputGroup>
                        </div> {/* Modalidade */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>CPF</MDBBtn>
                                <InputMask mask='999.999.999-99'  className='form-control' type='text' id={'novoContatoCpf'}/>
                            </MDBInputGroup>
                        </div> {/* CPF */}
                        <div className="col-md-6 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Sexo</MDBBtn>
                                <select id='novoContatoSexo' className='selectCurso novoContatoSexo'>
                                    <option value="M">Masculino</option>
                                    <option value="F">Feminino</option>
                                    <option value="N">Não informar</option>
                                </select>
                            </MDBInputGroup>
                        </div> {/* Sexo */}
                        <div className="col-md-12 pt-md-2 pt-sm-1">
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='novoContatoForm px-2'>Data de colação</MDBBtn>
                                <input className='selectCurso' type="date" id='novoContatoData'/>
                            </MDBInputGroup>
                        </div> {/* Data Colação */}
                    </div>
                    <div className='d-flex'>
                        <MDBBtn onClick={e=>{setNewContato(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                        <MDBBtn onClick={e=>{addContato()}}>Salvar</MDBBtn>
                    </div>
                    </MDBContainer>
                </MDBListGroupItem>
            )
        )
    } 

    function showEditContato(element){
        let v=document.getElementById("contatoEmail"+element.id)
        v.disabled=!v.disabled
        let p=document.getElementById("edit"+element.id)
        p.style.display==='none'?p.style.display='block':p.style.display='none'
        let erase=document.getElementById("erase"+element.id)
        erase.style.display==='none'?erase.style.display='block':erase.style.display='none'
        let send=document.getElementById("send"+element.id)
        if(send.lastChild.nodeName=='SPAN'){
            send.removeChild(send.lastChild)
        }else{
            let spanBlock = document.createElement('span')
            spanBlock.className = 'input-group-text'
            let sendSymbol = document.createElement('i')
            sendSymbol.title ='Enviar formulário para este email'
            sendSymbol.onclick = function (e) {sendOneEmail(element.id)}
            sendSymbol.className = 'edit fas fa-light fa-paper-plane fa-sm'
            send.appendChild(spanBlock)
            send.lastChild.appendChild(sendSymbol)
        }
        let x=document.getElementById("contatoForm"+element.id)
        x.style.display==='none'?x.style.display='block':x.style.display='none'
        element.dataColacao?document.getElementById("contatoData"+element.id).value=element.dataColacao.substr(0,10):<></>;
        document.getElementById("contatoTelefone1"+element.id).value=element.telefone1
        document.getElementById("contatoTelefone2"+element.id).value=element.telefone2
    }

    function handleClick(elemento, cancel){
        if(click.find((element)=>element?.id === elemento.id)){
            setClick(click.filter(a=> a.id !== elemento.id))
            document.getElementById('warning'+elemento.id).style.display='none'
            document.getElementById('cancel'+elemento.id).style.display='none'
            if(!cancel) excluiRespostas(elemento)
        }else{
            document.getElementById('warning'+elemento.id).style.display='block'
            document.getElementById('cancel'+elemento.id).style.display='block'
            setClick([...click,{id:elemento.id}])
        }
    }

    async function sendEmails(){
        await axios.post(baseUrl+"/enviar",{UserId: sessionStorage.getItem("userId"),FormId: sessionStorage.getItem("formId")},{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else if(error.response.status===402){alert("Usuário não possui uma senha de aplicativo de gmail. Acesse a página do usuário para saber mais.")}
            else{ console.log(error)}
        })
    }

    async function sendOneEmail(id){
        await axios.post(baseUrl+"/enviarUnico",{UserId: sessionStorage.getItem("userId"),FormId: sessionStorage.getItem("formId"),EmailId:id},{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else if(error.response.status===402){alert("Usuário não possui uma senha de aplicativo de gmail. Acesse a página do usuário para saber mais.")}
            else{ console.log(error)}
        })
    }

    async function importEmails(){
        let selectedFiles = document.getElementById('formFile').files;
        if (selectedFiles.length>0) { 
            document.getElementById('cancelmodalimports').disabled=true
            var i,f;
            for (i = 0, f = selectedFiles[i]; i != selectedFiles.length; ++i) {
                let reader = new FileReader();
                reader.readAsArrayBuffer(f);
                reader.onload = (e) => {
                    let binarystr = new Uint8Array(e.target.result);
                    let wb = XLSX.read(binarystr, {cellDates:true});
                    let wsname = wb.SheetNames[0];
                    let data = XLSX.utils.sheet_to_json(wb.Sheets[wsname]);
                    let json = JSON.stringify(data)
                    json = json.replace(/":\s*[^"0-9.]*([0-9.Z]+)/g, '":"$1"');
                    json = JSON.parse(json)
                    axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/cefetModel",json,{
                        headers: {
                            'Authorization': 'bearer ' + sessionStorage.getItem("token")
                        }
                    })
                    .then(responsta=>{
                        document.getElementById('cancelmodalimports').disabled=false
                        carregaEnvios()
                        setImportModal(false)
                    })
                    .catch((error) => {
                        if (error.response.status===401) {
                            navigate('/login')
                            console.warn("Faça o login")
                        }else{ console.log(error)}
                    })
                }
            }
        }else{
            document.getElementById('formFile').classList.add("is-invalid")
        }
    }

    const secaoContatos = <main className='mt-3 principal'> 
        {Title("Contatos",carregaEnvios)}

        {/* Barra de busca */}
        <MDBContainer fluid className='mt-3 p-3 rounded-3 bg-light'>
            <MDBRadio name='buscaContato' label='Buscar por email' onClick={e=>{setNomeEmail(true)}} inline />
            <MDBRadio name='buscaContato' label='Buscar por nome' onClick={e=>{setNomeEmail(false)}} inline />
            <MDBInput 
                className='mt-1'
                type="text"
                label="Busque aqui"
                onChange={searchChange} />
        </MDBContainer>

        {/* Emails */}
        <MDBListGroup small className='mt-3' >
            {renderizaContatos()}
        </MDBListGroup>

        {/* Novo Contato Form */}
        {newContato}

        {/* Botões de adição e envio de contatos */}
        <div className='d-flex mt-2'>
            <MDBBtn onClick={e=>{handleNewContato()}} color='success'><i title='Adicionar novo email a enviar' className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
            <MDBBtn onClick={e=>{setImportModal(true)}} color='secondary' className='ms-auto mx-2'><i title='Importar emails de modelo CEFET-MG' className="edit fas fa-regular fa-file-import"></i></MDBBtn>
            <MDBBtn onClick={e=>{sendEmails()}} color='secondary'><i title='Enviar à todos os emails da lista' className="edit fas fa-light fa-paper-plane"></i></MDBBtn>
        </div>
        
        {/* Modal para adicionar contatos no modelo Cefet */}
        <MDBModal staticBackdrop tabIndex='-1' show={importModal} setShow={setImportModal}>
            <MDBModalDialog centered>
                <MDBModalContent>
                    <MDBModalHeader className='py-2'>
                        Importar envios de arquivo (csv, xsl, xslx)
                    </MDBModalHeader>
                    <MDBModalBody>
                        <MDBFile label='Insira seu arquivo' size='lg' id='formFile' />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn id="cancelmodalimports" color='secondary' onClick={e=>{setImportModal(false)}}> Cancelar </MDBBtn>
                        <MDBBtn onClick={e=>{importEmails()}}>Importar</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>

        {/* Modal de alerta de resposta presente em outro form */}
        <MDBModal tabIndex='-1' show={respondidoDerivado} setShow={setRespondidoDerivado}>
            <MDBModalDialog centered>
                <MDBModalContent>
                    <MDBModalHeader className='py-2'>
                        Formulário derivado possui resposta, exclua primeiro a resposta dele.
                    </MDBModalHeader>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={e=>{setRespondidoDerivado(false)}}> Fechar </MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>

        {/* Pagination */}
        {contatos.length>0
        ?<div className="d-flex justify-content-center mt-2">
            {contatosPage<=3?
            <MDBListGroup horizontal>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(1)}}>1</MDBListGroupItem>
                {Math.ceil(contatos.length/15)>1?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(2)}}>2</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)>2?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(3)}}>3</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)>3?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(4)}}>4</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)>4?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(5)}}>5</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)>5?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15))}}>...</MDBListGroupItem>:<></>}
            </MDBListGroup>
            :contatosPage>((Math.ceil(contatos.length/15))-3)?
            <MDBListGroup horizontal>
                {Math.ceil(contatos.length/15)-5>0?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(1)}} >...</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)-4>0?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-4)}}>{Math.ceil(contatos.length/15)-4}</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)-3>0?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-3)}}>{Math.ceil(contatos.length/15)-3}</MDBListGroupItem>:<></>}
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-2)}}>{Math.ceil(contatos.length/15)-2}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-1)}}>{Math.ceil(contatos.length/15)-1}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15))}}>{Math.ceil(contatos.length/15)}</MDBListGroupItem>
            </MDBListGroup>
            :contatosPage>3?
            <MDBListGroup horizontal>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(1)}}>...</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage-2)}}>{contatosPage-2}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage-1)}}>{contatosPage-1}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage)}}>{contatosPage}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage+1)}}>{contatosPage+1}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage+2)}}>{contatosPage+2}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15))}}>...</MDBListGroupItem>
            </MDBListGroup>
            :<></>}
        </div>:<></>}
    </main>
    // Contatos

    // Secao Respostas
    function renderizaRepostas(){
        return respostas?.map(element => {
            return(
                <MDBListGroupItem key={element.id} className='mt-3 rounded-3'>
                    <div className='enunciado d-flex'>{element.numero}) {element.enunciado}<div className='ms-auto'>{element.type===1?<MDBRadio disabled defaultChecked={true} className='mt-1' value='' inline/>:<MDBCheckbox disabled defaultChecked={true} className='mt-1' value='' inline/>}</div></div>
                    <hr className='mt-0 mb-2'></hr>
                    <div id={"resposta"+element.id} className='mx-2'>
                        {makeBar(element,element.type)}
                    </div>
                </MDBListGroupItem>
            )
        })
    }

    function makeBar(element,tipo){
        let sum = element.resposta.reduce((partialSum, a) => partialSum + a.quantidade, 0);
        return element.resposta?.map((item,index)=>{
            let parcial=Math.trunc((item.quantidade/sum)*100)
            if(item.quantidade){
                return(
                    <div className='d-flex my-1' key={'resposta'+element.id+index}>
                        <div className='px-2 py-1 borda-esquerda porcentagem'>{String(parcial).padStart(2, '0')}%</div>
                        <MDBProgressBar className='borda-direita porcentagem' striped bgColor='info' width={`${parcial}`} valuemin={0} valuemax={100}>{item.texto}</MDBProgressBar>
                    </div>
                )
            }
        })
    }

    const secaoRespostas = <main className='mt-3 principal'> 
        {Title("Repostas",carregaRespostas)}
        <MDBListGroup small className='mt-3' >
            {renderizaRepostas()}
        </MDBListGroup>
    </main>
    // Secao Respostas

    function ShowSidebar(id){
        var v = document.getElementById(id);
        if (appearing) {
            v.classList.remove("d-block")
            setAppearing(false)
        }else{
            v.classList.add("d-block")
            setAppearing(true)
        }
    }  

    function limit(element)
    {
        var max_chars = 250;
            
        if(element.value.length > max_chars) {
            element.value = element.value.substr(0, max_chars);
        }
    }

    function makeSecao() {
        if(secao===1){
            return(UserSection(main,secaoQuestoes))
        }else if(secao===2){
            return(UserSection(main,secaoContatos))
        }else if(secao===3){
            return(UserSection(main,secaoRespostas))
        }
    }

    return(
        <section>
            {Sidebar(setMain,'questoes',setsecao,setInput)}
            {Navbar(ShowSidebar)}

            {makeSecao()}
        </section>
    )
}