import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import CIcon from '@coreui/icons-react'
import { ModalBody, ModalFooter, ModalHeader, Modal } from 'reactstrap';
import { BsFillTrashFill, BsFileEarmarkText, BsSearch } from 'react-icons/bs';
import { Component } from 'react';
import { FcPlus, FcFolder } from "react-icons/fc";
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
import UserProfile from '../usuarios/UserProfile';

const fields = ['', 'nombre', 'fecha', 'semestre', 'nucleoTemático', 'tamaño', 'tipoArchivo', 'opciones']
let extension;
let tamano;


class Asesorias extends Component {
  state = {
    data: [],
    tablaData: [],
    busqueda: "",
    archivos: (null),
    modalInsertar: false,
    modalEliminar: false,
    edicion: {
      id: '',
      nombre: '',
      fecha: '',
      tamaño: '',
      tipoArchivo: '',
      semestre: '',
      nucleo: '',
      docente: {
        id: UserProfile.getId()
      }
    },
    form: {
      id: '',
      nombre: '',
      fecha: '',
      tamaño: '',
      tipoArchivo: '',
      semestre: '',
      nucleo: '',
      docente: {
        id: '425'
      },
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

    if (!campo["nombre"]) {
      formularioValido = false;
      error["nombre"] = "Por favor, ingresa el Nombre.";
    }
    if (!campo["semestre"]) {
      formularioValido = false;
      error["semestre"] = "Por favor, ingresa el Semestre.";
    }
    if (!campo["nucleo"]) {
      formularioValido = false;
      error["nucleo"] = "Por favor, ingresa el Nucleo.";
    }

    if (!campo["fecha"]) {
      formularioValido = false;
      error["fecha"] = "Por favor, ingresa la Fecha de Asesoría.";
    } else {
      if (fecha <= campo["fecha"]) {
        formularioValido = false;
        error["fecha"] = "Por favor, ingresa una fecha anterior a la actual.";
      }
    }

    this.setState({
      error: error
    });

    return formularioValido;
  }

  peticionGet = () => { //Petición para traer todas las asesorias de acuerdo al docente loggeado
    axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/asesoria/listarDocente/' + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionDelete = () => { //Petición para eliminar una asesoria
    axios.delete('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/asesoria/delete/' + this.state.form.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  peticionPut = () => { //Petición para editar una asesoria
    axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/asesoria/editar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  handleChange = async e => { //Función para guardra los datos de una asesoria
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
        docente: {
          id: UserProfile.getId()
        }
      }
    });
    let campo = this.state.campo;
    campo[e.target.name] = e.target.value;

    // Cambio de estado de campo 
    this.setState({
      campo
    });
  }

  handleChanges = e => { //Función para guardar los datos de busqueda
    this.setState({ busqueda: e.target.value });
    this.filtrar(e.target.value)
  }

  filtrar = (terminoBusqueda) => { //Función para filtrar los datos de la tabla
    var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase()) ||
        elemento.semestre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
      ) {
        return elemento;
      }
    });
    this.setState({ data: resultadosBusqueda });
  }

  componentDidMount() {
    this.peticionGet();
  }

  seleccionarAsesoria = (asesoria) => { //Función para guardar los datos de la asesoría seleccionada
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: asesoria.id,
        nombre: asesoria.nombre,
        fecha: asesoria.fecha,
        tipoArchivo: asesoria.tipoArchivo,
        tamaño: asesoria.tamaño,
        semestre: asesoria.semestre,
        nucleo: asesoria.nucleoTemático
      }
    })
  }


  subirArchivos = e => { //Función para capturar el archivo subido por el docente
    this.setState({ archivos: e });
    let campo = this.state.campo;
    campo['files'] = e;
    this.setState({
      campo
    });
  }

  modalInsertar = () => { 
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  insertArchivos = async () => { //Función para guardar una asesoría
    if (this.validarFormulario()) {
      await this.setState({
        edicion: {
          nombre: this.state.form.nombre,
          fecha: this.state.form.fecha,
          tipoArchivo: this.state.form.tipoArchivo,
          tamaño: this.state.form.tamaño,
          semestre: this.state.form.semestre,
          nucleo: this.state.form.nucleo,
          docente: {
            id: this.state.form.docente.id
          }

        }
      });
      const f = new FormData();

      for (let index = 0; index < this.state.archivos.length; index++) {
        f.append("multipartFile", this.state.archivos[index]);
        extension = this.state.archivos[index].name.split('.').pop();
        extension = extension.toUpperCase();
        tamano = parseInt((this.state.archivos[index].size) / 1024);
      }

      await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/asesoria/upload', f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
        .then(response => {
          this.setState({
            form: {
              id: response.data.id,
              nombre: this.state.edicion.nombre,
              fecha: this.state.edicion.fecha,
              tipoArchivo: 'Archivo ' + extension,
              tamaño: tamano + ' KB',
              semestre: this.state.edicion.semestre,
              nucleo: this.state.edicion.nucleo,
              docente: {
                id: this.state.edicion.docente.id
              }
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
                    <h2 >< FcFolder size="50px" /> Asesorías</h2>
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
                                href={item.archivoUrl} target="_blank">
                                <CButton >
                                  <BsSearch />
                                </CButton>
                              </a>
                            </td>
                            <td>
                              <CButton size="lg" onClick={() => { this.seleccionarAsesoria(item); this.setState({ modalEliminar: true }) }}>
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
                <CInput type="file" name="files" accept="application/pdf" multiple onChange={(e) => this.subirArchivos(e.target.files)} />
                <span style={{ color: "red" }}>{this.state.error["files"]}</span>
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
                  <CLabel htmlFor="text-input">Semestre</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="semestre" className="form-control my-2" onChange={this.handleChange} value={form ? form.semestre : ''} />
                  <span style={{ color: "red" }}>{this.state.error["semestre"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Núcleo Temático</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="nucleo" className="form-control my-2" onChange={this.handleChange} value={form ? form.nucleo : ''} />
                  <span style={{ color: "red" }}>{this.state.error["nucleo"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="date-input">Fecha de Asesoría</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="date" name="fecha" className="form-control my-2" onChange={this.handleChange} value={form ? form.fecha : ''} />
                  <span style={{ color: "red" }}>{this.state.error["fecha"]}</span>
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
            Estás seguro que deseas eliminar la asesoría {form && form.nombre}
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

export default Asesorias;