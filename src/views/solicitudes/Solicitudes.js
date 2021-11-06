import React, { Component } from 'react'
import { BsSearch } from 'react-icons/bs';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CButton,
    CLabel,
    CForm,
    CFormGroup
} from '@coreui/react'
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import UserProfile from '../usuarios/UserProfile';
import swal from 'sweetalert';
const fields = ['nucleoTemático', 'fecha', 'grupo', 'semestre', 'sede', 'opciones']
const fields1 = ['nombre', 'fechaInicio', 'fechaTerminación', 'tipoSalida', 'opciones']
class Solicitudes extends Component {
    state = {
        data: [],
        tablaData: [],
        salidas: [],
        tablaSalidas: [],
        modalSolicitud: false,
        modalSalidas: false,
        aula: {
            soau_id: '',
            nucleoTemático: {
                mate_id: '',
                nombre: ''
            },
            fecha: '',
            grupo: '',
            semestre: '',
            sede: '',
            docente: {
                id: '',
                nombre: ''
            },
            estado: '',
            registradopor: '',
            fechacambio: ''
        },
        aulaVirtual: {
            auvi_id: '',
            nombre: '',
            materia: {
                mate_id: ''
            },
            fechacambio: '',
            grupo: '',
            semestre: '',
            sede: '',
            docente: {
                id: ''
            },
            registradopor: '',
            fechacambio: ''
        },
        aulaId: [],
        salida: {
            sosa_id: '',
            fechaSolicitud: '',
            estado: '',
            semestre: '',
            registradoPor: '',
            fechaCambio: '',
            fechaInicio: '',
            fechaTerminación: '',
            nombre: '',
            tipoSalida: '',
            noEstudiantes: '',
            tematica: '',
            docente: {
                id: '',
                nombre: ''
            },
            programaacademico: {
                prac_id: '',
                nombre: ''
            },
            materiaSalida: []
        }
    }

    mostrarAlerta = (texto) => {
        swal({
            title: "Aviso",
            text: texto,
            icon: "success",
            button: "Aceptar"
        })
    }

