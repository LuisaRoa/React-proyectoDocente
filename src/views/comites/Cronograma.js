import React, { Component } from 'react'
import { FcCalendar, FcInspection } from 'react-icons/fc';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CForm
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';
import axios from 'axios';
class Cronograma extends Component {

    state = {
        data: [],
        tablaData: [],
        busqueda: "",
        crono: true,
        seleccionado: '',
        cronograma: {}
    }

    peticionGet = () => { //Petición para traer todos los cronogramas por el id del comité
        axios.get('http://localhost:8080/cronograma/listarComite/' + this.props.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ tablaData: response.data });
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionGetId = () => { //Petición para traer un cronograma por id
        axios.get('http://localhost:8080/cronograma/retornarId/' + this.state.seleccionado, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ cronograma: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    handleChange = async e => { //Función para capturar el cronograma seleccionado
        e.persist();
        await this.setState({
            ...this.state.seleccionado,
            seleccionado: e.target.value
        })
        this.peticionGetId();
    }

    componentDidMount() {
        this.peticionGet();
    }

    render() {

        return (
            <>
                <CRow>
                    <CCol>
                        <CCard style={{ textAlign: 'center' }}>
                            <CCardHeader>
                                <CForm className="form-inline">
                                    <h2 ><FcCalendar size="50px" /> Cronograma </h2>
                                </CForm>
                            </CCardHeader>
                            <CCardBody>
                                <br />
                                <CRow>
                                    {this.state.data.map(elemento => (
                                        <CCol xs="6" sm="5" md="6">
                                            <CCard>
                                                <CCardBody className="mb-3 mb-xl-0 text-left">
                                                    <a href={elemento.cronogramaUrl} target="_blank"><CButton >
                                                        <h4><FcInspection size="40px" style={{ color: '#0BD824' }} /> {elemento.nombre}</h4>
                                                    </CButton></a>
                                                </CCardBody>
                                            </CCard>
                                        </CCol>
                                    ))}
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        );
    }
}

export default Cronograma