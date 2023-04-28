import React, {useEffect,useState}from 'react'
import './Forms.css'
import axios from "axios";
import baseUrl from "../../config/api";
import {useNavigate} from 'react-router-dom';
import { CarregaQuestoes, CarregaRespostas, CarregaEnvios } from '../../config/utils';
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from '../user/UserSection'
import {
    MDBInputGroup, MDBTextArea, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBProgress, MDBProgressBar, MDBContainer, MDBInput} from 'mdb-react-ui-kit';

export default function FormsDerivados(){
    const navigate = useNavigate();

    // Conta cliques para excluir email a ser enviado
    const [click, setClick] = useState([{id:''}]);

    // Aba de respostas da aplicação
    const [respostas, setRespostas] = useState(null);
    // Aba de questoes que mostra todas as questoes do formulario
    const [questoes, setQuestoes] = useState([]);
    // Aba de envios que mostra todos os emails a serem enviados do formulario
    const [contatos, setContatos] = useState([]);
    const [contatosDB, setContatosDB] = useState([]);
    // Troca entre informações da página e do usúario
    const [main, setMain] = useState(0)

    // Seta qual secao aparece, questoes, repostas ou envios
    const [secao, setsecao] = useState(2)

    // Usado para busca de contatos
    const [nomeEmail, setNomeEmail] = useState(true);

    const [contatosPage, setContatosPage] = useState(1);

    useEffect(() => {
        if (sessionStorage.getItem("token")){
            CarregaQuestoes(setQuestoes,navigate)
            CarregaEnvios(setContatos,setContatosDB,navigate)
            CarregaRespostas(setRespostas,navigate)
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
    function renderizaQuestoes(listaQuestoes,opcao){
        if(!(listaQuestoes?.length))listaQuestoes=questoes
        let opcoes=[1,2,3,4,5,6,7,8,9,10]
        return listaQuestoes?.map(element => {
            switch (element.type) {
                case 1:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={opcao?'rounded-3 mb-3 opcao'+opcao:'rounded-3 mb-3'}>
                            <MDBInputGroup className='mb-2 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                <input className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled/>
                            </MDBInputGroup>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao1}</div>:<></>}
                                {element.opcao2?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao2}</div>:<></>}
                                {element.opcao3?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao3}</div>:<></>}
                                {element.opcao4?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao4}</div>:<></>}
                                {element.opcao5?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao5}</div>:<></>}
                                {element.opcao6?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao6}</div>:<></>}
                                {element.opcao7?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao7}</div>:<></>}
                                {element.opcao8?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao8}</div>:<></>}
                                {element.opcao9?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao9}</div>:<></>}
                                {element.opcao10?<div className='d-flex'><MDBRadio disabled name='radioNoLabel' value='' inline/>{element.opcao10}</div>:<></>}
                            </div>
                        </MDBListGroupItem>
                    )
                case 2:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={opcao?'rounded-3 mb-3 opcao'+opcao:'rounded-3 mb-3'}>
                            <MDBInputGroup className='mb-2 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                <input className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled/>
                            </MDBInputGroup>
                            <MDBTextArea rows={4} label='Resposta' readOnly className='mb-2'/>
                        </MDBListGroupItem>
                    )
                case 3:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={opcao?'rounded-3 mb-3 opcao'+opcao:'rounded-3 mb-3'}>
                            <MDBInputGroup className='mb-2 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                <input className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled/>
                            </MDBInputGroup>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao1}</div>:<></>}
                                {element.opcao2?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao2}</div>:<></>}
                                {element.opcao3?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao3}</div>:<></>}
                                {element.opcao4?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao4}</div>:<></>}
                                {element.opcao5?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao5}</div>:<></>}
                                {element.opcao6?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao6}</div>:<></>}
                                {element.opcao7?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao7}</div>:<></>}
                                {element.opcao8?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao8}</div>:<></>}
                                {element.opcao9?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao9}</div>:<></>}
                                {element.opcao10?<div className='d-flex'><MDBCheckbox disabled name='checkNoLabel' value='' inline/>{element.opcao10}</div>:<></>}
                            </div>
                        </MDBListGroupItem>
                    )
                case 4:
                    return(
                        <MDBListGroupItem noBorders key={element.id} className={opcao?'rounded-3 mb-3 opcao'+opcao:'rounded-3 mb-3'}>
                            <MDBTextArea disabled id={'questao'+element.id}
                                         defaultValue={element.enunciado} rows={4} label='Descrição' className='mb-2'/>
                        </MDBListGroupItem>
                    )
                case 9:
                    return(<div  key={element.id} >
                        <MDBListGroupItem className='rounded-2 mb-3'>
                            <MDBInputGroup className='mb-2 mt-1'>
                                <MDBBtn color='secondary' className='numQuestao'>{element.numero}</MDBBtn>
                                <input className='form-control' type='text' id={'questao'+element.id} defaultValue={element.enunciado} disabled/>
                            </MDBInputGroup>
                            <div id={"opcoes"+element.id} className='mx-2'>
                                {element.opcao1?<div className='my-1 opcao1 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao1}</div>:<></>}
                                {element.opcao2?<div className='my-1 opcao2 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao2}</div>:<></>}
                                {element.opcao3?<div className='my-1 opcao3 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao3}</div>:<></>}
                                {element.opcao4?<div className='my-1 opcao4 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao4}</div>:<></>}
                                {element.opcao5?<div className='my-1 opcao5 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao5}</div>:<></>}
                                {element.opcao6?<div className='my-1 opcao6 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao6}</div>:<></>}
                                {element.opcao7?<div className='my-1 opcao7 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao7}</div>:<></>}
                                {element.opcao8?<div className='my-1 opcao8 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao8}</div>:<></>}
                                {element.opcao9?<div className='my-1 opcao9 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao9}</div>:<></>}
                                {element.opcao10?<div className='my-1 opcao10 rounded-2 d-flex'><MDBRadio name='radioNoLabel' value='' inline/>{element.opcao10}</div>:<></>}
                            </div>
                        </MDBListGroupItem>
                        {element?.derivadas?.length?opcoes.map(numero=>{
                            return (
                                <MDBListGroup key={element.id+'respostasopcao'+numero} className='mt-1 rounded-3' >
                                    {element.derivadas?.filter(s=>s.derivadaDeOpcao===numero).length?renderizaQuestoes(element.derivadas?.filter(s=>s.derivadaDeOpcao===numero),numero):null}
                                </MDBListGroup>)
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
        {Title("Questões")}

        <MDBListGroup small className='mt-3' >
            {renderizaQuestoes()}
        </MDBListGroup>
    </main>
    // Questões

    // Contatos
    async function excluiRespostas(elemento){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formDeId")+"/enviados/"+elemento.id+"?deleta=false",{
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
        await axios.post(baseUrl+"/enviar",{UserId: sessionStorage.getItem("userId"),FormId: sessionStorage.getItem("formDeId")},{
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

    const secaoContatos = <main className='mt-3 principal'> 
        {Title("Contatos")}

        
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
            {contatos?.slice((contatosPage-1)*15,((contatosPage-1)*15)+15).map(element => {
                if(element.respondido===true){
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInputGroup>
                                <MDBBtn onClick={e=>{handleClick(element)}} color='secondary' className='numQuestao'><i className="trashcan fas fa-trash-can"></i></MDBBtn>
                                <input className='form-control' type='text' defaultValue={element.email} disabled/>
                                <div role='button' onClick={e=>{sessionStorage.setItem('enviadoId',element.id);navigate('/resposta')}} color='secondary' className='numQuestao borda-direita' id={'edit'+element.id}><i className='p-2 ms-auto fas fa-solid fa-eye'></i></div>
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

        {/* Botões de adição e envio de contatos */}
        <div className='d-flex mt-3'>
            <MDBBtn outline color='dark' className=' ms-auto border-1 bg-light contatoBotoes' onClick={e=>{sendEmails()}}><i title='Enviar à todos os emails da lista' className="edit fas fa-light fa-paper-plane py-1"></i></MDBBtn>
        </div>

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
                {Math.ceil(contatos.length/15)>5?<MDBListGroupItem className='pages'>...</MDBListGroupItem>:<></>}
            </MDBListGroup>
            :contatosPage>((Math.ceil(contatos.length/15))-3)?
            <MDBListGroup horizontal>
                {Math.ceil(contatos.length/15)-5>0?<MDBListGroupItem className='pages'>...</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)-4>0?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-4)}}>{Math.ceil(contatos.length/15)-4}</MDBListGroupItem>:<></>}
                {Math.ceil(contatos.length/15)-3>0?<MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-3)}}>{Math.ceil(contatos.length/15)-3}</MDBListGroupItem>:<></>}
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-2)}}>{Math.ceil(contatos.length/15)-2}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15)-1)}}>{Math.ceil(contatos.length/15)-1}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(Math.ceil(contatos.length/15))}}>{Math.ceil(contatos.length/15)}</MDBListGroupItem>
            </MDBListGroup>
            :contatosPage>3?
            <MDBListGroup horizontal>
                <MDBListGroupItem className='pages'>...</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage-2)}}>{contatosPage-2}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage-1)}}>{contatosPage-1}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage)}}>{contatosPage}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage+1)}}>{contatosPage+1}</MDBListGroupItem>
                <MDBListGroupItem className='pages' onClick={e=>{setContatosPage(contatosPage+2)}}>{contatosPage+2}</MDBListGroupItem>
                <MDBListGroupItem className='pages'>...</MDBListGroupItem>
            </MDBListGroup>
            :<></>}
        </div>:<></>}
    </main>
    // Contatos

    // Secao Respostas
    
    function renderizaRepostas(){
        return respostas?.map(element => {
            return(
                <div  key={element.id}>
                <MDBListGroupItem className='shadow mt-3 rounded-3'>
                    <div className='d-flex porcentagem'>{element.numero}) {element.enunciado}
                        <div className='ms-auto'>
                            {element.type===1?
                            <MDBRadio disabled defaultChecked={true} className='mt-1' value='' inline/>:
                            <MDBCheckbox disabled defaultChecked={true} className='mt-1' value='' inline/>}
                        </div>
                    </div>
                    <hr className='mt-0 mb-2'></hr>
                    <div id={"resposta"+element.id} className='mx-2'>
                        {element.type===9?makeBar(element,true):makeBar(element,false)}
                    </div>
                </MDBListGroupItem>
                {element.derivadas.length>0?renderizaRepostasDerivadas(element.derivadas,element):<></>}</div>
            )
        })
    }

    function renderizaRepostasDerivadas(derivadas, questaoOrig){
        let opcoes = [1,2,3,4,5,6,7,8,9,10]
        return opcoes.map(opcao=>{
            return (
                <MDBListGroup key={questaoOrig.id+'respostasopcao'+opcao} className='mt-1 rounded-3' >
                    {derivadas?.filter(s=>s.derivadaDeOpcao===opcao)?.map(element=>{
                        return (<MDBListGroupItem key={element.id} className={'mt-1 rounded-3 opcao'+opcao}>
                                    <div className='d-flex porcentagem'>{element.numero}) {element.enunciado}<div className='ms-auto'>{element.type===1?<MDBRadio disabled defaultChecked={true} className='mt-1' value='' inline/>:<MDBCheckbox disabled defaultChecked={true} className='mt-1' value='' inline/>}</div></div>
                                    <hr className='mt-0 mb-2'></hr>
                                    <div id={"resposta"+element.id} className='mx-2'>
                                        {makeBar(element,false)}
                                    </div>
                                </MDBListGroupItem>)})}
                </MDBListGroup>)
        })
    }

    function makeBar(element,tipo){
        let numero=0
        let sum = element.resposta.reduce((partialSum, a) => partialSum + a.quantidade, 0);
        let count=0
        return element.resposta?.map((item)=>{
            numero+=1
            count+=1
            let parcial=Math.trunc((item.quantidade/sum)*100)
            if(!parcial) parcial=0
            return(
                <div key={'Barra'+element.id+count} className='mb-2 porcentagem'> <div className={tipo?'rounded-3 opcao'+count:null}>{numero}) {item.texto}</div>
                    <MDBProgress height='30' className='rounded-3'>
                        <MDBProgressBar className='porcentagem' width={parcial} valuemin={0} valuemax={100}>{parcial}%</MDBProgressBar>
                    </MDBProgress>
                </div>
            )
        })
    }

    const secaoRespostas = <main className='mt-3 principal'> 
        {Title("Repostas")}
        <MDBListGroup small className='mt-3' >
            {renderizaRepostas()}
        </MDBListGroup>
    </main>
    // Secao Respostas

    function makeSecao() {
        if(secao===1){
            return(secaoQuestoes)
        }else if(secao===2){
            return(secaoContatos)
        }else if(secao===3){
            return(secaoRespostas)
        }else{
            return(<UserSection navigate={navigate}/>)
        }
    }

    return(
        <section>
            {Sidebar('questoes',setsecao)}
            {Navbar()}

            {makeSecao()}
        </section>
    )
}