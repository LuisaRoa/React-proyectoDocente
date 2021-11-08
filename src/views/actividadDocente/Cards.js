import React, { Component } from "react";
import { FcPackage } from "react-icons/fc";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
    CCard,
    CCardBody,
    CCol,
    CButton,
    CCardHeader,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CFormGroup,
    CLabel,
    CSelect,
    CForm,
    CInput
} from '@coreui/react'
import axios from 'axios';
import UserProfile from "../usuarios/UserProfile";
import swal from 'sweetalert';

let extension;
let tamano;
class Cards extends Component {
    state = {
        docentes: [],
        cronogramas: [],
        tablaData: [],
        modalMiembros: false,
        modalCronograma: false,
        modalEliminar: false,
        archivos: null,
        miembro: {
            comite: '',
            docente: ''
        },
        cronograma: {
            id: '',
            nombre: '',
            fecha: '',
            tipoArchivo: '',
            tamaño: '',
            comite: {
                comi_id: ''
            }
        }
    }
    mostrarAlerta = (texto) => { //Función para mostrar alertas de confirmación
        swal({
            title: "Aviso",
            text: texto,
            icon: "success",
            button: "Aceptar"
        })
    }
    peticionGet = () => { //Petición para traer todos los docentes que no son miembros de un comité
        axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/docente/listarNoMiembros/" + this.props.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ docentes: response.data });
            this.setState({ tablaData: response.data });
            var i;
            for (i = 0; i <= this.state.docentes.length; i++) {
                if (this.state.docentes[i].contrato != 'Hora Cátedra') {
                    this.state.docentes.splice(i, 1);
                }
            }
            this.setState({ modalMiembros: true });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGetCronograma = () => { //Trae todos los cronogramas de un comité especifico
        axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/cronograma/listarComite/" + this.props.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ cronogramas: response.data });
            this.setState({ modalEliminar: true });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => { //Petición para guardar un nuevo miembro de un comité
        await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/miembros/guardar', this.state.miembro, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.mostrarAlerta('Miembro Agregado');
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPut = () => { //Petición para editar un cronograma
        axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/cronograma/editar', this.state.cronograma, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.mostrarAlerta('Cronograma Agregado');
            this.setState({ modalCronograma: false });
        })
    }

    peticionDelete = () => { //Petición para eliminar un cronograma
        axios.delete('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/cronograma/delete/' + this.state.cronograma.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ modalEliminar: false });
            this.mostrarAlerta('Cronograma Eliminado');
        })
    }

    handleChange = async e => { //Función que guarda los datos de los miembros
        e.persist();
        await this.setState({
            miembro: {
                ...this.state.miembro,
                [e.target.name]: e.target.value,
                comite: this.props.id
            }
        });
    }

    handleChanges = async e => { //Función que guarda los datos de un cronograma
        e.persist();
        let fechaHora = new Date();
        let dia = fechaHora.getDate();
        let mes = fechaHora.getMonth() + 1;
        let ano = fechaHora.getFullYear();
        let fecha = dia + '/' + mes + '/' + ano;
        await this.setState({
            cronograma: {
                ...this.state.cronograma,
                [e.target.name]: e.target.value,
                comite: {
                    comi_id: this.props.id
                },
                fecha: fecha
            }
        });
    }

    subirArchivos = e => { //Se guarda en un estado el archivo de cronograma
        this.setState({ archivos: e });
    }

    insertarCronograma = async () => { //Función para guardar un nuevo archivo cronograma
        await this.setState({
            crono: {
                nombre: this.state.cronograma.nombre,
                fecha: this.state.cronograma.fecha,
                comite: {
                    comi_id: this.state.cronograma.comite.comi_id
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

        await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/cronograma/upload', f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
            .then(response => {
                this.setState({
                    cronograma: {
                        id: response.data.id,
                        nombre: this.state.cronograma.nombre,
                        fecha: this.state.cronograma.fecha,
                        tipoArchivo: 'Archivo ' + extension,
                        tamaño: tamano + ' KB',
                        comite: {
                            comi_id: this.state.cronograma.comite.comi_id
                        }
                    }
                });
                this.peticionPut();
            }).catch(error => {
                console.log(error);
            })

    }

    render() {
        return (
            <>
                <CCard style={{ height: '90%' }}>
                    <CCardHeader>
                        <CCol className="form-inline">
                            <h4><FcPackage size="30px" style={{ color: '#0BD824' }} /> {this.props.nombre}</h4>
                        </CCol>
                    </CCardHeader>
                    <CCardBody>
                        <CCol>
                            <br />{this.props.programaacademico} <br /><br />{this.props.sede} <br />
                        </CCol>
                        <CCol col="3" className="mb-3 mb-xl-0 text-rigth">
                            <br />
                        </CCol>
                        <CCol className="form-inline">
                            <Link to={`VerActas/${this.props.id}`}>
                                <CButton color="success">Actas </CButton>
                            </Link>
                            <CCol col="3" className="mb-3 mb-xl-0 text-rigth" >
                                <Link to={`VerProductos/${this.props.id}`}>
                                    <CButton color="warning">Productos </CButton>
                                </Link>
                            </CCol>
                            <CCol></CCol>
                            <CCol></CCol>
                            <CCol class="card-body d-flex">
                                <CDropdown class="btn btn-sm ml-auto">
                                    <CDropdownToggle color="transparent" caret={false}>
                                        <BsThreeDots size="20px" />
                                    </CDropdownToggle>
                                    <CDropdownMenu className="pt-0" placement="bottom-end">
                                        <CDropdownItem onClick={() => this.peticionGet()}>Agregar Miembros</CDropdownItem>
                                        <CDropdownItem onClick={() => this.setState({ modalCronograma: true })}>Agregar Cronograma</CDropdownItem>
                                        <CDropdownItem onClick={() => this.peticionGetCronograma()}>Eliminar Cronograma</CDropdownItem>
                                    </CDropdownMenu>
                                </CDropdown>
                            </CCol>
                        </CCol>
                        <br />
                    </CCardBody>
                </CCard>
                <Modal isOpen={this.state.modalMiembros}>
                    <ModalHeader style={{ color: '#007a3d' }}>
                        Agregar Miembros
                    </ModalHeader>
                    <ModalBody>
                        <CForm>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel ><b>Comité: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput class="form-control my-2" name="nombre" type="text" readonly value={this.props.nombre} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="select"><b>Docentes: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CSelect custom name="docente" id="select" className="form-control my-2" onChange={this.handleChange}>
                                        <option value='0'>-- Seleccionar --</option>
                                        {this.state.docentes.map(elemento => (
                                            <option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>
                                        ))}
                                    </CSelect>
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.peticionPost()}>Agregar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalMiembros: false })}>Cerrar</CButton>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalCronograma}>
                    <ModalHeader style={{ color: '#007a3d' }}>
                        Agregar Cronograma
                    </ModalHeader>
                    <ModalBody>
                        <CForm>
                            <CFormGroup row>
                                <br /><br />
                                <CInput type="file" name="files" accept="application/pdf" multiple onChange={(e) => this.subirArchivos(e.target.files)} required />
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel ><b>Comité: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput class="form-control my-2" name="nombre" type="text" readonly value={this.props.nombre} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Nombre: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput name="nombre" className="form-control my-2" onChange={this.handleChanges} />
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.insertarCronograma()}>Agregar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalCronograma: false })}>Cerrar</CButton>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalEliminar}>
                    <ModalHeader style={{ color: '#007a3d' }}>
                        Eliminar Cronograma
                    </ModalHeader>
                    <ModalBody>
                        <CForm>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel ><b>Comité: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput class="form-control my-2" name="nombre" type="text" readonly value={this.props.nombre} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="select"><b>Cronograma: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CSelect custom name="id" id="select" className="form-control my-2" onChange={this.handleChanges}>
                                        <option value='0'>-- Seleccionar --</option>
                                        {this.state.cronogramas.map(elemento => (
                                            <option key={elemento.id} value={elemento.id}>{elemento.nombre}</option>
                                        ))}
                                    </CSelect>
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.peticionDelete()}>Eliminar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalEliminar: false })}>Cerrar</CButton>
                    </ModalFooter>
                </Modal>
            </>

        )
    }
}

export default Cards