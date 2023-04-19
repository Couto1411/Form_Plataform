import React, {useEffect,useState}from 'react'
import './FormsUser.css'
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from './UserSection'
import { limit } from '../../config/utils'
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
    // Seta para aparecer a seção de formulários
    const [main, setMain] = useState(1)

    // Booleano usado para decidir se a função irá adicionar ou editar um formulário
    const [addForm, setAddForm] = useState(false);

    // Lista de formulários do usuário
    const [forms, setforms] = useState([]);
    const [form, setform] = useState({id: null, titulo:null});

    const [count, setCount] = useState(0);


    useEffect(() => {
        if (sessionStorage.getItem("token")){
            carregaForms()
        }
        else{
            console.warn("Faça o login")
            navigate('/login')
        }

    }, []);

    const secaoForms=<main className='mt-3 principal'>
        {Title("Formularios",carregaForms)}
        
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

    return(
        <section>
            {Sidebar(setMain,'forms')}
            {Navbar()}

            {UserSection(main,secaoForms)}
        </section>
    )
}