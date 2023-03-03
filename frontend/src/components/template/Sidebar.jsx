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
            child.firstChild.style.backgroundColor="white"
        }
        id?document.getElementById(id).style.backgroundColor="#aeaeae":<></>
    }  

    function items(){
        if (area==='forms') {
            return(
                <MDBListGroup className="mx-3 mt-4" id='sidebar'>
                    <MDBRipple><MDBListGroupItem role='button' id='Forms' noBorders className='px-3 rounded-top sidebarItem zoom' onClick={e=>{updateSelected(e.target.id);setMain(1)}}>Forms</MDBListGroupItem></MDBRipple>
                    <MDBRipple><MDBListGroupItem role='button' id='Dashboard' className='px-3 borda sidebarItem zoom' onClick={e=>{updateSelected(e.target.id)}}>Dashboard</MDBListGroupItem></MDBRipple>
                    <MDBRipple><MDBListGroupItem role='button' id='Item3' noBorders className='px-3 rounded-bottom sidebarItem zoom' onClick={e=>{updateSelected(e.target.id)}}>...</MDBListGroupItem></MDBRipple>
                </MDBListGroup>
            )
        }else if(area==='questoes'){
            return(
                <MDBListGroup className="mx-3 mt-4" id='sidebar'>
                    <MDBRipple><MDBListGroupItem role='button' id='Questoes' className='px-3 sidebarItem zoom rounded-top border-bottom-0' onClick={e=>{updateSelected(e.target.id);setAdicional(1);setMain(1)}}>Questoes</MDBListGroupItem></MDBRipple>
                    <MDBRipple><MDBListGroupItem role='button' id='Contatos' className='px-3 sidebarItem zoom border-bottom-0' onClick={e=>{updateSelected(e.target.id);setAdicional(2);setMain(1)}}>Contatos</MDBListGroupItem></MDBRipple>
                    <MDBRipple><MDBListGroupItem role='button' id='Respostas' className='px-3 sidebarItem zoom border-bottom-0' onClick={e=>{updateSelected(e.target.id);setAdicional(3);setMain(1)}}>Respostas</MDBListGroupItem></MDBRipple>
                    <MDBRipple><MDBListGroupItem role='button' id='Item3' className='px-3 sidebarItem zoom rounded-bottom' onClick={e=>{navigate('/user')}}>Voltar</MDBListGroupItem></MDBRipple>
                </MDBListGroup>
            )
        }else if(area==='resposta'){
            return(
                <MDBListGroup className="mx-3 mt-4" id='sidebar'>
                    <MDBRipple><MDBListGroupItem role='button' id='Item3' noBorders className='px-3 rounded-3 sidebarItem zoom' onClick={e=>{navigate('/forms')}}>Voltar</MDBListGroupItem></MDBRipple>
                </MDBListGroup>
            )
        }
    }

    return(
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar">
            <div className="position-sticky">
                {items()}
            </div>
            <MDBContainer fluid className='rodape d-flex border-top border-dark bg-dark'>
                <i role='button' className="botoesconfig edit py-3 fas fa-light fa-gear fa-lg"></i>
                <i role='button' id="userButton" className="botoesconfig edit ms-auto py-3 fas fa-user fa-lg" onClick={e=>{updateSelected(0);setMain(2)}}></i>
            </MDBContainer>
        </nav>
    )
}