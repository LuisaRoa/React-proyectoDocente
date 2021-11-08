import React, { Component } from 'react'
import axios from 'axios';
import { FcLock, FcOk } from "react-icons/fc";
import { BsPencil } from "react-icons/bs";
import swal from 'sweetalert';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
    CImg,
    CCard,
    CCardBody,
    CLabel,
    CFormGroup,
    CCol,
    CRow,
    CInput,
    CButton,
    CForm
} from '@coreui/react'
import UserProfile from './UserProfile';
let rol;
class Perfil extends Component {

    state = {
        data: [],
        tablaData: [],
        form: {
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
            fotoUrl: '',
            password: ''
        },
        boolean: false,
        passwordActual: '',
        passwordNuevo: '',
        passwordNuevo2: '',
        archivos: (null),
        filepreview: null,
        modalFoto: false,
        modalPassword: false,
        error: {},
        campo: {},
        enviado: false
    }

    mostrarAlerta = () => { //Función para mostrar una alerta de confirmación
        if (this.validarFormulario()) {
            swal({
                title: "Aviso",
                text: "Contraseña Actualizada",
                icon: "success",
                button: "Aceptar"
            })
        }
    }

    validarFormulario() { //Función para validar los campos del formulario
        let campo = this.state.campo;
        let error = {};
        let formularioValido = true;

        if (!campo["passwordActual"]) {
            formularioValido = false;
            error["passwordActual"] = "Por favor, ingresa la contraseña actual";
        }

        if (this.state.boolean!= true) {
            formularioValido = false;
            error["passwordActual"] = "Contraseña Actual incorrecta";
        }

        if (!campo["passwordNuevo"]) {
            formularioValido = false;
            error["passwordNuevo"] = "Por favor, ingresa la contraseña nueva";
        }else{
            if (campo["passwordNuevo"].length < 8) {
                formularioValido = false;
                error["passwordNuevo"] = "La contraseña debe contener al menos 8 caracteres";
            }else{
                if (campo["passwordNuevo"].match(/[A-z]/)) {
                    if (campo["passwordNuevo"].match(/\d/)) {
        
                    } else {
                        formularioValido = false;
                        error["passwordNuevo"] = "La contraseña debe contener al menos un número";
                    }
                } else {
                    formularioValido = false;
                    error["passwordNuevo"] = "La contraseña debe contener al menos una letra";
                }
            }
        }
        if (!campo["passwordNuevo2"]) {
            formularioValido = false;
            error["passwordNuevo2"] = "Por favor, ingresa la contraseña nuevamente";
        }

        if (campo["passwordNuevo2"] != campo["passwordNuevo"]) {
            formularioValido = false;
            error["passwordNuevo2"] = "Las contraseñas no coinciden";
        }

        this.setState({
            error: error
        });

        return formularioValido;
    }

