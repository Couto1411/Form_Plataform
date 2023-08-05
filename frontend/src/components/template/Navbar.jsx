import React from "react"
import './Navbar.css'
import Logo from "./Logo"
import {MDBContainer} from 'mdb-react-ui-kit';


export default function Navbar({navigate}){
    
    function ShowSidebar(){
        var v = document.getElementById('sidebarMenu');
        if (v.classList.contains("d-block")) {
            v.classList.remove("d-block")
        }else{
            v.classList.add("d-block")
        }
    } 
    
    return(
        <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light sticky-top">
            <MDBContainer fluid>
                {/* Toggle button */}
                <button className="navbar-toggler" onClick={e=>{ShowSidebar()}}>
                    <i className="fas fa-bars"></i>
                </button>

                {/* Brand */}
                <Logo navigate={navigate}/>
            </MDBContainer>
        </nav>
    )
}