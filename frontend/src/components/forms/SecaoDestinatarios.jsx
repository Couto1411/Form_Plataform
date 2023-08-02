import React, {useEffect,useState}from 'react'
import { limit, CarregaCursosUser, CarregaDestinatarios, RemoveSessao } from '../../config/utils';
import './Forms.css'
import axios from "axios";
import * as XLSX from "xlsx";
import baseUrl from "../../config/api";
import Title from '../template/Title'
import InputMask from 'react-input-mask';
import {
    MDBInputGroup,  MDBRadio,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBInput, MDBFile,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalBody, MDBModalFooter, MDBModalHeader, MDBContainer, MDBSpinner} from 'mdb-react-ui-kit';

export default function SecaoDestinatarios({navigate}){

    // Alert de destinário já respondeu em form derivado
    const [respondidoDerivado, setRespondidoDerivado] = useState(false);
    // Conta cliques para excluir o destinatário
    const [click, setClick] = useState([{id:''}]);
    // Lista de destinatários
    const [destinatarios, setDestinatarios] = useState([]);
    const [destinatariosDB, setDestinatariosDB] = useState([]);
    // Responsavel pelo armazenamento das opcões de cursos
    const [cursos, setCursos] = useState(null);

    // Modifica visibilidade da area de novo destinatário
    const [newDestinatario, setNewDestinatario] = useState(<></>);

    // Modifica visibilidade do popup de import de destinatários
    const [importModal, setImportModal] = useState(false);

    // Usado para paginação
    const [destinatariosPage, setDestinatariosPage] = useState(1);
    const [qtdPPag, setQtdPPag] = useState(15);

    // Usado para busca de destinatarios
    const [nomeEmail, setNomeEmail] = useState(true);
    // Confirmação de envio de email
    const [enviou, setEnviou] = useState(false);
    const [carregandoEnvio, setCarregandoEnvio] = useState(true);

    useEffect(() => {
        CarregaCursosUser(setCursos,navigate).then(()=>{
            CarregaDestinatarios(setDestinatarios,setDestinatariosDB,sessionStorage.getItem('formId'),navigate)
        })
    }, [navigate]);

    const searchChange = (e) => {
        setDestinatariosPage(1)
        var envio = destinatariosDB.filter((el)=>{
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
        setDestinatarios(envio)
    }; 

    function renderizaDestinatarios(){
        return destinatarios?.slice((destinatariosPage-1)*(qtdPPag!==''?qtdPPag:15),((destinatariosPage-1)*(qtdPPag!==''?qtdPPag:15))+(qtdPPag!==''?qtdPPag:15)).map(element => {
                if(element.respondido===2){
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInputGroup>
                                <MDBBtn outline color='dark' onClick={e=>{handleClick(element)}} className='numQuestao'><i className="trashcan fas fa-trash-can"></i></MDBBtn>
                                <input className='form-control' type='text' defaultValue={element.email} disabled/>
                                <div role='button' onClick={e=>{sessionStorage.setItem('destinatarioId',element.id);navigate('/resposta')}} color='secondary' className='numQuestao borda-direita' id={'edit'+element.id}><i className='p-2 ms-auto fas fa-solid fa-eye'></i></div>
                            </MDBInputGroup>
                            <div className='d-flex'><div className='text-danger p-1' id={'warning'+element.id} style={{display: 'none'}}>Todas as respostas desse email serão apagadas, se tiver certeza clique novamente</div><a href='/#' role='button' onClick={e=>{handleClick(element,true)}} id={'cancel'+element.id} style={{display: 'none'}} className='p-1 ms-auto'>Cancelar</a></div>
                        </MDBListGroupItem>
                    )
                }else{
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInputGroup id={'send'+element.id} textAfter={<i title='Enviar formulário para este email' onClick={e=>{sendOneEmail(element.id)}} className={element.respondido===1?"edit fas fa-light fa-paper-plane fa-sm greenicon":"edit fas fa-light fa-paper-plane fa-sm"}></i>}>
                                <MDBBtn outline color='dark' onClick={e=>{showEditDestinatario(element)}} className='numQuestao'>@</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'destinatarioEmail'+element.id} defaultValue={element.email} disabled onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].email=e.target.value}}/>
                                <div role='button' onClick={e=>{editaDestinatario(element.id)}} className='numQuestao borda-direita' id={'edit'+element.id} style={{display: 'none'}}><i className='p-2 ms-auto fas fa-regular fa-pen'></i></div>
                                <div role='button' onClick={e=>{excluiDestinatario(element.id)}} className='numQuestao borda-direita' id={'erase'+element.id} style={{display: 'none'}}><i className='p-2 ms-auto trashcan fas fa-trash-can'></i></div>
                            </MDBInputGroup>
                            <MDBContainer fluid className='mt-2' id={'destinatarioForm'+element.id} style={{display: 'none'}}>
                                <div className='row'>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Nome</MDBBtn>
                                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} defaultValue={element.nome} onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].nome=e.target.value}} className='form-control' type='text'/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Matrícula</MDBBtn>
                                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} defaultValue={element.matricula} onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].matricula=e.target.value}} className='form-control' type='text'/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].telefone1=e.target.value}} className='novoDestinatarioForm px-2'>Telefone 1</MDBBtn>
                                            <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'destinatarioTelefone1'+element.id}/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].telefone2=e.target.value}} className='novoDestinatarioForm px-2'>Telefone 2</MDBBtn>
                                            <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'destinatarioTelefone2'+element.id}/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Curso</MDBBtn>
                                            <select defaultValue={element.curso} onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].curso=e.target.value}} className='selectCurso novoDestinatarioCurso'>
                                                {cursos?.listaCursos?.map(item => {
                                                    return <option key={element.id+"opcaocurso"+item.id} value={item.curso}>{item.curso}</option>
                                                })}
                                            </select>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Modalidade do Curso</MDBBtn>
                                            <select defaultValue={element.modalidade} onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].modalidade=e.target.value}} className='selectCurso'>
                                                {cursos?.listaModalidades?.map(item => {
                                                    return <option key={element.id+"opcaotipo"+item.id} value={item.modalidade}>{item.modalidade}</option>
                                                })}
                                            </select>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>CPF</MDBBtn>
                                            <InputMask mask='999.999.999-99'  className='form-control' type='text' defaultValue={element.cpf} onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].cpf=e.target.value}} />
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Sexo</MDBBtn>
                                            <select  defaultValue={element.sexo} onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].sexo=e.target.value}} className='selectCurso novoDestinatarioSexo'>
                                                <option value="M">Masculino</option>
                                                <option value="F">Feminino</option>
                                                <option value="N">Não informar</option>
                                            </select>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-12 pt-md-2 pt-sm-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Data de colação</MDBBtn>
                                            <input type="date" className='porcentagem selectCurso' onChange={e=>{destinatarios[destinatarios.map(object => object.id).indexOf(element.id)].dataColacao=e.target.value}} id={'destinatarioData'+element.id}/>
                                        </MDBInputGroup>
                                    </div>
                                </div>
                            </MDBContainer>
                        </MDBListGroupItem>
                    )
                }
            })
    }

    async function addDestinatario(){
        let novodestinatario ={}
        novodestinatario.email=document.getElementById("novoDestinatarioEmail").value
        novodestinatario.nome=document.getElementById("novoDestinatarioNome").value
        novodestinatario.matricula=document.getElementById("novoDestinatarioMatricula").value
        novodestinatario.telefone2=document.getElementById("novoDestinatarioTelefone2").value
        novodestinatario.telefone1=document.getElementById("novoDestinatarioTelefone1").value
        novodestinatario.curso=document.getElementById("novoDestinatarioCurso").value
        novodestinatario.modalidade=document.getElementById("novoDestinatarioModalidade").value
        novodestinatario.cpf=document.getElementById("novoDestinatarioCpf").value
        novodestinatario.sexo=document.getElementById("novoDestinatarioSexo").value
        novodestinatario.dataColacao=document.getElementById("novoDestinatarioData").value
        if(novodestinatario.email){
            document.getElementById("novoDestinatarioEmail").classList.remove("is-invalid")
            if (novodestinatario.telefone1 && !/\(\d\d\)\s\d\d\d\d\d-\d\d\d\d/.test(novodestinatario.telefone1)) {
                document.getElementById("novoDestinatarioTelefone1").classList.add("is-invalid")
                return
            }else{document.getElementById("novoDestinatarioTelefone1").classList.remove("is-invalid")}
            if (novodestinatario.telefone2 && !/\(\d\d\)\s\d\d\d\d\d-\d\d\d\d/.test(novodestinatario.telefone2)) {
                document.getElementById("novoDestinatarioTelefone2").classList.add("is-invalid")
                return
            }else{document.getElementById("novoDestinatarioTelefone2").classList.remove("is-invalid")}
            if (novodestinatario.cpf && !/\d\d\d\.\d\d\d\.\d\d\d-\d\d/.test(novodestinatario.cpf)) {
                document.getElementById("novoDestinatarioCpf").classList.add("is-invalid")
                return
            }else{document.getElementById("novoDestinatarioCpf").classList.remove("is-invalid")}
            if (!novodestinatario.dataColacao) novodestinatario.dataColacao=null
            novodestinatario.respondido=0
            await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados",novodestinatario,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then(resposta=>{
                novodestinatario.id=resposta.data
                setDestinatarios([
                    ...destinatarios,
                    novodestinatario
                ])
                setNewDestinatario(<></>)
            })
            .catch((error) => {
                if (error.response.status===401) RemoveSessao(navigate)
                else console.log(error)
            })
        }else{
            document.getElementById("novoDestinatarioEmail").classList.add("is-invalid")
        }
    }

    async function editaDestinatario(id){
        let dados=destinatarios[destinatarios.map(object => object.id).indexOf(id)]
        await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+id,dados,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(resposta =>{
            document.getElementById("destinatarioEmail"+id).disabled=true
            document.getElementById("edit"+id).style.display='none'
            document.getElementById("destinatarioForm"+id).style.display='none'
            let erase=document.getElementById("erase"+id)
            erase.style.display==='none'?erase.style.display='block':erase.style.display='none'
            let send=document.getElementById("send"+id)
            if(send.lastChild.nodeName==='SPAN'){
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
            if (error.response.status===401) RemoveSessao(navigate)
            else if(error.response.status===402) setRespondidoDerivado(true)
            else console.log(error)
        })
    } 

    async function excluiDestinatario(id){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados/"+id+"?deleta=true",{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            if(destinatarios.map(a=>a.id).indexOf(id)%(qtdPPag!==''?qtdPPag:15)===0) {
                setDestinatariosPage(destinatariosPage-1)}
            setDestinatarios(destinatarios.filter(a=> a.id !== id))
        })
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else console.log(error)
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
            setDestinatarios(destinatarios.filter(a=> a.id !== elemento.id))
            setDestinatarios([
                ...destinatarios
            ])
        })
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    function handleNewDestinatario(){
        setNewDestinatario(
            <MDBListGroupItem noBorders className='rounded-3 mt-3 mb-3'>
                <MDBContainer fluid className='mt-2'>
                <div className='row'>
                    <div className="col-12 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='numQuestao'>@</MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoDestinatarioEmail'}/>
                        </MDBInputGroup>
                    </div> {/* Email */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Nome</MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoDestinatarioNome'}/>
                        </MDBInputGroup>
                    </div> {/* Nome */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Matrícula</MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoDestinatarioMatricula'}/>
                        </MDBInputGroup>
                    </div> {/* Matrícula */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Telefone 1</MDBBtn>
                            <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'novoDestinatarioTelefone1'}/>
                        </MDBInputGroup>
                    </div> {/* Tel1 */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Telefone 2</MDBBtn>
                            <InputMask mask='(99) 99999-9999' className='form-control' type='text' id={'novoDestinatarioTelefone2'}/>
                        </MDBInputGroup>
                    </div> {/* Tel2 */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Curso</MDBBtn>
                            <select id="novoDestinatarioCurso" className='selectCurso novoDestinatarioCurso'>
                                {cursos?.listaCursos?.map(item => {
                                    return <option key={"newopcaocurso"+item.id} value={item.curso}>{item.curso}</option>
                                })}
                            </select>
                        </MDBInputGroup>
                    </div> {/* Curso */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Modalidade do Curso</MDBBtn>
                            <select id="novoDestinatarioModalidade" className='selectCurso'>
                                {cursos?.listaModalidades?.map(item => {
                                    return <option key={"newopcaotipo"+item.id} value={item.modalidade}>{item.modalidade}</option>
                                })}
                            </select>
                        </MDBInputGroup>
                    </div> {/* Modalidade */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>CPF</MDBBtn>
                            <InputMask mask='999.999.999-99'  className='form-control' type='text' id={'novoDestinatarioCpf'}/>
                        </MDBInputGroup>
                    </div> {/* CPF */}
                    <div className="col-md-6 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Sexo</MDBBtn>
                            <select id='novoDestinatarioSexo' className='selectCurso novoDestinatarioSexo'>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                                <option value="N">Não informar</option>
                            </select>
                        </MDBInputGroup>
                    </div> {/* Sexo */}
                    <div className="col-md-12 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoDestinatarioForm px-2'>Data de colação</MDBBtn>
                            <input className='selectCurso' type="date" id='novoDestinatarioData'/>
                        </MDBInputGroup>
                    </div> {/* Data Colação */}
                </div>
                <div className='d-flex mt-2 mt-md-0'>
                    <MDBBtn onClick={e=>{setNewDestinatario(<></>)}} color='danger' className='ms-auto me-2'>Excluir</MDBBtn>
                    <MDBBtn onClick={e=>{addDestinatario()}}>Salvar</MDBBtn>
                </div>
                </MDBContainer>
            </MDBListGroupItem>
        )
    } 

    function showEditDestinatario(element){
        let v=document.getElementById("destinatarioEmail"+element.id)
        v.disabled=!v.disabled
        let p=document.getElementById("edit"+element.id)
        p.style.display==='none'?p.style.display='block':p.style.display='none'
        let erase=document.getElementById("erase"+element.id)
        erase.style.display==='none'?erase.style.display='block':erase.style.display='none'
        let send=document.getElementById("send"+element.id)
        if(send.lastChild.nodeName==='SPAN'){
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
        let x=document.getElementById("destinatarioForm"+element.id)
        x.style.display==='none'?x.style.display='block':x.style.display='none'
        element.dataColacao?document.getElementById("destinatarioData"+element.id).value=element.dataColacao.substr(0,10):<></>;
        document.getElementById("destinatarioTelefone1"+element.id).value=element.telefone1
        document.getElementById("destinatarioTelefone2"+element.id).value=element.telefone2
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
        setEnviou(true)
        setCarregandoEnvio(true)
        await axios.post(baseUrl+"/enviar",{UserId: sessionStorage.getItem("userId"),FormId: sessionStorage.getItem("formId")},{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(()=>{setCarregandoEnvio(false)})
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else if(error.response.status===402){alert("Usuário não possui uma senha de aplicativo de gmail. Acesse a página do usuário para saber mais.")}
            else console.log(error)
        })
    }

    async function sendOneEmail(id){
        setEnviou(true)
        setCarregandoEnvio(true)
        await axios.post(baseUrl+"/enviarUnico",{UserId: sessionStorage.getItem("userId"),FormId: sessionStorage.getItem("formId"),EmailId:id},{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(()=>{setCarregandoEnvio(false)})
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else if(error.response.status===402){alert("Usuário não possui uma senha de aplicativo de gmail. Acesse a página do usuário para saber mais.")}
            else console.log(error)
        })
    }

    async function importEmails(){
        let selectedFiles = document.getElementById('formFile').files;
        if (selectedFiles.length>0) { 
            document.getElementById('cancelmodalimports').disabled=true
            var i,f;
            for (i = 0, f = selectedFiles[i]; i !== selectedFiles.length; ++i) {
                if(['xlsx','xls','csv'].includes(f.name.slice(f.name.lastIndexOf('.') + 1).toLowerCase())){
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
                            CarregaDestinatarios(setDestinatarios,setDestinatariosDB,sessionStorage.getItem('formId'),navigate)
                            CarregaCursosUser(setCursos,navigate)
                            setImportModal(false)
                        })
                        .catch((error) => {
                            if (error.response.status===401) RemoveSessao(navigate)
                            else console.log(error)
                        })
                    }
                }else{
                    document.getElementById('formFile').classList.add("is-invalid")
                    break;
                }
            }
        }else{
            document.getElementById('formFile').classList.add("is-invalid")
        }
    }

    return(
        <main className='mt-3 principal'> 
            {Title(sessionStorage.getItem('nomePesquisa'),()=>{CarregaDestinatarios(setDestinatarios,setDestinatariosDB,sessionStorage.getItem('formId'),navigate)})}

            {/* Barra de busca */}
            <MDBContainer fluid className='shadow mt-3 p-3 rounded-3 bg-light'>
                <MDBRadio name='buscaDestinatario' label='Buscar por email' onClick={e=>{setNomeEmail(true)}} defaultChecked inline />
                <MDBRadio name='buscaDestinatario' label='Buscar por nome' onClick={e=>{setNomeEmail(false)}} inline />
                <MDBInput 
                    className='mt-1'
                    type="text"
                    label="Busque aqui"
                    onChange={searchChange} />
            </MDBContainer>

            {/* Emails */}
            <MDBListGroup small className='shadow mt-3' >
                {renderizaDestinatarios()}
            </MDBListGroup>

            {/* Novo Destinatário Form */}
            {newDestinatario}

            {/* Botões de adição e envio de destinatarios */}
            <div className='d-flex mt-3'>
                <MDBBtn outline color='dark' className='border-1 bg-light destinatarioBotoes' onClick={e=>{handleNewDestinatario()}}><i title='Adicionar novo email a enviar' className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
                <div className='mx-1'><input value={qtdPPag} onChange={e=>{
                    if(e.target.value!=='' && Number(e.target.value>=1)){
                        setQtdPPag(Number(e.target.value))
                    }else setQtdPPag('')
                    setDestinatariosPage(1)
                }} className="inputnumero form-control form-control-3 p-2" id="typeNumber" size='3' maxLength="3"/></div>
                <MDBBtn outline color='dark' className='border-1 bg-light destinatarioBotoes ms-auto mx-2' onClick={e=>{setImportModal(true)}} ><i title='Importar emails de modelo CEFET-MG' className="edit fas fa-regular fa-file-import"></i></MDBBtn>
                <MDBBtn outline color='dark' className='border-1 bg-light destinatarioBotoes' onClick={e=>{sendEmails()}}><i title='Enviar à todos os emails da lista' className="edit fas fa-light fa-paper-plane"></i></MDBBtn>
            </div>
            
            {/* Modal para adicionar destinatarios no modelo Cefet */}
            <MDBModal tabIndex='-1' show={importModal} setShow={setImportModal}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader className='py-2'>
                            Importar envios de arquivo (xslx, csv, xls)
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

            {/* Modal de avisar que foi enviado */}
            <MDBModal tabIndex='-1' show={enviou} setShow={setEnviou}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalBody className='py-2'>
                            {carregandoEnvio?
                                <div><MDBSpinner color='primary' size='sm' role='status'/><span className='px-2'>Enviando...</span></div>:
                                "Enviado com sucesso"}
                        </MDBModalBody>
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
            {destinatarios.length>(qtdPPag!==''?qtdPPag:15)
            ?<div className="d-flex justify-content-center mt-2">
                {destinatariosPage<=3?
                <MDBListGroup horizontal>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(1)}}>1</MDBListGroupItem>
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))>1?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(2)}}>2</MDBListGroupItem>:<></>}
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))>2?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(3)}}>3</MDBListGroupItem>:<></>}
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))>3?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(4)}}>4</MDBListGroupItem>:<></>}
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))>4?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(5)}}>5</MDBListGroupItem>:<></>}
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))>5?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15)))}}>...</MDBListGroupItem>:<></>}
                </MDBListGroup>
                :destinatariosPage>((Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15)))-3)?
                <MDBListGroup horizontal>
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-5>0?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(1)}} >...</MDBListGroupItem>:<></>}
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-4>0?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-4)}}>{Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-4}</MDBListGroupItem>:<></>}
                    {Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-3>0?<MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-3)}}>{Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-3}</MDBListGroupItem>:<></>}
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-2)}}>{Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-2}</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-1)}}>{Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))-1}</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15)))}}>{Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15))}</MDBListGroupItem>
                </MDBListGroup>
                :destinatariosPage>3?
                <MDBListGroup horizontal>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(1)}}>...</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(destinatariosPage-2)}}>{destinatariosPage-2}</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(destinatariosPage-1)}}>{destinatariosPage-1}</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(destinatariosPage)}}>{destinatariosPage}</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(destinatariosPage+1)}}>{destinatariosPage+1}</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(destinatariosPage+2)}}>{destinatariosPage+2}</MDBListGroupItem>
                    <MDBListGroupItem className='pages' onClick={e=>{setDestinatariosPage(Math.ceil(destinatarios.length/(qtdPPag!==''?qtdPPag:15)))}}>...</MDBListGroupItem>
                </MDBListGroup>
                :<></>}
            </div>:<></>}
        </main>
    )
}