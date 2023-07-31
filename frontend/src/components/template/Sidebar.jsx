import React from "react"
import './Sidebar.css'
import { Link, useNavigate } from 'react-router-dom';
import {
    MDBListGroup, MDBListGroupItem,
    MDBContainer
} from 'mdb-react-ui-kit';


export default function Sidebar({area, setSecao,qtdRespostas,derivado}) {
    const navigate = useNavigate();

    function updateSelected(id) {
        var lista = document.getElementById('sidebar')
        for (const child of lista.children) {
            child.classList.remove('sidebarSelected')
            child.classList.add('sidebarItem')
        }
        if (id) {
            document.getElementById(id).classList.add('sidebarSelected')
            document.getElementById(id).classList.remove('sidebarItem')
        }
    }

    function items() {
        if (area === 'forms') {
            return (
                <MDBListGroup className="rounded-0" id='sidebar'>
                    <MDBListGroupItem tag='a' action id='Forms' className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(1) }}>Formulários</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='Dashboard' className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(2) }}>Gráficos</MDBListGroupItem>
                </MDBListGroup>
            )
        } else if (area === 'questoes') {
            return (
                <MDBListGroup id='sidebar' className="rounded-0">
                    <MDBListGroupItem tag='a' action id='Questoes'      className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(1) }}>Questões</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='Destinatarios' className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(2) }}>Destinatários</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='Respostas'     className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(3) }}>Respostas {qtdRespostas??""}</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='Relatorios'    className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(4) }}>Relatórios</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='VoltarForm'    className='px-3 sidebarItem' onClick={e => { navigate('/user') }}>Voltar</MDBListGroupItem>
                </MDBListGroup>
            )
        } else if (area === 'resposta') {
            return (
                <MDBListGroup className="rounded-0" id='sidebar'>
                    <Link to={derivado? '/forms/' + derivado : '/forms'} state={{derivado:derivado}}><MDBListGroupItem id='VoltarResp' className='px-3 sidebarItem'>Voltar</MDBListGroupItem></Link>
                </MDBListGroup>
            )
        } else if (area === 'respostaDerivados') {
            return (
                <MDBListGroup className="rounded-0" id='sidebar'>
                    <MDBListGroupItem tag='a' action id='VoltarResp' className='px-3 sidebarItem' onClick={e => {  }}>Voltar</MDBListGroupItem>
                </MDBListGroup>
            )
        } else if (area === 'admin') {
            return (
                <MDBListGroup className="rounded-0" id='sidebar'>
                    <MDBListGroupItem tag='a' action id='Usuarios' className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(1) }}>Usuários</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='Formularios' className='px-3 sidebarItem' onClick={e => { updateSelected(e.target.id); setSecao(2) }}>Formulários</MDBListGroupItem>
                </MDBListGroup>
            )
        }
    }

    return (
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar">
            <div className="position-sticky mt-0 pt-0">
                {items()}
            </div>
            <MDBContainer fluid className='rodape d-flex border-top border-dark'>
                <i role='button' id="userButton" className="botoesconfig edit py-3 fas fa-user fa-lg" onClick={e => { updateSelected(0); setSecao(0) }}></i>
            </MDBContainer>
        </nav>
    )
}