    peticionGetPassword = () => { //Petición para buscar el password actual
        if (UserProfile.getRol() === 'Administrativo') {
            rol = "administrativo";
        } else {
            rol = "docente";
        }
        axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/" + rol + "/buscarPassword/" + UserProfile.getId()+"/"+ this.state.passwordActual, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({boolean: true});
        }).catch(error => {
            this.setState({boolean: false});
        })
    }

    peticionGet = () => { //Petición para traer los datos de un usuario por id
        if (UserProfile.getRol() === 'Administrativo') {
            rol = "administrativo";
        } else {
            rol = "docente";
        }
        axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/" + rol + "/retornarId/" + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({
                form: {
                    ...this.state.form,
                    nombre: response.data.nombre,
                    documento: response.data.documento,
                    correo: response.data.correo,
                    fechaNacimiento: response.data.fechaNacimiento,
                    direccion: response.data.direccion,
                    sede: response.data.sede,
                    fotoUrl: response.data.fotoUrl,
                    password: response.data.password
                }
            })
        }).catch(error => {
            console.log(error.message);
        })
    }

    subirArchivos = e => { //Función para obtener la foto cargada
        this.setState({ archivos: e });
        this.setState({ filepreview: URL.createObjectURL(e[0]) });
    }

    actualizarPassword = () => { //Petición para actualizar o modificar el password del usuario
        if (this.validarFormulario()) {
            axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/' + rol + '/cambiarPassword/' + UserProfile.getId() + '/' + this.state.passwordNuevo, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
                this.setState({ modalPassword: false });
                this.mostrarAlerta();
                this.peticionGet();
            })
        }
    }

    insertArchivos = async () => { //Función para actualizar la fot de perfil de un usuario
        const f = new FormData();
        for (let index = 0; index < this.state.archivos.length; index++) {
            f.append("multipartFile", this.state.archivos[index]);
        }
        axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/' + rol + '/upload/' + UserProfile.getId(), f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
            .then(response => {
                this.setState({ modalFoto: false, filepreview: null });
                this.peticionGet();
                localStorage.setItem("foto", response.data);
            })

    }

    handleChange = async e => { //Función para obtener los datos de contraseña
        e.persist();
        await this.setState({
            [e.target.name]: e.target.value,
        });
        let campo = this.state.campo;
        campo[e.target.name] = e.target.value;

        // Cambio de estado de campo 
        this.setState({
            campo
        });
    }

    componentDidMount() {
        this.peticionGet();
    }

    render() {
        return (
            <>
                <CRow className="justify-content-center">
                    <CCard style={{ width: '70%', height: '90%' }}>
                        <CCardBody>
                            <CCol className="mb-3 mb-xl-0 text-center">
                                <h2 >{this.state.form.nombre}</h2>
                            </CCol>
                            <br /> <br /> <br />
                            <CCol className="mb-3 mb-xl-0 text-center">
                                <div className="c-avatar">
                                    <CImg
                                        src={this.state.form.fotoUrl ? this.state.form.fotoUrl : 'avatars/9.jpg'}
                                        style={{ width: '450%', height: '450%' }}
                                        alt="admin@bootstrapmaster.com"
                                    />
                                </div>
                                <br />
                                <CButton onClick={() => this.setState({ modalFoto: true })} variant="ghost" size="lg">Cambiar Foto  <BsPencil size="20px" /></CButton>
                            </CCol>
                            <CRow>
                                <CCol xs="6">
                                    <CForm>
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel htmlFor="text-input"><b>Documento: </b></CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <CLabel htmlFor="text-input">{this.state.form.documento}</CLabel>
                                            </CCol>
                                        </CFormGroup>
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel ><b>Correo Electrónico: </b></CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <CLabel >{this.state.form.correo}</CLabel>
                                            </CCol>
                                        </CFormGroup>
                                        <CFormGroup row>
                                            <CCol md="3">
                                                <CLabel htmlFor="text-input"><b>Fecha Nacimiento: </b></CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <CLabel htmlFor="text-input">{this.state.form.fechaNacimiento}</CLabel>
                                            </CCol>
                                        </CFormGroup>
                                        <CFormGroup row >
                                            <CCol md="3">
                                                <CLabel htmlFor="text-input"><b>Sede: </b></CLabel>
                                            </CCol>
                                            <CCol xs="12" md="9">
                                                <CLabel htmlFor="text-input">{this.state.form.sede}</CLabel>
                                            </CCol>
                                        </CFormGroup>
                                    </CForm>
                                </CCol>
                                <CCol xs="5" className="text-right">
                                    <br /><br /><br /><br /><br /><br />
                                    <CButton onClick={() => this.setState({ modalPassword: true })} variant="ghost" size="lg"><FcLock size="60px" /><br />Cambiar Contraseña</CButton>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CRow>
                <Modal isOpen={this.state.modalFoto}>
                    <ModalHeader>
                    </ModalHeader>
                    <ModalBody>
                        <CForm encType="multipart/form-data" noValidat>
                            <CFormGroup row>
                                <br /><br />
                                <CInput type="file" name="files" accept="application/jpg, application/png" multiple onChange={(e) => this.subirArchivos(e.target.files)} />
                                <br /><br /><br /><br /><br />
                                <div className="c-avatar">
                                    <CImg className="img-preview"
                                        src={this.state.filepreview}
                                        style={{ maxWidth: '100px' }}
                                    />
                                </div>
                                <br /><br /><br />
                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.insertArchivos()}>Actualizar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalFoto: false, filepreview: null })}>Cerrar</CButton>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalPassword}>
                    <ModalHeader>
                    </ModalHeader>
                    <ModalBody>
                        <CForm>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Contraseña Actual: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput type="password" autoComplete="current-password" name="passwordActual" onChange={this.handleChange} />
                                    <span style={{ color: "red" }}>{this.state.error["passwordActual"]}</span>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Nueva Contraseña: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput type="password" autoComplete="current-password" name="passwordNuevo" onChange={this.handleChange} />
                                    <span style={{ color: "red" }}>{this.state.error["passwordNuevo"]}</span>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CCol md="3">
                                    <CLabel htmlFor="text-input"><b>Repetir contraseña: </b></CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput type="password" autoComplete="current-password" name="passwordNuevo2" onChange={this.handleChange} />
                                    <span style={{ color: "red" }}>{this.state.error["passwordNuevo2"]}</span>
                                </CCol>
                            </CFormGroup>
                            <CFormGroup row>
                                <CLabel htmlFor="text-input"><b>Tu contraseña debe contener: </b></CLabel>

                                <p><FcOk /> Al menos 8 caracteres</p>
                                <p><FcOk /> Al menos una letra</p>
                                <p><FcOk /> Al menos un número</p>

                            </CFormGroup>
                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => {this.peticionGetPassword();this.actualizarPassword()}}>Guardar</CButton>
                        <CButton color="warning" onClick={() => this.setState({ modalPassword: false })}>Cancelar</CButton>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}
export default Perfil