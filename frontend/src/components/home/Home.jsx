import { MDBCollapse, MDBContainer, MDBIcon, MDBListGroup, MDBListGroupItem, MDBNavbar, MDBNavbarBrand, MDBNavbarLink, MDBNavbarNav, MDBNavbarToggler } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import Logo from '../template/Logo';
import './Home.css'
import Login from './Login';
import { Link, useLocation } from 'react-router-dom';
import { Parallax,ParallaxLayer } from "@react-spring/parallax";
import ManualGeral from './../manuais/Manuais.pdf'
import ManualAdm from './../manuais/Manual_Adm.pdf'
import ManualDestinatario from './../manuais/Manual_Dest.pdf'
// import ManualInstituicao from './../manuais/Manual_Inst.pdf'
import ManualUsuario from './../manuais/Manual_Usu.pdf'


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
        <MDBContainer className='rounded bg-white shadow p-3 mt-3 mt-lg-5'>
        <h5>Manuais</h5>
        <hr className='mt-1 mb-2'></hr>
        <MDBListGroup className='mx-3' small light>
            <MDBListGroupItem>
                <Link
                    to={ManualGeral}
                    download="Manuais RAEG"
                    target="_blank"
                    rel="noreferrer"
                ><i className="me-2 fa-regular fa-file-pdf"/> Todos os manuais</Link>
            </MDBListGroupItem>
            <MDBListGroupItem>
                <Link
                    to={ManualAdm}
                    download="Manual do Administrador RAEG"
                    target="_blank"
                    rel="noreferrer"
                ><i className="me-2 fa-regular fa-file-pdf"/> Manual do Administrador</Link>
            </MDBListGroupItem>
            <MDBListGroupItem>
                <Link
                    to={ManualUsuario}
                    download="Manual do Usuário RAEG"
                    target="_blank"
                    rel="noreferrer"
                ><i className="me-2 fa-regular fa-file-pdf"/> Manual do Usuário</Link>
            </MDBListGroupItem>
            <MDBListGroupItem>
                <Link
                    to={ManualDestinatario}
                    download="Manual do Destinatário RAEG"
                    target="_blank"
                    rel="noreferrer"
                ><i className="me-2 fa-regular fa-file-pdf"/> Manual do destinatário</Link>
            </MDBListGroupItem>
            {/* <MDBListGroupItem>
                <Link
                    to={ManualInstituicao}
                    download="Manual da Instituição RAEG"
                    target="_blank"
                    rel="noreferrer"
                ><i className="me-2 fa-regular fa-file-pdf"/> Manual da Instituição</Link>
            </MDBListGroupItem> */}
        </MDBListGroup>
        </MDBContainer>
    </main>

    const Sobre = <main>
        {Title}
        <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
            <h5>Proposta</h5>
            <hr className='mt-0 mb-3'></hr>
            O acompanhamento de egressos da Educação Profissional e Tecnológica (EPT) é uma importante ferramenta que pode, através de 
            seus vários aspectos, auxiliar no planejamento das atividades das instituições, propiciando-lhes informações com potencial 
            diagnóstico e importantes elementos para o planejamento e a tomadas de decisões dos profissionais responsáveis por coordenações 
            de cursos e os gestores de unidades, dentre outros. Além desta perspectiva, voltada a aperfeiçoar o planejamento das atividades 
            educacionais, o acompanhamento de egressos permite fortalecer os laços entre as instituições e seus egressos. 
            <br/><br/>
            Mesmo com esses diferenciais, na EPT, este acompanhamento ainda encontra percalços e dificuldades diversas. Pensando nisto, 
            o <span className='title_shadowless'>RAEG</span> foi criado e se apresenta como uma plataforma que tem como finalidade auxiliar, 
            nesta ação, os gestores da EPT. Foi projetada e desenvolvida no âmbito da Rede de Educação Profissional e Tecnológica (Rede EPT), a 
            partir das demandas e dificuldades encontradas por gestores.
        </MDBContainer>
        <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5'>
            <h5>Diferencial</h5>
            <hr className='mt-0 mb-3'></hr>
            Ao trazer o uso de sistemas de informação para o acompanhamento de egressos, a 
            plataforma <span className='title_shadowless'>RAEG</span> se propõe como ferramenta de coleta de dados, voltada a auxiliar os 
            gestores da Educação Profissional e Tecnológica, facilitando a verificação de informações de alunos, a importação direta de 
            informações a partir de modelos, e o acompanhamento rápido das respostas. 
            <br/><br/>
            O <span className='title_shadowless'>RAEG</span> também proporciona diversas formas de relatórios, podendo armazenar os dados 
            das pesquisas fora da plataforma, além de seus relatórios internos com melhor interface e amostragem gráfica.
        </MDBContainer>
        <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5' style={{wordBreak:'break-word'}}>
            <h5>Equipe</h5>
            <hr className='mt-0 mb-3'></hr>
            O <span className='title_shadowless'>RAEG</span> é um Produto Educacional oriundo das atividades do Programa de Mestrado em 
            Educação Profissional e Tecnológica (PROFEPT), foi desenvolvido no Campus Divinópolis do CEFET-MG em parceria com 
            Projeto de Iniciação Científica (PIBIC) da própria instituição e com fomento da Fundação de Amparo à Pesquisa do Estado de Minas 
            Gerais (FAPEMIG).
            <br/> <br/>
            Equipe de produção:<br/>
            Desenvolvimento - <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/4555794230183109' target='_blank'>Gabriel Couto</a> (PIBIC) gabriel.couto14@hotmail.com <a className='linkRef' rel="noreferrer" href='https://github.com/Couto1411' target='_blank'><i className="fa-brands fa-github"/></a><br/>
            Pesquisa - <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/9265442500973824'>Oscar Praga de Souza</a> (PROFEPT) oscarsouza.cap@gmail.com
            <br/><br/>
            Orientação:<br/>
            Orientador - Prof. Dr. <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/9306302347633373' target='_blank'>Emerson Sousa Costa</a> (PROFEPT/CEFET-MG)<br/>
            Coorientador - Prof. Dr. <a className='linkRef' rel="noreferrer" href='http://lattes.cnpq.br/4687858846001290' target='_blank'>Thiago Magela Rodrigues Dias</a> (PROFEPT/CEFET-MG)
        </MDBContainer>
        <MDBContainer className='rounded bg-light shadow p-3 mt-3 mt-lg-5 d-flex align-items-center justify-content-center' style={{wordBreak:'break-word'}}>
            <MDBListGroup horizontal horizontalSize='lg'>
                <MDBListGroupItem className='d-flex align-items-center justify-content-center'><img className='img-fluid' src={require('./../imgs/PROFEPT_CEFET_HORIZONTAL.png')} alt='profept_logo'/></MDBListGroupItem>
                <MDBListGroupItem className='d-flex align-items-center justify-content-center'><img className='img-fluid' src={require('./../imgs/CEFET_LOGO.png')}               alt='cefet_logo'  /></MDBListGroupItem>
                <MDBListGroupItem className='d-flex align-items-center justify-content-center'><img className='img-fluid' src={require('./../imgs/FAPEMIG_LOGO.jpg')}             alt='fapemig_logo'/></MDBListGroupItem>
            </MDBListGroup>
        </MDBContainer>
    </main>

    const HomePage = <Parallax pages={window.innerHeight>800?1.8:2}>
        <ParallaxLayer sticky={{start:0,end:0.1}} offset={0}>
            {HomeNav()}
        </ParallaxLayer>
        <main>
            <ParallaxLayer speed={0.6} offset={0}>
                <div style={{height:'35em'}} className='darktolight'></div>
                <div style={{height:'25em'}} className='middle'></div>
                <div style={{height:'35em'}} className='lighttodark'></div>
                <div style={{height:'25em'}} className='darktolight'></div>
                <div style={{height:'35em'}} className='middle'></div>
            </ParallaxLayer>
            <ParallaxLayer speed={1.2} offset={0.1}>
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

