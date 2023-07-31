import 'bootstrap/dist/css/bootstrap.min.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Routes from './Routes'

const props = () =>
    <BrowserRouter>
        <div className="inteiro">
            <Routes />
        </div>
    </BrowserRouter>

export default props