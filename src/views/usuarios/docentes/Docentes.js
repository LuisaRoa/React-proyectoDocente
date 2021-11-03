import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { BsFillTrashFill, BsPencil, BsFillPeopleFill } from 'react-icons/bs';
import { FcPlus } from "react-icons/fc";
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
  CFormGroup,
  CInput,
  CLabel,
  CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Component } from 'react';
import axios from 'axios';
import { Modal } from 'reactstrap';
import UserProfile from '../UserProfile';

const fields = ['documento', 'nombre', 'codigo', 'direccion', 'celular', 'fechaNacimiento', 'sexo', 'fechaIngreso', 'correo', 'sede', 'opciones']

const url = "http://localhost:8080/docente/retornarTodos";


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
        admi_id: '0',
        documento: '',
        codigo: '',
        nombre: '',
        direccion: '',
        celular: '',
        fechaNacimiento: '',
        sexo: '',
        fechaIngreso: '',
        correo: '',
        sede: ''
      },
      contrato: '',
      admin: '',
      tipoModal: ''
    },
    error: {},
    campo: {},
    enviado: false,
    director: []
  }

  validarFormulario() { //Función para validar los campos del formulario
    let campo = this.state.campo;
    let error = {};
    let formularioValido = true;
    let fechaHora = new Date();
    let dia = fechaHora.getDate();
    let mes = fechaHora.getMonth() + 1;
    let ano = fechaHora.getFullYear();
    let fecha = ano + '-' + mes + '-' + dia;

    if (!campo["documento"]) {
      formularioValido = false;
      error["documento"] = "Por favor, ingresa el Documento";
    }
    if (!campo["codigo"]) {
      formularioValido = false;
      error["codigo"] = "Por favor, ingresa el Código.";
    }
    if (!campo["nombre"]) {
      formularioValido = false;
      error["nombre"] = "Por favor, ingresa los Nombres y Apellidos.";
    }
    if (!campo["direccion"]) {
      formularioValido = false;
      error["direccion"] = "Por favor, ingresa la Dirección.";
    }

    if (!campo["celular"]) {
      formularioValido = false;
      error["celular"] = "Por favor, ingresa el numero de Celular o Telefono.";
    } else {
      if (!Number(campo["celular"])) {
        formularioValido = false;
        error["celular"] = "Por favor, ingresa un número de celular válido.";
      }
    }

    if (!campo["fechaNacimiento"]) {
      formularioValido = false;
      error["fechaNacimiento"] = "Por favor, ingresa la Fecha de Nacimiento.";
    } else {
      if (fecha <= campo["fechaNacimiento"]) {
        formularioValido = false;
        error["fechaNacimiento"] = "Por favor, ingresa una fecha anterior a la actual.";
      }
    }

    if (!campo["sexo"]) {
      formularioValido = false;
      error["sexo"] = "Por favor, ingresa el sexo.";
    }

    if (!campo["fechaIngreso"]) {
      formularioValido = false;
      error["fechaIngreso"] = "Por favor, ingresa la Fecha de Ingreso.";
    } else {
      if (fecha <= campo["fechaIngreso"]) {
        formularioValido = false;
        error["fechaIngreso"] = "Por favor, ingresa una fecha anterior a la actual.";
      }
    }

    if (!campo["sede"]) {
      formularioValido = false;
      error["sede"] = "Por favor, ingresa la Sede.";
    }

    if (!campo["correo"]) {
      formularioValido = false;
      error["correo"] = "Por favor, ingresa el Correo.";
    }

    if (!campo["contrato"]) {
      formularioValido = false;
      error["contrato"] = "Por favor, ingresa el Tipo de contrato.";
    }

    if (typeof campo["correo"] !== "undefined") {
      let posicionArroba = campo["correo"].lastIndexOf('@');
      let posicionPunto = campo["correo"].lastIndexOf('.');

      if (!(posicionArroba < posicionPunto && posicionArroba > 0 && campo["correo"].indexOf('@@') == -1 && posicionPunto > 2 && (campo["correo"].length - posicionPunto) > 2)) {
        formularioValido = false;
        error["correo"] = "Por favor, ingresa un correo válido.";
      }
    }



    this.setState({
      error: error
    });

    return formularioValido;
  }


  peticionGet = () => { //Petición para traer todos los docentes
    axios.get(url).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetDirector = () => { //Petición para traer todos los administrativos
    axios.get("http://localhost:8080/administrativo/retornarTodos", { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ director: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }


  peticionPost = async () => { //Petición para guardar un nuevo docente
    if (this.validarFormulario()) {

      // Cambio el estado de 'enviado' a 'true'
      this.setState({ enviado: true });
      await axios.post('http://localhost:8080/docente/guardar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
        this.modalInsertar();
        this.peticionGet();
      }).catch(error => {
        console.log(error.message);
      })

    }

  }

  peticionPut = () => { //Petición para editar un docente
    axios.put('http://localhost:8080/docente/editar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => { //Petición para eliminar un docente
    axios.delete('http://localhost:8080/docente/eliminar/' + this.state.form.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarUsuario = (usuario) => { //Función para obtener los datos del docente seleccionado
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
        admin: usuario.administrativo.admi_id,
        contrato: usuario.contrato
      }
    })
  }

  handleChange = async e => { //Función para obtener los datos del formulario
    e.persist();
    if (e.target.name === "administrativo") {
      await this.setState({
        form: {
          ...this.state.form,
          administrativo: {
            admi_id: e.target.value
          },
          admin: e.target.value
        }
      });
    } else {
      await this.setState({
        form: {
          ...this.state.form,
          [e.target.name]: e.target.value
        }
      });
      let campo = this.state.campo;
      campo[e.target.name] = e.target.value;

      // Cambio de estado de campo 
      this.setState({
        campo
      });
    }

  }

  handleChanges = e => { //Función para obtener los datos de la barra de filtro
    this.setState({ busqueda: e.target.value });
    this.filtrar(e.target.value)
  }

  filtrar = (terminoBusqueda) => { //Función para filtrar los datos de la tabla
    var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
        || elemento.documento.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
      ) {
        return elemento;
      }
    });
    this.setState({ data: resultadosBusqueda });
  }

  componentDidMount() {
    this.peticionGet();
    this.peticionGetDirector();
  }

  render() {

    const { form } = this.state;
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
                  <CCol col="2" className="mb-3 mb-xl-0 text-right">
                    <CButton onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }} variant="ghost" size="lg"><FcPlus size="60px" /></CButton>
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
                            <CButton size="lg" onClick={() => { this.seleccionarUsuario(item); this.modalInsertar() }}>
                              <BsPencil />
                            </CButton>
                          </td>
                          <td>
                            <CButton size="lg" onClick={() => { this.seleccionarUsuario(item); this.setState({ modalEliminar: true }) }}>
                              <BsFillTrashFill />
                            </CButton>
                          </td>
                        </tr>
                      )
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}></span>
          </ModalHeader>
          <ModalBody>
            <CForm>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Documento</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="text" name="documento" className="form-control my-2" onChange={this.handleChange} value={form ? form.documento : ''} />
                  <span style={{ color: "red" }}>{this.state.error["documento"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Código</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="codigo" className="form-control my-2" onChange={this.handleChange} value={form ? form.codigo : ''} />
                  <span style={{ color: "red" }}>{this.state.error["codigo"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Nombres y Apellidos</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="text" name="nombre" className="form-control my-2" onChange={this.handleChange} value={form ? form.nombre : ''} />
                  <span style={{ color: "red" }}>{this.state.error["nombre"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="date-input">Fecha de Nacimiento</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="date" name="fechaNacimiento" className="form-control my-2" onChange={this.handleChange} value={form ? form.fechaNacimiento : ''} />
                  <span style={{ color: "red" }}>{this.state.error["fechaNacimiento"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Dirección</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="text" name="direccion" className="form-control my-2" onChange={this.handleChange} value={form ? form.direccion : ''} />
                  <span style={{ color: "red" }}>{this.state.error["direccion"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Celular</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="text" name="celular" className="form-control my-2" onChange={this.handleChange} value={form ? form.celular : ''} />
                  <span style={{ color: "red" }}>{this.state.error["celular"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Sexo</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="sexo" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.sexo : ''}>
                    <option value="0">-- Seleccionar --</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["sexo"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="date-input">Fecha de Ingreso</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="date" name="fechaIngreso" className="form-control my-2" onChange={this.handleChange} value={form ? form.fechaIngreso : ''} />
                  <span style={{ color: "red" }}>{this.state.error["fechaIngreso"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="email-input">Correo</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="email" name="correo" autoComplete="email" className="form-control my-2" onChange={this.handleChange} value={form ? form.correo : ''} />
                  <span style={{ color: "red" }}>{this.state.error["correo"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Sede</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="sede" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.sede : ''}>
                    <option value="0">-- Seleccionar --</option>
                    <option value="Fusagasugá">Fusagasugá</option>
                    <option value="Girardot">Girardot</option>
                    <option value="Ubaté">Ubaté</option>
                    <option value="Chía">Chía</option>
                    <option value="Chocontá">Chocontá</option>
                    <option value="Facatativá">Facatativá</option>
                    <option value="Soacha">Soacha</option>
                    <option value="Zipaquirá">Zipaquirá</option>
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["sede"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Director de Programa</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="administrativo" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.admin : ''}>
                    <option value='0'>-- Seleccionar --</option>
                    {this.state.director.map(elemento => (
                      <option key={elemento.admi_id} value={elemento.admi_id}>{elemento.nombre}</option>
                    ))}
                  </CSelect>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Tipo de Contrato</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="contrato" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.contrato : ''}>
                    <option value="0">-- Seleccionar --</option>
                    <option value="Hora Cátedra">Hora Cátedra</option>
                    <option value="Contrato por 4 meses">Contrato por 4 meses</option>
                    <option value="Contrato por 12 meses">Contrato por 12 meses</option>
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["contrato"]}</span>
                </CCol>
              </CFormGroup>
            </CForm>
          </ModalBody>
          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <CButton color="success" onClick={() => this.peticionPost()}><CIcon name="cil-scrubber" /> Registrar</CButton> :
              <CButton color="success" onClick={() => this.peticionPut()} ><CIcon name="cil-scrubber" /> Actualizar</CButton>}
            <CButton onClick={() => this.modalInsertar()} type="reset" color="warning"><CIcon name="cil-ban" /> Cancelar</CButton>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar el usuario {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <CButton color="success" onClick={() => this.peticionDelete()}>Sí</CButton>
            <CButton color="warning" onClick={() => this.setState({ modalEliminar: false })}>No</CButton>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default Docentes