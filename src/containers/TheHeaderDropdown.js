import React, { useState } from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import UserProfile from 'src/views/usuarios/UserProfile';
import axios from 'axios';

function TheHeaderDropdown(props) {

  const cerrarSesion = async () => {
    let token = sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME);
    await axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/cerrarSesion/anular/" + token)
      .then(respuesta => {
        sessionStorage.clear();
        localStorage.clear();
      }).catch(error => {
        console.log(error);
      })

  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false} >
        <div className="c-avatar">
          <CImg
            src={UserProfile.getFoto() ? UserProfile.getFoto() : 'avatars/9.jpg'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
            style={{ maxHeight: '47px' }}
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>{UserProfile.getNombre()}</strong>
        </CDropdownItem>
        {UserProfile.getNombre() ?
          <CDropdownItem href="/#/usuarios/perfil">
            <CIcon name="cil-user" className="mfe-2" />Perfil
          </CDropdownItem>
          : null}
        <CDropdownItem divider />
        <CDropdownItem onClick={() => { cerrarSesion() }} href="/#/login">
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Cerrar Sesion
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
}
export default TheHeaderDropdown
