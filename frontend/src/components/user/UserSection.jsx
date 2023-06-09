import React, {useState,useEffect} from "react"
import './UserSection.css'
import baseUrl from "../../config/api"
import Title from "../template/Title"
import { limit, CarregaCursos, CarregaUsuario } from "../../config/utils"
import axios from "axios"
import {
    MDBInput, MDBBtn, MDBContainer, MDBInputGroup,
    MDBModal, MDBModalDialog, MDBModalContent, MDBModalBody
} from 'mdb-react-ui-kit'
import { useNavigate } from "react-router-dom"

export default function UserSection() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [cursos, setCursos] = useState([])
    const [tipoCursos, setTipoCursos] = useState([])
    const [count, setCount] = useState(0)
    const [modalAjuda, setModalAjuda] = useState(false)

    useEffect(() => {
        CarregaUsuario(setUser,navigate)
        CarregaCursos(setCursos,setTipoCursos,navigate)
    }, []);

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
                            if (error.response.status === 401) {
                                navigate('/login')
                                sessionStorage.removeItem('token')
                                sessionStorage.removeItem('enviadoId')
                                sessionStorage.removeItem('formDeId')
                                sessionStorage.removeItem('formId')
                                alert("Faça o login")
                            } else { console.log(error) }
                        })
                } else appPassword.classList.add('is-invalid')
            } else univ.classList.add('is-invalid')
        }
        else nomeUser.classList.add('is-invalid')
    }

    async function addCursos() {
        if (cursos.length === 0) { document.getElementById("labelCurso").style.color = 'red' }
        else {
            document.getElementById("labelCurso").style.color = '#4f4f4f'
            if (tipoCursos.length === 0) { document.getElementById("labelTipoCurso").style.color = 'red' }
            else {
                document.getElementById("labelTipoCurso").style.color = '#4f4f4f'
                let objeto = {}
                objeto.listaCursos = cursos
                objeto.listaTipoCursos = tipoCursos
                await axios.post(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/cursos", objeto, {
                    headers: {
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                    .catch((error) => {
                        if (error.response.status === 401) {
                            navigate('/login')
                            sessionStorage.removeItem('token')
                            sessionStorage.removeItem('enviadoId')
                            sessionStorage.removeItem('formDeId')
                            sessionStorage.removeItem('formId')
                            alert("Faça o login")
                        } else console.log(error)
                    })
            }
        }
    }

    async function editCursos(cursoounao, item) {
        if (cursoounao) {
            let objeto = {}
            objeto.curso = document.getElementById("cursonome" + item.id).value
            await axios.put(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/curso/" + item.id, objeto, {
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/login')
                        sessionStorage.removeItem('token')
                        sessionStorage.removeItem('enviadoId')
                        sessionStorage.removeItem('formDeId')
                        sessionStorage.removeItem('formId')
                        alert("Faça o login")
                    } else console.log(error)
                })
        }
        else {
            let objeto = {}
            objeto.tipoCurso = document.getElementById("tipocursonome" + item.id).value
            await axios.put(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/tipocurso/" + item.id, objeto, {
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/login')
                        sessionStorage.removeItem('token')
                        sessionStorage.removeItem('enviadoId')
                        sessionStorage.removeItem('formDeId')
                        sessionStorage.removeItem('formId')
                        alert("Faça o login")
                    } else console.log(error)
                })
        }
    }

    async function deleteCursos(cursoounao, item) {
        if (cursoounao) {
            await axios.delete(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/curso/" + item.id, {
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
                .then((response) => {
                    setCursos(cursos.filter(a => a.id !== item.id))
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/login')
                        sessionStorage.removeItem('token')
                        sessionStorage.removeItem('enviadoId')
                        sessionStorage.removeItem('formDeId')
                        sessionStorage.removeItem('formId')
                        alert("Faça o login")
                    } else console.log(error)
                })
        }
        else {
            await axios.delete(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/tipocurso/" + item.id, {
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
                .then((response) => {
                    setTipoCursos(tipoCursos.filter(a => a.id !== item.id))
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        navigate('/login')
                        sessionStorage.removeItem('token')
                        sessionStorage.removeItem('enviadoId')
                        sessionStorage.removeItem('formDeId')
                        sessionStorage.removeItem('formId')
                        alert("Faça o login")
                    } else console.log(error)
                })
        }
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
                                2. Encontre a aba de <b>Segurança</b>, ative a verificação em duas etapas e clique em <b>Senhas de apps</b>:<br /><br />
                                <div className="d-flex justify-content-center"><img alt="Ver Configurações" src={require('./../imgs/seesettings.png')} className='img-fluid shadow-4'></img></div><br /><br />
                                3. Clique na seção <b>Selecionar app</b>:<br /><br />
                                <div className="d-flex justify-content-center"><img alt="Senha" src={require('./../imgs/senha.png')} className='img-fluid shadow-4'></img></div><br /><br />
                                4. Escolha a opção <b>Outro (nome personalizado)</b>, digite um nome para o acesso à plataforma e clique em <b>Gerar</b>:<br /><br />
                                <div className="d-flex justify-content-center"><img alt="Geração" src={require('./../imgs/outro.png')} className='img-fluid shadow-4'></img></div><br /><br />
                                5. Selecione a chave gerada na área amarela:<br /><br />
                                <div className="d-flex justify-content-center"><img alt="Copiar" src={require('./../imgs/seleciona.png')} className='img-fluid shadow-4'></img></div><br /><br />
                                6. Cole o texto selecionado neste campo.
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
                            }))}} id='univUsuario' value={user?.universidade} name='funiv' required label='Universidade' />
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
                    <h4 >Curso</h4>
                    <hr className='mt-0 mb-3'></hr>

                    <h6 id="labelCurso">Cursos:</h6>
                    <div className='row g-3'>
                        {cursos?.map(item => {
                            if (item.novo) {
                                return (<div key={item.name} className='col-12'>
                                    <MDBInput value={item?.curso} disabled label='Nome do curso' />
                                </div>)
                            } else {
                                return (<MDBInputGroup key={"curso" + item.id} className='col-12'
                                    textBefore={<div onClick={e => { editCursos(true, item) }}><i className="fa-regular fa-floppy-disk"></i></div>}
                                    textAfter={<div onClick={e => { deleteCursos(true, item) }}><i className="trashcan pt-1 fas fa-trash-can"></i></div>}>
                                    <input
                                        onKeyDown={e => { limit(e.target, 250) }} onKeyUp={e => { limit(e.target, 250) }}
                                        id={"cursonome" + item.id} defaultValue={item?.curso} className='form-control' type='text' />
                                </MDBInputGroup>)
                            }
                        })}
                        <div id="novoCurso" style={{ display: "none" }}>
                            <MDBInputGroup className='col-12' textAfter={<div onClick={e => {
                                setCount(count + 1)
                                setCursos([...cursos, { novo: true, name: "cursonovo" + count, curso: document.getElementById("novoCursoNome").value }])
                                document.getElementById("novoCurso").style.display = 'none'
                            }}><i className="fa-regular fa-floppy-disk"></i></div>}>
                                <input onKeyDown={e => { limit(e.target, 250) }} onKeyUp={e => { limit(e.target, 250) }} id="novoCursoNome" className='form-control' type='text' />
                            </MDBInputGroup>
                        </div>
                        <i role='button' className="addQuestao mx-1 edit fas fa-regular fa-plus" onClick={e => document.getElementById("novoCurso").style.display = 'inline-block'} ></i>
                    </div>

                    <h6 id="labelTipoCurso" className="mt-2">Modalidades dos Cursos:</h6>
                    <div className='row g-3'>
                        {tipoCursos?.map(item => {
                            if (item.novo) {
                                return <div key={item.name} className='col-12'>
                                    <MDBInput value={item?.tipoCurso} disabled label='Modalidade dos cursos' />
                                </div>
                            } else {
                                return (<MDBInputGroup key={"tipocurso" + item.id} className='col-12'
                                    textBefore={<div onClick={e => { editCursos(false, item) }}><i className="fa-regular fa-floppy-disk"></i></div>}
                                    textAfter={<div onClick={e => { deleteCursos(false, item) }}><i className="trashcan pt-1 fas fa-trash-can"></i></div>}>
                                    <input
                                        onKeyDown={e => { limit(e.target, 250) }} onKeyUp={e => { limit(e.target, 250) }}
                                        id={"tipocursonome" + item.id} defaultValue={item?.tipoCurso} className='form-control' type='text' />
                                </MDBInputGroup>)
                            }
                        })}
                        <div id="novoTipoCurso" style={{ display: "none" }}>
                            <MDBInputGroup className='col-12' textAfter={<div onClick={e => {
                                setTipoCursos([...tipoCursos, { novo: true, name: "tipocursonovo" + count, tipoCurso: document.getElementById("novoTipoCursoNome").value }])
                                setCount(count + 1)
                                document.getElementById("novoTipoCurso").style.display = 'none'
                            }}><i className="fa-regular fa-floppy-disk"></i></div>}>
                                <input onKeyDown={e => { limit(e.target, 250) }} onKeyUp={e => { limit(e.target, 250) }} id="novoTipoCursoNome" className='form-control' type='text' />
                            </MDBInputGroup>
                        </div>
                        <i role='button' className="addQuestao mx-1 edit fas fa-regular fa-plus" onClick={e => document.getElementById("novoTipoCurso").style.display = 'inline-block'} ></i>
                    </div>

                    <div className='d-flex mt-2'>
                        <MDBBtn color='secondary' onClick={e => {
                            document.getElementById("novoCurso").style.display = 'none'
                            document.getElementById("novoTipoCurso").style.display = 'none'
                            setTipoCursos(tipoCursos.filter(x => x.novo !== true))
                            setCursos(cursos.filter(x => x.novo !== true))
                        }} className="ms-auto">Cancelar</MDBBtn>
                        <MDBBtn onClick={e => addCursos()}>Salvar</MDBBtn>
                    </div>
                </MDBContainer>

                {/* Botões de perfil administrador e logout */}
                <div className="d-flex mt-2">
                    <div className="ms-auto">{admin()}</div>
                    <MDBBtn color="danger" onClick={e => { 
                        navigate('/login')
                        sessionStorage.removeItem('token')
                        sessionStorage.removeItem('enviadoId')
                        sessionStorage.removeItem('formDeId')
                        sessionStorage.removeItem('formId') }}>Logout</MDBBtn>
                </div>

            </main>
        )
}