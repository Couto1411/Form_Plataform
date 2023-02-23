import React from 'react'
import {MDBContainer} from 'mdb-react-ui-kit';

export default function Title(titulo,reload){
    return(
        <MDBContainer fluid className='p-3 rounded-3 bg-light'>
            <div className='text-center'>
                <div className='row'><h1 className='col-11'>{titulo}</h1>{reload?<div onClick={e=>{reload()}} className='d-flex align-items-center justify-content-center col-1'><i className="fa-solid fa-arrows-rotate"></i></div>:<></>}</div>
                <hr className='m-0'></hr>
            </div>
        </MDBContainer>
    )
}