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
  CSelect,
  CLabel
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';

const fields = ['', 'nombre', 'fecha', 'semestre', 'tamaño', 'tipoArchivo', 'opciones']
let extension;
let tamano;

class DesempeñoDocentes extends Component {
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
      administrativo: {
        admi_id: UserProfile.getId()
      },
      periodoAca: ''
    },
    form: {
      id: '',
      nombre: '',
      fecha: '',
      tamaño: '',
      tipoArchivo: '',
      semestre: '',
      administrativo: {
        admi_id: UserProfile.getId()
      },
      periodoAca: '',
      tipoModal: ''
    },
    error: {},
    campo: {},
    enviado: false
  }

  validarFormulario() {
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

    if (!campo["fecha"]) {
      formularioValido = false;
      error["fecha"] = "Por favor, ingresa la Fecha de Elaboración.";
    } else {
      if (fecha <= campo["fecha"]) {
        formularioValido = false;
        error["fecha"] = "Por favor, ingresa una fecha anterior a la actual.";
      }
    }

    if (!campo["periodoAca"]) {
      formularioValido = false;
      error["periodoAca"] = "Por favor, ingresa el Periodo Académico.";
    }

    if (!campo["semestre"]) {
      formularioValido = false;
      error["semestre"] = "Por favor, ingresa el Semestre.";
    }

    this.setState({
      error: error
    });

    return formularioValido;
  }

  peticionGet = () => { //Petición para traer todos los informes de cierre academico de un administrativo
    axios.get('http://localhost:8080/desempeñoDocentes/listarAdministrativo/' + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ tablaData: response.data });
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionDelete = () => { //Petición para borrar un informe
    axios.delete('http://localhost:8080/desempeñoDocentes/delete/' + this.state.form.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  peticionPut = () => { //Petición para editar un informe
    axios.put('http://localhost:8080/desempeñoDocentes/editar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  handleChange = async e => { //Función para capturar los datos del formulario
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
        administrativo: {
          admi_id: UserProfile.getId()
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

  handleChanges = e => { //Función para capturar los datos del filtro
    this.setState({ busqueda: e.target.value });
    this.filtrar(e.target.value)
  }

  filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = this.state.tablaData.filter((elemento) => { //Función para filtrar los datos del formulario
      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase()) ||
        elemento.fecha.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
      ) {
        return elemento;
      }
    });
    this.setState({ data: resultadosBusqueda });
  }

  componentDidMount() {
    this.peticionGet();

  }

  seleccionarInforme = (informe) => { //Función para capturar los datos del informe seleccionado
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: informe.id,
        nombre: informe.nombre,
        fecha: informe.fecha,
        tipoArchivo: informe.tipoArchivo,
        tamaño: informe.tamaño,
        semestre: informe.semestre,
        periodoAca: informe.periodoAca
      }
    })
  }


  subirArchivos = e => { //Función para capturar el archivo cargado
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

  insertArchivos = async () => { //Función para guardar un nuevo informe
    if (this.validarFormulario()) {
      await this.setState({
        edicion: {
          nombre: this.state.form.nombre,
          fecha: this.state.form.fecha,
          tipoArchivo: this.state.form.tipoArchivo,
          tamaño: this.state.form.tamaño,
          semestre: this.state.form.semestre,
          periodoAca: this.state.form.periodoAca,
          administrativo: {
            admi_id: this.state.form.administrativo.admi_id
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

      await axios.post('http://localhost:8080/desempeñoDocentes/upload', f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
        .then(response => {
          this.setState({
            form: {
              id: response.data.id,
              nombre: this.state.edicion.nombre,
              fecha: this.state.edicion.fecha,
              tipoArchivo: 'Archivo ' + extension,
              tamaño: tamano + ' KB',
              semestre: this.state.edicion.semestre,
              periodoAca: this.state.edicion.periodoAca,
              administrativo: {
                admi_id: this.state.edicion.administrativo.admi_id
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
                    <h2 >< FcFolder size="50px" /> Informe Desempeño Docentes</h2>
                    <CCol col="2" className="mb-3 mb-xl-0 text-center">
                      <CNav className="navbar navbar-light bg-light" >
                        <CForm className="form-inline">
                          <CInput className="form-control mr-sm-2" value={this.state.busqueda} placeholder="Buscar" aria-label="Search" onChange={this.handleChanges} />

                        </CForm>
                      </CNav>
                    </CCol>
                    <CCol col="2" className="mb-3 mb-xl-0 text-right">
                      <CButton onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }} variant="ghost" size="lg"><FcPlus size="60px" /></CButton>
                      <br />
                      <a
                        href='https://plataforma.ucundinamarca.edu.co/aplicaciones/calidad/download.jsp?file=2021-02-18_6424_1.docx&id=830&tipo=2' >
                        <font color="#000000">Descargar Formato  </font>
                      </a>
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
                                href={item.informeUrl} target="_blank">
                                <CButton >
                                  <BsSearch />
                                </CButton>
                              </a>
                            </td>
                            <td>
                              <CButton size="lg" onClick={() => { this.seleccionarInforme(item); this.setState({ modalEliminar: true }) }}>
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
                  <CLabel htmlFor="date-input">Fecha de Elaboración</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="date" name="fecha" className="form-control my-2" onChange={this.handleChange} value={form ? form.fecha : ''} />
                  <span style={{ color: "red" }}>{this.state.error["fecha"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Periodo Académico</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="periodoAca" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.periodoAca : ''}>
                    <option value="0">-- Seleccionar --</option>
                    <option value="1">I Semestre</option>
                    <option value="2">II Semestre</option>
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["periodoAca"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="date-input">Semestre</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="semestre" className="form-control my-2" onChange={this.handleChange} value={form ? form.semestre : ''} />
                  <span style={{ color: "red" }}>{this.state.error["semestre"]}</span>
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
            Estás seguro que deseas eliminar el {form && form.nombre}
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

export default DesempeñoDocentes;