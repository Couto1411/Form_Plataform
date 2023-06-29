import React, {useState} from 'react'
import './Login.css'
import axios from "axios"
import baseUrl from "../../config/api"
import {useNavigate} from 'react-router-dom';
import { MDBInput,MDBInputGroup,MDBBtn } from 'mdb-react-ui-kit';

export default function Login (props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [senha, setSenha] = useState();
    const [aparecendo, setAparecendo] = useState(false);
    
    const signIn = async (e) =>{
        e.preventDefault()
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
            if(error.response){
                if(error.response.status===401){
                    let v = document.getElementById("Senha");
                    v.classList.add("is-invalid");
                }else if(error.response.status===400){
                    let v = document.getElementById("Email");
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
        <form className='login' onSubmit={e=>{signIn(e)}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="card bg-dark text-white" style={{borderRadius: 1 + 'rem'}}>
                            <div className="card-body p-5 text-center mb-3">
                                <div className="mb-md-5 mt-md-4 pb-2">
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
                                    <MDBInputGroup className='GrupoSenha mb-4 row' size='lg'> 
                                        <div className="form-outline form-white col-10 p-0">
                                            <input type="password" className="form-control form-control-lg" id="Senha" required
                                            onChange={e => {
                                                updateField(e.target.id)
                                                setSenha(e.target.value)
                                                if(e.target.value==='') e.target.classList.remove('active')
                                                else e.target.classList.add('active')
                                            }}/>
                                            <label className="form-label" htmlFor="Senha">Senha</label>
                                            <div className="form-notch">
                                                <div className="form-notch-leading"></div>
                                                <div className="form-notch-middle" style={{width: '43.2px'}}></div>
                                                <div className="form-notch-trailing"></div>
                                            </div>
                                        </div>
                                        <MDBBtn className='col-2' type='button' outline color='light' onClick={e=>{
                                            if (aparecendo) {
                                                document.getElementById('slashed').style.display='none'
                                                document.getElementById('normal').style.display='block'
                                                document.getElementById('Senha').type='text'
                                            }else{
                                                document.getElementById('slashed').style.display='block'
                                                document.getElementById('normal').style.display='none'
                                                document.getElementById('Senha').type='password'
                                            }
                                            setAparecendo(!aparecendo)
                                        }}><i style={{display: 'block'}} id='slashed' className="fa-solid fa-eye-slash"></i><i style={{display: 'none'}} id='normal' className="fa-solid fa-eye"></i></MDBBtn>
                                    </MDBInputGroup>

                                    <p className="small mb-5 pb-lg-2"></p>

                                    <button className="btn btn-outline-light btn-lg px-5" type="submit" >Login</button>
                                </div>
                                <div>
                                    <p className="mb-0">Precisa de acesso? Esqueceu sua senha?<br/> Contate o responsável da instituição.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}