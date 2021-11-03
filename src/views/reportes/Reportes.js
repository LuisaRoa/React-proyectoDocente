import React, { Component } from 'react'
import { FcBullish } from 'react-icons/fc';
import {
    CInputRadio,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CButton,
    CRow,
    CForm,
    CFormGroup,
    CInput,
    CLabel,
    CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Grafica from './Grafica';

let pagina = null;
class Reportes extends Component {

    state = {
        data: {},
        tablaData: {},
        busqueda: "",
        actividad: true,
        seleccionado: '',
        año: '',
        periodo: '',
        mostrar: '',
        error: {},
        campo: {},
        enviado: false
    }

    validarFormulario() { //Función para validar los campos solicitados
        let campo = this.state.campo;
        let error = {};
        let formularioValido = true;

        if (!campo["año"]) {
            formularioValido = false;
            error["año"] = "Por favor, ingresa el Año.";
        }

        this.setState({
            error: error
        });

        return formularioValido;
    }

    pagina = async () => { // Función para determinar los reportes a mostrar
        if (this.validarFormulario()) {
            this.setState({ mostrar: true })
            switch (this.state.seleccionado) {
                case "Syllabus":
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='syllabus' titulo='syllabus' />;
                    break;
                case 'Acuerdo Formación y Aprendizaje':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='acuerdopedagogico' titulo='acuerdos pedagógicos' />;
                    break;
                case 'Informe Semestral':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='informeSemestral' titulo='informes semestrales' />;
                    break;
                case 'Informe Recuperación de Clase':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='recuperacionclase' titulo='informes de recuperación de clase' />;
                    break;
                case 'Informe de Horas no Lectivas':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='informeHoras' titulo='informes de horas no lectivas' />;
                    break;
                case 'Comités':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='comité' titulo='comités' />;
                    break;
                case 'Informes Salidas Académicas':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='informeSalidas' titulo='informes de salidas académicas' />;
                    break;
                case 'Evidencias Aulas virtuales':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='evidencia' titulo='evidencias' />;
                    break;
                case 'Asesoría Estudiantil':
                    pagina = <Grafica periodo={this.state.periodo} año={this.state.año} actividad='asesoria' titulo='asesorias' />;
                    break;
                default:
                    pagina = '';
                    this.setState({ mostrar: '' })
                    break;
            }
        }
    }

    handleChange = async e => { // Función para obtener la opción seleccionada
        e.persist();
        await this.setState({
            seleccionado: e.target.value,
        })
    }

    handleChanges = async e => { // Función para obtener las opciones de busqueda
        e.persist();
        await this.setState({
            [e.target.name]: e.target.value
        })
        let campo = this.state.campo;
        campo[e.target.name] = e.target.value;

        // Cambio de estado de campo 
        this.setState({
            campo
        });

    }

    render() {
        return (
            <>
                <CRow>
                    <CCol>
                        <CCard style={{ textAlign: 'center' }}>
                            <CCardHeader>
                                <CForm className="form-inline">
                                    <h2 ><FcBullish size="50px" /> Reportes</h2>
                                    <CCol col="2" className="mb-3 mb-xl-0 text-right">
                                        <CFormGroup row>
                                            <CCol xs="12" md="9">
                                                <CSelect custom name="seleccionado" id="select" onChange={this.handleChange} className="form-control my-2" >
                                                    <option value=''>-- Actividad --</option>
                                                    <option value="Acuerdo Formación y Aprendizaje">Acuerdo Formación y Aprendizaje</option>
                                                    <option value="Syllabus">Syllabus</option>
                                                    <option value="Informe Semestral">Informe Semestral</option>
                                                    <option value="Informe de Horas no Lectivas">Informe de Horas no Lectivas</option>
                                                    <option value="Comités">Comités</option>
                                                    <option value="Informe Recuperación de Clase">Informe Recuperación de Clase</option>
                                                    <option value="Informes Salidas Académicas">Informes Salidas Académicas</option>
                                                    <option value="Evidencias Aulas virtuales">Evidencias Aulas virtuales</option>
                                                    <option value="Asesoría Estudiantil">Asesoría Estudiantil</option>
                                                </CSelect>
                                                <br />
                                                <CFormGroup variant="custom-radio" inline>
                                                    {this.state.seleccionado ? <CInput placeholder="Año" name="año" className="form-control my-2" onChange={this.handleChanges} /> : null}
                                                    <span style={{ color: "red" }}>{this.state.error["año"]}</span>
                                                </CFormGroup>
                                                <CFormGroup variant="custom-radio" inline>
                                                    {this.state.seleccionado ? <CInputRadio custom id="inline-radio1" name="periodo" value="1" onChange={this.handleChanges} /> : null}
                                                    {this.state.seleccionado ? <CLabel variant="custom-checkbox" htmlFor="inline-radio1" >I Semestre</CLabel> : null}
                                                </CFormGroup>
                                                <CFormGroup variant="custom-radio" inline>
                                                    {this.state.seleccionado ? <CInputRadio custom id="inline-radio2" name="periodo" value="2" onChange={this.handleChanges} /> : null}
                                                    {this.state.seleccionado ? <CLabel variant="custom-checkbox" htmlFor="inline-radio2" >II Semestre</CLabel> : null}
                                                </CFormGroup>
                                                <CFormGroup variant="custom-radio" inline>
                                                    {this.state.seleccionado ? <CInputRadio custom id="inline-radio3" name="periodo" value="Mensual" onChange={this.handleChanges} /> : null}
                                                    {this.state.seleccionado ? <CLabel variant="custom-checkbox" htmlFor="inline-radio3" >Mensual</CLabel> : null}
                                                </CFormGroup>
                                                <CFormGroup variant="custom-checkbox" inline>
                                                    {this.state.seleccionado ? <CButton color="success" onClick={() => this.pagina()}><CIcon name="cil-scrubber" /> Generar</CButton> : null}
                                                </CFormGroup>
                                            </CCol>
                                        </CFormGroup>
                                    </CCol>
                                </CForm>
                            </CCardHeader>
                            <CCardBody>
                                {this.state.mostrar ? pagina : null}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        );
    }
}

export default Reportes;