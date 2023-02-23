import React, {useEffect,useState}from 'react'
import './PaginaUsuario.css'
import Title from '../template/Title'
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
    const [centredModal, setCentredModal] = useState(false);
    const [idGenerico, setIdGenerico] = useState(0);
    const [usure, setUsure] = useState(false);
    const [main, setMain] = useState(1)

    const navigate = useNavigate();
    
    const [appearing, setAppearing] = useState(false);
    const [addForm, setAddForm] = useState(false);
    const [forms, setforms] = useState(null);
    const [form, setform] = useState({id: null, titulo:null});

    
    const toggleShow = (element) => {
        setCentredModal(!centredModal)
        setform(element)
        var change = document.getElementById("form"+form.id);
        change.value=element.titulo
        change.classList.remove("is-invalid");
    };
    
    async function carregaForms(){
        let res = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms",{
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
        setforms(res.data)
    }

    useEffect(() => {
        if (sessionStorage.getItem("token")){
            carregaForms()
        }
        else{
            console.warn("Faça o login")
            navigate('/login')
        }

    }, []);

    async function editForm(){
        var change = document.getElementById("form"+form.id);
        let dados={"titulo": change.value}
        if (addForm) {
            if (change.value != '') {
                change.classList.remove("is-invalid");
                await axios.post(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms",dados,{
                    headers: {
                        'Authorization': 'bearer ' + sessionStorage.getItem("token")
                    }
                })
                .then((response)=>{
                    setforms([
                        ...forms,
                        {id: response.data, titulo: change.value}
                    ])
                })
                .catch((error) => {
                    if (error.response.status===401) {
                        navigate('/login')
                        console.warn("Faça o login")
                    }else{ console.log(error)}
                })
            }
            else{
                change.classList.add("is-invalid");
            }
        }else{
            if (change.value == form.titulo) {
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
                        console.warn("Faça o login")
                    }else{ console.log(error)}
                })
            }
        }
        toggleShow({id: null, titulo:null});
    }

    async function deleteForm(id){
        await axios.delete(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+id,{
            headers: {
                'Authorization': 'bearer ' + sessionStorage.getItem("token")
            }
        })
        .then((response)=>{
            setforms(forms.filter(a=> a.id !== id))
        })
        .catch((error) => {
            if (error.response.status===401) {
                navigate('/login')
                console.warn("Faça o login")
            }else{ console.log(error)}
        })
        setUsure(false)
    }

    function updateField(id){
        var v = document.getElementById(id);
        if (appearing) {
            v.classList.remove("d-block")
            setAppearing(false)
        }else{
            v.classList.add("d-block")
            setAppearing(true)
        }
    }    

    function renderizaForms(){
        return forms?.map(element => {
            return(
                <MDBListGroupItem noBorders key={element.id} className='d-flex border-bottom align-items-center'>
                    <Link className='zoom' to="/forms" onClick={e=>{sessionStorage.setItem("formId",element.id)}}>{element.titulo}</Link>
                    <i className="edit mx-2 pt-1 ms-auto fas fa-pen-to-square" onClick={e=>{
                        setAddForm(false)
                        toggleShow(element)
                        }}></i>
                    <i className="trashcan pt-1 fas fa-trash-can" onClick={e=>{
                        setIdGenerico(element.id)
                        setUsure(true)
                        }}></i>
                    
                </MDBListGroupItem>
            )
        });
    }

    function limit(element)
    {
        var max_chars = 250;
            
        if(element.value.length > max_chars) {
            element.value = element.value.substr(0, max_chars);
        }
    }

    const secaoForms=<main className='mt-3 principal'>
        {Title("Formularios",carregaForms)}
        
        <MDBListGroup small numbered className='mt-3 rounded-3 bg-light' >
            {renderizaForms()}
        </MDBListGroup>
        <MDBBtn onClick={e=>{
            setAddForm(true)
            toggleShow({id: 'novo', titulo:null})
            }} color='success' className='mt-2'><i className="edit fas fa-regular fa-plus fa-2x"></i></MDBBtn>
    </main>

    return(
        <section>
            {Sidebar(setMain,'forms')}
            {Navbar(updateField)}

            {UserSection(main,secaoForms)}

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
            <MDBModal tabIndex='-1' show={usure} setShow={setUsure}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader className='py-2'>
                            Tem certeza que deseja excluir o formulário e todas as informações dele? (Emails, questões, dados)
                        </MDBModalHeader>
                        <MDBModalFooter>
                            <MDBBtn color='secondary' onClick={e=>{setUsure(false)}}> Cancelar </MDBBtn>
                            <MDBBtn color='danger' onClick={e=>{deleteForm(idGenerico)}}>Excluir tudo</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </section>
    )
}