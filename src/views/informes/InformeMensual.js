import React, { useState } from 'react'
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

const fields = ['', 'nombre', 'fechaElaboración', 'periodoAcadémico', 'tamaño', 'tipoArchivo', 'opciones']
let extension;
let tamano;

class InformeMensual extends Component {
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
            fechaElaboración: '',
            tamaño: '',
            tipoArchivo: '',
            docente: {
                id: UserProfile.getId()
            },
            programaacademico: {
                prac_id: ''
            },
            progra: '',
            año: '',
            periodoAcadémico: ''
        },
        form: {
            id: '',
            nombre: '',
            fechaElaboración: '',
            tamaño: '',
            tipoArchivo: '',
            docente: {
                id: UserProfile.getId()
            },
            programaacademico: {
                prac_id: ''
            },
            progra: '',
            periodoAcadémico: '',
            año: '',
            tipoModal: ''
        },
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
        let mes = fechaHora.getMonth()+1;
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

        if (!campo["fechaElaboración"]) {
            formularioValido = false;
            error["fechaElaboración"] = "Por favor, ingresa la Fecha de Elaboración.";
        }else{
            if(fecha<=campo["fechaElaboración"]){
              formularioValido = false;
              error["fechaElaboración"] = "Por favor, ingresa una fecha anterior a la actual.";
            }
          }

        if (!campo["periodoAcadémico"]) {
            formularioValido = false;
            error["periodoAcadémico"] = "Por favor, ingresa el Periodo Académico.";
        }

        if (!campo["año"]) {
            formularioValido = false;
            error["año"] = "Por favor, ingresa el Año.";
        }else{
            if (!Number(campo["año"])) {
              formularioValido = false;
              error["año"] = "Por favor, ingresa un número válido.";
              }
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

    peticionGetPrograma = () => { //Petición para traer todos los programas academicos
        axios.get("http://localhost:8080/programaacademico/retornarTodos",{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response => {
            this.setState({ programa: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGet = () => { //Petición para traer todos los informes de cierre academico de un docente
        axios.get('http://localhost:8080/informeHoras/listarDocente/' + UserProfile.getId(),{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response => {
            this.setState({ tablaData: response.data });
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionDelete = () => { //Petición para borrar un informe
        axios.delete('http://localhost:8080/informeHoras/delete/' + this.state.form.id,{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }

    peticionPut = () => { //Petición para editar un informe
        axios.put('http://localhost:8080/informeHoras/editar', this.state.form,{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    handleChange = async e => { //Función para capturar los datos del formulario
        e.persist();
        if (e.target.name === "programaacademico") {
            await this.setState({
                form: {
                    ...this.state.form,
                    programaacademico: {
                        prac_id: e.target.value
                    },
                    progra: e.target.value,
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

    handleChanges = e => { //Función para capturar los datos del filtro
        this.setState({ busqueda: e.target.value });
        this.filtrar(e.target.value)
    }

    filtrar = (terminoBusqueda) => { //Función para filtrar los datos del formulario
        var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
            if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase()) ||
                elemento.fechaElaboración.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
            ) {
                return elemento;
            }
        });
        this.setState({ data: resultadosBusqueda });
    }

    componentDidMount() {
        this.peticionGetPrograma();
        this.peticionGet();

    }

    seleccionarInforme = (informe) => { //Función para capturar los datos del informe seleccionado
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: informe.id,
                nombre: informe.nombre,
                fechaElaboración: informe.fechaElaboración,
                tipoArchivo: informe.tipoArchivo,
                tamaño: informe.tamaño,
                programaacademico: {
                    prac_id: informe.programaacademico.prac_id
                },
                progra: informe.programaacademico.prac_id,
                periodoAcadémico: informe.periodoAcadémico,
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
                    fechaElaboración: this.state.form.fechaElaboración,
                    tipoArchivo: this.state.form.tipoArchivo,
                    tamaño: this.state.form.tamaño,
                    periodoAcadémico: this.state.form.periodoAcadémico,
                    año: this.state.form.año,
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

            await axios.post('http://localhost:8080/informeHoras/upload', f,{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}})
                .then(response => {
                    this.setState({
                        form: {
                            id: response.data.id,
                            nombre: this.state.edicion.nombre,
                            fechaElaboración: this.state.edicion.fechaElaboración,
                            tipoArchivo: 'Archivo ' + extension,
                            tamaño: tamano + ' KB',
                            periodoAcadémico: this.state.edicion.periodoAcadémico,
                            año: this.state.edicion.año,
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
                                        <h2 >< FcFolder size="50px" /> Informe Horas no Lectivas</h2>
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
                                                href='https://res.cloudinary.com/dbvsv8u1s/image/upload/v1630987803/okz7bo09xgnlic4htijd.pdf' target="_blank">
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
                                    <CInput type="date" name="fechaElaboración" className="form-control my-2" onChange={this.handleChange} value={form ? form.fechaElaboración : ''} />
                                    <span style={{ color: "red" }}>{this.state.error["fechaElaboración"]}</span>
                                </CCol>
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="select">Periodo Académico</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CSelect custom name="periodoAcadémico" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.periodoAcadémico : ''}>
                                        <option value="0">-- Seleccionar --</option>
                                        <option value="1">I Semestre</option>
                                        <option value="2">II Semestre</option>
                                    </CSelect>
                                    <span style={{ color: "red" }}>{this.state.error["periodoAcadémico"]}</span>
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

export default InformeMensual;