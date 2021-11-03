import React, { Component } from "react";
import { FcFolder } from "react-icons/fc";
import axios from 'axios';
import { withRouter } from "react-router-dom";
import {
    CCard,
    CCardBody,
    CContainer,
    CCol,
    CButton,
    CRow,
    CCardHeader
} from '@coreui/react'
import Actas from "./Actas";
import Resultados from "./Resultados";
import UserProfile from '../usuarios/UserProfile';
import Cronograma from "./Cronograma";

class Acciones extends Component {

    state = {
        data: [],
        tablaData: [],
        nombre: '',
        estado: true,
        seleccionado: ''
    }

    peticionGetId = (id) => { //Petición para traer los comités por id
        axios.get('http://localhost:8080/comite/retornarId/' + id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ nombre: response.data.nombre });
            this.setState({ tablaData: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.peticionGetId(id);
    }
    render() {
        let pagina;
        switch (this.state.seleccionado) {
            case "Actas":
                pagina = <Actas id={this.props.match.params.id} />;
                console.log('case1');
                break;
            case 'Productos':
                pagina = <Resultados id={this.props.match.params.id} />;
                break;
            case 'Plan de Trabajo':
                pagina = <Cronograma id={this.props.match.params.id} />;
                break;
            default:
                pagina = '';
                break;
        }
        return (
            <CContainer >
                <CRow className="justify-content-center">
                    <CCard style={{ height: '90%', width: '100%' }}>
                        <CCardHeader style={{ backgroundColor: '#007a3d', width: '100%' }}>
                            <br />
                            <h3 color="#007a3d">{this.state.nombre}</h3>
                        </CCardHeader>
                        <CCardBody >
                            <br />
                            {this.state.estado ? <CRow>
                                <CCol xs="6" sm="5" md="6">
                                    <CCard>
                                        <CCardBody>
                                            <CButton onClick={() => this.setState({ seleccionado: 'Actas', estado: false })}>
                                                <h4><FcFolder size="40px" style={{ color: '#0BD824' }} /> Actas</h4>
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                <CCol xs="6" sm="5" md="6">
                                    <CCard>
                                        <CCardBody>
                                            <CButton onClick={() => this.setState({ seleccionado: 'Productos', estado: false })}>
                                                <h4><FcFolder size="40px" style={{ color: '#0BD824' }} /> Productos</h4>
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                <CCol xs="6" sm="5" md="6">
                                    <CCard>
                                        <CCardBody>
                                            <CButton onClick={() => this.setState({ seleccionado: 'Plan de Trabajo', estado: false })}>
                                                <h4><FcFolder size="40px" style={{ color: '#0BD824' }} /> Plan de Trabajo</h4>
                                            </CButton>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow> : pagina}
                        </CCardBody>
                    </CCard>
                </CRow>
            </CContainer>
        );
    }

}

export default withRouter(Acciones);