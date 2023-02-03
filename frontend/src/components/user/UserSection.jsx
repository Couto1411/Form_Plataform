import React from "react"
import './UserSection.css'
import baseUrl from "../../config/api"
import Title from "../template/Title"
import axios from "axios"
import { useState } from "react"
import { MDBInput, MDBBtn,MDBContainer} from 'mdb-react-ui-kit'
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

    useEffect(() => {
        async function carregaUsuario(){
            let res = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId"),{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .catch((error) => {console.log(error)})
            setNome(res.data.nome)
            setUser(res.data)
        }
        carregaUsuario()
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
                .catch((error) => {console.log(error)})
            }else univ.classList.add('is-invalid')
        }
        else nomeUser.classList.add('is-invalid')
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
                    <div className="d-flex mt-2"><MDBBtn className="ms-auto" color="danger" onClick={e => {navigate('/login')}}>Logout</MDBBtn></div>
                </main>
            )
        default:
            break;
    }
}