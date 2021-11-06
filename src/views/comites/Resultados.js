import React, { Component } from "react";
import { FcOpenedFolder } from "react-icons/fc";
import axios from 'axios';
import { BsFillTrashFill, BsFileEarmarkText, BsSearch } from 'react-icons/bs';
import { FcPlus } from "react-icons/fc";
import { ModalBody, ModalFooter, ModalHeader, Modal } from 'reactstrap';
import CIcon from '@coreui/icons-react'
import {
    CDataTable,
    CCardBody,
    CContainer,
    CCol,
    CNav,
    CButton,
    CRow,
    CCardHeader,
    CForm,
    CInput,
    CCard,
    CFormGroup,
    CLabel
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';
const fields = ['', 'nombre', 'producto', 'fechaElaboración', 'tamaño', 'tipoArchivo', 'opciones']
let extension;
let tamano;
class Resultados extends Component {

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
            producto: '',
            fechaElaboración: '',
            tamaño: '',
            tipoArchivo: '',
            comite: {
                comi_id: ''
            }
        },
        form: {
            id: '',
            nombre: '',
            producto: '',
            fechaElaboración: '',
            tamaño: '',
            tipoArchivo: '',
            comite: {
                comi_id: '425'
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
        if (!campo["producto"]) {
            formularioValido = false;
            error["producto"] = "Por favor, ingresa el nombre del producto.";
        }

        if (!campo["fechaElaboración"]) {
            formularioValido = false;
            error["fechaElaboración"] = "Por favor, ingresa la Fecha de Elaboración.";
        } else {
            if (fecha <= campo["fechaElaboración"]) {
                formularioValido = false;
                error["fechaElaboración"] = "Por favor, ingresa una fecha anterior a la actual.";
            }
        }

        this.setState({
            error: error
        });

        return formularioValido;
    }

    peticionGet = () => { //Petición para traer los productos por el id del comité
        axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/producto/listarComite/' + this.props.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ tablaData: response.data });
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionDelete = () => { //Petición para eliminar un producto
        axios.delete('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/producto/delete/' + this.state.form.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ modalEliminar: false });
            this.peticionGet();
        })
    }

    peticionPut = () => { //Petición para editar un producto
        axios.put('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/producto/editar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
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
                comite: {
                    comi_id: this.props.id
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

    handleChanges = e => { //Función para capturar lo que se digita en la barra de filtrado
        this.setState({ busqueda: e.target.value });
        this.filtrar(e.target.value)
    }

    filtrar = (terminoBusqueda) => { //Función para filtrar la tabla
        var resultadosBusqueda = this.state.tablaData.filter((elemento) => {
            if (elemento.nombre.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase()) ||
                elemento.producto.toString().toLowerCase().includes(terminoBusqueda.toString().toLowerCase())
            ) {
                return elemento;
            }
        });
        this.setState({ data: resultadosBusqueda });
    }

    seleccionarProducto = (producto) => { //Función para capturar los datos del producto seleccionado
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: producto.id,
                nombre: producto.nombre,
                fechaElaboración: producto.fechaElaboración,
                tipoArchivo: producto.tipoArchivo,
                tamaño: producto.tamaño,
                producto: producto.producto,
                comite: {
                    comi_id: producto.comite.comi_id
                }
            }
        })
    }

    subirArchivos = e => { //Función para capturar el archivo subido por el usuario
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

    insertArchivos = async () => { //Función para guardar un nuevo producto
        if (this.validarFormulario()) {
            await this.setState({
                edicion: {
                    nombre: this.state.form.nombre,
                    fechaElaboración: this.state.form.fechaElaboración,
                    tipoArchivo: this.state.form.tipoArchivo,
                    tamaño: this.state.form.tamaño,
                    producto: this.state.form.producto,
                    comite: {
                        comi_id: this.state.form.comite.comi_id
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

            await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/producto/upload', f, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } })
                .then(response => {
                    this.setState({
                        form: {
                            id: response.data.id,
                            nombre: this.state.edicion.nombre,
                            fechaElaboración: this.state.edicion.fechaElaboración,
                            tipoArchivo: 'Archivo ' + extension,
                            tamaño: tamano + ' KB',
                            producto: this.state.edicion.producto,
                            comite: {
                                comi_id: this.state.edicion.comite.comi_id
                            }
                        }
                    });
                    this.peticionPut();
                }).catch(error => {
                    console.log(error);
                })
        }
    }

    componentDidMount() {
        this.peticionGet();
    }

    render() {
        const { form } = this.state;
        return (
            <div>
                <CContainer >
                    <CRow className="justify-content-center">
                        <CCol>
                            <CCard style={{ width: '100%', textAlign: 'center' }}>
                                <CCardHeader>
                                    <CForm className="form-inline" >
                                        <h2 >< FcOpenedFolder size="50px" /> Productos</h2>
                                        <CCol col="2" className="mb-3 mb-xl-0 text-center" >
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
                                                                href={item.productoUrl} target="_blank">
                                                                <CButton >
                                                                    <BsSearch />
                                                                </CButton>
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <CButton size="lg" onClick={() => { this.seleccionarProducto(item); this.setState({ modalEliminar: true }) }}>
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
                                    <CLabel htmlFor="text-input">Producto</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput name="producto" className="form-control my-2" onChange={this.handleChange} value={form ? form.producto : ''} />
                                    <span style={{ color: "red" }}>{this.state.error["producto"]}</span>
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

                        </CForm>
                    </ModalBody>
                    <ModalFooter>
                        <CButton color="success" onClick={() => this.insertArchivos()}><CIcon name="cil-scrubber" /> Insertar</CButton>
                        <CButton onClick={() => this.modalInsertar()} type="reset" color="warning"><CIcon name="cil-ban" /> Cancelar</CButton>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar el producto {form && form.nombre}
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

export default Resultados;