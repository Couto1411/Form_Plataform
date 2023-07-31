import baseUrl from "./api"
import axios from "axios"

export function RemoveSessao(){
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('destinatarioId')
    sessionStorage.removeItem('formId')
}

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
            RemoveSessao()
            alert("Faça o login")
        }else if (error.response.status!==404){ console.log(error)}
    })
}

export async function CarregaQuestoes(setQuestoes){
    await axios.get(baseUrl+"/questoes/"+sessionStorage.getItem("formId"))
    .then((response)=>{
        response.data.sort((a,b) => a.numero - b.numero);
        setQuestoes(response.data)
    })
    .catch((error) => { 
        setQuestoes([])
        if (error.response.status!==404) {console.log(error);}
    })
}

export async function CarregaQuestoesDashboard(setQuestoes,navigate){
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
            RemoveSessao()
            alert("Faça o login")
        } else if (error.response.status!==404){ console.log(error)}
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
            RemoveSessao()
            alert("Faça o login")
        } else if (error.response.status!==404){ console.log(error)}
    })
}

export async function CarregaCursos(setCursos,setModalidades,navigate){
    await axios.get(baseUrl + "/users/" + sessionStorage.getItem("userId") + "/cursos", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then(res=>{
        setCursos(res.data.listaCursos)
        setModalidades(res.data.listaModalidades)
    })
    .catch((error) => {
        if (error.response.status === 401) {
            navigate('/login')
            RemoveSessao()
            alert("Faça o login")
        } else if (error.response.status!==404){ console.log(error)}
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
            RemoveSessao()
            alert("Faça o login")
        }else if (error.response.status!==404){ console.log(error)}
    })
}

export async function CarregaDestinatarios(setDestinatarios,setDestinatariosDB,id,navigate){
    await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+id+"/enviados",{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{
        response.data.sort((a,b) => b.respondido-a.respondido);
        setDestinatarios(response.data);
        setDestinatariosDB(response.data)
    })
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            RemoveSessao()
            alert("Faça o login")
        }else if (error.response.status===404){setDestinatarios([])}
        else { console.log(error);setDestinatarios([])}
    }) 
}

export async function CarregaRespostas(setRespostas,navigate,derivado){
    let temp = derivado || sessionStorage.getItem("formId")
    await axios.get(baseUrl+"/users/"+sessionStorage.getItem("userId")+"/forms/"+temp+"/respostas",{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{setRespostas(response.data)})
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            RemoveSessao()
            alert("Faça o login")
        }else if (error.response.status===404){setRespostas(null)}
        else{ console.log(error);setRespostas(null)}
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
            RemoveSessao()
            alert("Faça o login")
        }else if (error.response.status===404){setDatasets([])}
        else{ console.log(error);setDatasets([])}
    })
}

export async function CarregaRelatorio(setDados,navigate,queryObject,loadNewPage){
    await axios.get(baseUrl+'/users/relatorio/'+JSON.stringify(queryObject.id)+'?avancado='+
        JSON.stringify(queryObject.avancado)+'&&questoes='+
        JSON.stringify(queryObject.questoesEscolhidas)+'&&cursos='+
        JSON.stringify(queryObject.cursoFiltros)+'&&modalidades='+
        JSON.stringify(queryObject.modalidadeFiltros)
        .concat(queryObject.dataAntes?('&&dataAntes='+queryObject.dataAntes):'')
        .concat(queryObject.dataDepois?('&&dataDepois='+queryObject.dataDepois):''),{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{
        if(loadNewPage)
            navigate('/relatorio',{state:{dados:response.data.relatorio,pesquisa:response.data.nomePesquisa}})
        else setDados(response.data.relatorio)
    })
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            RemoveSessao()
            alert("Faça o login")
        }else if (error.response.status===404){}
        else{ console.log(error);}
    })
}

export async function CarregaDestinatariosResposta(setDestinatariosResposta,navigate,formid,questid,item){
    await axios.get(baseUrl+"/respostas/forms/"+formid+"/questao/"+questid+"/"+item?.opcao,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'bearer ' + sessionStorage.getItem("token")
        }
    })
    .then((response)=>{setDestinatariosResposta({data: response.data,enunciado: item?.texto})})
    .catch((error) => {
        if (error.response.status===401) {
            navigate('/login')
            RemoveSessao()
            alert("Faça o login")
        }else if (error.response.status===404){setDestinatariosResposta([])}
        else{ console.log(error);setDestinatariosResposta([])}
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