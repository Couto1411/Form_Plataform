import React, {useEffect,useState}from 'react'
import axios from "axios";
import { limit, RemoveSessao } from '../../config/utils';
import baseUrl from "../../config/api";
import {
    MDBInputGroup, MDBTextArea, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn} from 'mdb-react-ui-kit';


export default function QuestoesDerivadas({navigate,questao}){
    
    // Modifia visibilidade da area de nova questao - 1 parte tipo questao
    const [typeQuestion, setTypeQuestion] = useState(<></>);
    // Modifia visibilidade da area de nova questao - 2 parte enunciado e opcao da questao 
    const [newQuestion, setNewQuestion] = useState(<></>);

    // Regula novas opcões
    const [input, setInput] = useState({content:<></>});
    // Modifia visibilidade da area de nova questao - 1 parte tipo questao
    const [questoes, setQuestoes] = useState([]);
    // Auxilia no processo de adicao da questao na pagina
    const [novaQuestao, setNovaQuestao] = useState({});

    const opcoes = [1,2,3,4,5,6,7,8,9,10]


    useEffect(() => {
        if (sessionStorage.getItem("token")){
            questao.derivadas.sort((a,b)=>a.numero-b.numero)
            setQuestoes(questao.derivadas)
        }
        else RemoveSessao(navigate)
    }, [navigate,questao]);

    function renderizaQuestoes(opcao,cor){
        return questoes.filter(e=>e.derivadaDeOpcao===opcao)?.map(element => {
            switch (element.type) {
                // Radiobox
                case 1:
                    return(
                        <MDBListGroupItem className={cor} key={element.id}>
                            <MDBInputGroup className='mb-2 mt-1'>
                                <MDBBtn outline color='dark' onClick={e=>{toggleShowExcluiSalva(element.id)}} className='numQuestao'>{questao.numero+'.'+element.numero}</MDBBtn>
                                <textarea id={'questao'+element.id} className='form-control textAreaEnunciado'
                                    defaultValue={element.enunciado} disabled
                                    onChange={e=>{limit(e.target);questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}/>
                            </MDBInputGroup>
                            <div className='mx-2'>
                                {element.opcao1? <div className='d-flex'><MDBRadio labelClass={element.id+"-1"}  label={element.opcao1}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,1)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao2? <div className='d-flex'><MDBRadio labelClass={element.id+"-2"}  label={element.opcao2}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,2)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao3? <div className='d-flex'><MDBRadio labelClass={element.id+"-3"}  label={element.opcao3}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,3)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao4? <div className='d-flex'><MDBRadio labelClass={element.id+"-4"}  label={element.opcao4}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,4)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao5? <div className='d-flex'><MDBRadio labelClass={element.id+"-5"}  label={element.opcao5}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,5)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao6? <div className='d-flex'><MDBRadio labelClass={element.id+"-6"}  label={element.opcao6}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,6)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao7? <div className='d-flex'><MDBRadio labelClass={element.id+"-7"}  label={element.opcao7}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,7)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao8? <div className='d-flex'><MDBRadio labelClass={element.id+"-8"}  label={element.opcao8}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,8)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao9? <div className='d-flex'><MDBRadio labelClass={element.id+"-9"}  label={element.opcao9}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,9)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao10?<div className='d-flex'><MDBRadio labelClass={element.id+"-10"} label={element.opcao10} labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,10)}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<i role='button' className="addQuestao mx-1 edit fas fa-regular fa-plus" onClick={e=>{addOpcao(element.id)}}></i>}
                                {handleInput(element.id)}
                            </div>
                            <div className='d-flex'>
                                <MDBBtn color='danger' outline onClick={e=>{excluiQuestao(element)}} id={'exclui'+element.id} className='ms-auto me-2' style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn color='success' outline onClick={e=>{editaQuestao(element.id)}} id={'salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                // Text
                case 2:
                    return(
                        <MDBListGroupItem className={cor} key={element.id}>
                            <MDBInputGroup className='mb-2 mt-1'>
                                <MDBBtn outline color='dark'  onClick={e=>{toggleShowExcluiSalva(element.id)}} className='numQuestao'>{questao.numero+'.'+element.numero}</MDBBtn>
                                <textarea id={'questao'+element.id} className='form-control textAreaEnunciado'
                                    defaultValue={element.enunciado} disabled
                                    onChange={e=>{limit(e.target);questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}/>
                            </MDBInputGroup>
                            <MDBTextArea rows={4} label='Resposta' readOnly className='mb-2'/>
                            <div className='d-flex'>
                                <MDBBtn color='danger' outline onClick={e=>{excluiQuestao(element)}} id={'exclui'+element.id} className='ms-auto me-2' style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn color='success' outline onClick={e=>{editaQuestao(element.id)}} id={'salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                // Checkbox
                case 3:
                    return(
                        <MDBListGroupItem className={cor} key={element.id}>
                            <MDBInputGroup className='mb-2 mt-1'>
                                <MDBBtn outline color='dark' onClick={e=>{toggleShowExcluiSalva(element.id)}} className='numQuestao'>{questao.numero+'.'+element.numero}</MDBBtn>
                                <textarea id={'questao'+element.id} className='form-control textAreaEnunciado'
                                    defaultValue={element.enunciado} disabled
                                    onChange={e=>{limit(e.target);questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}/>
                            </MDBInputGroup>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-1"}  label={element.opcao1}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,1)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao2? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-2"}  label={element.opcao2}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,2)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao3? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-3"}  label={element.opcao3}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,3)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao4? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-4"}  label={element.opcao4}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,4)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao5? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-5"}  label={element.opcao5}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,5)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao6? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-6"}  label={element.opcao6}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,6)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao7? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-7"}  label={element.opcao7}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,7)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao8? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-8"}  label={element.opcao8}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,8)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao9? <div className='d-flex'><MDBCheckbox labelClass={element.id+"-9"}  label={element.opcao9}  labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,9)}}  className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<></>}
                                {element.opcao10?<div className='d-flex'><MDBCheckbox labelClass={element.id+"-10"} label={element.opcao10} labelStyle={{wordBreak: 'break-word'}}/><i role='button' onClick={e=>{editOpcao(element.id,10)}} className='edit editOpcoes ms-auto p-1 fas fa-regular fa-pen fa-md'></i></div>:<i role='button' className="addQuestao edit fas fa-regular fa-plus" onClick={e=>{addOpcao(element.id)}}></i>}
                                {handleInput(element.id)}
                            </div>
                            <div className='d-flex'>
                                <MDBBtn color='danger' outline onClick={e=>{excluiQuestao(element)}} id={'exclui'+element.id} className='ms-auto me-2' style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn color='success' outline onClick={e=>{editaQuestao(element.id)}} id={'salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    )
                // Description
                case 4:
                    return(
                        <MDBListGroupItem className={cor} key={element.id}>
                            <MDBTextArea disabled onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} id={'questao'+element.id}
                                         onChange={e=>{questoes[questoes.map(object => object.id).indexOf(element.id)].enunciado=e.target.value}}
                                         defaultValue={element.enunciado} rows={4} label='Descrição' className='mb-2'/>
                            <MDBBtn outline color='dark' onClick={e=>{toggleShowExcluiSalva(element.id,true)}} className='numQuestao'><i className='p-1 fas fa-regular fa-pen'></i></MDBBtn>
                            <div className='d-flex'>
                                <MDBBtn color='danger' outline onClick={e=>{excluiQuestao(element)}} id={'exclui'+element.id} className='ms-auto me-2' style={{display:'none'}}>Excluir</MDBBtn>
                                <MDBBtn color='success' outline onClick={e=>{editaQuestao(element.id)}} id={'salva'+element.id} style={{display: 'none'}}>Salvar</MDBBtn>
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

    function toggleShowExcluiSalva(id, show){
        let v= document.getElementById("questao"+id)
        v.disabled=!v.disabled
        document.getElementById("exclui"+id).style.display==="none"?document.getElementById("exclui"+id).style.display="inline-block":document.getElementById("exclui"+id).style.display="none"
        document.getElementById("salva"+id).style.display ==="none"?document.getElementById("salva"+id).style.display="inline-block":document.getElementById("salva"+id).style.display="none"
    }

    async function addQuestao(opcao){
        novaQuestao.enunciado=document.getElementById("novaQuestaoEnunciado").value
        if(novaQuestao.enunciado){
            if (novaQuestao.type===1||novaQuestao.type===3) {
                novaQuestao.opcao1 =document.getElementById("option1").value
                novaQuestao.opcao2 =document.getElementById("option2").value
                novaQuestao.opcao3 =document.getElementById("option3").value
                novaQuestao.opcao4 =document.getElementById("option4").value
                novaQuestao.opcao5 =document.getElementById("option5").value
                novaQuestao.opcao6 =document.getElementById("option6").value
                novaQuestao.opcao7 =document.getElementById("option7").value
                novaQuestao.opcao8 =document.getElementById("option8").value
                novaQuestao.opcao9 =document.getElementById("option9").value
                novaQuestao.opcao10=document.getElementById("option10").value
            }
            await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId"),novaQuestao,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then(resposta=>{
                novaQuestao.id=resposta.data
                setQuestoes([
                    ...questoes,
                    novaQuestao
                ])
                setNovaQuestao({})
                setNewQuestion(<></>)
            })
            .catch((error) => {
                if (error.response.status===401) RemoveSessao(navigate)
                else console.log(error)
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
        .then(resposta=>{toggleShowExcluiSalva(id);document.getElementById("questao"+id).disabled=true})
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else console.log(error)
        })
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
            if (error.response.status===401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    function addOpcao( id){
        var v = document.getElementsByClassName("addQuestao")
        var opcoes = document.getElementsByClassName("editOpcoes")
        setInput({
            id:id,
            content: <div className='my-2'>
                <MDBTextArea onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} id={"questao"+id+"novaopcao"} rows={3} label='Opcao' className='mb-2'/>
                <MDBBtn className='border border-secondary' color='light' onClick={e=>{
                    for (let item of v) item.style.display = "inline-block"
                    for (let item of opcoes) item.style.display = "inline-block"
                    setInput({})
                    let index = questoes.map(object => object.id).indexOf(id)
                    let newOption = document.getElementById("questao"+id+"novaopcao").value
                    if(newOption){
                        document.getElementById("exclui"+id).style.display= "inline-block"
                        document.getElementById("salva"+id).style.display = "inline-block"
                        if (!questoes[index].opcao1) {questoes[index].opcao1=newOption}
                        else if (!questoes[index].opcao2)  {questoes[index].opcao2 =newOption}
                        else if (!questoes[index].opcao3)  {questoes[index].opcao3 =newOption}
                        else if (!questoes[index].opcao4)  {questoes[index].opcao4 =newOption}
                        else if (!questoes[index].opcao5)  {questoes[index].opcao5 =newOption}
                        else if (!questoes[index].opcao6)  {questoes[index].opcao6 =newOption}
                        else if (!questoes[index].opcao7)  {questoes[index].opcao7 =newOption}
                        else if (!questoes[index].opcao8)  {questoes[index].opcao8 =newOption}
                        else if (!questoes[index].opcao9)  {questoes[index].opcao9 =newOption}
                        else if (!questoes[index].opcao10) {questoes[index].opcao10=newOption}
                    }
                }}><i className='p-1 fas fa-regular fa-pen'></i></MDBBtn>
            </div>
        })
        for (let item of v) item.style.display = "none"
        for (let item of opcoes) item.style.display = "none"
        document.getElementById("exclui"+id).style.display= "none"
        document.getElementById("salva"+id).style.display = "none"
    }

    function editOpcao(id,opcao){
        var v = document.getElementsByClassName("addQuestao")
        var opcoes = document.getElementsByClassName("editOpcoes")
        document.getElementById("exclui"+id).style.display= "inline-block"
        document.getElementById("salva"+id).style.display = "inline-block"
        setInput({
            id:id,
            content:<div className='my-2'>
                <MDBTextArea defaultValue={document.getElementsByClassName(id+"-"+opcao)[0].innerHTML} onChange={e=>{limit(e.target)}} id={"questao"+id+"novaopcao"} label={'Opcão '+opcao} rows={3} className='mb-2'/>
                <MDBBtn className='border border-secondary' color='light' onClick={e=>{
                    for (let item of v) item.style.display = "inline-block"
                    for (let item of opcoes) item.style.display = "inline-block"
                    document.getElementById("exclui"+id).style.display= "inline-block"
                    document.getElementById("salva"+id).style.display = "inline-block"
                    setInput({})
                    switch (opcao) {
                        case 1:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao1=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 2:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao2=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 3:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao3=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 4:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao4=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 5:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao5=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 6:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao6=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 7:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao7=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 8:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao8=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 9:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao9=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        case 10:
                            questoes[questoes.map(object => object.id).indexOf(id)].opcao10=document.getElementById("questao"+id+"novaopcao").value
                            break;
                        default:
                            break;
                    }
                }}><i className=' fas fa-regular fa-pen'></i></MDBBtn>
                <MDBBtn className=' mx-2 border border-secondary' color='light' onClick={()=>{
                    for (let item of v) item.style.display = "inline-block"
                    for (let item of opcoes) item.style.display = "inline-block"
                    setInput({})
                }}>Cancelar</MDBBtn>
            </div>
        })
        for (let item of v) item.style.display = "none"
        for (let item of opcoes) item.style.display = "none"
        document.getElementById("exclui"+id).style.display= "none"
        document.getElementById("salva"+id).style.display = "none"
    }
    
    function handleNewQuestion(opcao){
        novaQuestao.derivadaDeOpcao = opcao
        novaQuestao.derivadaDeId = questao.id
        if (novaQuestao.type===4) {
            if(questoes.filter(e=>e.derivadaDeOpcao===opcao)[0]) novaQuestao.numero=questoes.filter(e=>e.derivadaDeOpcao===opcao).at(-1).numero
            else novaQuestao.numero=questao.numero=0
        }
        else{
            if(questoes.filter(e=>e.derivadaDeOpcao===opcao)[0]) novaQuestao.numero=questoes.filter(e=>e.derivadaDeOpcao===opcao).at(-1).numero+1
            else novaQuestao.numero=1
        }
        setTypeQuestion(<></>)
        switch (novaQuestao.type) {
            case 1:
            case 3:
                setNewQuestion(<MDBListGroupItem noBorders key={"novaQuestao"} className='shadow rounded-3 mb-3'>
                        <div className='enunciado mt-1'>
                            <MDBInputGroup className='mb-2'>
                                <MDBBtn color='secondary' className='numQuestao'>{questao.numero+'.'+novaQuestao.numero}</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novaQuestaoEnunciado'} defaultValue=''/>
                            </MDBInputGroup>
                        </div>
                        <div id={"novaQuestaoOpcoes"} className='mx-2'>
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onChange={e=>{limit(e.target)}} textBefore='Opção 1' ><input id='option1'  className='form-control' onInput={e=>{document.getElementById("option2").disabled=false }} type='text'/></MDBInputGroup></div>}
                            {[2,3,4,5,6,7,8,9].map(el=>{
                                return <div className='d-flex align-items-center mb-2'><MDBInputGroup onChange={e=>{limit(e.target)}} textBefore={"Opção "+el}><input id={'option'+el}  className='form-control' onInput={e=>{document.getElementById("option"+(el+1)).disabled=false }} type='text' disabled/></MDBInputGroup></div>
                            })}
                            {<div className='d-flex align-items-center mb-2'><MDBInputGroup onChange={e=>{limit(e.target)}} textBefore='Opção 10'><input id='option10' className='form-control' type='text' disabled/></MDBInputGroup></div>}
                        </div>
                        <div className='d-flex'>
                            <MDBBtn onClick={e=>{setNewQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                            <MDBBtn onClick={e=>{addQuestao()}}>Salvar</MDBBtn>
                        </div>
                    </MDBListGroupItem>)
                break;
            case 2:
                setNewQuestion(<MDBListGroupItem noBorders key={"novaQuestao"} className='rounded-3 mb-3'>
                        <div className='enunciado mt-1'>
                            <MDBInputGroup className='mb-2'>
                                <MDBBtn color='secondary' className='numQuestao'>{questao.numero+'.'+novaQuestao.numero}</MDBBtn>
                                <input className='form-control' type='text' id={'novaQuestaoEnunciado'} defaultValue=''/>
                            </MDBInputGroup>
                        </div>
                        <MDBTextArea rows={4} label='Resposta' readOnly className='mb-2'/>
                        <div className='d-flex'>
                            <MDBBtn onClick={e=>{setNewQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                            <MDBBtn onClick={e=>{addQuestao()}}>Salvar</MDBBtn>
                        </div>
                    </MDBListGroupItem>)
                break;  
            case 4:
                setNewQuestion(<MDBListGroupItem noBorders key={"novaQuestao"} className='rounded-3 mb-3'>
                        <MDBTextArea id='novaQuestaoEnunciado' rows={4} label='Resposta' className='mb-2'/>
                        <div className='d-flex'>
                            <MDBBtn onClick={e=>{setNewQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                            <MDBBtn onClick={e=>{addQuestao()}}>Salvar</MDBBtn>
                        </div>
                    </MDBListGroupItem>)
                break;   
            default:
                break;
        }
    }

    function handleNewTypeQuestion(opcao){
        setTypeQuestion(<MDBListGroupItem noBorders className='shadow rounded-3 mb-3'>
                <div className='d-flex justify-content-around align-items-center'>
                    <div className='enunciado'>Tipo da Questão:</div>
                    <MDBRadio onClick={e=>{novaQuestao.type=3}} inline name='tipoQuestao' label='Caixa de seleção'></MDBRadio>
                    <MDBRadio onClick={e=>{novaQuestao.type=1}} inline name='tipoQuestao' label='Múltipla Escolha'></MDBRadio>
                    <MDBRadio onClick={e=>{novaQuestao.type=2}} inline name='tipoQuestao' label='Aberta'></MDBRadio>
                    <MDBRadio onClick={e=>{novaQuestao.type=4}} inline name='tipoQuestao' label='Descrição'></MDBRadio>
                </div>
                <hr className='mt-1 mb-1'></hr>
                <div className='d-flex'>
                    <MDBBtn onClick={e=>{setTypeQuestion(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                    <MDBBtn onClick={e=>{novaQuestao.type?handleNewQuestion(opcao):<></>}}>Proxima</MDBBtn>
                </div>
            </MDBListGroupItem>)
    }

    function handleInput(id){
        if (input.id && input.id===id) return input.content 
        else return <></>
    }

    return (<>{typeQuestion}{newQuestion}{opcoes.map(element =>{
        switch (element){
            case 1: return(
                <div key='questoesopcao1'><MDBListGroup small className='my-1' >
                    {questao.opcao1?renderizaQuestoes(1,'opcao1'):null}
                    </MDBListGroup>
                    {questao.opcao1?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(1)}} className='opcao1 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 2: return(
                <div key='questoesopcao2'><MDBListGroup small className='my-1' >
                    {questao.opcao2?renderizaQuestoes(2,'opcao2'):null}
                    </MDBListGroup>
                    {questao.opcao2?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(2)}} className='opcao2 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 3: return(
                <div key='questoesopcao3'><MDBListGroup small className='my-1'>
                    {questao.opcao3?renderizaQuestoes(3,'opcao3'):null}
                    </MDBListGroup>
                    {questao.opcao3?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(3)}} className='opcao3 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 4: return(
                <div key='questoesopcao4'><MDBListGroup small className='my-1' >
                    {questao.opcao4?renderizaQuestoes(4,'opcao4'):null}
                    </MDBListGroup>
                    {questao.opcao4?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(4)}} className='opcao4 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 5: return(
                <div key='questoesopcao5'><MDBListGroup small className='my-1' >
                    {questao.opcao5?renderizaQuestoes(5,'opcao5'):null}
                    </MDBListGroup>
                    {questao.opcao5?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(5)}} className='opcao5 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 6: return(
                <div key='questoesopcao6'><MDBListGroup small className='my-1' >
                    {questao.opcao6?renderizaQuestoes(6,'opcao6'):null}
                    </MDBListGroup>
                    {questao.opcao6?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(6)}} className='opcao6 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 7: return(
                <div key='questoesopcao7'><MDBListGroup small className='my-1' >
                    {questao.opcao7?renderizaQuestoes(7,'opcao7'):null}
                    </MDBListGroup>
                    {questao.opcao7?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(7)}} className='opcao7 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 8: return(
                <div key='questoesopcao8'><MDBListGroup small className='my-1' >
                    {questao.opcao8?renderizaQuestoes(8,'opcao8'):null}
                    </MDBListGroup>
                    {questao.opcao8?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(8)}} className='opcao8 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 9: return(
                <div key='questoesopcao9'><MDBListGroup small className='my-1' >
                    {questao.opcao9?renderizaQuestoes(9,'opcao9'):null}
                    </MDBListGroup>
                    {questao.opcao9?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(9)}} className='opcao9 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            case 10: return(
                <div key='questoesopcao10'><MDBListGroup small className='my-1' >
                    {questao.opcao10?renderizaQuestoes(10,'opcao10'):null}
                    </MDBListGroup>
                    {questao.opcao10?
                    <MDBBtn onClick={e=>{handleNewTypeQuestion(10)}} className='opcao10 border-1 btn-secondary'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                    :null}</div>)
            default: return(<></>)
        }
    })}</>)
}