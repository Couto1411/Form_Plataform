import React, {useEffect,useState}from 'react'
import './Forms.css'
import axios from "axios";
import baseUrl from "../../config/api";
import { CarregaQuestoes, CarregaRespostas, CarregaDestinatarios, RemoveSessao } from '../../config/utils';
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from '../user/UserSection'
import {
    MDBInputGroup, MDBTextArea, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBContainer, MDBInput,
    MDBModal,MDBModalDialog,MDBModalContent,MDBModalBody} from 'mdb-react-ui-kit';
import { Link, useLocation } from 'react-router-dom';
import SecaoRelatorios from './SecaoRelatórios';
import SecaoRespostas from './SecaoResposta';

export default function FormsDerivados({navigate}){
    const location = useLocation().state
    const { derivado } = location
    // Conta cliques para excluir o destinatário
    const [click, setClick] = useState([{id:''}]);

    // Aba de respostas da aplicação
    const [respostas, setRespostas] = useState(null);
    // Aba de questoes que mostra todas as questoes do formulario
    const [questoes, setQuestoes] = useState([]);
    // Aba de destinatários que mostra todos os emails do formulário
    const [destinatarios, setDestinatarios] = useState([]);
    const [destinatariosDB, setDestinatariosDB] = useState([]);

    // Seta qual secao aparece, questoes, repostas ou envios
    const [secao, setsecao] = useState(2)

    // Usado para busca de destinatarios
    const [nomeEmail, setNomeEmail] = useState(true);

    // Usado para paginação
    const [destinatariosPage, setDestinatariosPage] = useState(1);
    const [qtdPPag, setQtdPPag] = useState(15);

    // Confirmação de envio de email
    const [enviou, setEnviou] = useState(false);

    useEffect(() => {
        CarregaQuestoes(setQuestoes,navigate)
        CarregaDestinatarios(setDestinatarios,setDestinatariosDB,derivado,navigate).then(()=>{
            CarregaRespostas(setRespostas,navigate,derivado)
        })
    }, [navigate,derivado]);
    
    const searchChange = (e) => {
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


    // Questões
    function renderizaQuestoes(listaQuestoes,opcao,numeroOrig){
        if(!(listaQuestoes?.length))listaQuestoes=questoes
        let opcoes=[1,2,3,4,5,6,7,8,9,10]
        return listaQuestoes?.map(element => {
            switch (element.type) {
                case 1:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={'shadow rounded-3 mb-2 '+(opcao&&'opcao'+opcao)}>
                            <MDBInputGroup className='mb-1 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{numeroOrig?numeroOrig+'.'+element.numero:element.numero}</MDBBtn>
                                <textarea className='form-control' id={'questao'+element.id} 
                                    defaultValue={element.enunciado} disabled 
                                    style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>
                            </MDBInputGroup>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1? <MDBRadio label={element.opcao1}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao2? <MDBRadio label={element.opcao2}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao3? <MDBRadio label={element.opcao3}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao4? <MDBRadio label={element.opcao4}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao5? <MDBRadio label={element.opcao5}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao6? <MDBRadio label={element.opcao6}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao7? <MDBRadio label={element.opcao7}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao8? <MDBRadio label={element.opcao8}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao9? <MDBRadio label={element.opcao9}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao10?<MDBRadio label={element.opcao10} labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                            </div>
                            {element.obrigatoria>0&&<div className='d-flex'><div className='ms-auto'>Obrigatória</div></div>}
                        </MDBListGroupItem>
                    )
                case 2:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={'shadow rounded-3 mb-2 '+(opcao&&'opcao'+opcao)}>
                            <MDBInputGroup className='mb-1 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{numeroOrig?numeroOrig+'.'+element.numero:element.numero}</MDBBtn>
                                <textarea className='form-control' id={'questao'+element.id} 
                                    defaultValue={element.enunciado} disabled 
                                    style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>
                            </MDBInputGroup>
                            <MDBTextArea rows={2} label='Resposta' readOnly className='mb-2'/>
                            {element.obrigatoria>0&&<div className='d-flex'><div className='ms-auto'>Obrigatória</div></div>}
                        </MDBListGroupItem>
                    )
                case 3:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={'shadow rounded-3 mb-2 '+(opcao&&'opcao'+opcao)}>
                            <MDBInputGroup className='mb-1 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{numeroOrig?numeroOrig+'.'+element.numero:element.numero}</MDBBtn>
                                <textarea className='form-control' id={'questao'+element.id} 
                                    defaultValue={element.enunciado} disabled 
                                    style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>                              
                            </MDBInputGroup>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1? <MDBCheckbox label={element.opcao1}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao2? <MDBCheckbox label={element.opcao2}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao3? <MDBCheckbox label={element.opcao3}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao4? <MDBCheckbox label={element.opcao4}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao5? <MDBCheckbox label={element.opcao5}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao6? <MDBCheckbox label={element.opcao6}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao7? <MDBCheckbox label={element.opcao7}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao8? <MDBCheckbox label={element.opcao8}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao9? <MDBCheckbox label={element.opcao9}  labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                                {element.opcao10?<MDBCheckbox label={element.opcao10} labelStyle={{wordBreak: 'break-word'}}/>:<></>}
                            </div>
                            {element.obrigatoria>0&&<div className='d-flex'><div className='ms-auto'>Obrigatória</div></div>}
                        </MDBListGroupItem>
                    )
                case 4:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={'shadow rounded-3 mb-2 '+(opcao&&'opcao'+opcao)}>
                            <MDBTextArea disabled id={'questao'+element.id}
                                         defaultValue={element.enunciado} rows={3} label='Descrição' className='mb-2'/>
                        </MDBListGroupItem>
                    )
                case 9:
                    return(<div  key={element.id} >
                        <MDBListGroupItem className='rounded-2 mb-2 shadow'>
                            <MDBInputGroup className='mb-1 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                <textarea className='form-control' id={'questao'+element.id} 
                                    defaultValue={element.enunciado} disabled 
                                    style={{borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px'}}/>                            
                            </MDBInputGroup>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1? <div className='pt-1 px-1 my-1 opcao1  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao1} /></div>:<></>}
                                {element.opcao2? <div className='pt-1 px-1 my-1 opcao2  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao2} /></div>:<></>}
                                {element.opcao3? <div className='pt-1 px-1 my-1 opcao3  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao3} /></div>:<></>}
                                {element.opcao4? <div className='pt-1 px-1 my-1 opcao4  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao4} /></div>:<></>}
                                {element.opcao5? <div className='pt-1 px-1 my-1 opcao5  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao5} /></div>:<></>}
                                {element.opcao6? <div className='pt-1 px-1 my-1 opcao6  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao6} /></div>:<></>}
                                {element.opcao7? <div className='pt-1 px-1 my-1 opcao7  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao7} /></div>:<></>}
                                {element.opcao8? <div className='pt-1 px-1 my-1 opcao8  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao8} /></div>:<></>}
                                {element.opcao9? <div className='pt-1 px-1 my-1 opcao9  rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao9} /></div>:<></>}
                                {element.opcao10?<div className='pt-1 px-1 my-1 opcao10 rounded-2 d-flex'><MDBRadio labelStyle={{wordBreak: 'break-word'}} label={element.opcao10}/></div>:<></>}
                            </div>
                        </MDBListGroupItem>
                        {element?.derivadas?.length?opcoes.map(numero=>{
                            return element.derivadas?.filter(s=>s.derivadaDeOpcao===numero).length?renderizaQuestoes(element.derivadas?.filter(s=>s.derivadaDeOpcao===numero),numero,element.numero):null
                        }):null}
                    </div>)
                default:
                    return(
                        <></>
                    )
            }
        });
    }

    const secaoQuestoes = <main className='mt-3 principal'>
        {Title(location?location.nomePesquisa:'Nome')}

        <MDBListGroup small className='mt-3' >
            {renderizaQuestoes()}
        </MDBListGroup>
    </main>
    // Questões

    // Destinatarios
    async function excluiRespostas(elemento){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+derivado+"/enviados/"+elemento.id+"?deleta=false",{
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
        await axios.post(baseUrl+"/enviar",{UserId: sessionStorage.getItem("userId"),FormId: derivado},{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(()=>{setEnviou(true)})
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else if(error.response.status===402){alert("Usuário não possui uma senha de aplicativo de gmail. Acesse a página do usuário para saber mais.")}
            else console.log(error)
        })
    }

    const secaoDestinatarios = <main className='mt-3 principal'> 
        {Title(location?location.nomePesquisa:'Nome',()=>CarregaDestinatarios(setDestinatarios,setDestinatariosDB,derivado,navigate))}

        {/* Busca */}
        <MDBContainer fluid className='mt-3 p-3 rounded-3 bg-light'>
            <MDBRadio name='buscaDestinatario' label='Buscar por email' onClick={e=>{setNomeEmail(true)}} inline />
            <MDBRadio name='buscaDestinatario' label='Buscar por nome' onClick={e=>{setNomeEmail(false)}} inline />
            <MDBInput 
                className='mt-1'
                type="text"
                label="Busque aqui"
                onChange={searchChange} />
        </MDBContainer>

        {/* Emails */}
        <MDBListGroup small className='mt-3' >
            {destinatarios?.slice((destinatariosPage-1)*(qtdPPag!==''?qtdPPag:15),((destinatariosPage-1)*(qtdPPag!==''?qtdPPag:15))+(qtdPPag!==''?qtdPPag:15)).map(element => {
                if(element.respondido===2){
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInputGroup>
                                <MDBBtn onClick={e=>{handleClick(element)}} color='secondary' className='numQuestao'><i className="trashcan fas fa-trash-can"></i></MDBBtn>
                                <input className='form-control' type='text' defaultValue={element.email} disabled/>
                                <Link role='button' state={{derivado:derivado,nomePesquisa:location?.nomePesquisa}} onClick={e=>{sessionStorage.setItem('destinatarioId',element.id)}} to='/resposta' color='secondary' className='numQuestao borda-direita' id={'edit'+element.id}>
                                    <i className='p-2 ms-auto fas fa-solid fa-eye'></i>
                                </Link>
                            </MDBInputGroup>
                            <div className='d-flex'><div className='text-danger p-1' id={'warning'+element.id} style={{display: 'none'}}>Todas as respostas desse email serão apagadas, se tiver certeza clique novamente</div><a href='/#' role='button' onClick={e=>{handleClick(element.id,true)}} id={'cancel'+element.id} style={{display: 'none'}} className='p-1 ms-auto'>Cancelar</a></div>
                        </MDBListGroupItem>
                    )
                }else{
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInputGroup>
                                <MDBBtn color='secondary' className='numQuestao'>@</MDBBtn>
                                <input className='form-control' type='text' defaultValue={element.email} disabled/>
                            </MDBInputGroup>
                        </MDBListGroupItem>
                    )
                }
            })}
        </MDBListGroup>

        {/* Modal de avisar que foi enviado */}
        <MDBModal tabIndex='-1' show={enviou} setShow={setEnviou}>
            <MDBModalDialog centered>
                <MDBModalContent>
                    <MDBModalBody className='py-2'>
                        Enviado com sucesso
                    </MDBModalBody>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>

        {/* Botões de paginação e envio de destinatarios */}
        <div className='d-flex mt-3'>
            <div className='mx-1'><input value={qtdPPag} onChange={e=>{
                if(e.target.value!=='' && Number(e.target.value>=1)){
                    setQtdPPag(Number(e.target.value))
                }else setQtdPPag('')
                setDestinatariosPage(1)
            }} className="inputnumero form-control form-control-3 p-2" id="typeNumber" size='3' maxLength="3"/></div>
            <MDBBtn outline color='dark' className=' ms-auto border-1 bg-light destinatariosBotoes' onClick={e=>{sendEmails()}}><i title='Enviar à todos os emails da lista' className="edit fas fa-light fa-paper-plane py-1"></i></MDBBtn>
        </div>

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
    // Destinatarios

    function makeSecao() {
        if(secao===1){
            return(secaoQuestoes)
        }else if(secao===2){
            return(secaoDestinatarios)
        }else if(secao===3){
            return(<SecaoRespostas navigate={navigate} respostas={respostas}/>)
        }else if(secao===4){
            return(<SecaoRelatorios navigate={navigate} derivado={derivado}/>)
        }else{
            return(<UserSection navigate={navigate}/>)
        }
    }

    return(
        <section>
            {Sidebar({area:'questoes',setSecao:setsecao,qtdRespostas:respostas?.quantidadeRespostas})}
            {Navbar({navigate:navigate})}

            {makeSecao()}
        </section>
    )
}