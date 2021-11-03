import React from "react";
import { FcLibrary } from 'react-icons/fc';
import {
    CCard,
    CCardBody,
    CCol,
    CButton
} from '@coreui/react'
import { Link } from "react-router-dom";

function Card({ id, tittle, codigo, grupo, sede, semestre }) {
    console.log(tittle);
    return (

        <CCard style={{ height: '90%' }}>
            <CCardBody>
                <h2><FcLibrary size="30px" /> {tittle}</h2>
                <CCol></CCol>
                <CCol>
                    Código: {codigo} <br /> Grupo: {grupo}  <br /> Sede: {sede} <br /> {semestre} Semestre <br />
                </CCol>
                <br />
                <Link to={`Archivos/${id}`}>
                    <CButton color="success">Agregar</CButton>
                </Link>
            </CCardBody>
        </CCard>

    )

}

export default Card