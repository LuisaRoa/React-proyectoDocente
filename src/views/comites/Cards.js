import React from "react";
import { FcPackage } from "react-icons/fc";
import { Link } from "react-router-dom";
import {
    CCard,
    CCardBody,
    CCol,
    CButton
} from '@coreui/react'

function Cards({ id, nombre, programaacademico, sede }) {


    return (

        <CCard style={{ height: '90%' }}>
            <CCardBody>
                <h4><FcPackage size="30px" style={{ color: '#0BD824' }} /> {nombre}</h4>
                <CCol></CCol>
                <CCol>
                    <br />{programaacademico} <br /><br />{sede} <br />
                </CCol>
                <br />
                <Link to={`vistas/${id}`}>
                    <CButton color="success">Acceder</CButton>
                </Link>
                <br />
            </CCardBody>
        </CCard>

    )

}

export default Cards