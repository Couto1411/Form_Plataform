import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../components/home/Home'
import Login from '../components/user/Login'
import PaginaUsuario from '../components/user/PaginaUsuario'
import Forms from '../components/forms/Forms'
import FormsDerivado from '../components/forms/FormsDerivados'
import Resposta from '../components/forms/Resposta'
import FormularioResposta from '../components/response/FormularioResp'

export default props => 
<Routes>
    <Route path='/:formId' element={<FormularioResposta/>} exact/>
    <Route path='/resposta' element={<Resposta/>} exact/>
    <Route path='/forms' element={<Forms/>} exact/>
    <Route path='/forms/:formDeId' element={<FormsDerivado/>} exact/>
    <Route path='/user' element={<PaginaUsuario/>} exact/>
    <Route path='/login' element={<Login/>} exact/>
    <Route path='/' element={<Home/>} exact/>
    <Route path="*" element={<Navigate to="/login" replace />}/>
</Routes>