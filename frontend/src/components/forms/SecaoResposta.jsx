import React, {useState}from 'react'
import './Forms.css'
import Title from '../template/Title'
import * as XLSX from "xlsx";
import {
    MDBInputGroup, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBProgressBar,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBContainer, MDBProgress} from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';

export default function SecaoRespostas({respostas,navigate}){
    const location = useLocation().state;
    // Usado para dizer qual a pergunta e o tipo de reposta do relatório
    const [show, setShow] = useState(false);
    
    // Usado para dizer os valores do relatório de reposta
    const [opcaoText, setOpcaoText] = useState('');
    // Usado para dizer os valores do relatório de reposta
    const [destinatariosResposta, setDestinatariosResposta] = useState([]);

    function renderizaRepostas(){
        return respostas?.respostas?.map(element => {
            return(
                <div key={element.id} className='col-md-6 col-xxl-4'>
                <MDBListGroupItem className='shadow mt-3 rounded-3'>
                    <div className='porcentagem'>
                        {element.type===1?
                        <MDBRadio disabled defaultChecked={true} className='me-0' value='' inline/>:
                        <MDBCheckbox disabled defaultChecked={true} className='me-0 mt-1' value='' inline/>}
                        {element.numero}) {element.enunciado}
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
                        return (<MDBListGroupItem key={element.id} className={'shadow mt-1 rounded-3 opcao'+opcao}>
                                    <div className='porcentagem'>
                                        {element.type===1?
                                        <MDBRadio disabled defaultChecked={true} className='me-0' value='' inline/>:
                                        <MDBCheckbox disabled defaultChecked={true} className='me-0 mt-1' value='' inline/>}
                                        {questaoOrig.numero+'.'+element.numero}) {element.enunciado}
                                    </div>
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
            if(item?.texto || parcial>0)
                return(
                    <div key={'Barra'+element.id+count} className='mb-2 porcentagem'> 
                        <div className={"px-1 mt-1 bordaCorHr rounded-top border-bottom-0  "+(tipo ? 'opcao'+count:'')}>{numero}) 
                            <div style={{cursor:'pointer',display:'inline'}} onClick={()=>{
                                setShow(item);
                                setOpcaoText(item?.texto)
                                setDestinatariosResposta(item.destinatarios)}}>{" "+(item.texto || "---")}
                            </div>
                        </div>
                        <div className={'bordaCorHr border-top-0 rounded-bottom'}>
                            <MDBProgress height='20' className='rounded-bottom'>
                                <MDBProgressBar className='porcentagem' width={parcial} valuemin={0} valuemax={100}>{parcial}%</MDBProgressBar>
                            </MDBProgress>
                        </div>
                    </div>
                )
            else return null
        })
    }

    function renderizaRelatorio(){
        return destinatariosResposta?.map(destinatario => {
            return <MDBInputGroup key={destinatario.email} className='mb-1'>
                    <input className='form-control' type='text' defaultValue={destinatario.nome||destinatario.email} disabled/>
                </MDBInputGroup>
        })
    }

    function geraObjectPlanilha(questao,index){
        return {
            ['1. ' +questao.resposta[0].texto]: questao.resposta[0].destinatarios.length>index ? (questao.resposta[0].destinatarios[index].nome || questao.resposta[0].destinatarios[index].email) : '',
            ['2. ' +questao.resposta[1].texto]: questao.resposta[1].destinatarios.length>index ? (questao.resposta[1].destinatarios[index].nome || questao.resposta[1].destinatarios[index].email) : '',
            ['3. ' +questao.resposta[2].texto]: questao.resposta[2].destinatarios.length>index ? (questao.resposta[2].destinatarios[index].nome || questao.resposta[2].destinatarios[index].email) : '',
            ['4. ' +questao.resposta[3].texto]: questao.resposta[3].destinatarios.length>index ? (questao.resposta[3].destinatarios[index].nome || questao.resposta[3].destinatarios[index].email) : '',
            ['5. ' +questao.resposta[4].texto]: questao.resposta[4].destinatarios.length>index ? (questao.resposta[4].destinatarios[index].nome || questao.resposta[4].destinatarios[index].email) : '',
            ['6. ' +questao.resposta[5].texto]: questao.resposta[5].destinatarios.length>index ? (questao.resposta[5].destinatarios[index].nome || questao.resposta[5].destinatarios[index].email) : '',
            ['7. ' +questao.resposta[6].texto]: questao.resposta[6].destinatarios.length>index ? (questao.resposta[6].destinatarios[index].nome || questao.resposta[6].destinatarios[index].email) : '',
            ['8. ' +questao.resposta[7].texto]: questao.resposta[7].destinatarios.length>index ? (questao.resposta[7].destinatarios[index].nome || questao.resposta[7].destinatarios[index].email) : '',
            ['9. ' +questao.resposta[8].texto]: questao.resposta[8].destinatarios.length>index ? (questao.resposta[8].destinatarios[index].nome || questao.resposta[8].destinatarios[index].email) : '',
            ['10. '+questao.resposta[9].texto]: questao.resposta[9].destinatarios.length>index ? (questao.resposta[9].destinatarios[index].nome || questao.resposta[9].destinatarios[index].email) : '',
        }
    }

    function GeraPlanilha(){
        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new() // Make Workbook of Excel

        respostas?.respostas?.forEach(questao => {
            // Adiciona os primeiros destinatários com o enunciado
            let dataSheetInit = [{'Enunciado':questao.enunciado}]
            Object.assign(dataSheetInit[0],geraObjectPlanilha(questao,0))
            // Pega o máximo de destinatários que uma opcão teve
            let maxDestinatarios = Math.max(...questao.resposta?.map(opcao=>opcao.destinatarios.length));
            // Adiciona os destinatários de cada resposta na coluna das mesmas
            for (let index = 1; index < maxDestinatarios; index++) {
                let dataSheet = dataSheetInit.concat(geraObjectPlanilha(questao,index))
                dataSheetInit=dataSheet
            }
            var sheet = XLSX.utils.json_to_sheet(dataSheetInit)                   // Create Sheet from JSON 
            XLSX.utils.book_append_sheet(wb, sheet, `Questão ${questao.numero}`)  // Add Worksheet to Workbook

            // Adiciona questões derivadas
            questao?.derivadas?.sort((a,b)=>a?.derivadaDeOpcao-b?.derivadaDeOpcao)?.forEach(questaoDerivada => {
                let dataDerivadaSheetInit =  [{'Enunciado':questaoDerivada.enunciado}] 
                Object.assign(dataDerivadaSheetInit[0],geraObjectPlanilha(questaoDerivada,0))
                let maxDerivadaDestinatarios = Math.max(...questaoDerivada.resposta?.map(opcao=>opcao.destinatarios.length));
                for (let index = 1; index < maxDerivadaDestinatarios; index++) {
                    let dataSheet = dataDerivadaSheetInit.concat(geraObjectPlanilha(questaoDerivada,index))
                    dataDerivadaSheetInit=dataSheet
                }
                var sheetDerivada = XLSX.utils.json_to_sheet(dataDerivadaSheetInit)                                                                        // Create Sheet Derivada from JSON 
                XLSX.utils.book_append_sheet(wb, sheetDerivada, `Questão ${questao.numero}-${questaoDerivada.derivadaDeOpcao}.${questaoDerivada.numero}`)  // Add Worksheet to Workbook
            });
        });
  
        // Export Excel file
        XLSX.writeFile(wb, `${location?location.nomePesquisa:'Nome'}.xlsx`) // name of the file is 'book.xlsx'
      
    }

    return(
        <main className='mt-3 principal'> 
            {Title(location?location.nomePesquisa:'Nome')}

            <MDBBtn color='light' className='mt-3 shadow' onClick={()=>GeraPlanilha()}>Gerar Planilha</MDBBtn>

            {/* Questões e quantidade de respostas */}
            <MDBListGroup small>
                <div className='row'>
                    {renderizaRepostas()}
                </div>
            </MDBListGroup>

            {/* Modal de pessoas que responderam */}
            <MDBModal show={show} tabIndex='-1' setShow={setShow}>
                <MDBModalDialog size='md'>
                <MDBModalContent>
                    <MDBModalHeader>
                    <MDBModalTitle>{opcaoText}</MDBModalTitle>
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


// Implementação com vírgula:
// function GeraPlanilha(){
//     // A workbook is the name given to an Excel file
//     var wb = XLSX.utils.book_new() // Make Workbook of Excel

//     respostas?.respostas?.forEach(questao => {
//         let dataSheetInit = [{'Enunciado':questao.enunciado}]
//         let dataSheet = dataSheetInit.concat(questao.resposta?.map(opcao => { return {
//             'Opção':opcao.texto, 
//             'Quem Respondeu':opcao.destinatarios.map(e=>{
//                 if(e.nome) return e.nome
//                 else return e.email
//             }).join(', ')
//         }}))
//         var sheet = XLSX.utils.json_to_sheet(dataSheet)             // Create Sheet from JSON 
//         XLSX.utils.book_append_sheet(wb, sheet, `Questão ${questao.numero}`)  // Add Worksheet to Workbook

//         // Adiciona questões derivadas
//         questao?.derivadas?.sort((a,b)=>a?.derivadaDeOpcao-b?.derivadaDeOpcao)?.forEach(questaoDerivada => {
//             let dataDerivadaSheetInit =  [{'Enunciado':questaoDerivada.enunciado}] 
//             let dataDerivadaSheet = dataDerivadaSheetInit.concat(questaoDerivada.resposta?.map(opcao => { return {
//                 'Opção':opcao.texto, 
//                 'Quem Respondeu':opcao.destinatarios.map(e=>{
//                     if(e.nome) return e.nome
//                     else return e.email
//                 }).join(', ')
//             }}))
//             var sheetDerivada = XLSX.utils.json_to_sheet(dataDerivadaSheet)             // Create Sheet Derivada from JSON 
//             XLSX.utils.book_append_sheet(wb, sheetDerivada, `Questão ${questao.numero}-${questaoDerivada.derivadaDeOpcao}.${questaoDerivada.numero}`)  // Add Worksheet to Workbook
//         });
//     });

//     // Export Excel file
//     XLSX.writeFile(wb, `${location?location.nomePesquisa:'Nome'}.xlsx`) // name of the file is 'book.xlsx'
  
// }