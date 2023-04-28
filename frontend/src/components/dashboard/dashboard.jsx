import React, {useEffect,useState}from 'react'
import './dashboard.css'
import Title from '../template/Title'
import {useNavigate} from 'react-router-dom'

export default function Dashboard(){
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem("token")){
            
        }
        else{
            console.warn("Faça o login")
            navigate('/login')
        }

    }, []);


    return(
        <main className='mt-3 principal'>
            {Title("Dashboard")}
        </main>
    )
}