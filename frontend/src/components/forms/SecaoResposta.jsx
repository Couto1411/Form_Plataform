import React, {useState}from 'react'
import './Forms.css'
import Title from '../template/Title'
import * as XLSX from "xlsx";
import {
    MDBInputGroup, MDBRadio, MDBCheckbox,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBProgressBar,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalTitle, MDBContainer, MDBProgress} from 'mdb-react-ui-kit';

export default function SecaoRespostas({respostas,navigate}){
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
                        <MDBRadio disabled defaultChecked={true} className='mt-1' value='' inline/>:
                        <MDBCheckbox disabled defaultChecked={true} className='mt-1' value='' inline/>}
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
                            setOpcaoText(item?.texto)
                            setDestinatariosResposta(item.destinatarios)}}>{" "+item.texto}
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
        return destinatariosResposta?.map(destinatario => {
            return <MDBInputGroup key={destinatario.email} className='mb-1'>
                    <input className='form-control' type='text' defaultValue={destinatario.nome||destinatario.email} disabled/>
                </MDBInputGroup>
        })
    }

    function GeraPlanilha(){
        // A workbook is the name given to an Excel file
        var wb = XLSX.utils.book_new() // Make Workbook of Excel

        respostas?.respostas?.forEach(questao => {
            // Adiciona coluna com o enunciado
            let dataSheetInit = [{'Enunciado':questao.enunciado}]
            // Pega o máximo de destinatários que uma opcão teve
            let maxDestinatarios = Math.max(...questao.resposta?.map(opcao=>opcao.destinatarios.length));
            // Adiciona os destinatários de cada resposta na coluna das mesmas
            for (let index = 0; index < maxDestinatarios; index++) {
                let dataSheet = dataSheetInit.concat({
                    [questao.resposta[0].texto]: questao.resposta[0].destinatarios.length>index ? (questao.resposta[0].destinatarios[index].nome || questao.resposta[0].destinatarios[index].email) : '',
                    [questao.resposta[1].texto]: questao.resposta[1].destinatarios.length>index ? (questao.resposta[1].destinatarios[index].nome || questao.resposta[1].destinatarios[index].email) : '',
                    [questao.resposta[2].texto]: questao.resposta[2].destinatarios.length>index ? (questao.resposta[2].destinatarios[index].nome || questao.resposta[2].destinatarios[index].email) : '',
                    [questao.resposta[3].texto]: questao.resposta[3].destinatarios.length>index ? (questao.resposta[3].destinatarios[index].nome || questao.resposta[3].destinatarios[index].email) : '',
                    [questao.resposta[4].texto]: questao.resposta[4].destinatarios.length>index ? (questao.resposta[4].destinatarios[index].nome || questao.resposta[4].destinatarios[index].email) : '',
                    [questao.resposta[5].texto]: questao.resposta[5].destinatarios.length>index ? (questao.resposta[5].destinatarios[index].nome || questao.resposta[5].destinatarios[index].email) : '',
                    [questao.resposta[6].texto]: questao.resposta[6].destinatarios.length>index ? (questao.resposta[6].destinatarios[index].nome || questao.resposta[6].destinatarios[index].email) : '',
                    [questao.resposta[7].texto]: questao.resposta[7].destinatarios.length>index ? (questao.resposta[7].destinatarios[index].nome || questao.resposta[7].destinatarios[index].email) : '',
                    [questao.resposta[8].texto]: questao.resposta[8].destinatarios.length>index ? (questao.resposta[8].destinatarios[index].nome || questao.resposta[8].destinatarios[index].email) : '',
                    [questao.resposta[9].texto]: questao.resposta[9].destinatarios.length>index ? (questao.resposta[9].destinatarios[index].nome || questao.resposta[9].destinatarios[index].email) : '',
                })
                dataSheetInit=dataSheet
            }
            var sheet = XLSX.utils.json_to_sheet(dataSheetInit)                   // Create Sheet from JSON 
            XLSX.utils.book_append_sheet(wb, sheet, `Questão ${questao.numero}`)  // Add Worksheet to Workbook

            // Adiciona questões derivadas
            questao?.derivadas?.sort((a,b)=>a?.derivadaDeOpcao-b?.derivadaDeOpcao)?.forEach(questaoDerivada => {
                let dataDerivadaSheetInit =  [{'Enunciado':questaoDerivada.enunciado}] 
                let maxDerivadaDestinatarios = Math.max(...questaoDerivada.resposta?.map(opcao=>opcao.destinatarios.length));
                for (let index = 0; index < maxDerivadaDestinatarios; index++) {
                    let dataSheet = dataDerivadaSheetInit.concat({
                        [questaoDerivada.resposta[0].texto]: questaoDerivada.resposta[0].destinatarios.length>index ? (questaoDerivada.resposta[0].destinatarios[index].nome || questaoDerivada.resposta[0].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[1].texto]: questaoDerivada.resposta[1].destinatarios.length>index ? (questaoDerivada.resposta[1].destinatarios[index].nome || questaoDerivada.resposta[1].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[2].texto]: questaoDerivada.resposta[2].destinatarios.length>index ? (questaoDerivada.resposta[2].destinatarios[index].nome || questaoDerivada.resposta[2].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[3].texto]: questaoDerivada.resposta[3].destinatarios.length>index ? (questaoDerivada.resposta[3].destinatarios[index].nome || questaoDerivada.resposta[3].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[4].texto]: questaoDerivada.resposta[4].destinatarios.length>index ? (questaoDerivada.resposta[4].destinatarios[index].nome || questaoDerivada.resposta[4].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[5].texto]: questaoDerivada.resposta[5].destinatarios.length>index ? (questaoDerivada.resposta[5].destinatarios[index].nome || questaoDerivada.resposta[5].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[6].texto]: questaoDerivada.resposta[6].destinatarios.length>index ? (questaoDerivada.resposta[6].destinatarios[index].nome || questaoDerivada.resposta[6].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[7].texto]: questaoDerivada.resposta[7].destinatarios.length>index ? (questaoDerivada.resposta[7].destinatarios[index].nome || questaoDerivada.resposta[7].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[8].texto]: questaoDerivada.resposta[8].destinatarios.length>index ? (questaoDerivada.resposta[8].destinatarios[index].nome || questaoDerivada.resposta[8].destinatarios[index].email) : '',
                        [questaoDerivada.resposta[9].texto]: questaoDerivada.resposta[9].destinatarios.length>index ? (questaoDerivada.resposta[9].destinatarios[index].nome || questaoDerivada.resposta[9].destinatarios[index].email) : '',
                    })
                    dataDerivadaSheetInit=dataSheet
                }
                var sheetDerivada = XLSX.utils.json_to_sheet(dataDerivadaSheetInit)                                                                        // Create Sheet Derivada from JSON 
                XLSX.utils.book_append_sheet(wb, sheetDerivada, `Questão ${questao.numero}-${questaoDerivada.derivadaDeOpcao}.${questaoDerivada.numero}`)  // Add Worksheet to Workbook
            });
        });
  
        // Export Excel file
        XLSX.writeFile(wb, `${sessionStorage.getItem('nomePesquisa')}.xlsx`) // name of the file is 'book.xlsx'
      
    }

    return(
        <main className='mt-3 principal'> 
            {Title(sessionStorage.getItem('nomePesquisa'))}

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
//     XLSX.writeFile(wb, `${sessionStorage.getItem('nomePesquisa')}.xlsx`) // name of the file is 'book.xlsx'
  
// }