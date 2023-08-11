import React, {useState,useEffect} from "react"
import './UserSection.css'
import baseUrl from "../../config/api"
import Title from "../template/Title"
import { limit, CarregaCursos, CarregaUsuario, RemoveSessao } from "../../config/utils"
import axios from "axios"
import {
    MDBInput, MDBBtn, MDBContainer, MDBInputGroup,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalBody
} from 'mdb-react-ui-kit'

export default function UserSection({navigate}) {
    const [user, setUser] = useState({})
    const [cursos, setCursos] = useState([])
    const [modalidades, setModalidades] = useState([])
    const [modalAjuda, setModalAjuda] = useState(false)

    useEffect(() => {
        CarregaUsuario(setUser,navigate).then(e => {
            CarregaCursos(setCursos,setModalidades,navigate)
        })
    }, [navigate]);

    async function handleSave() {
        let nomeUser = document.getElementById('nomeUsuario')
        let univ = document.getElementById('univUsuario')
        let senha = document.getElementById('senha')
        let confsenha = document.getElementById('ConfirmaSenha')
        let appPassword = document.getElementById('appPassword')
        if (nomeUser.value) {
            user.nomeUser = nomeUser.value
            if (univ.value) {
                user.universidade = univ.value
                if (appPassword.value) {
                    user.appPassword = appPassword.value
                    if (senha.value) {
                        if (senha.value === confsenha.value) {
                            user.senha = senha.value
                        } else {
                            confsenha.classList.add('is-invalid')
                            senha.classList.add('is-invalid')
                        }
                    }
                    await axios.put(baseUrl + "/users/" + sessionStorage.getItem("userId"), user, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'bearer ' + sessionStorage.getItem("token")
                        }
                    })
                        .then((_) => {
                            senha.value = ''
                            confsenha.value = ''
                        })
                        .catch((error) => {
                            if (error.response.status === 401) RemoveSessao(navigate)
                            else console.log(error) 
                        })
                } else appPassword.classList.add('is-invalid')
            } else univ.classList.add('is-invalid')
        }
        else nomeUser.classList.add('is-invalid')
    }

    function renderizaCursos(){
        return cursos?.map(item => {
            return <MDBInputGroup key={"curso" + item.id} className='mt-2'
                textBefore={<div>
                            <i id={"saveCurso"+item.id}  onClick={e => editCursos(item.id)}   className="fa-regular fa-floppy-disk" style={{display:'none'}}/>
                            <i id={"editCurso"+item.id}  onClick={e => toggleEditCurso(item.id,true)} className="fa-regular fa-pen-to-square"/></div>}
                textAfter ={<i id={"trashCurso"+item.id} onClick={e => deleteCursos(item.id)} className="trashcan fas fa-trash-can" style={{display:'none'}}/>}>
                <input onChange={e => limit(e.target, 250)} readOnly className='form-control' type='text'
                    id={"cursonome" + item.id} defaultValue={item?.curso}/>
            </MDBInputGroup>
        })
    }

    function renderizaModalidades(){
        return modalidades?.map(item => {
            return (<MDBInputGroup key={"modalidade" + item.id} className='mt-2'
                textBefore={<div>
                            <i id={"saveModalidade"+item.id}  onClick={e => editModalidades(item.id)}   className="fa-regular fa-floppy-disk" style={{display:'none'}}/>
                            <i id={"editModalidade"+item.id}  onClick={e => toggleEditModalidade(item.id,true)} className="fa-regular fa-pen-to-square"/></div>}
                textAfter ={<i id={"trashModalidade"+item.id} onClick={e => deleteModalidades(item.id)} className="trashcan fas fa-trash-can" style={{display:'none'}}/>}>
                <input onChange={e => limit(e.target, 250)} readOnly className='form-control' type='text' 
                    id={"modalidadeNome" + item.id} defaultValue={item?.modalidade}/>
            </MDBInputGroup>)
        })
    }

    async function addCurso(curso) {
        document.getElementById("novoCurso").style.display = 'none'
        await axios.post(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/cursos", curso, {
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(response => {
            curso.id=response.data
            setCursos([
                ...cursos,
                curso
            ])
            document.getElementById("novoCursoNome").value=""
        })
        .catch(error => {
            if (error.response.status === 401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    async function addModalidade(modalidade) {
        document.getElementById("novaModalidade").style.display = 'none'
        await axios.post(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/modalidades", modalidade, {
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(response => {
            modalidade.id=response.data
            setModalidades([
                ...modalidades,
                modalidade
            ])
            document.getElementById("novaModalidadeNome").value=""
        })
        .catch((error) => {
            if (error.response.status === 401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    function toggleEditCurso(id,show){
        if(show){
            document.getElementById("saveCurso"+id).style.display="block"
            document.getElementById("editCurso"+id).style.display="none"
            document.getElementById("cursonome"+id).readOnly=false
            document.getElementById("trashCurso"+id).style.display="block"
        }
        else{
            document.getElementById("saveCurso"+id).style.display="none"
            document.getElementById("editCurso"+id).style.display="block"
            document.getElementById("cursonome"+id).readOnly=true
            document.getElementById("trashCurso"+id).style.display="none"
        }
    }

    function toggleEditModalidade(id,show){
        if(show){
            document.getElementById("saveModalidade"+id).style.display="block"
            document.getElementById("editModalidade"+id).style.display="none"
            document.getElementById("modalidadeNome"+id).readOnly=false
            document.getElementById("trashModalidade"+id).style.display="block"
        }
        else{
            document.getElementById("saveModalidade"+id).style.display="none"
            document.getElementById("editModalidade"+id).style.display="block"
            document.getElementById("modalidadeNome"+id).readOnly=true
            document.getElementById("trashModalidade"+id).style.display="none"
        }
    }

    async function editCursos(id) {
        let objeto = {}
        objeto.curso = document.getElementById("cursonome" + id).value
        await axios.put(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/curso/" + id, objeto, {
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(response => toggleEditCurso(id,false))
        .catch((error) => {
            if (error.response.status === 401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    async function editModalidades(id) {
        let objeto = {}
        objeto.modalidade = document.getElementById("modalidadeNome" + id).value
        await axios.put(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/modalidade/" + id, objeto, {
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then(response => toggleEditModalidade(id,false))
        .catch((error) => {
            if (error.response.status === 401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    async function deleteCursos(id) {
        await axios.delete(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/curso/" + id, {
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response) => {
            setCursos(cursos.filter(a => a.id !== id))
        })
        .catch((error) => {
            if (error.response.status === 401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    async function deleteModalidades(id) {
        await axios.delete(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/modalidade/" + id, {
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response) => {
            setModalidades(modalidades.filter(a => a.id !== id))
        })
        .catch((error) => {
            if (error.response.status === 401) RemoveSessao(navigate)
            else console.log(error)
        })
    }

    function admin() {
        if (sessionStorage.getItem("admin") === 'true') {
            let pathArray = window.location.pathname.split('/');
            if (pathArray.slice(-1)[0] === 'admin')
                return (<MDBBtn className="mx-2" color="dark" onClick={e => { navigate('/user') }}>USUÁRIO</MDBBtn>)
            else
                return (<MDBBtn className="mx-2" color="dark" onClick={e => { navigate('/admin') }}>ADMIN</MDBBtn>)
        }
    }

    return (
        <main className='mt-3 principal'>
            {Title(user?.nome)}

            {/* Modal de instrução da senha de aplicativo do GMAIL */}
            <MDBModal tabIndex='-1' show={modalAjuda} setShow={setModalAjuda}>
                <MDBModalDialog size="lg" scrollable>
                    <MDBModalContent>
                        <MDBModalBody>
                            Este campo é reservado para a senha de aplicativo do Gmail. <br />
                            Esta senha é utilizada para permitir que a plataforma possa enviar os emails aos destinatários. <br />
                            Caso não possua uma senha ou tenha perdido a informação siga os passos ou acesse: <a className="realLink" rel="noreferrer" target="_blank" href="https://support.google.com/accounts/answer/185833?hl=pt-BR">Senha de aplicativo do Gmail</a><br /><br />
                            1. Acesse a aba <b>Gerenciar sua conta do Google</b> da sua conta do gmail:<br /><br />
                            <div className="d-flex justify-content-center"><img alt="Configurações" src={require('./../imgs/settings.png')} className='img-fluid shadow-4'></img></div><br /><br />
                            2. Encontre a aba de <b>Segurança</b>, ative a verificação em duas etapas e clique em <b>Verificação em Duas Etapas</b>:<br /><br />
                            <div className="d-flex justify-content-center"><img alt="Ver Duas Etapas" src={require('./../imgs/seesettings.png')} className='img-fluid shadow-4'></img></div><br /><br />
                            3. Clique em <b>Senhas de app</b> ao final da página:<br /><br />
                            <div className="d-flex justify-content-center"><img alt="Selecionar App" src={require('./../imgs/duasetapas.png')} className='img-fluid shadow-4'></img></div><br /><br />
                            4. Clique na seção <b>Selecionar app</b>:<br /><br />
                            <div className="d-flex justify-content-center"><img alt="Senha" src={require('./../imgs/senha.png')} className='img-fluid shadow-4'></img></div><br /><br />
                            5. Escolha a opção <b>Outro (nome personalizado)</b>, digite um nome para o acesso à plataforma e clique em <b>Gerar</b>:<br /><br />
                            <div className="d-flex justify-content-center"><img alt="Geração" src={require('./../imgs/outro.png')} className='img-fluid shadow-4'></img></div><br /><br />
                            6. Selecione a chave gerada na área amarela:<br /><br />
                            <div className="d-flex justify-content-center"><img alt="Copiar" src={require('./../imgs/seleciona.png')} className='img-fluid shadow-4'></img></div><br /><br />
                            7. Cole o texto selecionado neste campo.
                        </MDBModalBody>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Informações do usuários */}
            <MDBContainer fluid className="shadow bg-light mt-3 rounded-3 p-3">
                <h4>Usuário</h4>
                <hr className='mt-0 mb-3'></hr>
                <div className='row g-3'>
                    <div className="col-12">
                        <MDBInput onChange={e=>{setUser(user => ({
                            ...user,
                            ...{nome:e.target.value}
                        }))}} id='nomeUsuario' value={user?.nome} name='fname' required label='Nome' />
                    </div>
                    <div className="col-md-6">
                        <MDBInput id='emailUsuario' readOnly type='email' value={user?.email} name='femail' required label='Email' />
                    </div>
                    <div className="col-md-6">
                        <MDBInput onChange={e=>{setUser(user => ({
                            ...user,
                            ...{universidade:e.target.value}
                        }))}} id='univUsuario' value={user?.universidade} name='funiv' required label='Instituição' />
                    </div>
                    <div className="col-md-6" >
                        <MDBInput onKeyDown={e => { limit(e.target, 20) }} onKeyUp={e => { limit(e.target, 20) }} id='senha' type='password' onChange={e => {
                            e.target.classList.remove('is-invalid')
                            if (e.target.value !== '') document.getElementById("ConfirmaSenha").removeAttribute('readOnly')
                            else document.getElementById("ConfirmaSenha").setAttribute('readOnly', true)
                        }} name='fsenha' label='Nova senha' />
                    </div>
                    <div className="col-md-6">
                        <MDBInput onKeyDown={e => { limit(e.target, 20) }} onKeyUp={e => { limit(e.target, 20) }} id='ConfirmaSenha' readOnly type='password' onChange={e => {
                            e.target.classList.remove('is-invalid')
                        }} name='fconfsenha' label='Confirmar nova senha' />
                    </div>
                    <div className="col-12">
                        <MDBInputGroup className='col-12'
                            textBefore="Senha de Aplicativo do Gmail"
                            textAfter={<div onClick={e => { setModalAjuda(true) }}><i className="fas fa-solid fa-circle-question"></i></div>}>
                            <input onKeyDown={e => { limit(e.target, 250) }} onKeyUp={e => { limit(e.target, 250) }}
                                id={"appPassword"} defaultValue={user?.appPassword} className='form-control' type='text' />
                        </MDBInputGroup>
                    </div>
                    <div className='col-12 d-flex'>
                        <MDBBtn onClick={e => handleSave()} className="ms-auto">Salvar</MDBBtn>
                    </div>
                </div>
            </MDBContainer>

            {/* Informações dos cursos e modalidades */}
            <MDBContainer fluid className="shadow bg-light mt-3 rounded-3 p-3">
                <h4 >Cursos e Modalidades</h4>
                <hr className='mt-0 mb-2'></hr>

                <h6>Cursos:</h6>
                {renderizaCursos()}
                <div id="novoCurso" className="mt-2" style={{ display: "none" }}>
                    <MDBInputGroup className='col-12' textAfter={
                        <i onClick={e => addCurso({curso: document.getElementById("novoCursoNome").value})} className="fa-regular fa-floppy-disk"/>}>
                        <input onChange={e => limit(e.target, 250)} id="novoCursoNome" className='form-control' type='text' placeholder="Novo Curso"/>
                    </MDBInputGroup>
                </div>
                <i className="border rounded border-dark py-1 px-2 mt-2 edit fas fa-regular fa-plus" onClick={e => document.getElementById("novoCurso").style.display = 'block'}/>

                <hr className='my-3'></hr>

                <h6 className="mt-2">Modalidades:</h6>
                {renderizaModalidades()}
                <div id="novaModalidade" className="mt-2" style={{ display: "none" }}>
                    <MDBInputGroup textAfter={
                        <i onClick={e=>addModalidade({modalidade: document.getElementById("novaModalidadeNome").value})} className="fa-regular fa-floppy-disk"/>}>
                        <input onChange={e => limit(e.target, 250)} id="novaModalidadeNome" className='form-control' type='text' placeholder="Nova modalidade"/>
                    </MDBInputGroup>
                </div>
                <i className="border rounded border-dark py-1 px-2 mt-2 edit fas fa-regular fa-plus" onClick={e => document.getElementById("novaModalidade").style.display = 'block'}/>
            </MDBContainer>

            {/* Botões de perfil administrador e logout */}
            <div className="d-flex mt-2">
                <div className="ms-auto">{admin()}</div>
                <MDBBtn color="danger" onClick={e => RemoveSessao(navigate,true)}>Logout</MDBBtn>
            </div>

        </main>
    )
}