    peticionGet = () => { //Petición para traer todas las solicitudes de aulas por el id del administrativo
        var i;
        axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudaulas/retornarAdministrativo/' + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ tablaData: response.data });
            for (i = 0; i <= this.state.tablaData.length; i++) {
                this.setState({ data: response.data });
                this.state.data[i].nucleoTemático = this.state.tablaData[i].nucleoTemático.nombre;
            }

        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGetId = (id) => { //Petición para traer una solicitud de aula por id
        axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudaulas/retornarId/" + id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ aulaId: response.data });
            this.setState({
                aula: {
                    ...this.state.aula,
                    nucleoTemático: {
                        mate_id: response.data.nucleoTemático.mate_id,
                        nombre: response.data.nucleoTemático.nombre
                    },
                    estado: 'activo'
                },
                aulaVirtual: {
                    ...this.state.aulaVirtual,
                    materia: {
                        mate_id: response.data.nucleoTemático.mate_id
                    }
                }

            });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGetIdSalida = () => { //Petición para traer todas las solicitudes de salidas academicas 
        axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudsalida/retornarTodos", { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({
                salida: {
                    ...this.state.salida,
                    estado: 'Aprobado'
                }

            });
        }).catch(error => {
            console.log(error.message);
        })
    }

    aprobarAula = () => { //Función para aprobar una solicitud de aula virtual
        this.peticionGetId(this.state.aula.soau_id);
        axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudaulas/editar', this.state.aula, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ modalSolicitud: false });
            this.mostrarAlerta('Aula virtual aprobada');
            this.peticionGet();
            this.peticionPost();
        })

    }

    peticionPost = async () => { //Función para guardar un aula virtual
        await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/aulasvirtuales/guardar', this.state.aulaVirtual, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
        }).catch(error => {
            console.log(error.message);
        })
    }

    aprobarSalida = () => { //Función para aprobar una solicitud academica
        axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudsalida/editar', this.state.salida, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ modalSalidas: false });
            this.mostrarAlerta('Salida academica aprobada');
            this.peticionGetSalida();
        })
    }

    peticionGetSalida = () => { //Función para traer una solicitud de salida academica por el id del administrativo
        axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudsalida/retornarAdministrativo/" + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ salidas: response.data });
            this.setState({ tablaSalidas: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }
    componentDidMount() {
        this.peticionGet();
        this.peticionGetSalida();
    }

    seleccionarAula = (item) => { //Función para capturar los datos de solicitud de aula seleccionada
        this.peticionGetId(item.soau_id);
        this.setState({
            aula: {
                ...this.state.aula,
                soau_id: item.soau_id,
                fecha: item.fecha,
                grupo: item.grupo,
                semestre: item.semestre,
                sede: item.sede,
                docente: {
                    id: item.docente.id,
                    nombre: item.docente.nombre
                },
                estado: item.estado,
                registradopor: item.registradopor,
                fechacambio: item.fechacambio
            },
            aulaVirtual: {
                nombre: item.nucleoTemático,
                grupo: item.grupo,
                semestre: item.semestre,
                sede: item.sede,
                docente: {
                    id: item.docente.id
                },
                registradopor: item.registradopor,
                fechacambio: item.fechacambio
            }
        });

    }

    seleccionarSalida = (item) => { //Función para obtener los datos de la solicitud de salida seleccionada
        this.peticionGetIdSalida();
        this.setState({
            salida: {
                ...this.state.salida,
                sosa_id: item.sosa_id,
                fechaSolicitud: item.fechaSolicitud,
                semestre: item.semestre,
                registradoPor: item.registradoPor,
                fechaCambio: item.fechaCambio,
                fechaInicio: item.fechaInicio,
                fechaTerminación: item.fechaTerminación,
                nombre: item.nombre,
                tipoSalida: item.tipoSalida,
                noEstudiantes: item.noEstudiantes,
                tematica: item.tematica,
                docente: {
                    id: item.docente.id,
                    nombre: item.docente.nombre
                },
                programaacademico: {
                    prac_id: item.programaacademico.prac_id,
                    nombre: item.programaacademico.nombre
                },
                materiaSalida: item.materiaSalida
            }
        })

    }

    render() {
        return (
            <>
                <CRow>
                    <CCol xs="12" lg="6">
                        <CCard>
                            <CCardHeader>
                                Aulas Virtuales
                            </CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    items={this.state.data}
                                    fields={fields}
                                    itemsPerPage={5}
                                    pagination
                                    scopedSlots={{
                                        'opciones':
                                            (item) => (
                                                <tr>
                                                    <td>
                                                        <CButton onClick={() => { this.seleccionarAula(item); this.setState({ modalSolicitud: true }) }}>
                                                            <BsSearch />
                                                        </CButton>

                                                    </td>
                                                </tr>
                                            )

                                    }}
                                />
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol xs="12" lg="6">
                        <CCard>
                            <CCardHeader>
                                Salidas Académicas
                            </CCardHeader>
                            <CCardBody>
                                <CDataTable
                                    items={this.state.salidas}
                                    fields={fields1}
                                    itemsPerPage={5}
                                    pagination
                                    scopedSlots={{
                                        'opciones':
                                            (item) => (
                                                <tr>
                                                    <td>
                                                        <CButton onClick={() => { this.seleccionarSalida(item); this.setState({ modalSalidas: true }) }}>
                                                            <BsSearch />
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
                <Modal isOpen={this.state.modalSolicitud}>
                    <ModalHeader style={{ color: '#007a3d' }}>
                        Solicitud Aula Virtual
                    </ModalHeader>
                    <ModalBody>
                        <CForm>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel ><b>Núcleo Temático: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel >{this.state.aula.nucleoTemático.nombre}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Fecha: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.aula.fecha}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Grupo: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.aula.grupo}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Semestre: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.aula.semestre}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Sede: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.aula.sede}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Docente: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.aula.docente.nombre}</CLabel>
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.aprobarAula()}>Aprobar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalSolicitud: false })}>Cerrar</CButton>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalSalidas}>
                    <ModalHeader style={{ color: '#007a3d' }}>
                        Solicitud Salida Académica
                    </ModalHeader>
                    <ModalBody>
                        <CForm>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel ><b>Nombre Salida: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel >{this.state.salida.nombre}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Fecha Inicio: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.fechaInicio}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Fecha Terminación: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.fechaTerminación}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Número de Estudiantes: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.noEstudiantes}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Temática: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.tematica}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Tipo de Salida: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.tipoSalida}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Semestre: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.semestre}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Docente: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.docente.nombre}</CLabel>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Programa Académico: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CLabel htmlFor="text-input">{this.state.salida.programaacademico.nombre}</CLabel>
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.aprobarSalida()}>Aprobar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalSalidas: false })}>Cerrar</CButton>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}


export default Solicitudes