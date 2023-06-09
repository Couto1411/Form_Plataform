import React, {useEffect,useState}from 'react'
import Dashboard from '../dashboard/dashboard'
import './FormsUser.css'
import Title from '../template/Title'
import { limit, CarregaForms } from '../../config/utils'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from './UserSection'
import axios from "axios"
import baseUrl from "../../config/api"
import {useNavigate, Link} from 'react-router-dom'
import {
    MDBInput,
    MDBListGroup, MDBListGroupItem,
    MDBBtn, MDBModal, MDBModalDialog, MDBModalContent, MDBModalHeader, MDBModalBody, MDBModalFooter} from 'mdb-react-ui-kit'

export default function PaginaUsuario(){
    const navigate = useNavigate();

    // Modal para criar formulário
    const [centredModal, setCentredModal] = useState(false);
    // Modal para deletar formulário
    const [deletaFormulario, setDeletaFormulario] = useState(false);
    // Hook para setar o id do formulário a ser deletado
    const [idToDelete, setIdToDelete] = useState(0);
    // Hook para dizer se o formulário a ser deletado é derivado
    const [idDerivateToDelete, setIdDerivateToDelete] = useState(null);

    // Booleano usado para decidir se a função irá adicionar ou editar um formulário
    const [addForm, setAddForm] = useState(false);

    // Lista de formulários do usuário
    const [forms, setforms] = useState([]);
    const [form, setform] = useState({id: null, titulo:null});

    const [secao, setSecao] = useState(1)

    const [count, setCount] = useState(0);

    
    const toggleShow = (element) => {
        setCentredModal(!centredModal)
        setform(element)
        var change = document.getElementById("form"+form.id);
        change.classList.remove("is-invalid");
    };
    

    useEffect(() => {
        if (sessionStorage.getItem("token")){
            CarregaForms(setforms, navigate)
        }
        else{
            alert("Faça o login")
            navigate('/login')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('enviadoId')
            sessionStorage.removeItem('formDeId')
            sessionStorage.removeItem('formId')
        }

    }, []);

    async function editForm(){
        var change = document.getElementById("form"+form.id);
        let dados={"titulo": change.value}
        if (addForm) {
            if (change.value !== '') {
                change.classList.remove("is-invalid");
                await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms",dados,{
                    headers: {
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                .then((response)=>{
                    setforms([
                        ...forms,
                        {id: response.data, titulo: change.value, derivados:[]}
                    ])
                })
                .catch((error) => {
                    if (error.response.status===401) {
                        navigate('/login')
                        sessionStorage.removeItem('token')
                        sessionStorage.removeItem('enviadoId')
                        sessionStorage.removeItem('formDeId')
                        sessionStorage.removeItem('formId')
                        alert("Faça o login")
                    }else{ console.log(error)}
                })
            }
            else{
                change.classList.add("is-invalid");
            }
        }else{
            if (change.value === form.titulo) {
                change.classList.add("is-invalid");
            }
            else{
                change.classList.remove("is-invalid");
                await axios.put(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+form.id,dados,{
                    headers: {
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                .then((response)=>{
                    forms[forms.map(object => object.id).indexOf(form.id)].titulo=change.value
                })
                .catch((error) => {
                    if (error.response.status===401) {
                        navigate('/login')
                        sessionStorage.removeItem('token')
                        sessionStorage.removeItem('enviadoId')
                        sessionStorage.removeItem('formDeId')
                        sessionStorage.removeItem('formId')
                        alert("Faça o login")
                    }else{ console.log(error)}
                })
            }
        }
        toggleShow({id: null, titulo:null});
    }

    async function deleteForm(){
        if(idDerivateToDelete){
            // Form a ser deletado é derivado
            await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+idDerivateToDelete,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then((response)=>{
                let indexOrig = forms.map(object => object.id).indexOf(idToDelete)
                forms[indexOrig].derivados=forms[indexOrig].derivados.filter(a=> a.id!== idDerivateToDelete)
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    sessionStorage.removeItem('token')
                    sessionStorage.removeItem('enviadoId')
                    sessionStorage.removeItem('formDeId')
                    sessionStorage.removeItem('formId')
                    alert("Faça o login")
                }else{ console.log(error)}
            })
        }else{
            // Form a ser deletado é original
            await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+idToDelete,{
                headers: {
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            .then((response)=>{
                setforms(forms.filter(a=> a.id !== idToDelete))
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    sessionStorage.removeItem('token')
                    sessionStorage.removeItem('enviadoId')
                    sessionStorage.removeItem('formDeId')
                    sessionStorage.removeItem('formId')
                    alert("Faça o login")
                }else{ console.log(error)}
            })
        }
        setDeletaFormulario(false)
    }

    function toggleDerivados(id){
        let x = document.getElementById('icone'+id).aberto
        if (x===undefined || x==='F') {
            document.getElementById('form'+id+'derivados').style.display='block'
            document.getElementById('icone'+id).classList.remove("fa-angle-down")
            document.getElementById('icone'+id).classList.add("fa-angle-up")
            document.getElementById('icone'+id).aberto=''
        }
        else{
            document.getElementById('form'+id+'derivados').style.display='none'
            document.getElementById('icone'+id).classList.remove("fa-angle-up")
            document.getElementById('icone'+id).classList.add("fa-angle-down")
            document.getElementById('icone'+id).aberto='F'
        }
    }

    async function addDerivado(element){
        let novoDerivado = {}
        novoDerivado.titulo = element.titulo
        novoDerivado.derivadoDeId = element.id
        await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms",novoDerivado,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('enviadoId')
                sessionStorage.removeItem('formDeId')
                sessionStorage.removeItem('formId')
                alert("Faça o login")
            }else{ console.log(error)}
        })
        novoDerivado.id = 'novoderivado'+count
        setCount(count+1)
        element.derivados.push(novoDerivado)
    }

    function renderizaForms(){
        let numero = 0
        return forms?.map(element => {
            numero+=1
            let tempDate= new Date( Date.parse(element.dataEnviado))
            return(
                <div key={element.id} className={forms.length>numero?'border-bottom':''}>
                    <MDBListGroupItem noBorders className='d-flex rounded-2 align-items-center'>
                        {numero}. <Link className='zoom' style={{}} to="/forms" onClick={e=>{sessionStorage.setItem("formId",element.id);sessionStorage.removeItem("formDeId")}}>{element.titulo} {element.dataEnviado?<i>({tempDate.toLocaleDateString('en-GB')})</i>:<></>}</Link>{element.derivados?.length?<i id={'icone'+element.id} aberto='F' onClick={e=>{toggleDerivados(element.id)}} className=" mx-2 fas fa-regular fa-angle-down"></i>:null}
                        
                        <i title='Adicionar novo envio de formulário' className="edit pt-1 ms-auto fas fa-light fa-plus" onClick={e=>{addDerivado(element)}}></i>
                        <i title='Editar Formulário' className="edit mx-2 pt-1 fas fa-pen-to-square" onClick={e=>{
                            setAddForm(false)
                            toggleShow(element)
                            }}></i>
                        <i title='Excluir Formulário' className="trashcan pt-1 fas fa-trash-can" onClick={e=>{
                            setIdToDelete(element.id)
                            setIdDerivateToDelete(null)
                            setDeletaFormulario(true)
                            }}></i>
                    </MDBListGroupItem>
                    {element.derivados?.length?
                        <div  id={'form'+element.id+'derivados'} style={{display:'none'}}>
                            <hr className='mt-0 mb-1'></hr>
                            <MDBListGroup numbered className='mx-3 mb-1 border-top'>
                                {element.derivados.map(item =>{
                                    return (
                                        <MDBListGroupItem key={'formderivado'+item.id} className='pb-0 formsDuplicates d-flex'>
                                            {item.id[0]?<>{item.titulo}</>:<Link className='formsDuplicates zoom' to={"/forms/"+item.id} onClick={e=>{sessionStorage.setItem("formId",element.id);sessionStorage.setItem("formDeId",item.id)}}>{item.titulo}{item.dataEnviado?<i>({item.dataEnviado.toLocaleString('en-GB', { timeZone: 'UTC' })})</i>:<></>}</Link>}
                                            {item.id[0]?<i onClick={e=>{CarregaForms(setforms)}} className="pt-1 ms-auto fa-solid fa-arrows-rotate"></i>:<i className="ms-auto trashcan pt-1 fas fa-trash-can" onClick={e=>{
                                                setIdToDelete(element.id)
                                                setIdDerivateToDelete(item.id)
                                                setDeletaFormulario(true)
                                                }}></i>}
                                            <hr></hr>
                                        </MDBListGroupItem>
                                    )
                                })}
                            </MDBListGroup>
                        </div>
                    :null}
                </div>
            )
        });
    }

    const secaoForms=<main className='mt-3 principal'>
        {Title("Formularios")}
        
        <MDBListGroup small className='shadow mt-3 rounded-3 bg-light' >
            {renderizaForms()}
        </MDBListGroup>
        <MDBBtn onClick={e=>{
            setAddForm(true)
            toggleShow({id: 'novo', titulo:null})
            }} outline color='dark' className='border-1 bg-light contatoBotoes mt-3'><i className="edit fas fa-light fa-plus fa-2x"></i></MDBBtn>
    
            {/* Modal de Adicionar Form */}
            <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalBody>
                            <MDBInput onKeyDown={e=>{limit(e.target)}} onKeyUp={e=>{limit(e.target)}} label='Titulo' id={"form"+form.id} type='text'/>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={e=>{toggleShow({id: null, titulo:null})}}> Cancelar </MDBBtn>
                            <MDBBtn onClick={e=>{editForm()}}>Salvar mudanças</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            
            {/* Modal de excluir Form */}
            <MDBModal tabIndex='-1' show={deletaFormulario} setShow={setDeletaFormulario}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader className='py-2'>
                            Tem certeza que deseja excluir o formulário e todas as informações dele? (Emails, questões, dados)
                        </MDBModalHeader>
                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={e=>{setDeletaFormulario(false)}}> Cancelar </MDBBtn>
                            <MDBBtn color='danger' onClick={e=>{deleteForm()}}>Excluir tudo</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
    </main>
       
    function makeSecao() {
        if(secao===1){
            return(secaoForms)
        }else if(secao===2){
            return (<Dashboard />)
        }else{
            return (<UserSection navigate={navigate}/>)
        }
    }

    return(
        <section>
            {Sidebar('forms',setSecao)}
            {Navbar()}

            {makeSecao()}
        </section>
    )
}