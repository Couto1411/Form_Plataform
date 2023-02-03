import React, {useEffect,useState}from 'react'
import './Forms.css'
import axios from "axios";
import baseUrl from "../../config/api";
import Title from '../template/Title'
import Navbar from '../template/Navbar'
import Sidebar from '../template/Sidebar'
import UserSection from '../user/UserSection'
import {MDBListGroup,MDBListGroupItem, MDBRadio,MDBBtn,MDBInputGroup, MDBTextArea,MDBCheckbox} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

export default function Resposta(){
    const navigate = useNavigate()
    const [main, setMain] = useState(1)

    const [respostas,setRespostas] = useState([{}])

    const [user, setUser] = useState({})
    const [secao, setsecao] = useState(1)
    const [appearing, setAppearing] = useState(false)

    useEffect(() => {
        async function validate(){
            await axios.post(baseUrl+"/validateToken",{
                "token": sessionStorage.getItem("token")
            })
            .then((response) => {
                if(!response){
                    navigate('/login')
                    console.warn("Faça o login")
                }
            })
            .catch((error) => {
                if (error.response.status===401) {
                    navigate('/login')
                    console.warn("Faça o login")
                }else{
                    console.log(error)
                }
            })
        }
        async function carregaResposta(){
            let reponse = await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/respostas/"+sessionStorage.getItem("enviadoId"),{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'bearer ' + sessionStorage.getItem("token")
                }
            })
            setRespostas(reponse.data)
        }
        if (sessionStorage.getItem("token")){
            validate()
            carregaResposta()
        }
        else{
            console.warn("Faça o login")
            navigate('/login')
        }

    }, []);

    function renderizaRepostas(){
        return respostas?.map(element => {
            return(
                <MDBListGroupItem key={"r"+element.id} className='mt-3 rounded-3'>
                    <div className='enunciado'>{element.numero}) {element.enunciado}</div>
                    <hr className='mt-0 mb-2'></hr>
                    <div id={"enviado"+element.id} className='mx-2'>
                        {element.resposta?makeResp(element):<></>}
                    </div>
                </MDBListGroupItem>
            )
        })
    }

    function makeResp(element){
        switch (element.type) {
            case 1:
                return(
                    <div className='my-1'>
                        <MDBInputGroup className='mb-2'>
                            <MDBBtn disabled color='secondary' className='numQuestao py-0 px-3'><MDBRadio defaultChecked={true} className='m-0 p-0' name='radioNoLabel' value='' inline disabled/></MDBBtn>
                            <input className='form-control' type='text' value={element.resposta} disabled/>
                        </MDBInputGroup>
                    </div>
                )
            case 2:
                return(
                    <div className='my-1'>
                        <MDBTextArea rows={4} label='Resposta' value={element.resposta} readOnly className='mb-2'/>
                    </div>
                )
            case 3:
                return element.resposta?.map((item,index)=>{
                    return(
                        <MDBInputGroup key={element.id+index} className='mb-2'>
                            <MDBBtn disabled color='secondary' className='numQuestao py-0 px-3'><MDBCheckbox defaultChecked={true} className='m-0 p-0' name='radioNoLabel' value='' inline disabled/></MDBBtn>
                            <input className='form-control' type='text' value={item} disabled/>
                        </MDBInputGroup>
                    )
                })
            default:
                break;
        }
    }

    const secaoRespostas = <main className='mt-3 principal'> 
        {Title("Nome")}
        <MDBListGroup small className='mt-3' >
            {renderizaRepostas()}
        </MDBListGroup>
    </main>
    // Secao Respostas

    
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


    function makeSecao() {
        if(secao===1){
            return(UserSection(main,secaoRespostas))
        }
    }

    return(
        <section>
            {Sidebar(setMain,'resposta',setsecao)}
            {Navbar(updateField)}

            {makeSecao()}
        </section>
    )
}