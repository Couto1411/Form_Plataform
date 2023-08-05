import React, { useEffect, useState } from 'react'
import './Forms.css'
import Title from '../template/Title'
import { MDBBtn, MDBCheckbox, MDBContainer, MDBRadio, MDBTabs, MDBTabsContent, MDBTabsItem, MDBTabsLink, MDBTabsPane } from 'mdb-react-ui-kit'
import { CarregaCursos, CarregaQuestoes, CarregaRelatorio } from '../../config/utils'
import { Link, useLocation } from 'react-router-dom';

export default function SecaoRelatorios({navigate,derivado}){
    const location = useLocation().state;
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
    // Carrega Query para pdf
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
                    return <MDBCheckbox labelStyle={{wordBreak:'break-all'}} id={'c'+curso.id} name='cursoFiltro' key={'curso'+curso.id} label={curso.curso}/>
                })}
            </div>,
            <div key='modalidadesFiltro' style={filtro===2?{display:'block'}:{display:'none'}}>
                {modalidades?.map(modalidade => {
                    return <MDBCheckbox labelStyle={{wordBreak:'break-all'}} id={'m'+modalidade.id} name='modalidadeFiltro' key={'modalidade'+modalidade.id} label={modalidade.modalidade}/>
                })}
            </div>,
            <div key='datasFiltro' style={filtro===3?{display:'block'}:{display:'none'}}>
                <MDBCheckbox name='dataColacaoAntes'  label={<div>Antes de: <input className='mx-2 dataRelatorios' type="date" id='dataAntesFiltro'  defaultValue={(new Date().toISOString().split('T')[0])}/></div>}/>
                <MDBCheckbox name='dataColacaoDepois' label={<div>Depois de:<input className='mx-1 dataRelatorios' type="date" id='dataDepoisFiltro' defaultValue={(new Date().toISOString().split('T')[0])}/></div>}/>
            </div>,
            <div key='questoesFiltro' style={filtro===4?{display:'block'}:{display:'none'}}>
                {questoes?.filter(e=>e.type===1||e.type===3||e.type===9)?.map(questao => {
                    return [
                        <div key={'questaoFiltro'+questao.id}>{questoesFiltros(questao)}</div>,
                        <div key={'questaoFiltroDerivadas'+questao.id}>
                            {[1,2,3,4,5,6,7,8,9,10].map(num=>{
                                return questao?.derivadas?.filter(e=>(e.derivadaDeOpcao===num && (e.type===1||e.type===3||e.type===9))).map(questaoDerivada=>{
                                    return questoesFiltros(questaoDerivada)
                                })
                            })}
                        </div>
                    ]
                })}
            </div>
        ]
    }

    function questoesFiltros(questao){
        return [
            <MDBCheckbox key={'questaoFiltro'+questao.id} name='questaoFiltro' label={questao.enunciado} labelStyle={{wordBreak:'break-all'}}
            value={questao.id}    
            className={questao?.derivadaDeOpcao?'opcao'+questao?.derivadaDeOpcao:''}
                onClick={(e)=>{e.target.checked?
                    document.getElementById('respostas'+questao.id).style.display='inline-block':
                    document.getElementById('respostas'+questao.id).style.display='none'}}/>,
            <div key={'respostas'+questao.id} id={'respostas'+questao.id} style={{display:'none'}}> 
                {questao?.opcao1  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '1' )} name={'respostaFiltro'+questao.id} value={1}  label={questao?.opcao1 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao2  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '2' )} name={'respostaFiltro'+questao.id} value={2}  label={questao?.opcao2 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao3  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '3' )} name={'respostaFiltro'+questao.id} value={3}  label={questao?.opcao3 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao4  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '4' )} name={'respostaFiltro'+questao.id} value={4}  label={questao?.opcao4 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao5  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '5' )} name={'respostaFiltro'+questao.id} value={5}  label={questao?.opcao5 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao6  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '6' )} name={'respostaFiltro'+questao.id} value={6}  label={questao?.opcao6 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao7  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '7' )} name={'respostaFiltro'+questao.id} value={7}  label={questao?.opcao7 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao8  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '8' )} name={'respostaFiltro'+questao.id} value={8}  label={questao?.opcao8 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao9  && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '9' )} name={'respostaFiltro'+questao.id} value={9}  label={questao?.opcao9 } labelStyle={{wordBreak:'break-all'}}/>}
                {questao?.opcao10 && <MDBCheckbox className={'mx-2 opcao'+(questao.derivadas.length>0 && '10')} name={'respostaFiltro'+questao.id} value={10} label={questao?.opcao10} labelStyle={{wordBreak:'break-all'}}/>}
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

    async function geraRelatorio(){
        let Query = {}
        let avancado = document.getElementsByName('relatorioAvancado')[0].checked
        Query.avancado           = avancado
        Query.id                 = derivado?derivado:+sessionStorage.getItem('formId')
        Query.cursoFiltros       = avancado?[...document.getElementsByName('cursoFiltro')].filter(e=>e.checked).map(e=>+(e.id.substring(1))):[]
        Query.modalidadeFiltros  = avancado?[...document.getElementsByName('modalidadeFiltro')].filter(e=>e.checked).map(e=>+(e.id.substring(1))):[]
        Query.dataAntes          = avancado?document.getElementsByName('dataColacaoAntes')[0].checked ?document.getElementById('dataAntesFiltro').value :null:null
        Query.dataDepois         = avancado?document.getElementsByName('dataColacaoDepois')[0].checked?document.getElementById('dataDepoisFiltro').value:null:null
        Query.questoesFiltros    = []
        if (avancado) {
            let questoesFiltros = [...document.getElementsByName('questaoFiltro')].filter(e=>e.checked).map(e=>+e.value)
            questoesFiltros.forEach(questaoId => {
                Query.questoesFiltros.push({
                    questao: questaoId,
                    opcoes: [...document.getElementsByName('respostaFiltro'+questaoId)].filter(e=>e.checked).map(e=>+e.value)
                })
            });
        }
        Query.questoesEscolhidas = [...document.getElementsByName('questaoEscolhida')].filter(e=>e.checked).map(e=>+(e.id.substring(1)))
        CarregaRelatorio(setDados,navigate,Query,false).then(setQuery(Query))
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
                    <MDBRadio name='filtroSelecionado' label='Repostas'          inline onClick={e=>setFiltro(4)}  className='mx-sm-2'/>
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
            {Title(location?location.nomePesquisa:'Nome')}

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
                        <MDBBtn color='light' className='shadow'>Gerar PDF</MDBBtn>
                    </Link>
                    <div id='relatorios'>
                        {renderizaRelatorio()}
                    </div>
                    <Link role='button' to={{pathname: '/load/relatorio',search: '?'+JSON.stringify(query)+'?token='+sessionStorage.getItem('token')}} target='_blank'>
                        <MDBBtn color='light' className='mt-3 shadow'>Gerar PDF</MDBBtn>
                    </Link>
                </MDBTabsPane>
            </MDBTabsContent>
        </main>
    )
}