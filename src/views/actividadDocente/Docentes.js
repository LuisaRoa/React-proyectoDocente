import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillPeopleFill, BsSearch } from 'react-icons/bs';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CNav,
  CForm,
  CInput,
} from '@coreui/react'
import { Component } from 'react';
import axios from 'axios';
import UserProfile from '../usuarios/UserProfile';
import { Link } from "react-router-dom";

const fields = ['documento', 'nombre', 'codigo', 'fechaIngreso', 'correo', 'sede', 'opciones']

const url = "http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/docente/retornarAdministrativo/";


class Docentes extends Component {
  state = {
    data: [],
    tablaData: [],
    busqueda: "",
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      documento: '',
      codigo: '',
      nombre: '',
      direccion: '',
      celular: '',
      fechaNacimiento: '',
      sexo: '',
      fechaIngreso: '',
      correo: '',
      sede: '',
      administrativo: {
        admi_id: UserProfile.getId()
      },
      admin: '',
      tipoModal: ''
    },
    error: {},
    campo: {},
    enviado: false,
    director: []
  }



  peticionGet = () => { //Petición para traer todos los docentes relacionados con un administrativo
    axios.get(url + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarUsuario = (usuario) => { //Función para guardar los datos del docente seleccionado
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: usuario.id,
        documento: usuario.documento,
        codigo: usuario.codigo,
        nombre: usuario.nombre,
        direccion: usuario.direccion,
        celular: usuario.celular,
        fechaNacimiento: usuario.fechaNacimiento,
        sexo: usuario.sexo,
        fechaIngreso: usuario.fechaIngreso,
        correo: usuario.correo,
        sede: usuario.sede,
        administrativo: {
          admi_id: usuario.administrativo.admi_id
        },
        admin: usuario.administrativo.admi_id
      }
    })
  }


  handleChanges = e => { //Función para guardar los datos de busqueda
    this.setState({ busqueda: e.target.value });
    this.filtrar(e.target.value)
  }

  filtrar = (terminoBusqueda) => { //Función para filtrar los datos de la tabla
    var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
        || elemento.codigo.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
      ) {
        return elemento;
      }
    });
    this.setState({ data: resultadosBusqueda });
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {

    return (
      <>
        <CRow>
          <CCol>
            <CCard style={{ textAlign: 'center' }}>
              <CCardHeader>
                <CForm className="form-inline">
                  <h2 ><BsFillPeopleFill size="50px" /> Docentes</h2>
                  <CCol col="2" className="mb-3 mb-xl-0 text-center">
                    <CNav className="navbar navbar-light bg-light" >
                      <CForm className="form-inline">
                        <CInput className="form-control mr-sm-2" value={this.state.busqueda} placeholder="Buscar" aria-label="Search" onChange={this.handleChanges} />

                      </CForm>
                    </CNav>
                  </CCol>
                </CForm>
              </CCardHeader>
              <CCardBody>
                <CDataTable
                  items={this.state.data}
                  fields={fields}
                  hover
                  striped
                  bordered
                  size="sm"
                  itemsPerPage={5}
                  pagination
                  scopedSlots={{
                    'opciones':
                      (item) => (
                        <tr>
                          <td>
                            <Link to={`Actividades/${item.id}`}>
                              <CButton size="lg"><BsSearch /></CButton>
                            </Link>
                          </td>
                        </tr>
                      )
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Docentes