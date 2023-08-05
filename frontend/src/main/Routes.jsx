import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useNavigate } from "react-router-dom"

import FormsUser from '../components/user/FormsUser'
import Admin from '../components/user/admin.jsx'
import Forms from '../components/forms/Forms'
import FormsDerivado from '../components/forms/FormsDerivados'
import Resposta from '../components/forms/RespostaIndividual'
import FormularioResposta from '../components/response/FormularioResp'
import Relatorios, {LoadRelatorio} from '../components/dashboard/relatorio'
import Home from '../components/home/Home'

export default function Props(){
    const navigate = useNavigate();
    return <Routes>
        <Route path='/:formId' element={<FormularioResposta navigate={navigate}/>}/>
        <Route path='/resposta' element={<Resposta navigate={navigate}/>} exact/>
        <Route path='/forms' element={<Forms navigate={navigate}/>} exact/>
        <Route path='/admin' element={<Admin navigate={navigate}/>} exact/>
        <Route path='/forms/:formDeId' element={<FormsDerivado  navigate={navigate}/>} exact/>
        <Route path='/user' element={<FormsUser  navigate={navigate}/>} exact/>
        <Route path='/load/relatorio' element={<LoadRelatorio  navigate={navigate}/>} exact/>
        <Route path='/relatorio' element={<Relatorios  navigate={navigate}/>} exact/>
        <Route path='/' element={<Home navigate={navigate}/>} exact/>
        <Route path="*" element={<Navigate to="/" replace navigate={navigate}/>}/>
    </Routes>
}