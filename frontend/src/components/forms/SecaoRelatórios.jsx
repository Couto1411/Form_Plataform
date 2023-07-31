import React, { useEffect, useState } from 'react'
import './Forms.css'
import Title from '../template/Title'
import { MDBBtn, MDBCheckbox, MDBContainer, MDBRadio, MDBTabs, MDBTabsContent, MDBTabsItem, MDBTabsLink, MDBTabsPane } from 'mdb-react-ui-kit'
import { CarregaCursos, CarregaQuestoes, CarregaRelatorio } from '../../config/utils'
import { Link } from 'react-router-dom';

export default function SecaoRelatorios({navigate,derivado}){
    // Seta se o relatório vai ser avançado ou não
    const [avancado,setAvancado] = useState(false)
    const [filtro,setFiltro] = useState(1)

    // Carrega cursos e modalidades
    const [cursos, setCursos] = useState([])
    const [modalidades, setModalidades] = useState([])

    // Carrega questoes
    const [questoes, setQuestoes] = useState([])

    // Carrega dados
    const [dados, setDados] = useState([])
    const [query, setQuery] = useState({})

    // Tabs
    const [tab, setTab] = useState('tab1');

    useEffect(() => {
        CarregaQuestoes(setQuestoes)
        CarregaCursos(setCursos,setModalidades,navigate)
    },[navigate])

    const handleClick = (value) => {
        if (value === tab) return;
        setTab(value);
    };

    async function geraRelatorio(){
        let Query = {}
        let avancado = document.getElementsByName('relatorioAvancado')[0].checked
        Query.avancado           = avancado
        Query.id                 = derivado?derivado:+sessionStorage.getItem('formId')
        Query.cursoFiltros       = avancado?[...document.getElementsByName('cursoFiltro')].filter(e=>e.checked).map(e=>+(e.id.substring(1))):[]
        Query.modalidadeFiltros  = avancado?[...document.getElementsByName('modalidadeFiltro')].filter(e=>e.checked).map(e=>+(e.id.substring(1))):[]
        Query.dataAntes          = avancado?document.getElementsByName('dataColacaoAntes')[0].checked ?document.getElementById('dataAntesFiltro').value :null:null
        Query.dataDepois         = avancado?document.getElementsByName('dataColacaoDepois')[0].checked?document.getElementById('dataDepoisFiltro').value:null:null
        Query.questoesEscolhidas = [...document.getElementsByName('questaoEscolhida')].filter(e=>e.checked).map(e=>+(e.id.substring(1)))
        CarregaRelatorio(setDados,navigate,Query,false).then(setQuery(Query))
    }

    function renderizaQuestoes(){
        return questoes?.map(questao =>{
            return [
                <MDBCheckbox id={'q'+questao.id} name='questaoEscolhida' key={'questao'+questao.id} label={questao.enunciado} labelStyle={{wordBreak:'break-word'}}/>,
                questao?.derivadas?.map(questaoDerivada=>{
                    return <MDBCheckbox id={'q'+questaoDerivada.id} name='questaoEscolhida' key={'questaoDerivada'+questaoDerivada.id} label={questaoDerivada.enunciado} labelStyle={{wordBreak:'break-word'}}/>
                })
            ]
        })
    }

    function renderizaFiltros(){
        return [
            <div key='cursosFiltro' style={filtro===1?{display:'block'}:{display:'none'}}>
                {cursos?.map(curso => {
                    return <MDBCheckbox id={'c'+curso.id} name='cursoFiltro' key={'curso'+curso.id} label={curso.curso}/>
                })}
            </div>,
            <div key='modalidadesFiltro' style={filtro===2?{display:'block'}:{display:'none'}}>
                {modalidades?.map(modalidade => {
                    return <MDBCheckbox id={'m'+modalidade.id} name='modalidadeFiltro' key={'modalidade'+modalidade.id} label={modalidade.modalidade}/>
                })}
            </div>,
            <div key='datasFiltro' style={filtro===3?{display:'block'}:{display:'none'}}>
                <MDBCheckbox name='dataColacaoAntes'  label={<div>Antes de: <input className='mx-2 dataRelatorios' type="date" id='dataAntesFiltro'  defaultValue={(new Date().toISOString().split('T')[0])}/></div>}/>
                <MDBCheckbox name='dataColacaoDepois' label={<div>Depois de:<input className='mx-1 dataRelatorios' type="date" id='dataDepoisFiltro' defaultValue={(new Date().toISOString().split('T')[0])}/></div>}/>
            </div>
        ]
    }

    function renderizaRelatorio(){
        return dados.map(item=>{
            return <div key={'ConteudoRelatorio'+item.destinatario?.id} id={'ConteudoRelatorio'+item.destinatario?.id} className='mt-3'>
                <MDBContainer fluid className='shadow p-2 rounded-3 bg-light'>
                    <div className='text-center'>{item.destinatario?.nome?item.destinatario?.nome:item.destinatario.email}</div>
                    <hr className='my-1 mb-2'/>
                </MDBContainer>
                {item.respostas?.map(resposta =>{
                    return <MDBContainer key={item.destinatario?.id+'resposta'+resposta.id} fluid className='p-2 rounded-2 bg-light mt-3' style={{wordBreak:'break-all'}}>
                        <div style={{fontWeight: 'bold'}}>{resposta.numero}) {resposta.enunciado}</div>
                        {resposta.type===3?
                            <div>
                                <div style={{textDecoration:'underline', display:'inline'}}>Respostas</div>:<br/>
                                <ul style={{marginBottom:0}}>
                                    {resposta?.checks?.map((resposta,index)=>{
                                        return <li key={'questao'+resposta.id+'check'+index} style={{lineHeight:'1em'}}>{resposta}</li> 
                                    })}
                                </ul>
                            </div>:
                            <div>
                                <div style={{textDecoration:'underline', display:'inline'}}>Resposta</div>: {resposta.radio??resposta.texto}
                            </div>}
                    </MDBContainer>
                })}
            </div>
        })
    }

    function Filtros(){
        return <div>
            <MDBContainer fluid className='shadow mt-3 pt-2 pb-1 rounded-3 bg-light'>
                <MDBCheckbox name='relatorioAvancado' label='Avançado' inline onClick={()=>setAvancado(!avancado)}/>
                <div className='ovHidden' style={avancado?{maxHeight:'500em',transition: 'max-height 4s'}:{maxHeight:'0px',transition: 'max-height 0.5s'}}>
                    <hr className='my-1 mb-2'/>
                    <MDBRadio name='filtroSelecionado' label='Curso'             inline onClick={e=>setFiltro(1)}  defaultChecked/>
                    <MDBRadio name='filtroSelecionado' label='Modalidade'        inline onClick={e=>setFiltro(2)}  className='mx-sm-2'/>
                    <MDBRadio name='filtroSelecionado' label='Data Colação'      inline onClick={e=>setFiltro(3)}  className='mx-sm-2'/>
                    <MDBRadio name='filtroSelecionado' label='Repostas' disabled inline onClick={e=>setFiltro(4)}  className='mx-sm-2'/>
                    <hr className='my-1 mb-2'/>
                    {renderizaFiltros()}
                </div>
            </MDBContainer>
            
            <MDBContainer fluid className='shadow mt-3 pt-2 pb-1 rounded-3 bg-light'>
                <MDBCheckbox name='SelecionarTudoQuestoes' label='Selecionar Tudo' onClick={()=>{
                    document.getElementsByName('SelecionarTudoQuestoes')[0].checked?
                    document.getElementsByName('questaoEscolhida').forEach(e=>e.checked=true):
                    document.getElementsByName('questaoEscolhida').forEach(e=>e.checked=false)

                }}/>
                <hr className='my-2'/>
                {renderizaQuestoes()}
            </MDBContainer>

            <div className='d-flex mt-3'>
                <MDBBtn className='ms-auto' onClick={()=>geraRelatorio()}>Gerar</MDBBtn>
            </div>
        </div>
    }

    return(
        <main className='mt-3 principal'> 
            {Title(sessionStorage.getItem('nomePesquisa'))}

            {dados.length>0 && <MDBTabs justify className='my-3'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleClick('tab1')} active={tab === 'tab1'}>
                        Novo Relatório
                    </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleClick('tab2')} active={tab === 'tab2'}>
                        Relatório Atual
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>}

            <MDBTabsContent>
                <MDBTabsPane show={tab === 'tab1'}>
                    {Filtros()}
                </MDBTabsPane>
                <MDBTabsPane show={tab === 'tab2'}>
                    <Link role='button' to={{pathname: '/load/relatorio',search: '?'+JSON.stringify(query)+'?token='+sessionStorage.getItem('token')}} target='_blank'>
                        <MDBBtn color='light'>Gerar PDF</MDBBtn>
                    </Link>
                    <div className='testes' id='relatorios'>
                        {renderizaRelatorio()}
                    </div>
                    <Link role='button' to={{pathname: '/load/relatorio',search: '?'+JSON.stringify(query)+'?token='+sessionStorage.getItem('token')}} target='_blank'>
                        <MDBBtn color='light' className='mt-3'>Gerar PDF</MDBBtn>
                    </Link>
                </MDBTabsPane>
            </MDBTabsContent>
        </main>
    )
}