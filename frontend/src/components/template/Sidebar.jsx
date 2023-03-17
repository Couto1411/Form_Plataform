import React from "react"
import './Sidebar.css'
import {useNavigate} from 'react-router-dom';
import {
    MDBListGroup, MDBListGroupItem, MDBRipple, 
    MDBContainer } from 'mdb-react-ui-kit';


export default function Sidebar(setMain,area,setAdicional){
    const navigate = useNavigate();

    function updateSelected(id){
        var lista = document.getElementById('sidebar')
        for (const child of lista.children) {
            child.style.backgroundColor="white"
            child.style.borderRight=""
            child.style.color="#4f4f4f"
        }
        if(id){
            document.getElementById(id).style.backgroundColor="#ffffe6"
            document.getElementById(id).style.borderRight="thick solid #ff9142"
            document.getElementById(id).style.color="#ff9142"
        }
    }  

    function items(){
        if (area==='forms') {
            return(
                <MDBListGroup className="rounded-0" id='sidebar'>
                    <MDBListGroupItem tag='a' action id='Forms' className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id);setMain(1)}}>Forms</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='Dashboard' className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id)}}>Dashboard</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='VoltarForms'  className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id)}}>...</MDBListGroupItem>
                </MDBListGroup>
            )
        }else if(area==='questoes'){
            return(
                <MDBListGroup id='sidebar' className="rounded-0">
                    <MDBListGroupItem tag='a' action id='QuestoesBar' className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id);setAdicional(1);setMain(1)}}>Questoes</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='ContatosBar' className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id);setAdicional(2);setMain(1)}}>Contatos</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='RespostasBar' className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id);setAdicional(3);setMain(1)}}>Respostas</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='VoltarBar' className='px-3 sidebarItem' onClick={e=>{navigate('/user')}}>Voltar</MDBListGroupItem>
                </MDBListGroup>
            )
        }else if(area==='resposta'){
            return(
                <MDBListGroup className="rounded-0" id='sidebar'>
                    <MDBListGroupItem tag='a' action id='VoltarResp' className='px-3 sidebarItem' onClick={e=>{navigate('/forms')}}>Voltar</MDBListGroupItem>
                </MDBListGroup>
            )
        }else if(area==='admin'){
            return(
                <MDBListGroup className="rounded-0" id='sidebar'>
                    <MDBListGroupItem tag='a' action id='Usuarios' className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id);setAdicional(1);setMain(1)}}>Usuários</MDBListGroupItem>
                    <MDBListGroupItem tag='a' action id='Formularios' className='px-3 sidebarItem' onClick={e=>{updateSelected(e.target.id);setAdicional(2);setMain(1)}}>Formulários</MDBListGroupItem>
                </MDBListGroup>
            )
        }
    }

    return(
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar">
            <div className="position-sticky">
                {items()}
            </div>
            <MDBContainer fluid className='rodape d-flex border-top border-dark'>
                <i role='button' className="botoesconfig edit py-3 fas fa-light fa-gear fa-lg"></i>
                <i role='button' id="userButton" className="botoesconfig edit ms-auto py-3 fas fa-user fa-lg" onClick={e=>{updateSelected(0);setMain(2)}}></i>
            </MDBContainer>
        </nav>
    )
}