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

const fields = ['', 'nombre', 'fecha', 'grupo', 'nucleoTemático', 'tamaño', 'tipoArchivo', 'opciones']
let extension;
let tamano;

class InformeSemestral extends Component {
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
      materia: {
        mate_id: ''
      },
      mate: '',
      docente: {
        id: UserProfile.getId()
      },
      programaacademico: {
        prac_id: ''
      },
      progra: '',
      estudianteApro: '',
      estudianteNoApro: '',
      estudianteRetirado: '',
      grupo: '',
      periodoAca: '',
      año: ''
    },
    form: {
      id: '',
      nombre: '',
      fecha: '',
      tamaño: '',
      tipoArchivo: '',
      semestre: '',
      materia: {
        mate_id: ''
      },
      mate: '',
      docente: {
        id: UserProfile.getId()
      },
      programaacademico: {
        prac_id: ''
      },
      progra: '',
      estudianteApro: '',
      estudianteNoApro: '',
      estudianteRetirado: '',
      grupo: '',
      periodoAca: '',
      año: '',
      tipoModal: ''
    },
    materias: [],
    programa: [],
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
    if (!campo["grupo"]) {
      formularioValido = false;
      error["grupo"] = "Por favor, ingresa el Grupo.";
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

    if (!campo["año"]) {
      formularioValido = false;
      error["año"] = "Por favor, ingresa el Año.";
    } else {
      if (!Number(campo["año"])) {
        formularioValido = false;
        error["año"] = "Por favor, ingresa un número válido.";
      }
    }

    if (!campo["estudianteApro"]) {
      formularioValido = false;
      error["estudianteApro"] = "Por favor, ingresa el Número de estudiantes aprobados.";
    } else {
      if (!Number(campo["estudianteApro"])) {
        formularioValido = false;
        error["estudianteApro"] = "Por favor, ingresa un número válido.";
      }
    }

    if (!campo["estudianteNoApro"]) {
      formularioValido = false;
      error["estudianteNoApro"] = "Por favor, ingresa el Número de estudiantes reprobados.";
    } else {
      if (!Number(campo["estudianteNoApro"])) {
        formularioValido = false;
        error["estudianteNoApro"] = "Por favor, ingresa un número válido.";
      }
    }

    if (!campo["estudianteRetirado"]) {
      formularioValido = false;
      error["estudianteRetirado"] = "Por favor, ingresa el Número de estudiantes retirados.";
    } else {
      if (!Number(campo["estudianteRetirado"])) {
        formularioValido = false;
        error["estudianteRetirado"] = "Por favor, ingresa un número válido.";
      }
    }

    if (!campo["materia"]) {
      formularioValido = false;
      error["materia"] = "Por favor, ingresa la Materia.";
    }

    if (!campo["programaacademico"]) {
      formularioValido = false;
      error["programaacademico"] = "Por favor, ingresa el Programa académico.";
    }

    this.setState({
      error: error
    });

    return formularioValido;
  }

  peticionGetMateria = () => { //Petición para traer todas las materias
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/materia/retornarTodos", { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ materias: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetMateriaId = (id) => { //Petición para traer todos la materia por el id
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/materia/retornarId/" + id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({
        form: {
          ...this.state.form,
          semestre: response.data.semestre
        }

      });

    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetPrograma = () => { //Petición para traer todos los programas academicos
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/programaacademico/retornarTodos", { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ programa: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGet = () => { //Petición para traer todos los informes de cierre academico de un docente
    var i;
    axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSemestral/listarDocente/' + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ tablaData: response.data });
      for (i = 0; i <= this.state.tablaData.length; i++) {
        this.setState({ data: response.data });
        this.state.data[i].nucleoTemático = this.state.tablaData[i].nucleoTemático.nombre;
      }
    }).catch(error => {
      console.log(error.message);
    })
  }
 
  peticionDelete = () => { //Petición para borrar un informe
    axios.delete('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSemestral/delete/' + this.state.form.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  peticionPut = () => { //Petición para editar un informe
    axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSemestral/editar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  handleChange = async e => { //Función para capturar los datos del formulario
    e.persist();
    if (e.target.name === "materia") {
      this.peticionGetMateriaId(e.target.value);
      await this.setState({
        form: {
          ...this.state.form,
          materia: {
            mate_id: e.target.value
          },
          mate: e.target.value,
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
      if (e.target.name === "programaacademico") {
        await this.setState({
          form: {
            ...this.state.form,
            programaacademico: {
              prac_id: e.target.value
            },
            progra: e.target.value

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
  }

  handleChanges = e => { //Función para capturar los datos del filtro
    this.setState({ busqueda: e.target.value });
    this.filtrar(e.target.value)
  }

  filtrar = (terminoBusqueda) => { //Función para filtrar los datos del formulario
    var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase()) ||
        elemento.materia.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
      ) {
        return elemento;
      }
    });
    this.setState({ data: resultadosBusqueda });
  }

  componentDidMount() {
    this.peticionGetMateria();
    this.peticionGetPrograma();
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
        programaacademico: {
          prac_id: informe.programaacademico.prac_id
        },
        progra: informe.programaacademico.prac_id,
        materia: {
          mate_id: informe.nucleoTemático.mate_id
        },
        mate: informe.nucleoTemático.mate_id,
        estudianteApro: informe.estudianteApro,
        estudianteNoApro: informe.estudianteNoApro,
        estudianteRetirado: informe.estudianteRetirado,
        grupo: informe.grupo,
        periodoAca: informe.periodoAca,
        año: informe.año
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
          estudianteApro: this.state.form.estudianteApro,
          estudianteNoApro: this.state.form.estudianteNoApro,
          estudianteRetirado: this.state.form.estudianteRetirado,
          grupo: this.state.form.grupo,
          periodoAca: this.state.form.periodoAca,
          año: this.state.form.año,
          materia: {
            mate_id: this.state.form.materia.mate_id
          },
          mate: this.state.form.materia.mate_id,
          programaacademico: {
            prac_id: this.state.form.programaacademico.prac_id
          },
          progra: this.state.form.programaacademico.prac_id,
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

      await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/informeSemestral/upload', f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
        .then(response => {
          this.setState({
            form: {
              id: response.data.id,
              nombre: this.state.edicion.nombre,
              fecha: this.state.edicion.fecha,
              tipoArchivo: 'Archivo ' + extension,
              tamaño: tamano + ' KB',
              semestre: this.state.edicion.semestre,
              estudianteApro: this.state.edicion.estudianteApro,
              estudianteNoApro: this.state.edicion.estudianteNoApro,
              estudianteRetirado: this.state.edicion.estudianteRetirado,
              grupo: this.state.edicion.grupo,
              periodoAca: this.state.edicion.periodoAca,
              año: this.state.edicion.año,
              materia: {
                mate_id: this.state.edicion.materia.mate_id
              },
              mate: this.state.edicion.materia.mate_id,
              programaacademico: {
                prac_id: this.state.edicion.programaacademico.prac_id
              },
              progra: this.state.edicion.programaacademico.prac_id,
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
                    <h2 >< FcFolder size="50px" /> Informe Semestral</h2>
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
                        href='http://res.cloudinary.com/dbvsv8u1s/image/upload/v1630557870/blmqmjgtfpkhkae9rcui.pdf' target="_blank">
                        <font color="#000000">Ver Formato Guía </font>
                      </a>
                      <br />
                      <a
                        href='https://plataforma.ucundinamarca.edu.co/aplicaciones/calidad/download.jsp?file=2019-09-10_5383_1.docx&id=333&tipo=2' >
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
                  <CLabel htmlFor="text-input">Grupo</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="grupo" className="form-control my-2" onChange={this.handleChange} value={form ? form.grupo : ''} />
                  <span style={{ color: "red" }}>{this.state.error["grupo"]}</span>
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
                  <CLabel htmlFor="text-input">Año</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="año" className="form-control my-2" onChange={this.handleChange} value={form ? form.año : ''} />
                  <span style={{ color: "red" }}>{this.state.error["año"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Nro Estudiantes Aprobados</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="estudianteApro" className="form-control my-2" onChange={this.handleChange} value={form ? form.estudianteApro : ''} />
                  <span style={{ color: "red" }}>{this.state.error["estudianteApro"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Nro Estudiantes Reprobados</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="estudianteNoApro" className="form-control my-2" onChange={this.handleChange} value={form ? form.estudianteNoApro : ''} />
                  <span style={{ color: "red" }}>{this.state.error["estudianteNoApro"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Nro Estudiantes Retirados</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput name="estudianteRetirado" className="form-control my-2" onChange={this.handleChange} value={form ? form.estudianteRetirado : ''} />
                  <span style={{ color: "red" }}>{this.state.error["estudianteRetirado"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Núcleo Temático</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="materia" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.mate : ''}>
                    <option value='0'>-- Seleccionar --</option>
                    {this.state.materias.map(elemento => (
                      <option key={elemento.mate_id} value={elemento.mate_id}>{elemento.codigo}-{elemento.nombre}</option>
                    ))}
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["materia"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Programa Académico</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="programaacademico" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.progra : ''}>
                    <option value='0'>-- Seleccionar --</option>
                    {this.state.programa.map(elemento => (
                      <option key={elemento.prac_id} value={elemento.prac_id}>{elemento.nombre}</option>
                    ))}
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["programaacademico"]}</span>
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

export default InformeSemestral;