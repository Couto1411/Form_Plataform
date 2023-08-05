import React from 'react'
import {MDBContainer} from 'mdb-react-ui-kit';

export default function Title(titulo,reload){
    return(
        <MDBContainer fluid className='shadow p-3 rounded-3 bg-light'>
            <div className='text-center'>
                <div className='row'>
                    <h3 className={reload?'col-11':'col-12'} style={{wordBreak:'break-word'}}>{titulo}</h3>
                    {reload?<div onClick={e=>{reload()}} className='d-flex align-items-center justify-content-end col-1'><i className="fa-solid fa-arrows-rotate"></i></div>:<></>}
                </div>
                <hr className='m-0'></hr>
            </div>
        </MDBContainer>
    )
}