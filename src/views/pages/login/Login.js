import React, { useState } from 'react'
import logo from './imagenucundi.png';
import axios from 'axios';
import decode from 'jwt-decode'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { TheSidebar } from 'src/containers';
import userProfile from './../../usuarios/UserProfile';

function Login(props) {
  const baseUrl = "http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/oauth/token";

  const [form, setForm] = useState({
    username: '',
    password: '',
    rol: '',
    estado: false
  })

  const handleChange = e => { //Función donde se capturan los datos de usuario y contraseña
    e.persist();
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  }

  const retornarId = async (rol) => { //Función donde se realiza guardan los datos del usuario autenticado
    await axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/" + rol + "/buscarCorreo" + `/${form.username}`, { headers: { Authorization: `Bearer ${sessionStorage.getItem(userProfile.getToken().TOKEN_NAME)}` } })
      .then(respuesta => {
        localStorage.setItem("nombre", respuesta.data.nombre);
        localStorage.setItem("foto", respuesta.data.fotoUrl);
        localStorage.setItem("rol", respuesta.data.rol.nombre);
        if (rol === 'administrativo') {
          localStorage.setItem("id", respuesta.data.admi_id);
          props.history.push('/informes/CierreAcademico');
          localStorage.setItem("contrato", "");
        } else {
          localStorage.setItem("id", respuesta.data.id);
          localStorage.setItem("contrato", respuesta.data.contrato);
          props.history.push('/asesorias/Asesorias');

        }
      }).catch(error => {
        console.log(error.respuesta.data.message);
      })
  }

  const iniciarSesion = async () => { //Función donde se realiza la autenticación de usuario
    let details = {
      'grant_type': 'password',
      'username': form.username,
      'password': form.password
    };
    let formBody = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    await axios.post(baseUrl, formBody,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset-UTF-8', 'Authorization': 'Basic ' + btoa(userProfile.getToken().TOKEN_AUTH_USERNAME + ':' + userProfile.getToken().TOKEN_AUTH_PASSWORD) }
      }
    ).then(response => {
      let d = decode(response.data.access_token);
      sessionStorage.setItem(userProfile.getToken().TOKEN_NAME, response.data.access_token);
      var rol = d.authorities[0];
      rol = rol[0].toLowerCase() + rol.slice(1);
      if (d.authorities[0] != 'Administrador') {
        retornarId(rol);
      } else {
        localStorage.setItem("rol", d.authorities[0]);
        localStorage.setItem("contrato", "");
        props.history.push('/usuarios/docentes');
      }


    }).catch(error => {
      if (error.response.data.error_description === 'Bad credentials') {
        alert('El usuario o la contraseña no son correctos');
      }
      console.log(error.response.data);
    })

  };


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard style={{ backgroundColor: '#007a3d' }}>
                <CCardBody>
                  <CForm>
                    <h1 className="etiqueta">Login</h1>
                    <p className="etiqueta">Ingrese sus credenciales</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" name="username" onChange={handleChange} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" name="password" onChange={handleChange} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton color="warning" onClick={() => iniciarSesion()} className="button" style={{ color: 'black' }}>Ingresar {form.estado ? <TheSidebar /> : null}</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="p-4" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <img width={300} height={300} alt="300x300" src={logo} />

                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>

    </div>
  )
}

export default Login
