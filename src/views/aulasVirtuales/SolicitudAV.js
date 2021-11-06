import React, { Component } from 'react'
import axios from 'axios';
import swal from 'sweetalert';

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CLabel,
  CSelect
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import UserProfile from '../usuarios/UserProfile';

class SolicitudAV extends Component {

  state = {
    data: [],
    tablaData: [],
    busqueda: "",
    modalInsertar: false,
    modalEliminar: false,
    form: {
      soau_id: '',
      fecha: '',
      estado: 'inactivo',
      grupo: '',
      semestre: '',
      sede: '',
      registradopor: UserProfile.getNombre(),
      fechacambio: '',
      docente: {
        id: UserProfile.getId()
      },
      nucleoTemático: {
        mate_id: ''
      },
      mate: '',
      tipoModal: ''
    },
    error: {},
    campo: {},
    enviado: false,
    materias: []
  }

  mostrarAlerta = () => {
    if (this.validarFormulario()) {
      swal({
        title: "Aviso",
        text: "Solicitud realizada",
        icon: "success",
        button: "Aceptar"
      })
      this.setState({
        form: {
          soau_id: '',
          fecha: '',
          estado: 'inactivo',
          grupo: '',
          semestre: '',
          sede: '',
          registradopor: UserProfile.getNombre(),
          fechacambio: '',
          docente: {
            id: UserProfile.getId()
          },
          nucleoTemático: {
            mate_id: ''
          },
          mate: '',
          tipoModal: ''
        }
      })
    }
  }

  validarFormulario() { //Función para validar los campos del formulario
    let campo = this.state.campo;
    let error = {};
    let formularioValido = true;

    if (!campo["grupo"]) {
      formularioValido = false;
      error["grupo"] = "Por favor, ingresa un Grupo";
    }

    if (!campo["nucleoTemático"]) {
      formularioValido = false;
      error["nucleoTemático"] = "Por favor, ingresa un Nucleo Temático";
    }

    if (!campo["sede"]) {
      formularioValido = false;
      error["sede"] = "Por favor, ingresa la Sede.";
    }

    this.setState({
      error: error
    });

    return formularioValido;
  }

  peticionGetMateria = () => { //Petición para traer todas las materias
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/materia/retornarTodos", { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ materias: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetMateriaId = (id) => { //Petición para traer una materia por id
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/materia/retornarId/" + id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({
        form: {
          ...this.state.form,
          semestre: response.data.semestre
        }

      });

    }).catch(error => {
      console.log(error.message);
    })
  }


  peticionPost = async () => { //Petición para guardar una nueva solicitud de un aula
    if (this.validarFormulario()) {
      // Cambio el estado de 'enviado' a 'true'
      this.setState({ enviado: true });
      await axios.post('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudaulas/guardar', this.state.form, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
        this.mostrarAlerta();
      }).catch(error => {
        console.log(error.message);
      })

    }

  }

  handleChange = async e => { //Función para capturar los datos de una nueva solicitud
    e.persist();
    let fechaHora = new Date();
    let dia = fechaHora.getDate();
    let mes = fechaHora.getMonth() + 1;
    let ano = fechaHora.getFullYear();
    let fecha = dia + '/' + mes + '/' + ano;
    if (e.target.name === "nucleoTemático") {
      this.peticionGetMateriaId(e.target.value);
      await this.setState({
        form: {
          ...this.state.form,
          nucleoTemático: {
            mate_id: e.target.value
          },
          mate: e.target.value,
          fecha: fecha,
          fechacambio: fecha
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

  componentDidMount() {
    this.peticionGetMateria();

  }

  render() {

    const { form } = this.state;
    return (
      <CCol>
        <CCard>
          <CCardHeader>
            <CCol col="2" className="mb-3 mb-xl-0 text-center">
              <h2 >Nueva Solicitud</h2>
            </CCol>
          </CCardHeader>
          <CCardBody>
            <CForm >
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Núcleo Temático</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="nucleoTemático" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.mate : ''}>
                    <option value='0'>-- Seleccionar --</option>
                    {this.state.materias.map(elemento => (
                      <option key={elemento.mate_id} value={elemento.mate_id}>{elemento.codigo}-{elemento.nombre}</option>
                    ))}
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["nucleoTemático"]}</span>
                </CCol>
              </CFormGroup>
              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="text-input">Grupo</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CInput type="text" name="grupo" className="form-control my-2" onChange={this.handleChange} />
                  <span style={{ color: "red" }}>{this.state.error["grupo"]}</span>
                </CCol>
              </CFormGroup>

              <CFormGroup row>
                <CCol md="3">
                  <CLabel htmlFor="select">Sede</CLabel>
                </CCol>
                <CCol xs="12" md="9">
                  <CSelect custom name="sede" id="select" className="form-control my-2" onChange={this.handleChange} value={form ? form.sede : ''}>
                    <option value="0">-- Seleccionar --</option>
                    <option value="Fusagasugá">Fusagasugá</option>
                    <option value="Girardot">Girardot</option>
                    <option value="Ubaté">Ubaté</option>
                    <option value="Chía">Chía</option>
                    <option value="Chocontá">Chocontá</option>
                    <option value="Facatativá">Facatativá</option>
                    <option value="Soacha">Soacha</option>
                    <option value="Zipaquirá">Zipaquirá</option>
                  </CSelect>
                  <span style={{ color: "red" }}>{this.state.error["sede"]}</span>
                </CCol>
              </CFormGroup>

              <CButton color="success" onClick={() => this.peticionPost()} type="reset"><CIcon name="cil-scrubber" /> Solicitar</CButton>
              <CButton type="reset" color="warning"><CIcon name="cil-ban" /> Cancelar</CButton>
            </CForm>
          </CCardBody>
          <CCardFooter>

          </CCardFooter>
        </CCard>
      </CCol>
    );
  }
}
export default SolicitudAV