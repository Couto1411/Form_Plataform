import React, {useEffect,useState}from 'react'
import './dashboard.css'
import { Chart as ChartJS, Colors, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Titulo from '../template/Title'
import {  CarregaForms, CarregaQuestoesUser, CarregaDashboard, RemoveSessao} from '../../config/utils'
import {useNavigate} from 'react-router-dom'
import {
    MDBBtn, MDBContainer, MDBCheckbox, MDBRadio,
    MDBModal,MDBModalContent,MDBModalDialog,MDBModalHeader,MDBModalTitle
} from 'mdb-react-ui-kit'

ChartJS.register( ArcElement,Colors, Title, Tooltip, Legend);

export default function Dashboard(){
    const navigate = useNavigate();

    // Lista de formulários do usuário
    const [forms, setforms] = useState([]);
    const [formSelected, setFormSelected] = useState(null);

    // Lista de questões do formulário
    const [questoes, setQuestoes] = useState([]);

    // Mostra relatório
    const [show, setShow] = useState(false)

    // Informações para gráficos
    const [datasets, setDatasets] = useState([]);
    const [labels, setLabels] = useState([])
    const backgroundColor= ['rgba(255, 99, 132, 0.5)','rgba(34, 198, 173, 0.5)','rgba(0, 255, 255, 0.5)','rgba(255, 150, 51, 0.5)',
                            'rgba(82, 191, 228, 0.5)','rgba(184, 43, 92, 0.5)','rgba(17, 132, 255, 0.5)','rgba(249, 217, 76, 0.5)',
                            'rgba(63, 255, 134, 0.5)','rgba(128, 75, 195, 0.5)']
    const legenda = 'Número de respostas'
    const options = {
        plugins: {
            datalabels: {
                color: 'blue',
                labels: { title: { font: { weight: 'bold' } } }
            },
            legend: {
                labels: {
                    generateLabels: chart => chart.data.labels.map((l, i) => ({
                        datasetIndex: 0,
                        index: i,
                        text: l.substr(0,l.indexOf(' ')),
                        fillStyle: chart.data.datasets[0].backgroundColor[i],
                        strokeStyle: chart.data.datasets[0].backgroundColor[i],
                        hidden: false
                    })),
                    boxWidth: 20, 
                    font: { size: 14 }
                },
                position: 'top',
            }
        },
    };

    useEffect(() => {
        if (sessionStorage.getItem("token")){
            CarregaForms(setforms, navigate)
            CarregaQuestoesUser(setQuestoes,navigate)
        }
        else{
            alert("Faça o login")
            navigate('/login')
            RemoveSessao()
        }

    }, []);

    function renderizaForms(){
        return forms?.map(element => {
            let tempDate= new Date( Date.parse(element.dataEnviado))
            return(
                <div key={element.id} className='pb-1 align-items-center'>
                    <MDBRadio name='Formularios' value={element.id} inline onClick={e=>{setFormSelected(element)}}/> {element.titulo} {element.dataEnviado?<i>({tempDate.toLocaleDateString('en-GB')})</i>:<></>}
                </div>
            )
        });
    }

    function renderizaDerivados(){
        if (formSelected) {
            let derivados=forms.find(element => element.id === formSelected.id).derivados
            if (derivados.length>0){
                return <MDBContainer className="shadow bg-light mt-3 rounded-3 p-3 ">
                    <h5 className='fixed'>Quais variações quer comparar?</h5>
                    <hr className='mt-0 mb-3'></hr>
                    <MDBContainer id={"SelectFormularios"} className='formsselect mt-3 rounded-3 overflow-auto'>
                        {derivados.map(item =>{
                            let tempDate= new Date( Date.parse(item.dataEnviado))
                            return(
                                <div key={item.id} className='pb-1 align-items-center'>
                                    <MDBCheckbox name='FormulariosDev' value={item.id} inline/> {item.titulo} {item.dataEnviado?<i>({tempDate.toLocaleDateString('en-GB')})</i>:<></>}
                                </div>
                            )
                        })}
                    </MDBContainer>
                </MDBContainer>
            }
        }
    }

    function renderizaQuestoes(){
        if (formSelected && formSelected.id) {
            return <MDBContainer className="shadow bg-light mt-3 rounded-3 p-3 ">
                    <h5 className='fixed'>Quais questões quer comparar?</h5>
                    <hr className='mt-0 mb-3'></hr>
                    <MDBContainer id={"SelectFormularios"} className='formsselectbig mt-3 rounded-3 overflow-auto'>
                        {questoes.filter(e=>e.formId===formSelected.id).map(item =>{
                            return(
                                <div key={item.id} className='pb-1 align-items-center'>
                                    <MDBCheckbox name='Questoes' value={item.id} inline/> {item.enunciado}
                                    {item.derivadas.map(element=>{
                                        return (<div key={element.id} className={'align-items-center opcao'+element.derivadaDeOpcao}>
                                            <MDBCheckbox name='Questoes' value={element.id} inline/> {element.enunciado}
                                        </div>)
                                    })}
                                </div>
                            )
                        })}
                    </MDBContainer>
                </MDBContainer>
        }
    }

    function renderizaGraficos(){
        if (labels.length>0) {
            let cont=0
            return labels?.map(element => {
                let dado = { 
                    labels: element.opcoes,
                    datasets: []
                }
                datasets.forEach(x => {
                    let sets={}
                    sets.label=legenda
                    sets.backgroundColor=backgroundColor
                    sets.data=x[cont]
                    dado.datasets.push(sets)
                })
                cont+=1
                if(dado.datasets.length>0) return (<div key={'questao'+cont} className='col-lg-4 col-md-6 mb-3'><div className='d-flex justify-content-center'>Questão {element.numero}</div><Pie className='graficos' data={dado} options={options} /></div>)
                else return (<></>)
            })
        }
    }

    async function geraDashboard(){
        if (formSelected) {
            let check=[]
            let quests=[]
            let derivados=forms.find(element => element.id === formSelected.id).derivados
            if (derivados.length>0){
                let derivados = document.getElementsByName('FormulariosDev');  
                for (var checkbox of derivados) {  
                    if (checkbox.checked) check.push(+checkbox.value);  
                } 
            }
            let questoes = document.getElementsByName('Questoes');  
            for (var checkboxQuest of questoes) {  
                if (checkboxQuest.checked) quests.push(+checkboxQuest.value);  
            } 
            CarregaDashboard(setDatasets,setLabels, navigate, formSelected.id, JSON.stringify(check), JSON.stringify(quests))
            setShow(true)
        }
    }

    return(
        <main className='mt-3 principal'>
            {Titulo("Dashboard")}

            {/* Informações do usuários */}
            <MDBContainer className="shadow bg-light mt-3 rounded-3 p-3 ">
                <h5 className='fixed'>Qual formulário deseja fazer o dashboard?</h5>
                <hr className='mt-0 mb-3'></hr>
                <MDBContainer id={"SelectFormularios"} className='formsselect mt-3 rounded-3 overflow-auto'>
                    {renderizaForms()}
                </MDBContainer>
            </MDBContainer>
            {renderizaDerivados()}
            {renderizaQuestoes()}
            <MDBContainer className="d-flex mt-4"><MDBBtn className='ms-auto shadow' color='light' onClick={e=>{geraDashboard()}}>Gerar relatório</MDBBtn></MDBContainer>
            <MDBModal show={show} tabIndex='-1' setShow={setShow}>
                <MDBModalDialog size='xl'>
                <MDBModalContent>
                    <MDBModalHeader>
                    <MDBModalTitle>{formSelected?.titulo}</MDBModalTitle>
                    <MDBBtn className='btn-close' color='none' onClick={e=>setShow(false)}></MDBBtn>
                    </MDBModalHeader>
                    <MDBContainer className='mt-2 mb-3 d-flex row justify-content-center'>
                        {renderizaGraficos()}
                    </MDBContainer>
                </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </main>
    )
}