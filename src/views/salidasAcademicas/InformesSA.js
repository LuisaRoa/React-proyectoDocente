import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import CIcon from '@coreui/icons-react'
import { ModalBody, ModalFooter, ModalHeader, Modal } from 'reactstrap';
import { BsFillTrashFill, BsFileEarmarkText, BsSearch } from 'react-icons/bs';
import { Component } from 'react';
import { FcPlus, FcFolder } from "react-icons/fc";
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
  CSelect,
  CLabel
} from '@coreui/react'

const fields = ['', 'nombre', 'fecha', 'tamaño', 'tipoArchivo', 'opciones']
let extension;
let tamano;

class InformeSA extends Component {
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
      docente: {
        id: UserProfile.getId()
      },
      solicitudSalida: {
        sosa_id: ''
      },
      salida: ''
    },
    form: {
      id: '',
      nombre: '',
      fecha: '',
      tamaño: '',
      tipoArchivo: '',
      docente: {
        id: UserProfile.getId()
      },
      solicitudSalida: {
        sosa_id: ''
      },
      salida: '',
      tipoModal: ''
    },
    salidas: [],
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

    if (!campo["solicitudSalida"]) {
      formularioValido = false;
      error["solicitudSalida"] = "Por favor, ingresa la Salida Académica.";
    }

    this.setState({
      error: error
    });

    return formularioValido;
  }

  peticionGetSalidas = () => {
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudsalida/retornarEstado/" + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ salidas: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGet = () => {
    var i;
    axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSalidas/listarDocente/' + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionDelete = () => {
    axios.delete('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSalidas/delete/' + this.state.form.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  peticionPut = () => {
    axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSalidas/editar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  handleChange = async e => {
    e.persist();
    if (e.target.name === "solicitudSalida") {
      await this.setState({
        form: {
          ...this.state.form,
          solicitudSalida: {
            sosa_id: e.target.value
          },
          salida: e.target.value,
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

  handleChanges = e => {
    this.setState({ busqueda: e.target.value });
    this.filtrar(e.target.value)
  }

  filtrar = (terminoBusqueda) => {
    var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase()) ||
        elemento.fecha.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
      ) {
        return elemento;
      }
    });
    this.setState({ data: resultadosBusqueda });
  }

  componentDidMount() {
    this.peticionGetSalidas();
    this.peticionGet();

  }

  seleccionarInforme = (informe) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: informe.id,
        nombre: informe.nombre,
        fecha: informe.fecha,
        tipoArchivo: informe.tipoArchivo,
        tamaño: informe.tamaño,
        solicitudSalida: {
          sosa_id: informe.solicitudSalida.sosa_id
        },
        salida: informe.solicitudSalida.sosa_id
      }
    })
  }


  subirArchivos = e => {
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

  insertArchivos = async () => {
    if (this.validarFormulario()) {
      await this.setState({
        edicion: {
          nombre: this.state.form.nombre,
          fecha: this.state.form.fecha,
          tipoArchivo: this.state.form.tipoArchivo,
          tamaño: this.state.form.tamaño,
          solicitudSalida: {
            sosa_id: this.state.form.solicitudSalida.sosa_id
          },
          salida: this.state.form.solicitudSalida.sosa_id,
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

      await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSalidas/upload', f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
        .then(response => {
          this.setState({
            form: {
              id: response.data.id,
              nombre: this.state.edicion.nombre,
              fecha: this.state.edicion.fecha,
              tipoArchivo: 'Archivo ' + extension,
              tamaño: tamano + ' KB',
              solicitudSalida: {
                sosa_id: this.state.edicion.solicitudSalida.sosa_id
              },
              salida: this.state.edicion.solicitudSalida.prac_id,
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
                    <h2 >< FcFolder size="50px" />Informe Salida Académica</h2>
                    <CCol col="2" className="mb-3 mb-xl-0 text-center">
                      <CNav className="navbar navbar-light bg-light" >
                        <CForm className="form-inline">
                          <CInput className="form-control mr-sm-2" value={this.state.busqueda} placeholder="Buscar" aria-label="Search" onChange={this.handleChanges} />

                        </CForm>
                      </CNav>
                    </CCol>
                    <CCol col="2" className="mb-3 mb-xl-0 text-right">
                      <CButton onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }} variant="ghost" size="lg"><FcPlus size="60px" /></CButton>
                      <a
                        href='http://res.cloudinary.com/dbvsv8u1s/image/upload/v1631945725/g3b45g8dezjf896nxlgm.pdf' target="_blank">
                        <font color="#000000">Ver Formato Guía </font>
                      </a>
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
                                href={item.archivoUrl} target="_blank">
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
                  <CLabel htmlFor="select">Salida Académica</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="solicitudSalida" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.salida : ''}>
                    <option value='0'>-- Seleccionar --</option>
                    {this.state.salidas.map(elemento => (
                      <option key={elemento.sosa_id} value={elemento.sosa_id}>{elemento.nombre}</option>
                    ))}
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["solicitudSalida"]}</span>
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

export default InformeSA;