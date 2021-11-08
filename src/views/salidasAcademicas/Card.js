import React, { useState } from "react";
import { FcMediumPriority } from 'react-icons/fc';
import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import {
  CCard,
  CCardBody,
  CCol
} from '@coreui/react'

function Card({ nombre, semestre, fechaSolicitud, tipo, estado, logo }) {
  const [form, setForm] = useState({
    logo: logo
  })

  return (

    <CCard style={{ height: '90%' }}>
      <CCardBody>
        <h2><FcMediumPriority size="30px" /> {nombre}</h2>
        <CCol></CCol>
        <CCol>
          Tipo: {tipo} <br /> {semestre} Semestre  <br /> Fecha Solicitud: {fechaSolicitud}  <br />
        </CCol>
        <br />
        <br />
        <div className="form-inline">
          <h6>Estado: {estado}</h6>
          <CCol col="2" className="mb-3 mb-xl-0 text-right">
            {form.logo ? <FaRegThumbsUp size="30px" style={{ color: '#007a3d' }} /> : <FaRegThumbsDown size="30px" style={{ color: '#EF8608' }} />}
          </CCol>
        </div>
      </CCardBody>
    </CCard>

  )

}

export default Card