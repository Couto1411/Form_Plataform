import React from 'react'
import {MDBContainer} from 'mdb-react-ui-kit';

export default function Title(titulo){
    return(
        <MDBContainer fluid className='p-3 rounded-3 bg-light' >
            <div className='text-center'>
                <h1>{titulo}</h1>
                <hr className='m-0'></hr>
            </div>
        </MDBContainer>
    )
}