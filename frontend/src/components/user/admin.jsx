import React, {useEffect,useState}from 'react'
import { limit, RemoveSessao } from '../../config/utils'
import './admin.css'
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from './UserSection'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from "axios"
import baseUrl from "../../config/api"
import {
    MDBInputGroup, MDBContainer, MDBRadio, MDBInput,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalFooter} from 'mdb-react-ui-kit'

export default function Admin({navigate}){

    // Utilizado para não existirem usuarios com a mesma chave
    const [count, setCount] = useState(0);

    // Lista de usuários
    const [users, setUsers] = useState([]);
    // Modifica visibilidade da area de novo usuário
    const [newUser, setNewUser] = useState(<></>);
    // Modal para deletar usuários
    const [deletaUsuario, setDeletaUsuario] = useState(false);
    // Hook para setar o id do Usuário a ser deletado
    const [userIdToDelete, setUserIdToDelete] = useState(0);
    
    // Lista de usuários
    const [forms, setForms] = useState([]);
    // Modal para deletar formulários
    const [deletaFormulario, setDeletaFormulario] = useState(false);
    // Hook para setar o id do Formulário a ser deletado
    const [formIdToDelete, setFormrIdToDelete] = useState(0);

    // Seta qual secao aparece, usuários ou formulários
    const [secao, setsecao] = useState(1)

    // Seta a aparição dos warnings;
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("token")){
            async function CarregaUsuarios(){
                await axios.get(baseUrl+"/users/admin/"+sessionStorage.getItem("userId"),{
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                .then(response => {
                    setUsers(response.data)
                })
                .catch((error) => {
                    if (error.response.status===401) RemoveSessao(navigate)
                    else if (error.response.status!==404) console.log(error)
                })
            }
        
            async function CarregaFormularios(){
                await axios.get(baseUrl+"/forms/admin/"+sessionStorage.getItem("userId"),{
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                .then(response => {
                    setForms(response.data)
                })
                .catch((error) => {
                    if (error.response.status===401) RemoveSessao(navigate)
                    else console.log(error)
                })
            }
            CarregaUsuarios()
            CarregaFormularios()
        }
        else{
            alert("Usuário não é administrador")
            RemoveSessao(navigate)
        }

    }, [navigate]);

    // Usuários
    function renderizaUsers(){
        return users?.map(element => {
                if (element.novo===true) {
                    return(
                        <MDBListGroupItem className='py-2 px-2' key={element.id}>
                            <MDBInput label='Usuários poderão ser editados após recarregar' className='form-control' type='text' value={element.nome} disabled/>
                        </MDBListGroupItem>
                    )
                }else{ 
                    return (
                        <MDBListGroupItem key={element.id} className='py-2 px-2'>
                            <MDBInputGroup>
                                <MDBBtn onClick={e=>{showEditUsuario(element)}} color='secondary' className='numQuestao'>Nome</MDBBtn>
                                <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'userName'+element.id} defaultValue={element.nome} disabled onChange={e=>{users[users.map(object => object.id).indexOf(element.id)].email=e.target.value}}/>
                            
                                <div role='button' onClick={e=>{editaUsuario(element.id)}} color='secondary' className='numQuestao borda-direita' id={'edit'+element.id} style={{display: 'none'}}><i className='p-2 ms-auto fas fa-regular fa-pen'></i></div>
                                <div role='button' onClick={e=>{setDeletaUsuario(true);setUserIdToDelete(element.id)}} className='numQuestao borda-direita' id={'erase'+element.id}><i className='p-2 ms-auto trashcan fas fa-trash-can'></i></div>
                                
                            </MDBInputGroup>
                            <MDBContainer fluid className='mt-2' id={'userInfo'+element.id} style={{display: 'none'}}>
                                <div className='row'>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoUsuarioForm px-2'>Email</MDBBtn>
                                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} defaultValue={element.email} onChange={e=>{users[users.map(object => object.id).indexOf(element.id)].email=e.target.value}} className='form-control' type='email'/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoUsuarioForm px-2'>Instituição</MDBBtn>
                                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} defaultValue={element.universidade} onChange={e=>{users[users.map(object => object.id).indexOf(element.id)].universidade=e.target.value}} className='form-control' type='text'/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='novoUsuarioForm px-2'>Senha</MDBBtn>
                                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} defaultValue={element.senha} onChange={e=>{users[users.map(object => object.id).indexOf(element.id)].senha=e.target.value}} className='form-control' type='text'/>
                                        </MDBInputGroup>
                                    </div>
                                    <div className="col-md-6 pt-md-2 pt-1">
                                        <MDBInputGroup>
                                            <MDBBtn color='secondary' className='admin novoUsuarioForm px-2'>Admin</MDBBtn>
                                            <MDBRadio defaultChecked className='mt-2' id={'admintrue'+element.id} onClick={e=>{users[users.map(object => object.id).indexOf(element.id)].admin=true}} inline name={'Admin'+element.id} label={<div className='pt-1'>Sim</div>}></MDBRadio>
                                            <MDBRadio defaultChecked className='mt-2' id={'adminfalse'+element.id} onClick={e=>{users[users.map(object => object.id).indexOf(element.id)].admin=false}} inline name={'Admin'+element.id} label={<div className='pt-1'>Não</div>}></MDBRadio>
                                        </MDBInputGroup>
                                    </div>
                                    <MDBInputGroup className='col-md-12 pt-md-2 pt-sm-1' 
                                        textBefore="Senha de Aplicativo do Gmail">
                                        <input onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}}
                                            id={"appPassword"} defaultValue={element?.appPassword} className='form-control' type='text' />
                                    </MDBInputGroup>
                                </div>
                            </MDBContainer>
                        </MDBListGroupItem>
                    )
                }
        });
    }

    async function addUser(){
        let novoUsuario ={}
        novoUsuario.email=document.getElementById("novoUsuarioEmail").value
        novoUsuario.nome=document.getElementById("novoUsuarioNome").value
        novoUsuario.universidade=document.getElementById("novoUsuarioUniversidade").value
        novoUsuario.senha=document.getElementById("novoUsuarioSenha").value
        novoUsuario.appPassword=document.getElementById("novoUsuarioAppPassword").value
        novoUsuario.admin= document.querySelector('input[name="adminNovo"]:checked').value==='true'
        if(novoUsuario.email){
            document.getElementById("novoUsuarioEmail").classList.remove("is-invalid")
            if(novoUsuario.universidade){
                document.getElementById("novoUsuarioUniversidade").classList.remove("is-invalid")
                if(novoUsuario.nome){
                    document.getElementById("novoUsuarioNome").classList.remove("is-invalid")
                    if(novoUsuario.senha){
                        document.getElementById("novoUsuarioSenha").classList.remove("is-invalid")
                        await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId"),novoUsuario,{
                            headers: {
                                'Authorization': 'bearer ' + sessionStorage.getItem("token")
                            }
                        })
                        .then(e=>{
                            novoUsuario.novo=true
                            novoUsuario.id="new"+count
                            setCount(count+1)
                            setUsers([
                                ...users,
                                novoUsuario
                            ])
                            setNewUser(<></>)
                        })
                        .catch((error) => {
                            if (error.response.status===401) RemoveSessao(navigate)
                            else if(error.response.status===501){
                                document.getElementById("novoUsuarioEmail").classList.add("is-invalid")
                                setWarning(true);
                            }
                            else console.log(error)
                        })
                    }else document.getElementById("novoUsuarioSenha").classList.add("is-invalid")
                }else document.getElementById("novoUsuarioNome").classList.add("is-invalid")
            }else document.getElementById("novoUsuarioUniversidade").classList.add("is-invalid")
        }else document.getElementById("novoUsuarioEmail").classList.add("is-invalid")
    }

    async function editaUsuario(id){
        let dados=users[users.map(object => object.id).indexOf(id)]
        await axios.put(baseUrl+"/users/admin/"+sessionStorage.getItem("userId"),dados,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else console.log(error)
        })
        document.getElementById("userName"+id).disabled=true
        document.getElementById("edit"+id).style.display='none'
        document.getElementById("userInfo"+id).style.display='none'
        document.getElementById("erase"+id).style.display='block'
    }

    async function deleteUser(){
        // Form a ser deletado é original
        await axios.delete(baseUrl+"/users/"+userIdToDelete+"/admin/"+sessionStorage.getItem('userId'),{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            setUsers(users.filter(a=> a.id !== userIdToDelete))
        })
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else console.log(error)
        })
        setDeletaUsuario(false)
    }

    function showEditUsuario(element){
        element.admin?document.getElementById("admintrue"+element.id).checked=true:document.getElementById("adminfalse"+element.id).checked=true
        let v=document.getElementById("userName"+element.id)
        v.disabled=!v.disabled
        let p=document.getElementById("edit"+element.id)
        p.style.display==='none'?p.style.display='block':p.style.display='none'
        let erase=document.getElementById("erase"+element.id)
        erase.style.display==='none'?erase.style.display='block':erase.style.display='none'
        let x=document.getElementById("userInfo"+element.id)
        x.style.display==='none'?x.style.display='block':x.style.display='none'
    }

    function handleNewUser(){
        setNewUser(
            <MDBListGroupItem noBorders className='rounded-3 mt-3'>
                <MDBContainer fluid className='mt-2'>
                <div className='row'>
                    <div className="col-12 pt-md-2 pt-sm-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='numQuestao'>Nome</MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoUsuarioNome'}/>
                        </MDBInputGroup>
                    </div>
                    <div className="col-md-6 pt-md-2 pt-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoUsuarioForm px-2'>Email</MDBBtn>
                            <input placeholder='Email deve ser GMAIL' onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='email' id={'novoUsuarioEmail'}/>
                        </MDBInputGroup>
                    </div>
                    <div className="col-md-6 pt-md-2 pt-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoUsuarioForm px-2'>Instituição</MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoUsuarioUniversidade'}/>
                        </MDBInputGroup>
                    </div>
                    <div className="col-md-6 pt-md-2 pt-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='novoUsuarioForm px-2'>Senha</MDBBtn>
                            <input onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} className='form-control' type='text' id={'novoUsuarioSenha'}/>
                        </MDBInputGroup>
                    </div>
                    <div className="col-md-6 pt-md-2 pt-1">
                        <MDBInputGroup>
                            <MDBBtn color='secondary' className='admin novoUsuarioForm px-2'>Admin</MDBBtn>
                            <MDBRadio value={true} name='adminNovo' className='mt-2' id={'admintruenovo'} label={<div className='pt-1'>Sim</div>}></MDBRadio>
                            <MDBRadio value={false} name='adminNovo' className='mt-2' id={'adminfalsenovo'} label={<div className='pt-1'>Não</div>} defaultChecked></MDBRadio>
                        </MDBInputGroup>
                    </div>
                    <MDBInputGroup className='col-md-12 pt-md-2 pt-sm-1' 
                        textBefore="Senha de Aplicativo do Gmail">
                        <input onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}}
                                id={"novoUsuarioAppPassword"} className='form-control' type='text' />
                    </MDBInputGroup>
                </div>
                <div className='d-flex my-2'>
                    <MDBBtn onClick={e=>{setNewUser(<></>)}} color='danger' className='ms-auto mx-2'>Excluir</MDBBtn>
                    <MDBBtn onClick={e=>{addUser()}}>Salvar</MDBBtn>
                </div>
                </MDBContainer>
            </MDBListGroupItem>
        )
    }

    const secaoUsers=<main className='mt-3 principal'>
        {Title("Usuários")}
        
        <MDBListGroup small className='mt-3' >
            {renderizaUsers()}
        </MDBListGroup>

        {newUser}

        <MDBBtn onClick={e=>{handleNewUser()}} outline color='dark' className='border-1 bg-light adminBotoes mt-3'><i title='Adicionar novo email a enviar' className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
    
        {/* Modal para deletar Usuário */}
        <MDBModal tabIndex='-1' show={deletaUsuario} setShow={setDeletaUsuario}>
            <MDBModalDialog centered>
                <MDBModalContent>
                    <MDBModalHeader className='py-2'>
                        Tem certeza que deseja excluir o usuários e todas as informações dele? (Formulários, respostas, etc)
                    </MDBModalHeader>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={e=>{setDeletaUsuario(false)}}> Cancelar </MDBBtn>
                        <MDBBtn color='danger' onClick={e=>{deleteUser()}}>Excluir tudo</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={warning}>
            <MuiAlert severity='error' elevation={6} variant="filled" onClose={()=>{setWarning(false)}} sx={{ width: '100%' }}>
                Email deve ser do tipo GMAIL.
            </MuiAlert>
        </Snackbar>
    </main>
    // Usuários

    // Formulários
    function renderizaForms(){
        return forms?.map(element => {
            return (
                <MDBListGroupItem key={element.id} className='py-2 px-2'>
                    <MDBInputGroup>
                        <MDBBtn color='secondary' className='numQuestao'>{users[users.map(object => object.id).indexOf(element.responsavelId)]?.nome}</MDBBtn>
                        <input className='form-control' type='text' id={'userName'+element.id} value={element.titulo} disabled/>
                    
                        <div role='button' onClick={e=>{setDeletaFormulario(true);setFormrIdToDelete(element.id)}} className='numQuestao borda-direita'><i className='p-2 ms-auto trashcan fas fa-trash-can'></i></div>
                    </MDBInputGroup>
                </MDBListGroupItem>
            )
        });
    }

    async function deleteForm(){
        // Form a ser deletado é original
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem('userId')+"/forms/"+formIdToDelete,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            setForms(forms.filter(a=> a.id !== formIdToDelete))
        })
        .catch((error) => {
            if (error.response.status===401) RemoveSessao(navigate)
            else console.log(error)
        })
        setDeletaFormulario(false)
    }

    const secaoForms=<main className='mt-3 principal'>
        {Title("Formulários")}

        <MDBListGroup small className='mt-3' >
            {renderizaForms()}
        </MDBListGroup>
        
        {/* Modal para deletar Formulário */}
        <MDBModal tabIndex='-1' show={deletaFormulario} setShow={setDeletaFormulario}>
            <MDBModalDialog centered>
                <MDBModalContent>
                    <MDBModalHeader className='py-2'>
                        Tem certeza que deseja excluir o formulário e todas as informações dele? (Questões, respostas, etc)
                    </MDBModalHeader>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={e=>{setDeletaFormulario(false)}}> Cancelar </MDBBtn>
                        <MDBBtn color='danger' onClick={e=>{deleteForm()}}>Excluir tudo</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal>
    </main>
    // Formulários

    function makeSecao() {
        if(secao===1){
            return(secaoUsers)
        }else if(secao===2){
            return(secaoForms)
        }else{
            return(<UserSection navigate={navigate}/>)
        }
    }

    return(
        <section>
            {Sidebar({area:'admin',setSecao:setsecao})}
            {Navbar()}

            {makeSecao()}
        </section>
    )
}