import baseUrl from "./api"
import axios from "axios"

export async function CarregaForms(setforms,navigate){
    await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms",{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then(response => {
        setforms(response.data)
    })
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            console.warn("Faça o login")
        }else{ console.log(error)}
    })
}



export async function CarregaQuestoes(setQuestoes){
    await axios.get(baseUrl+"/questoes/"+sessionStorage.getItem("formId"))
    .then((response)=>{
        response.data.sort((a,b) => a.numero - b.numero);
        setQuestoes(response.data)
    })
    .catch((error) => { 
        console.log(error);setQuestoes([])
    })
}

export async function CarregaQuestoesUser(setQuestoes,navigate){
    await axios.get(baseUrl+"/questoes/user/"+sessionStorage.getItem("userId"),{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{
        response.data.sort((a,b) => a.numero - b.numero);
        setQuestoes(response.data)
    })
    .catch((error) => { 
        if (error.response.status === 401) {
            navigate('/login')
            console.warn("Faça o login")
        } else { console.log(error) }
    })
}

export async function CarregaUsuario(setUser,navigate){
    await axios.get(baseUrl + "/users/" + sessionStorage.getItem("userId"), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then(response => {
        setUser(response.data)
    })
    .catch((error) => {
        if (error.response.status === 401) {
            navigate('/login')
            console.warn("Faça o login")
        } else { console.log(error) }
    })
}

export async function CarregaCursos(setCursos,setTipoCursos,navigate){
    await axios.get(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/cursos", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then(res=>{
        setCursos(res.data.listaCursos)
        setTipoCursos(res.data.listaTipoCursos)
    })
    .catch((error) => {
        if (error.response.status === 401) {
            navigate('/login')
            console.warn("Faça o login")
        } else { console.log(error) }
    })
}

export async function CarregaCursosUser(setCursos,navigate){
    await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/cursos",{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then(res=>{setCursos(res.data)})
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            console.warn("Faça o login")
        }else{ console.log(error)}
    })
}

export async function CarregaEnvios(setContatos,setContatosDB,navigate){
    await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/enviados",{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{setContatos(response.data);setContatosDB(response.data)})
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            console.warn("Faça o login")
        }else{ console.log(error);setContatos([])}
    }) 
}

export async function CarregaRespostas(setRespostas,navigate){
    await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+sessionStorage.getItem("formId")+"/respostas",{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{setRespostas(response.data)})
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            console.warn("Faça o login")
        }else{ console.log(error);setRespostas([])}
    })
}

export async function CarregaDashboard(setDatasets,setLabels,navigate,id,forms,questoes){
    await axios.get(baseUrl+"/users/dashboard?formId="+id+"&&derivados="+forms+"&&questoes="+questoes,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{setDatasets(response.data.data);setLabels(response.data.labels)})
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            console.warn("Faça o login")
        }else{ console.log(error);setDatasets([])}
    })
}

export function limit(element,tamanho)
{
    let max_chars
    tamanho?max_chars = tamanho:max_chars=250;
        
    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}