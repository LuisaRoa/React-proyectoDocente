import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import CIcon from '@coreui/icons-react'
import { ModalBody, ModalFooter, ModalHeader, Modal } from 'reactstrap';
import { BsFillTrashFill, BsPencil, BsFileEarmarkText, BsSearch, BsFolder } from 'react-icons/bs';
import { Component } from 'react';
import { FcPlus } from "react-icons/fc";
import UserProfile from '../usuarios/UserProfile';
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
  CContainer,
  CLabel
} from '@coreui/react'

const fields = ['', 'codigo', 'nombre', 'proceso', 'version', 'fechaAprobacion', 'opciones']


class Formatos extends Component {
  state = {
    data: [],
    tablaData: [],
    busqueda: "",
    archivos: (null),
    modalInsertar: false,
    modalEliminar: false,
    edicion: {
      id: '',
      codigo: '',
      nombre: '',
      version: '',
      proceso: '',
      fechaAprobacion: ''
    },
    form: {
      id: '',
      codigo: '',
      nombre: '',
      version: '',
      proceso: '',
      fechaAprobacion: '',
      tipoModal: ''
    },
    error: {},
    campo: {},
    enviado: false
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

    if (!campo["files"]) {
      formularioValido = false;
      error["files"] = "Por favor, ingresa un Archivo";
    }

    if (!campo["codigo"]) {
      formularioValido = false;
      error["codigo"] = "Por favor, ingresa el Código";
    }

    if (!campo["nombre"]) {
      formularioValido = false;
      error["nombre"] = "Por favor, ingresa el Nombre.";
    }
    if (!campo["version"]) {
      formularioValido = false;
      error["version"] = "Por favor, ingresa la Versión.";
    }
    if (!campo["proceso"]) {
      formularioValido = false;
      error["proceso"] = "Por favor, ingresa el Proceso.";
    }

    if (!campo["fechaAprobacion"]) {
      formularioValido = false;
      error["fechaAprobacion"] = "Por favor, ingresa la Fecha de Aprobación.";
    } else {
      if (fecha <= campo["fechaAprobacion"]) {
        formularioValido = false;
        error["fechaAprobacion"] = "Por favor, ingresa una fecha anterior a la actual.";
      }
    }

    this.setState({
      error: error
    });

    return formularioValido;
  }

  peticionGet = () => { //Petición para traer todos los formatos
    axios.get('http://localhost:8080/cloudinary/list', { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionDelete = () => { //Petición para eliminar un formulario
    axios.delete('http://localhost:8080/cloudinary/delete/' + this.state.form.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  peticionPut = () => { //Petición para editar un formulario
    axios.put('http://localhost:8080/cloudinary/editar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  handleChange = async e => { //Función para capturar los datos del formulario
    e.persist();
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

  handleChanges = e => { //Función para capturar los datos de la barra de filtro
    this.setState({ busqueda: e.target.value });
    this.filtrar(e.target.value)
  }

  filtrar = (terminoBusqueda) => { //Función para filtrar los datos de la tabla
    var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase()) ||
        elemento.codigo.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
      ) {
        return elemento;
      }
    });
    this.setState({ data: resultadosBusqueda });
  }

  componentDidMount() {
    this.peticionGet();
  }

  seleccionarFormato = (formato) => { //Función para capturar los datos del formato seleccionado
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: formato.id,
        codigo: formato.name,
        nombre: formato.imagenUrl
      }
    })
  }


