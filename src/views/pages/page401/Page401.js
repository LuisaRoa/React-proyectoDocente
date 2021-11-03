import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupAppend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const Page401 = () => {
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <div className="clearfix">
              <h1 className="float-left display-3 mr-4">401</h1>
              <h4 className="pt-3">Oops! Lo sentimos.</h4>
              <p className="text-muted float-left">No estas autorizado para ingresar a esta pagina.</p>
            </div>
            
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page401