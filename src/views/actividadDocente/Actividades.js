import React, { Component } from 'react'
import { BsFillPersonFill } from 'react-icons/bs';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormGroup,
  CSelect
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';
import axios from 'axios';
import ListaTabla from './ListaTabla';
const fields1 = ['', 'nombre', 'fecha', 'grupo', 'nucleoTemático', 'tamaño', 'tipoArchivo', 'opciones']
const fields2 = ['', 'nombre', 'fecha', 'grupo', 'nucleoTemático', 'tamaño', 'tipoArchivo', 'opciones']
const fields3 = ['', 'nombre', 'fecha', 'grupo', 'nucleoTemático', 'tamaño', 'tipoArchivo', 'opciones']
const fields4 = ['', 'nombre', 'fecha', 'grupo', 'nucleoTemático', 'tamaño', 'tipoArchivo', 'opciones']
const fields6 = ['', 'nombre', 'fecha', 'tamaño', 'tipoArchivo', 'opciones']
const fields7 = ['', 'nombre', 'fecha', 'semestre', 'nucleoTemático', 'tamaño', 'tipoArchivo', 'opciones']
const fields8 = ['', 'nombre', 'aulaVirtual', 'corte', 'fechaModificacion', 'tipoArchivo', 'tamaño', 'opciones']
const fields9 = ['', 'nombre', 'fechaElaboración', 'periodoAcadémico', 'tamaño', 'tipoArchivo', 'opciones']
class Actividades extends Component {

  state = {
    data: {},
    tablaData: {},
    busqueda: "",
    actividad: true,
    seleccionado: ''
  }

  peticionGetId = () => { //Petición para traer un docente por id
    axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/docente/retornarId/' + this.props.match.params.id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  handleChange = async e => { //Se guarda la actividad seleccionada
    e.persist();
    await this.setState({
      ...this.state.seleccionado,
      seleccionado: e.target.value
    })
  }

  componentDidMount() {
    this.peticionGetId();
  }

  render() {
    let pagina; //Se muestra la pagina de acuerdo a la opción seleccionada 
    switch (this.state.seleccionado) {
      case "Syllabus":
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields1} url='syllabus' />;
        break;
      case 'Acuerdo Formación y Aprendizaje':
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields2} url='acuerdopedagogico' />;
        break;
      case 'Informe Semestral':
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields3} url='informeSemestral' />;
        break;
      case 'Informe Recuperación de Clase':
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields4} url='recuperacionclase' />;
        break;
      case 'Informe de Horas no Lectivas':
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields9} url='informeHoras' />;
        break;
      case 'Informes Salidas Académicas':
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields6} url='informeSalidas' />;
        break;
      case 'Evidencias Aulas virtuales':
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields8} url='evidencia' />;
        break;
      case 'Asesoría Estudiantil':
        pagina = <ListaTabla id={this.props.match.params.id} fields={fields7} url='asesoria' />;
        break;
      default:
        pagina = '';
        break;
    }

    return (
      <>
        <CRow>
          <CCol>
            <CCard style={{ textAlign: 'center' }}>
              <CCardHeader>
                <CForm className="form-inline">
                  <h2 ><BsFillPersonFill size="50px" /> {this.state.data.nombre}</h2>
                  <CCol col="2" className="mb-3 mb-xl-0 text-right">
                    <CFormGroup row>
                      <CCol xs="12" md="9">
                        <CSelect custom name="seleccionado" id="select" onChange={this.handleChange} className="form-control my-2" >
                          <option value=''>-- Actividad --</option>
                          <option value="Syllabus">Syllabus</option>
                          <option value="Acuerdo Formación y Aprendizaje">Acuerdo Formación y Aprendizaje</option>
                          <option value="Informe Semestral">Informe Semestral</option>
                          <option value="Informe Recuperación de Clase">Informe Recuperación de Clase</option>
                          {this.state.actividad ? <option value="Informe de Horas no Lectivas">Informe de Horas no Lectivas</option> : null}
                          <option value="Informes Salidas Académicas">Informes Salidas Académicas</option>
                          <option value="Evidencias Aulas virtuales">Evidencias Aulas virtuales</option>
                          {this.state.actividad ? <option value="Asesoría Estudiantil">Asesoría Estudiantil</option> : null}
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CForm>
              </CCardHeader>
              <CCardBody>
                {pagina}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Actividades