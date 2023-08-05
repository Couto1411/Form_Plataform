import React, {useState} from 'react'
import './Login.css'
import axios from "axios"
import baseUrl from "../../config/api"
import { MDBInput,MDBInputGroup,MDBBtn } from 'mdb-react-ui-kit';

export default function Login ({navigate}) {
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
            <div className="container py-5 h-75">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-lg-4 top-logos">
                        <div className='text-center'>
                            <img className='img-fluid mb-5' src={require('./../imgs/PROFEPT_CEFET.png')} alt='profept_logo'/>
                            <img className='img-fluid' src={require('./../imgs/LogoVertical.png')} alt='raeg_logo'/>
                        </div>
                    </div>
                    <div className='col-lg-2'></div>
                    <div className="col-10 col-md-8 col-lg-5 col-xxl-4 mb-7 mb-lg-0">
                        <div className="card bg-dark text-white shadow" style={{borderRadius: 1 + 'rem'}}>
                            <div className="card-body p-4 text-center mb-3">
                                <div className="mb-5 mt-md-4 pb-2">
                                    <h2 className="fw-bold mb-2 text-uppercase">Entrar</h2>
                                    <p className="text-white-50 mb-5">Insira seu email e senha de acesso</p>

                                    <div className="mb-4 px-4">
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
                                    <MDBInputGroup className='GrupoSenha mb-4 row px-4' size='lg'> 
                                        <div className="form-outline form-white col-9 p-0">
                                            <input type={aparecendo?"text":"password"} className="form-control form-control-lg" id="Senha" required
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
                                        <MDBBtn className='col-3 border' type='button' outline color='light' onClick={e=>setAparecendo(!aparecendo)}>
                                            <i id='normal' className={"fa-solid fa-eye"+(aparecendo?'':'-slash')}/>
                                        </MDBBtn>
                                    </MDBInputGroup>

                                    <p className="small mb-5"></p>

                                    <button className="btn btn-outline-light btn-lg px-5" type="submit" >Login</button>
                                </div>
                                <div>
                                    <p className="mb-0">Precisa de acesso? Esqueceu sua senha?<br/> Contate o responsável da instituição.</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-10 col-md-8 bottom-logos">
                        <div className='text-center'>
                            <img className='img-fluid mb-9' src={require('./../imgs/PROFEPT_CEFET.png')} alt='profept_logo'/>
                            <img className='img-fluid' src={require('./../imgs/LogoVertical.png')} alt='raeg_logo'/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}