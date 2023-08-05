import { MDBCollapse, MDBContainer, MDBIcon, MDBListGroup, MDBListGroupItem, MDBNavbar, MDBNavbarBrand, MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import Logo from '../template/Logo';
import './Home.css'
import Login from './Login';
import { useLocation } from 'react-router-dom';
import { Parallax,ParallaxLayer } from "@react-spring/parallax";


export default function Home({navigate}){
    const location = useLocation().state
    const [ativo,setAtivo] = useState('home')
    const [showNavSecond,setShowNavSecond] = useState(false)

    useEffect(()=>{
        if(location?.redirect) setAtivo('login')
        window.history.replaceState({}, document.title)
    },[location])

    function handleChangePage(pagina){
        setAtivo(pagina)
        setShowNavSecond(false)
    }

    function HomeNav(){
        if(ativo==='sobre') document.getElementsByTagName('body')[0].style.backgroundColor='#cee7ff'
        else if(ativo==='manuais') document.getElementsByTagName('body')[0].style.backgroundColor='#2670b6'
        else document.getElementsByTagName('body')[0].style.backgroundColor='#e3ecfa'
        return <MDBNavbar key={'nav'} expand='lg' dark bgColor='dark'>
            <MDBContainer fluid>
                <MDBNavbarBrand onClick={()=>handleChangePage('home')}><Logo/></MDBNavbarBrand>
                <MDBNavbarToggler aria-expanded='false' aria-label='Toggle navigation' onClick={() => setShowNavSecond(!showNavSecond)}>
                    <MDBIcon icon='bars' fas color='black'/>
                </MDBNavbarToggler>
                <MDBCollapse navbar show={showNavSecond}>
                    <MDBNavbarNav right fullWidth={false}>
                        <MDBNavbarLink active={ativo==='sobre'}   onClick={()=>handleChangePage('sobre') }>O que é?</MDBNavbarLink>
                        <MDBNavbarLink active={ativo==='manuais'} onClick={()=>handleChangePage('manuais')}>Manuais</MDBNavbarLink>
                        <MDBNavbarLink active={ativo==='login'}   onClick={()=>handleChangePage('login') }>
                            <MDBIcon size='xl' className='login-icon-before' icon='circle-user' fas color='white'/>
                                Login
                            <MDBIcon size='xl' className='login-icon-after mx-2' icon='circle-user' fas color='white'/>
                        </MDBNavbarLink>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBContainer>
        </MDBNavbar>
    }

    const Title = <MDBContainer className='rounded bg-light shadow p-3 px-5 mt-3 mt-lg-5'>
        <div className=' text-center'>
            <h1 className='title m-1'>RAEG</h1>
            <hr className='mt-0 mb-2 rounded' style={{height:'2px',color:'#4d4d4d'}}/>
            <h6 className='subtitle'>Registro e Acompanamento de Estudantes Egressos</h6>
        </div>
    </MDBContainer>

    const Manuais=<main>
        {Title}
    </main>

    const Sobre = <main>
        {Title}
        <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
            <h5>Proposta</h5>
            <hr className='mt-0 mb-3'></hr>
            O <span className='title_shadowless'>RAEG</span> é a plataforma criada no CEFET-MG Campus V, com o objetivo de auxiliar as
            instituições de ensino brasileiras na questão de acompanhamento de egressos.<br/>
            Nos estudos de <a className='linkRef' rel="noreferrer" href='https://periodicos.ufrn.br/casoseconsultoria/article/view/26052' target='_blank'>Oliveira (2021)</a> e de <a className='linkRef' rel="noreferrer" href='https://rsdjournal.org/index.php/rsd/article/view/26281' target='_blank'>Silva (2022)</a> vemos
            a como o acompanhamento de egressos nas IES é importante para melhorar a qualidade do ensino e fortalecer o relacionamento 
            entre as instituições e seus egressos.<br/>
            Além disso o uso de sistemas de informação no acompanhamento de egressos é relevante para melhorar a qualidade dos 
            cursos e fortalecer o relacionamento entre as IES e seus egressos, facilitando o contato com os mesmos através do meio digital.
        </MDBContainer>
        <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
            <h5>Diferencial</h5>
            <hr className='mt-0 mb-3'></hr>
            O <span className='title_shadowless'>RAEG</span> foi feito para agilizar o dia a dia dos funcionários das IES brasileiras,
            trazendo facilidade ao verificar informações de alunos, importação direta de informações a partir de modelos, e acompanhamento
            rápido das respostas.<br/>
            O <span className='title_shadowless'>RAEG</span> também proporciona diversas formas de relatórios, podendo armazenar os dados
            das pesquisas por fora da plataforma, além também de seus relatórios internos com melhor interface e amostragem de gráficos.
        </MDBContainer>
        <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5' style={{wordBreak:'break-word'}}>
            <h5>Equipe</h5>
            <hr className='mt-0 mb-3'></hr>
            O <span className='title_shadowless'>RAEG</span> foi desenvolvido como parte do Projeto de Iniciação Científica 
            do Prof. Dr. <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/9306302347633373' target='_blank'>Emerson Sousa</a>, com co-orientação
            do Prof. Dr. <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/4687858846001290' target='_blank'>Thiago Magela</a> com o objetivo de
            auxiliar o mestrado de <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/9265442500973824'>Oscar Praga</a> focado justamente no acompanhamento
            de egressos do CEFET.<br/>
            A plataforma foi desenvolvida inteiramente pelo aluno do curso de Engenharia da Computação do CEFET-MG Campus 
            V, <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/4555794230183109' target='_blank'>Gabriel Couto</a> <a className='linkRef' rel="noreferrer" href='https://github.com/Couto1411' target='_blank'><i className="fa-brands fa-github"/></a>.
        </MDBContainer>
    </main>

    const HomePage = <Parallax pages={window.innerHeight>800?1.8:2}>
        <ParallaxLayer sticky={{start:0,end:0.1}} offset={0}>
            {HomeNav()}
        </ParallaxLayer>
        <main>
            <ParallaxLayer speed={0.8} offset={0}>
                <div style={{height:'35em',backgroundColor:'#00284ee6'}}></div>
                <div style={{height:'25em',backgroundColor:'#003e79e6'}}></div>
                <div style={{height:'35em',backgroundColor:'#00284ee6'}}></div>
                <div style={{height:'25em',backgroundColor:'#003e79e6'}}></div>
                <div style={{height:'35em',backgroundColor:'#00284ee6'}}></div>
            </ParallaxLayer>
            <ParallaxLayer speed={1} offset={0.1}>
                {Title}
                <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
                    <h5>Crie pesquisas personalizadas</h5>
                    <hr className='mt-0 mb-3'></hr>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            <img alt='Criar_Pesquisas' className='img-fluid' src={require('./../imgs/Cria_Pesquisa_Cortado_Ajustado.gif')} />
                        </div>
                        <div className='col-12 col-md-6'>
                            <MDBListGroup light> 
                                <MDBListGroupItem className='py-1 cinzafundo'>Produza pesquisas com mensagens de contato personalizadas;</MDBListGroupItem>
                                <MDBListGroupItem className='py-1 cinzafundo'>Utilize questões de múltipla escolha e caixa de seleção com 10 possíveis opções;</MDBListGroupItem>
                                <MDBListGroupItem className='py-1 cinzafundo'>Crie pesquisas avançadas utilizando as questões funcionais;</MDBListGroupItem>
                                <MDBListGroupItem className='py-1 cinzafundo'>Filtre suas pesquisas utilizando as informações dos destinatários.</MDBListGroupItem>
                            </MDBListGroup>
                        </div>
                    </div>
                </MDBContainer>
                <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
                    <h5>Interface de resposta intuitiva</h5>
                    <hr className='mt-0 mb-3'></hr>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            <img alt='Envia_Pesquisas' className='img-fluid' src={require('./../imgs/Envia_Pesquisa_Cortado_Ajustado.gif')} />
                        </div>
                        <div className='col-12 col-md-6'>
                            <MDBListGroup light>
                                <MDBListGroupItem className='py-2 cinzafundo'>Envie suas mensagens individualemente ou para todos os destinatários;</MDBListGroupItem>
                                <MDBListGroupItem className='py-2 cinzafundo'>Emails de contato, que possuem o link da pesquisa;</MDBListGroupItem>
                                <MDBListGroupItem className='py-2 cinzafundo'>Interface de resposta limpa e de fácil utilização;</MDBListGroupItem>
                            </MDBListGroup>
                        </div>
                    </div>
                </MDBContainer>
                <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
                    <h5>Relatórios úteis para sua pesquisa</h5>
                    <hr className='mt-0 mb-3'></hr>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            <img alt='Relatorios_Pesquisas' className='img-fluid' src={require('./../imgs/Relatorios_Pesquisa_Cortado_Ajustado.gif')} />
                        </div>
                        <div className='col-12 col-md-6'>
                            <MDBListGroup light>
                                <MDBListGroupItem className='py-1 cinzafundo'>Veja a resposta individual de seus destinatários;</MDBListGroupItem>
                                <MDBListGroupItem className='py-1 cinzafundo'>Aba de respostas para fácil acesso às porcentagens de respostas fechadas;</MDBListGroupItem>
                                <MDBListGroupItem className='py-1 cinzafundo'>Obtenha uma planilha com a relação de destinatários por resposta;</MDBListGroupItem>
                                <MDBListGroupItem className='py-1 cinzafundo'>Gere relatórios em PDF com filtros dos destinatários.</MDBListGroupItem>
                            </MDBListGroup>
                        </div>
                    </div>
                </MDBContainer>
                <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
                    <h5>Gráficos de pesquisas ao longo do tempo</h5>
                    <hr className='mt-0 mb-3'></hr>
                    <div className='row'>
                        <div className='col-12 col-md-6'>
                            <img alt='Graficos_Pesquisas' className='img-fluid' src={require('./../imgs/Graficos_Pesquisa_Cortado_Ajustado.gif')} />
                        </div>
                        <div className='col-12 col-md-6'>
                            <MDBListGroup light>
                                <MDBListGroupItem className='py-2 cinzafundo'>Gerencie pesquisas de longa data, podendo fazer diversos envios do formulário;</MDBListGroupItem>
                                <MDBListGroupItem className='py-2 cinzafundo'>Visualize facilmente as datas de cada envio coletivo na página de formulários;</MDBListGroupItem>
                                <MDBListGroupItem className='py-2 cinzafundo'>Gere gráficos para melhor visualização das respostas ao longo do tempo.</MDBListGroupItem>
                            </MDBListGroup>
                        </div>
                    </div>
                </MDBContainer>
            </ParallaxLayer>
        </main>
    </Parallax>

    function makeSecao(){
        if (ativo==='login'){
            return <Login key={'login'} navigate={navigate}/>
        }
        else if (ativo==='manuais'){
            return (Manuais)
        }
        else if (ativo==='sobre'){
            return (Sobre)
        }
        else{
            return (HomePage)
        }
    }

    return (
        <section>
            {ativo==='home'?null:HomeNav()}
            {makeSecao()}
        </section>
    )
}

