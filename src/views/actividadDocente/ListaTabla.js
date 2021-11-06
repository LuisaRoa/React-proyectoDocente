import React, { Component } from 'react'
import { BsFileEarmarkText, BsSearch, BsPlusCircle } from 'react-icons/bs';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
    CButton,
    CCol,
    CDataTable,
    CForm,
    CFormGroup,
    CInput,
    CLabel
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';
import axios from 'axios';
import swal from 'sweetalert';

class ListaTabla extends Component {

    state = {
        data: [],
        tablaData: [],
        url: '',
        modalNotificacion: false,
        info: {
            docente: {
                id: '',
                nombre: ''
            },
            nombre: ''
        },
        notification: {
            noti_observacion: '',
            noti_actividad: '',
            docente: {
                id: ''
            },
            fecha: '',
            noti_nombreArchivo: ''
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

    peticionGet = () => { //Petición para traer todos los datos por docente de la actividad seleccionada
        var i;
        axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/' + this.props.url + '/listarDocente/' + this.props.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            console.log(response.data);
            this.setState({ tablaData: response.data });
            if ((this.props.url != 'asesoria') && (this.props.url != 'evidencia')) {
                for (i = 0; i <= this.state.tablaData.length; i++) {
                    this.setState({ data: response.data });
                    this.state.data[i].nucleoTemático = this.state.tablaData[i].nucleoTemático.nombre;
                }
            } else {
                if (this.props.url === 'evidencia') {
                    for (i = 0; i <= this.state.tablaData.length; i++) {
                        this.setState({ data: response.data });
                        this.state.data[i].aulaVirtual = this.state.tablaData[i].aulaVirtual.nombre;
                    }
                    this.setState({info: this.state.tablaData[i].aulaVirtual.docente.nombre})
                } else {
                    this.setState({ data: response.data });
                }
            }

        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => { //Petición para guardar una nueva notificación
        await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/notificacion/guardar', this.state.notification, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ modalNotificacion: false });
            this.mostrarAlerta('Observación enviada');
            this.peticionGet();
        }).catch(error => {
            console.log(error.message);
        })
    }

    handleChange = async e => { //Función para guardar los datos de una nueva notificación
        e.persist();
        let fechaHora = new Date();
        let dia = fechaHora.getDate();
        let mes = fechaHora.getMonth() + 1;
        let ano = fechaHora.getFullYear();
        let fecha = dia + '/' + mes + '/' + ano;
        await this.setState({
            notification: {
                ...this.state.notification,
                [e.target.name]: e.target.value,
                docente: {
                    id: this.state.info.docente.id
                },
                noti_actividad: this.props.url[0].toUpperCase() + this.props.url.slice(1),
                fecha: fecha,
                noti_nombreArchivo: this.state.info.nombre
            }
        });
    }

    seleccionar = (item) => { 
        if(this.props.url==='evidencia'){
            this.setState({
                info: {
                    docente: {
                        id: this.props.id
                    },
                    nombre: item.nombre
                }
            })
        }else{
            this.setState({
                info: {
                    docente: {
                        id: item.docente.id,
                        nombre: item.docente.nombre
                    },
                    nombre: item.nombre
                }
            })
        }
        
        return item;
    }

    componentDidMount() {
        this.peticionGet();
    }
    render() {
        if (this.props.url != this.state.url) {
            this.setState({ url: this.props.url });
            this.peticionGet();
        } else {

        }
        return (
            <div>
                <CDataTable
                    items={this.state.data}
                    fields={this.props.fields}
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
                                        <CButton size="lg" >
                                            <BsPlusCircle onClick={() => { this.seleccionar(item); this.setState({ modalNotificacion: true }) }} />
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
                <Modal isOpen={this.state.modalNotificacion}>
                    <ModalHeader style={{ color: '#007a3d' }}>
                        Agregar Observación
                    </ModalHeader>
                    <ModalBody>
                        <CForm>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel ><b>Nombre: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput class="form-control my-2" name="noti_actividad" type="text" readonly value={this.state.info.nombre} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Docente: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput class="form-control my-2" name="docente" type="text" readonly value={this.state.info.docente.nombre} />
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Observación: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <textarea class="form-control" name="noti_observacion" rows="3" onChange={this.handleChange} />
                                </CCol>
                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.peticionPost()}>Guardar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalNotificacion: false })}>Cancelar</CButton>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default ListaTabla