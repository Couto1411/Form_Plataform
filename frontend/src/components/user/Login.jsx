import React, {useState} from 'react'
import './Login.css'
import axios from "axios"
import baseUrl from "../../config/api"
import {useNavigate, Link} from 'react-router-dom';
import { MDBInput } from 'mdb-react-ui-kit';

export default function Login (props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    
    async function signIn(){
        await axios.post(baseUrl+"/signin",{
            "email":email,
            "senha":senha
        })
        .then((response) => {
            sessionStorage.setItem("userId",response.data.id)
            sessionStorage.setItem("admin",response.data.admin)
            sessionStorage.setItem("token",response.data.token)
            navigate('/user')
        })
        .catch((error) => {
            if(error.response.status){
                if(error.response.status===401){
                    var v = document.getElementById("Senha");
                    v.classList.add("is-invalid");
                }else if(error.response.status===400){
                    var v = document.getElementById("Email");
                    v.classList.add("is-invalid");
                }else{
                    console.log(error)
                }
            }
        })
    }
    function updateField(id){
        var v = document.getElementById(id);
        v.classList.remove("is-invalid");
    }

    return(
        <section className='login'>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{borderRadius: 1 + 'rem'}}>
                            <div className="card-body p-5 text-center">
                                <div className="mb-md-5 mt-md-4 pb-5">
                                    <h2 className="fw-bold mb-2 text-uppercase">Entrar</h2>
                                    <p className="text-white-50 mb-5">Insira seu email e senha de acesso</p>

                                    <div className="mb-4">
                                        <MDBInput 
                                            type="email" 
                                            size="lg"
                                            id="Email"
                                            required 
                                            contrast 
                                            onChange={e => {
                                                updateField(e.target.id)
                                                setEmail(e.target.value)
                                            }}
                                            label="Email"/>
                                    </div>
                                    <div className=" mb-4">
                                        <MDBInput  
                                            type="password" 
                                            size="lg"
                                            id="Senha"
                                            required 
                                            contrast 
                                            onChange={e => {
                                                updateField(e.target.id)
                                                setSenha(e.target.value)
                                            }}
                                            label="Senha"/>
                                    </div>

                                    <p className="small mb-5 pb-lg-2"><Link className='forgot text-white-50' to="/forgot">Esqueceu sua senha?</Link></p>

                                    <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={() => {signIn()}} >Login</button>
                                </div>
                                <div>
                                    <p className="mb-0">Precisa de acesso? Contate o responsável da instituição</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}