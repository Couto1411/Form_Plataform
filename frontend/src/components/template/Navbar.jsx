import React from "react"
import './Navbar.css'
import Logo from "./Logo"
import {
    MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem,
    MDBContainer, MDBNavbarBrand} from 'mdb-react-ui-kit';


export default function Navbar(ShowSidebar,props){
    return(
        <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light sticky-top">
            <MDBContainer fluid>
                {/* Toggle button */}
                {!props?<button className="navbar-toggler" onClick={e=>{ShowSidebar('sidebarMenu')}}>
                    <i className="fas fa-bars"></i>
                </button>:<></>}

                {/* Brand */}
                <Logo/>

                {/* Right links */}
                <ul className="navbar-nav ms-auto d-flex flex-row">
                    {/* Notification dropdown */}
                    <MDBDropdown group className='shadow-0'>
                        <MDBDropdownToggle color='transparent'><div className="text-light"><i className="fas fa-bell"></i></div></MDBDropdownToggle>
                        <MDBDropdownMenu>
                            <MDBDropdownItem link>...</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </ul>
            </MDBContainer>
        </nav>
    )
}