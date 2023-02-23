import React from "react"
import './UserSection.css'
import baseUrl from "../../config/api"
import Title from "../template/Title"
import axios from "axios"
import { useState } from "react"
import { MDBInput, MDBBtn,MDBContainer, MDBInputGroup} from 'mdb-react-ui-kit'
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function UserSection(main,secao,props){
    const navigate = useNavigate()
    const [user,setUser]= useState({
        nome:"",
        email:"",
        universidade:""
    })
    const [nome,setNome]= useState("")
    const [cursos,setCursos]= useState([])
    const [tipoCursos,setTipoCursos]= useState([])
    const [count,setCount]= useState(0)

    async function carregaUsuario(){
        let res = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId"),{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
        setNome(res.data.nome)
        setUser(res.data)
    }
    
    async function carregaCursos(){
        let res = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/cursos",{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
        setCursos(res.data.listaCursos)
        setTipoCursos(res.data.listaTipoCursos)
    }

    useEffect(() => {
        carregaUsuario()
        carregaCursos()
    }, []);

    async function handleSave(){
        let nomeUser=document.getElementById('nomeUsuario')
        let univ=document.getElementById('univUsuario')
        let senha=document.getElementById('senha')
        let confsenha=document.getElementById('ConfirmaSenha')
        if(nomeUser.value){
            if (univ.value) {
                if (senha.value) {
                    if (senha.value==confsenha.value) {
                        user.senha=senha.value
                        user.confirmaSenha=confsenha.value
                    }else{
                        confsenha.classList.add('is-invalid')
                        senha.classList.add('is-invalid')
                    }
                }
                await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId"),user,{
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                .then((_)=>{ 
                    senha.value=''
                    confsenha.value=''
                })
                .catch((error) => {
                    if (error.response.status===401) {
                        navigate('/login')
                        console.warn("Faça o login")
                    }else{ console.log(error)}
                })
            }else univ.classList.add('is-invalid')
        }
        else nomeUser.classList.add('is-invalid')
    }

    async function addCursos(){
        if (cursos.length==0){ document.getElementById("labelCurso").style.color='red' }
        else{
            document.getElementById("labelCurso").style.color='#4f4f4f'
            if (tipoCursos.length==0) {document.getElementById("labelTipoCurso").style.color='red'}
            else{
                document.getElementById("labelTipoCurso").style.color='#4f4f4f'
                let objeto ={}
                objeto.listaCursos = cursos
                objeto.listaTipoCursos = tipoCursos
                console.log(objeto)
                await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/cursos",objeto,{
                    headers: {
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                .catch((error) => {
                    if (error.response.status===401) {
                        navigate('/login')
                        console.warn("Faça o login")
                    }else console.log(error)
                })
            }
        }
    }

    async function editCursos(cursoounao, item){
        if(cursoounao){
            let objeto ={}
            objeto.curso=document.getElementById("cursonome"+item.id).value
            await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/curso/"+item.id,objeto,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else console.log(error)
            })
        }
        else{
            let objeto ={}
            objeto.tipoCurso=document.getElementById("tipocursonome"+item.id).value
            await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/tipocurso/"+item.id,objeto,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else console.log(error)
            })
        }
    }

    async function deleteCursos(cursoounao, item){
        if(cursoounao){
            await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/curso/"+item.id,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then((response)=>{
                setCursos(cursos.filter(a=> a.id !== item.id))
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else console.log(error)
            })
        }
        else{
            await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/tipocurso/"+item.id,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then((response)=>{
                setTipoCursos(tipoCursos.filter(a=> a.id !== item.id))
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else console.log(error)
            })
        }
    }

    function limit(element,tamanho)
    {
        var max_chars = tamanho;
            
        if(element.value.length > max_chars) {
            element.value = element.value.substr(0, max_chars);
        }
    }

    switch (main) {
        case 1:
            return(secao)
        case 2:
            return(
                <main className='mt-3 principal'>
                    {Title(nome)}
                    <MDBContainer fluid className="bg-light mt-3 rounded-3 p-3">
                        <h4>Usuário</h4>
                        <hr className='mt-0 mb-3'></hr>
                        <div className='row g-3'>
                            <div className="col-12">
                                <MDBInput onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}} id='nomeUsuario' value={user?.nome} onChange={e=>setUser({...user,nome: e.target.value})} name='fname' required label='Nome'/>
                            </div>
                            <div className="col-md-6">
                                <MDBInput  id='emailUsuario' readOnly type='email' value={user?.email} name='femail' required label='Email'/>
                            </div>
                            <div className="col-md-6"> 
                                <MDBInput onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}} id='univUsuario' value={user?.universidade} onChange={e=>setUser({...user,universidade: e.target.value})} name='funiv' required label='Universidade'/>
                            </div>
                            <div className="col-md-6" >
                                <MDBInput onKeyDown={e=>{limit(e.target,20)}} onKeyUp={e=>{limit(e.target,20)}} id='senha' type='password' onChange={e=>{
                                    e.target.classList.remove('is-invalid')
                                    if (e.target.value!=='') document.getElementById("ConfirmaSenha").removeAttribute('readOnly')
                                    else document.getElementById("ConfirmaSenha").setAttribute('readOnly',true)
                                }} name='fsenha' label='Nova senha'/>
                            </div>
                            <div className="col-md-6">
                                <MDBInput onKeyDown={e=>{limit(e.target,20)}} onKeyUp={e=>{limit(e.target,20)}} id='ConfirmaSenha' readOnly type='password' onChange={e=>{
                                    e.target.classList.remove('is-invalid')
                                }} name='fconfsenha' label='Confirmar nova senha'/>
                            </div>
                            <div className='col-12 d-flex'>
                                <MDBBtn onClick={e=>handleSave()} className="ms-auto">Salvar</MDBBtn>
                            </div>
                        </div>
                    </MDBContainer>

                    <MDBContainer fluid className="bg-light mt-3 rounded-3 p-3">
                        <h4 >Curso</h4>
                        <hr className='mt-0 mb-3'></hr>
                        
                        <h6 id="labelCurso">Cursos:</h6>
                        <div className='row g-3'>
                            {cursos?.map(item =>{
                                if(item.novo){
                                    return (<div key={item.name} className='col-12'>
                                                <MDBInput value={item?.curso} disabled label='Nome do curso'/>
                                            </div>)
                                }else{
                                    return (<MDBInputGroup key={"curso"+item.id} className='col-12' 
                                                textBefore={<div onClick={e=>{editCursos(true,item)}}><i className="fa-regular fa-floppy-disk"></i></div>}
                                                textAfter={ <div onClick={e=>{deleteCursos(true,item)}}><i className="trashcan pt-1 fas fa-trash-can"></i></div>}>
                                                <input 
                                                    onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}}
                                                    id={"cursonome"+item.id} defaultValue={item.curso} className='form-control' type='text' />
                                            </MDBInputGroup>)
                                }
                            })}
                            <div id="novoCurso" style={{display:"none"}}>
                                <MDBInputGroup className='col-12' textAfter={<div onClick={e=>{
                                        setCount(count+1)
                                        setCursos([...cursos,{novo:true,name:"cursonovo"+count,curso:document.getElementById("novoCursoNome").value}])
                                        document.getElementById("novoCurso").style.display='none'
                                    }}><i className="fa-regular fa-floppy-disk"></i></div>}>
                                    <input onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}} id="novoCursoNome" className='form-control' type='text' />
                                </MDBInputGroup>
                            </div>
                            <i role='button' className="addQuestao mx-1 edit fas fa-regular fa-plus" onClick={e=>document.getElementById("novoCurso").style.display='inline-block'} ></i>
                        </div>

                        <h6 id="labelTipoCurso" className="mt-2">Tipo de Cursos:</h6>
                        <div className='row g-3'>
                            {tipoCursos?.map(item =>{
                                if(item.novo){
                                    return <div key={item.name} className='col-12'>
                                                <MDBInput value={item?.tipoCurso} disabled label='Tipo dos cursos'/>
                                            </div>
                                }else{
                                    return (<MDBInputGroup key={"tipocurso"+item.id} className='col-12'
                                                textBefore={<div onClick={e=>{editCursos(false,item)}}><i className="fa-regular fa-floppy-disk"></i></div>}
                                                textAfter={<div onClick={e=>{deleteCursos(false,item)}}><i className="trashcan pt-1 fas fa-trash-can"></i></div>}>
                                                <input 
                                                    onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}}
                                                    id={"tipocursonome"+item.id} defaultValue={item.tipoCurso} className='form-control' type='text' />
                                            </MDBInputGroup>)
                                }
                            })}
                            <div id="novoTipoCurso" style={{display:"none"}}>
                                <MDBInputGroup className='col-12' textAfter={<div onClick={e=>{
                                        setTipoCursos([...tipoCursos,{novo:true,name:"tipocursonovo"+count,tipoCurso:document.getElementById("novoTipoCursoNome").value}])
                                        setCount(count+1)
                                        document.getElementById("novoTipoCurso").style.display='none'
                                    }}><i className="fa-regular fa-floppy-disk"></i></div>}>
                                    <input onKeyDown={e=>{limit(e.target,250)}} onKeyUp={e=>{limit(e.target,250)}} id="novoTipoCursoNome" className='form-control' type='text' />
                                </MDBInputGroup>
                            </div>
                            <i role='button' className="addQuestao mx-1 edit fas fa-regular fa-plus" onClick={e=>document.getElementById("novoTipoCurso").style.display='inline-block'} ></i>
                        </div>

                        <div className='d-flex mt-2'>
                            <MDBBtn color='secondary' onClick={e=>{
                                document.getElementById("novoCurso").style.display='none'
                                document.getElementById("novoTipoCurso").style.display='none'
                                setTipoCursos(tipoCursos.filter(x => x.novo!=true))
                                setCursos(cursos.filter(x => x.novo!=true))
                                }} className="ms-auto">Cancelar</MDBBtn>
                            <MDBBtn onClick={e=>addCursos()}>Salvar</MDBBtn>
                        </div>
                    </MDBContainer>
                    <div className="d-flex mt-2"><MDBBtn className="ms-auto" color="danger" onClick={e => {navigate('/login')}}>Logout</MDBBtn></div>
                </main>
            )
        default:
            break;
    }
}