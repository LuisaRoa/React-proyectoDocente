import React, { useState, useEffect } from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CCol,
  CLabel,
  CButton,
  CForm,
  CFormGroup
} from '@coreui/react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import CIcon from '@coreui/icons-react'
import UserProfile from 'src/views/usuarios/UserProfile'
import axios from 'axios';

const TheHeaderDropdownMssg = () => {

  const [noti, guardarNoti] = useState([]);
  const [form, setForm] = useState({
    noti_observacion: '',
    noti_actividad: '',
    docente: {
      id: '',
      nombre: ''
    },
    fecha: '',
    noti_nombreArchivo: ''
  })
  const [itemsCount, setItemsCount] = useState();
  const [modal, modalNotificacion] = useState(false);

  useEffect(() => {
    var i;
    var conteo = 0;
    axios.get('http://localhost:8080/notificacion/listarDocente/' + UserProfile.getId(),{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response => {
      guardarNoti(response.data)
      for (i = 0; i < (response.data).length; i++) {
        conteo++;
      }
      setItemsCount(conteo);
    }).catch(error => {
      console.log(error);
    })
  }, []);

  var seleccionar = (item) => {
    setForm({
      noti_observacion: item.noti_observacion,
      noti_actividad: item.noti_actividad,
      docente: {
        id: item.docente.id,
        nombre: item.docente.nombre
      },
      fecha: item.fecha,
      noti_nombreArchivo: item.noti_nombreArchivo
    })
    console.log('entró al seleccionar');
    //return item;
  }

  return (
    <div>
      <CDropdown
        inNav
        className="c-header-nav-item mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          <CIcon name="cil-envelope-open" /><CBadge shape="pill" color="info">{itemsCount}</CBadge>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end" style={{ width: '350px' }}>
          <CDropdownItem
            header
            tag="div"
            color="light"
          >
            <strong>Tienes {itemsCount} mensajes</strong>
          </CDropdownItem>
          {noti.map((item, i) => (
            <CDropdownItem onClick={() => { seleccionar(item); modalNotificacion(true) }} >
              <div className="message">
                <div>
                  <small className="text-muted" style={{ fontWeight: "bold" }}>{item.noti_actividad}</small>
                  <small className="text-muted float-right mt-1">{item.fecha}</small>
                </div>
                <div className="text-truncate font-weight-bold">{item.noti_nombreArchivo}</div>
                <div className="small text-muted text-truncate">{item.noti_observacion}
                </div>
              </div>
            </CDropdownItem>
          ))}
        </CDropdownMenu>
      </CDropdown>
      <Modal isOpen={modal}>
        <ModalHeader style={{ color: '#007a3d' }}>
          Mensaje
        </ModalHeader>
        <ModalBody>
          <CForm>
          <CFormGroup row>
              <CCol md="3">
                <CLabel ><b>Tipo de Actividad: </b></CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CLabel >{form.noti_actividad}</CLabel>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">
                <CLabel ><b>Nombre: </b></CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CLabel >{form.noti_nombreArchivo}</CLabel>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="text-input"><b>Fecha: </b></CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CLabel >{form.fecha}</CLabel>
              </CCol>
            </CFormGroup>
            <CFormGroup row>
              <CCol md="3">
                <CLabel htmlFor="text-input"><b>Observación: </b></CLabel>
              </CCol>
              <CCol xs="12" md="9">
                <CLabel >{form.noti_observacion}</CLabel>
              </CCol>
            </CFormGroup>
          </CForm>
        </ModalBody>
        <ModalFooter>
          <CButton color="warning" onClick={() => modalNotificacion(false) }>Cerrar</CButton>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default TheHeaderDropdownMssg