  subirArchivos = e => { //Función para capturar el archivo insertado
    this.setState({ archivos: e });
    let campo = this.state.campo;
    campo['files'] = e;

    // Cambio de estado de campo 
    this.setState({
      campo
    });
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  insertArchivos = async () => { //Función para guardar un nuevo formato

    if (this.validarFormulario()) {
      // Cambio el estado de 'enviado' a 'true'
      this.setState({ enviado: true });
      await this.setState({
        edicion: {
          codigo: this.state.form.codigo,
          nombre: this.state.form.nombre,
          version: this.state.form.version,
          proceso: this.state.form.proceso,
          fechaAprobacion: this.state.form.fechaAprobacion,
        }
      });
      const f = new FormData();

      for (let index = 0; index < this.state.archivos.length; index++) {
        f.append("multipartFile", this.state.archivos[index]);
      }

      await axios.post('http://localhost:8080/cloudinary/upload', f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
        .then(response => {
          this.setState({
            form: {
              id: response.data.id,
              codigo: this.state.edicion.codigo,
              nombre: this.state.edicion.nombre,
              version: this.state.edicion.version,
              proceso: this.state.edicion.proceso,
              fechaAprobacion: this.state.edicion.fechaAprobacion
            }
          });
          this.peticionPut();
        }).catch(error => {
          console.log(error);
        })
    }

  }
  render() {
    const { form } = this.state;
    return (
      <div>
        <CContainer >
          <CRow className="justify-content-center">
            <CCol>
              <CCard style={{ width: '100%', textAlign: 'center' }} >
                <CCardHeader>
                  <CForm className="form-inline" >
                    <h2 >< BsFolder size="50px" /> Formatos</h2>
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
                              <a
                                href={item.imagenUrl} target="_blank">
                                <CButton >
                                  <BsSearch />
                                </CButton>
                              </a>
                            </td>
                            <td>
                              <CButton size="lg" onClick={() => { this.seleccionarFormato(item); this.setState({ modalEliminar: true }) }}>
                                <BsFillTrashFill />
                              </CButton>
                            </td>
                          </tr>
                        ),
                      '':
                        (item) => (
                          <td>
                            <BsFileEarmarkText size="40px" />
                          </td>
                        )
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}></span>
          </ModalHeader>
          <ModalBody>
            <CForm encType="multipart/form-data" noValidat>
              <CFormGroup row>
                <br /><br />
                <CInput type="file" name="files" accept="application/pdf" multiple onChange={(e) => this.subirArchivos(e.target.files)} required />
                <span style={{ color: "red" }}>{this.state.error["files"]}</span>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Código</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="codigo" className="form-control-warning" className="form-control my-2" onChange={this.handleChange} value={form ? form.codigo : ''} />
                  <span style={{ color: "red" }}>{this.state.error["codigo"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Nombre</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="nombre" className="form-control my-2" onChange={this.handleChange} value={form ? form.nombre : ''} />
                  <span style={{ color: "red" }}>{this.state.error["nombre"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Proceso</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="proceso" className="form-control my-2" onChange={this.handleChange} value={form ? form.proceso : ''} />
                  <span style={{ color: "red" }}>{this.state.error["proceso"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Versión</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="version" className="form-control my-2" onChange={this.handleChange} value={form ? form.version : ''} />
                  <span style={{ color: "red" }}>{this.state.error["version"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="date-input">Fecha de Aprobación</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="date" name="fechaAprobacion" className="form-control my-2" onChange={this.handleChange} value={form ? form.fechaAprobacion : ''} />
                  <span style={{ color: "red" }}>{this.state.error["fechaAprobacion"]}</span>
                </CCol>
              </CFormGroup>

            </CForm>
          </ModalBody>
          <ModalFooter>
            <CButton color="success" onClick={() => this.insertArchivos()}><CIcon name="cil-scrubber" /> Insertar</CButton>
            <CButton onClick={() => this.modalInsertar()} type="reset" color="warning"><CIcon name="cil-ban" /> Cancelar</CButton>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar el formato {form && form.name}
          </ModalBody>
          <ModalFooter>
            <CButton color="success" onClick={() => this.peticionDelete()}>Sí</CButton>
            <CButton color="warning" onClick={() => this.setState({ modalEliminar: false })}>No</CButton>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

}

export default Formatos;