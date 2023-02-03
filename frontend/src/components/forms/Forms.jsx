import React, {useEffect,useState}from 'react'
import './Forms.css'
import axios from "axios";
import baseUrl from "../../config/api";
import {useNavigate} from 'react-router-dom';
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from '../user/UserSection'
import {
    MDBInputGroup, MDBTextArea, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBInput, MDBProgressBar} from 'mdb-react-ui-kit';

export default function Forms(){
    const navigate = useNavigate();

    const [count, setCount] = useState(0);
    const [click, setClick] = useState([{id:''}]);
    
    const [appearing, setAppearing] = useState(false);
    const [respostas, setRespostas] = useState(null);
    const [questoes, setQuestoes] = useState(null);
    const [enviados, setEnviados] = useState(null);
    const [input, setInput] = useState([{content:<></>}]);
    const [main, setMain] = useState(1)

    const [newEnviado, setNewEnviado] = useState(<></>);
    const [newQuestion, setNewQuestion] = useState(<></>);
    const [typeQuestion, setTypeQuestion] = useState(<></>);
    const [novaQuestao, setNovaQuestao] = useState({});

    const [secao, setsecao] = useState(1)

    useEffect(() => {
        async function validate(){
            await axios.post(baseUrl+"/validateToken",{
                "token": sessionStorage.getItem("token")
            })
            .then((response) => {
                if(!response){
                    navigate('/login')
                    console.warn("Faça o login")
                }
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else{
                    console.log(error)
                }
            })
        }
        async function carregaQuestoes(){
            let reponse = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados",{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .catch((error) => {console.log(error)})
            setEnviados(reponse.data)
            let res = await axios.get(baseUrl+"/"+sessionStorage.getItem("formId"),{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .catch((error) => {console.log(error)})
            res.data.sort((a,b) => a.numero - b.numero);
            setQuestoes(res.data)
            let respon = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/respostas",{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .catch((error) => {console.log(error)})
            setRespostas(respon.data)
        }
        if (sessionStorage.getItem("token")){
            validate()
            carregaQuestoes()
        }
        else{
            console.warn("Faça o login")
            navigate('/login')
        }

    }, []);

    // Questões
    function renderizaQuestoes(){
        return questoes?.map(element => {
            switch (element.type) {
                case 1:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn onClick={e=>{
                                        let v=document.getElementById("questao"+element.id)
                                        v.disabled=!v.disabled
                                        var excuiSalva = document.getElementsByClassName("exclui-salva"+element.id)
                                        for (let item of excuiSalva) item.style.display = "inline-block"
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
                case 2:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn onClick={e=>{
                                        let v=document.getElementById("questao"+element.id)
                                        v.disabled=!v.disabled
                                        var excuiSalva = document.getElementsByClassName("exclui-salva"+element.id)
                                        for (let item of excuiSalva) item.style.display = "inline-block"
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
                case 3:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn onClick={e=>{
                                        let v=document.getElementById("questao"+element.id)
                                        v.disabled=!v.disabled
                                        var excuiSalva = document.getElementsByClassName("exclui-salva"+element.id)
                                        for (let item of excuiSalva) item.style.display = "inline-block"
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
                                {element.opcao10?<div className='d-flex'><MDBCheckbox name='checkNoLabel' value='' inline/>{element.opcao10}<i role='button' onClick={e=>{editOpcao(element.id,"10")}} className='edit editOpcoes mb-2 ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<i role='button' className="addQuestao mx-1 edit fas fa-regular fa-plus" onClick={e=>{addOpcao(element.id)}}></i>}
                                {handleInput(element.id)}
                            </div>
                            <div className='d-flex'>
                                <MDBBtn onClick={e=>{excluiQuestao(element)}} color='danger' className={'ms-auto me-2 exclui-salva'+element.id} style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn onClick={e=>{editaQuestao(element.id)}} className={'exclui-salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                case 4:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled/>
                                </MDBInputGroup>
                            </div>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'>{element.opcao1}</div>:<></>}
                                {element.opcao2?<div className='d-flex'>{element.opcao2}</div>:<></>}
                                {element.opcao3?<div className='d-flex'>{element.opcao3}</div>:<></>}
                                {element.opcao4?<div className='d-flex'>{element.opcao4}</div>:<></>}
                                {element.opcao5?<div className='d-flex'>{element.opcao5}</div>:<></>}
                                {element.opcao6?<div className='d-flex'>{element.opcao6}</div>:<></>}
                                {element.opcao7?<div className='d-flex'>{element.opcao7}</div>:<></>}
                                {element.opcao8?<div className='d-flex'>{element.opcao8}</div>:<></>}
                                {element.opcao9?<div className='d-flex'>{element.opcao9}</div>:<></>}
                                {element.opcao10?<div className='d-flex'>{element.opcao10}</div>:<></>}
                            </div>
                            <div className='d-flex'>
                                <div color='danger' className='ms-auto me-2'>Questões poderão ser editadas após recarregar</div>
                            </div>
                        </MDBListGroupItem>
                    )
                case 5:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className='rounded-3 mb-3'>
                            <div className='enunciado mt-1'>
                                <MDBInputGroup className='mb-2'>
                                    <MDBBtn color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                    <input className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled/>
                                </MDBInputGroup>
                            </div>
                            <MDBTextArea rows={4} label='Resposta' readOnly className='mb-2'/>
                            <div className='d-flex'>
                                <div color='danger' className='ms-auto me-2'>Questões poderão ser editadas após recarregar</div>
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
            .catch((error) => {console.log(error.request)})
            setCount(count+1)
            novaQuestao.id="new"+count
            if(novaQuestao.type===1||novaQuestao.type===3) novaQuestao.type=4
            else novaQuestao.type=5
            setQuestoes([
                ...questoes,
                novaQuestao
            ])
            setNovaQuestao({})
            setNewQuestion(<></>)
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
        .catch((error) => {console.log(error.request)})
        document.getElementById("questao"+id).disabled=true
        var excuiSalva = document.getElementsByClassName("exclui-salva"+id)
        for (let item of excuiSalva) item.style.display = "none"
    }

    async function excluiQuestao(element){
        console.log(element)
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
        .catch((error) => {console.log(error.request)})
    }

    function addOpcao(id){
        var v = document.getElementsByClassName("addQuestao")
        var opcoes = document.getElementsByClassName("editOpcoes")
        var excuiSalva = document.getElementsByClassName("exclui-salva"+id)
        setInput([
            ...input,{
            id:id,
            content: <div className='my-2'>
                <MDBTextArea onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} id={"questao"+id+"novaopcao"} rows={3} label='Opcao' className='mb-2'/>
                <MDBBtn className='border border-secondary' color='light' onClick={e=>{
                    for (let item of v) item.style.display = "inline-block"
                    for (let item of opcoes) item.style.display = "inline-block"
                    for (let item of excuiSalva) item.style.display = "inline-block"
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
        for (let item of excuiSalva) item.style.display = "none"
    }

    function editOpcao(id,opcao){
        var v = document.getElementsByClassName("addQuestao")
        var opcoes = document.getElementsByClassName("editOpcoes")
        var excuiSalva = document.getElementsByClassName("exclui-salva"+id)
        setInput([
            ...input,{
            id:id,
            content:<div className='my-2'>
                <MDBTextArea onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} id={"questao"+id+"novaopcao"} rows={3} label='Opcao' className='mb-2'/>
                <MDBBtn className='border border-secondary' color='light' onClick={e=>{
                    for (let item of v) item.style.display = "inline-block"
                    for (let item of opcoes) item.style.display = "inline-block"
                    for (let item of excuiSalva) item.style.display = "inline-block"
                    setInput(input.filter(a=> a.id !== id))
                    eval("questoes[questoes.map(object => object.id).indexOf(id)].opcao"+opcao+`=document.getElementById("questao"+${id}+"novaopcao").value`)
                }}><i className='p-1 fas fa-regular fa-pen'></i></MDBBtn>
            </div>
        }])
        for (let item of v) item.style.display = "none"
        for (let item of opcoes) item.style.display = "none"
        for (let item of excuiSalva) item.style.display = "none"
    }

    function handleNewQuestion(){
        console.log()
        questoes[0]?novaQuestao.numero=questoes.at(-1).numero+1:novaQuestao.numero=1
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
                    <MDBRadio onClick={e=>{novaQuestao.type=1}} inline name='tipoQuestao' label='Única Escolha'></MDBRadio>
                    <MDBRadio onClick={e=>{novaQuestao.type=2}} inline name='tipoQuestao' label='Aberta'></MDBRadio>
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
        {Title("Questões")}

        <MDBListGroup small className='mt-3' >
            {renderizaQuestoes()}
            {typeQuestion}
            {newQuestion}
        </MDBListGroup>
        
        <MDBBtn onClick={e=>{handleNewTypeQuestion()}} color='success' className='mt-2'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
    </main>
    // Questões

    // Enviados
    function renderizaEnviados(){
        return enviados?.map(element => {
            if (element.novo===true) {
                return(
                    <MDBListGroupItem className='py-2 px-2' key={element.id}>
                        <MDBInput onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} label='Emails poderão ser editados após recarregar' className='form-control' type='text' id={'enviado'+element.id} value={element.email} disabled/>
                    </MDBListGroupItem>
                )
            }else if(element.respondido===1){
                return(
                    <MDBListGroupItem className='py-2 px-2' key={element.id}>
                        <MDBInputGroup>
                            <MDBBtn onClick={e=>{handleClick(element)}} color='secondary' className='numQuestao'><i className="trashcan fas fa-trash-can"></i></MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'enviado'+element.id} defaultValue={element.email} disabled/>
                            <div role='button' onClick={e=>{sessionStorage.setItem('enviadoId',element.id);navigate('/resposta')}} color='secondary' className='numQuestao borda-direita' id={'edit'+element.id}><i className='p-2 ms-auto fas fa-solid fa-eye'></i></div>
                        </MDBInputGroup>
                        <div className='d-flex'><div className='text-danger p-1' id={'warning'+element.id} style={{display: 'none'}}>Todas as respostas desse email serão apagadas, se tiver certeza clique novamente</div><a role='button' onClick={e=>{handleClick(element.id,true)}} id={'cancel'+element.id} style={{display: 'none'}} className='p-1 ms-auto'>Cancelar</a></div>
                    </MDBListGroupItem>
                )
            }else{
                return(
                    <MDBListGroupItem className='py-2 px-2' key={element.id}>
                        <MDBInputGroup>
                            <MDBBtn onClick={e=>{
                                let v=document.getElementById("enviado"+element.id)
                                v.disabled=!v.disabled
                                let p=document.getElementById("edit"+element.id)
                                p.style.display==='none'?p.style.display='block':p.style.display='none'
                                let erase=document.getElementById("erase"+element.id)
                                erase.style.display==='none'?erase.style.display='block':erase.style.display='none'
                            }} color='secondary' className='numQuestao'>@</MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'enviado'+element.id} defaultValue={element.email} disabled onChange={e=>{enviados[enviados.map(object => object.id).indexOf(element.id)].email=e.target.value}}/>
                            <div role='button' onClick={e=>{editaEnviado(element.id)}} color='secondary' className='numQuestao borda-direita' id={'edit'+element.id} style={{display: 'none'}}><i className='p-2 ms-auto fas fa-regular fa-pen'></i></div>
                            <div role='button' onClick={e=>{excluiEnviado(element.id)}} className='numQuestao borda-direita' id={'erase'+element.id} style={{display: 'none'}}><i className='p-2 ms-auto trashcan fas fa-trash-can'></i></div>
                        </MDBInputGroup>
                    </MDBListGroupItem>
                )
            }
        })
    }

    async function addEnviado(){
        let novoenviado ={}
        novoenviado.email=document.getElementById("novoEnviadoEmail").value
        if(novoenviado.email){
            novoenviado.respondido=0
            await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados",novoenviado,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .catch((error) => {console.log(error.request)})
            setCount(count+1)
            novoenviado.novo=true
            novoenviado.id="new"+count
            setEnviados([
                ...enviados,
                novoenviado
            ])
            setNewEnviado(<></>)
        }else{
            document.getElementById("novoEnviadoEmail").classList.add("is-invalid")
        }
    }

    async function editaEnviado(id){
        let dados=enviados[enviados.map(object => object.id).indexOf(id)]
        console.log(dados)
        await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+id,dados,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {console.log(error.request)})
        document.getElementById("enviado"+id).disabled=true
        document.getElementById("edit"+id).style.display='none'
    } 

    async function excluiEnviado(id){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+id+"?deleta=true",{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{setEnviados(enviados.filter(a=> a.id !== id))})
        .catch((error) => {console.log(error.request)})
    }

    async function excluiRespostas(elemento){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+elemento.id+"?deleta=false",{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            elemento.respondido=0
            setEnviados(enviados.filter(a=> a.id !== elemento.id))
            setEnviados([
                ...enviados
            ])
        })
        .catch((error) => {console.log(error.request)})
    }

    function handleNewEnviado(){
        return(
            setNewEnviado(
                <MDBListGroupItem noBorders key={"novoEnviado"} className='rounded-3 mt-3 mb-3'>
                    <div className='enunciado mt-1'>
                        <MDBInputGroup className='mb-2'>
                            <MDBBtn color='secondary' className='numQuestao'>@</MDBBtn>
                            <input className='form-control' type='text' id={'novoEnviadoEmail'}/>
                        </MDBInputGroup>
                    </div>
                    <div className='d-flex'>
                        <MDBBtn onClick={e=>{setNewEnviado(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                        <MDBBtn onClick={e=>{addEnviado()}}>Salvar</MDBBtn>
                    </div>
                </MDBListGroupItem>
            )
        )
    } 

    function handleClick(elemento, cancel){
        if(click.find((element)=>element?.id === elemento.id)){
            setClick(click.filter(a=> a.id !== elemento.id))
            document.getElementById('warning'+elemento.id).style.display='none'
            document.getElementById('cancel'+elemento.id).style.display='none'
            if(!cancel) excluiRespostas(elemento)
        }else{
            console.log(click)
            document.getElementById('warning'+elemento.id).style.display='block'
            document.getElementById('cancel'+elemento.id).style.display='block'
            setClick([...click,{id:elemento.id}])
        }
    }

    async function sendEmails(){
        let corpo ={}
        corpo.formId=+sessionStorage.getItem("formId")
        corpo.userId=+sessionStorage.getItem("userId")
        console.log(corpo)
        await axios.post(baseUrl+"/enviar",corpo,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
    }

    const secaoEnviados = <main className='mt-3 principal'> 
        {Title("Enviados")}
        <MDBListGroup small className='mt-3' >
            {renderizaEnviados()}
        </MDBListGroup>
        {newEnviado}
        <div className='d-flex mt-2'>
            <MDBBtn onClick={e=>{handleNewEnviado()}} color='success'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
            <MDBBtn onClick={e=>{sendEmails()}} color='secondary' className='ms-auto'><i className="edit fas fa-light fa-paper-plane"></i></MDBBtn>
        </div>
    </main>
    // Enviados

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
        {Title("Repostas")}
        <MDBListGroup small className='mt-3' >
            {renderizaRepostas()}
        </MDBListGroup>
    </main>
    // Secao Respostas

    function updateField(id){
        var v = document.getElementById(id);
        if (appearing) {
            v.classList.remove("d-block")
            setAppearing(false)
        }else{
            v.classList.add("d-block")
            setAppearing(true)
        }
    }  

    function makeSecao() {
        if(secao===1){
            return(UserSection(main,secaoQuestoes))
        }else if(secao===2){
            return(UserSection(main,secaoEnviados))
        }else if(secao===3){
            return(UserSection(main,secaoRespostas))
        }
    }

    function limit(element)
    {
        var max_chars = 250;
            
        if(element.value.length > max_chars) {
            element.value = element.value.substr(0, max_chars);
        }
    }

    return(
        <section>
            {Sidebar(setMain,'questoes',setsecao,setInput)}
            {Navbar(updateField)}

            {makeSecao()}
        </section>
    )
}