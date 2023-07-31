import React, {useState}from 'react'
import {CarregaDestinatariosResposta } from '../../config/utils';
import './Forms.css'
import Title from '../template/Title'
import {
    MDBInputGroup, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBProgressBar,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBContainer, MDBProgress} from 'mdb-react-ui-kit';

export default function SecaoRespostas({respostas,navigate}){

    // Usado para dizer qual a pergunta e o tipo de reposta do relatório
    const [show, setShow] = useState(false);
    
    // Usado para dizer os valores do relatório de reposta
    const [destinatariosResposta, setDestinatariosResposta] = useState([]);

    function renderizaRepostas(){
        return respostas?.respostas?.map(element => {
            return(
                <div key={element.id} className='col-md-6 col-xxl-4'>
                <MDBListGroupItem className='shadow mt-3 rounded-3'>
                    <div className='porcentagem'>
                        {element.type===1?
                        <MDBRadio disabled defaultChecked={true} className='mt-1' value='' inline/>:
                        <MDBCheckbox disabled defaultChecked={true} className='mt-1' value='' inline/>}
                        {element.numero+") "+element.enunciado}
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
        return element.resposta?.map((item,index)=>{
            numero+=1
            count+=1
            let parcial=Math.trunc((item.quantidade/sum)*100)
            if(!parcial) parcial=0
            return(
                <div key={'Barra'+element.id+count} className='mb-2 porcentagem'> 
                    <div className={tipo?'rounded-3 px-1 mt-1 opcao'+count:"px-1 mt-1"}>{numero}) 
                        <div style={{cursor:'pointer',display:'inline'}} onClick={()=>{
                            setShow(item);
                            CarregaDestinatariosResposta(setDestinatariosResposta,navigate,sessionStorage.getItem('formId'),element?.id,item);}}>{" "+item.texto}
                        </div>
                    </div>
                    <MDBProgress height='20' className='rounded-3'>
                        <MDBProgressBar className='porcentagem' width={parcial} valuemin={0} valuemax={100}>{parcial}%</MDBProgressBar>
                    </MDBProgress>
                </div>
            )
        })
    }

    function renderizaRelatorio(){
        return destinatariosResposta?.data?.map(destinatario => {
            return <MDBInputGroup key={destinatario.email} className='mb-1'>
                    <input className='form-control' type='text' defaultValue={destinatario.email} disabled/>
                </MDBInputGroup>
        })
    }

    return(
        <main className='mt-3 principal'> 
            {Title(sessionStorage.getItem('nomePesquisa'))}
            <MDBListGroup small className='mt-3' >
                <div className='row'>
                    {renderizaRepostas()}
                </div>
            </MDBListGroup>
            <MDBModal show={show} tabIndex='-1' setShow={setShow}>
                <MDBModalDialog size='md'>
                <MDBModalContent>
                    <MDBModalHeader>
                    <MDBModalTitle>{destinatariosResposta?.enunciado}</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={e=>setShow(false)}></MDBBtn>
                    </MDBModalHeader>
                    <MDBContainer className='mt-2 mb-3 d-flex row justify-content-center'>
                        {renderizaRelatorio()}
                    </MDBContainer>
                </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </main>
    )
}