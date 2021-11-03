import React, { Component} from 'react'
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
    CSelect,
    CInputCheckbox
  } from '@coreui/react'
  import UserProfile from '../usuarios/UserProfile';
  import CIcon from '@coreui/icons-react';

  let materia = []
class SolicitudSA extends Component {
  
  state={
    data:[],
    tablaData:[],
    busqueda:"",
    modalInsertar: false,
    modalEliminar: false,
    form:{
      sosa_id:'',
      fechaSolicitud:'',
      estado: 'No aprobado',
      semestre: '',
      registradoPor: UserProfile.getNombre(),
      fechaCambio: '',
      fechaInicio: '',
      fechaTerminación: '',
      nombre: '',
      tipoSalida: '',
      noEstudiantes: '',
      tematica: '',
      docente: {
        id: UserProfile.getId()
      },
      programaacademico: {
        prac_id: ''
      },
      progra: '',
      materiaSalida: [],
      tipoModal: ''
    },
    materia: {
      materia: {
        mate_id: ''
      }
    },
    error: {},
    campo: {},
    enviado: false,
    materias:[],
    programa: []
  }

  mostrarAlerta=()=>{
    if (this.validarFormulario()) {
      swal({
        title: "Aviso",
        text: "Solicitud realizada",
        icon : "success",
        button: "Aceptar"
      })
      this.setState({form:{
        sosa_id:'',
        fechaSolicitud:'',
        estado: 'No aprobado',
        semestre: '',
        registradoPor: UserProfile.getNombre(),
        fechaCambio: '',
        fechaInicio: '',
        fechaTerminación: '',
        nombre: '',
        tipoSalida: '',
        noEstudiantes: '',
        tematica: '',
        docente: {
          id: UserProfile.getId()
        },
        programaacademico: {
          prac_id: ''
        },
        progra: '',
        materiaSalida: [],
        tipoModal: ''
      }})
    }
  }

  validarFormulario(){
    let campo = this.state.campo;
    let error = {};
    let formularioValido = true;

    if (!campo["programaacademico"]) {
      formularioValido = false;
      error["programaacademico"] = "Por favor, ingresa el Programa Académico";
    }

    if (!campo["fechaInicio"]) {
      formularioValido = false;
      error["fechaInicio"] = "Por favor, ingresa la Fecha de inicio";
    }

    if (!campo["fechaTerminación"]) {
      formularioValido = false;
      error["fechaTerminación"] = "Por favor, ingresa la Fecha de terminación";
    }else{
        if(campo["fechaTerminación"]<=campo["fechaInicio"]){
          formularioValido = false;
          error["fechaTerminación"] = "Por favor, ingresa una fecha posterior a la fecha de inicio.";
        }
    }

    if (!campo["semestre"]) {
      formularioValido = false;
      error["semestre"] = "Por favor, ingresa el Semestre.";
    }

    if (!campo["nombre"]) {
      formularioValido = false;
      error["nombre"] = "Por favor, ingresa el Nombre de la salida.";
    }

    if (!campo["tipoSalida"]) {
      formularioValido = false;
      error["tipoSalida"] = "Por favor, ingresa el Tipo de la salida.";
    }

    if (!campo["noEstudiantes"]) {
      formularioValido = false;
      error["noEstudiantes"] = "Por favor, ingresa el Número de estudiantes.";
    }else{
      if (!Number(campo["noEstudiantes"])) {
        formularioValido = false;
        error["noEstudiantes"] = "Por favor, ingresa un número válido.";
        }
    }

    if (!campo["tematica"]) {
      formularioValido = false;
      error["tematica"] = "Por favor, ingresa la Temática.";
    }

    this.setState({
      error: error
    });

    return formularioValido;
  }

  peticionGetMateria=()=>{
    axios.get("http://localhost:8080/materia/retornarTodos",{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response=>{
      this.setState({materias: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionGetPrograma=()=>{
    axios.get("http://localhost:8080/programaacademico/retornarTodos",{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response=>{
      this.setState({programa: response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }


  peticionPost=async()=>{
    if (this.validarFormulario()) {            
      // Cambio el estado de 'enviado' a 'true'
        this.setState({enviado: true});
        await axios.post('http://localhost:8080/solicitudsalida/guardar',this.state.form,{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response=>{  
          this.mostrarAlerta();
      }).catch(error=>{
          console.log(error.message);
        })  
        
    } 
    
  }

  handleChange=async e=>{
    e.persist();
    let fechaHora = new Date();
    let dia = fechaHora.getDate();
    let mes = fechaHora.getMonth()+1;
    let ano = fechaHora.getFullYear();
    let fecha = dia + '/' + mes + '/' + ano;
    if(e.target.name==="materiaSalida"){
      await this.setState({
        materia:{
          ...this.state.materia,
          materia: {
            mate_id: e.target.value
          }
        }
          
      });
      materia.push(this.state.materia)
      await this.setState({
        form:{
          ...this.state.form,
          materiaSalida: materia
        }
          
      });
    }else{
      if(e.target.name==="programaacademico"){
        await this.setState({
          form:{
            ...this.state.form,
            programaacademico: {
              prac_id: e.target.value
            },
            progra:  e.target.value,
            fechaSolicitud: fecha,
            fechaCambio: fecha
          }
          
        });
        let campo = this.state.campo;  
        campo[e.target.name] = e.target.value;

          // Cambio de estado de campo 
          this.setState({
              campo
          });
      }else{
          await this.setState({
            form:{
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
    
  }

  componentDidMount(){
    this.peticionGetPrograma();
    this.peticionGetMateria();
    
  }

    render(){
      const {form}=this.state;
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
                    <CLabel htmlFor="select">Programa Académico</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect custom name="programaacademico" id="select" className="form-control my-2" onChange={this.handleChange} value={form?form.progra: ''}>
                    <option value='0'>-- Seleccionar --</option>
                      {this.state.programa.map(elemento =>(
                        <option key={elemento.prac_id} value={elemento.prac_id}>{elemento.nombre}</option>
                      ))}
                    </CSelect>  
                    <span style={{color: "red"}}>{this.state.error["programaacademico"]}</span>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3"><CLabel>Núcleos Temáticos</CLabel></CCol>
                  <CCol md="9">
                  {this.state.materias.map(elemento =>(
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox id="checkbox2" name="materiaSalida" value={elemento.mate_id} onChange={this.handleChange}/>
                        <CLabel variant="checkbox" className="form-check-label" htmlFor="checkbox2" key={elemento.mate_id} value={elemento.mate_id}>{elemento.nombre}</CLabel>
                      </CFormGroup>
                    ))}
                    
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="date-input">Fecha de Inicio</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput type="date" name="fechaInicio" className="form-control my-2" onChange={this.handleChange} value={form?form.fechaInicio: ''}/>
                    <span style={{color: "red"}}>{this.state.error["fechaInicio"]}</span>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="date-input">Fecha de Terminación</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput type="date" name="fechaTerminación" className="form-control my-2" onChange={this.handleChange} value={form?form.fechaTerminación: ''}/>
                    <span style={{color: "red"}}>{this.state.error["fechaTerminación"]}</span>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Semestre</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput name="semestre" className="form-control my-2" onChange={this.handleChange} value={form?form.semestre: ''}/>
                    <span style={{color: "red"}}>{this.state.error["semestre"]}</span>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Nombre Salida</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput name="nombre" className="form-control my-2" onChange={this.handleChange} value={form?form.nombre: ''}/>
                    <span style={{color: "red"}}>{this.state.error["nombre"]}</span>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="select">Tipo Salida</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CSelect custom name="tipoSalida" id="select" className="form-control my-2" onChange={this.handleChange} value={form?form.tipoSalida: ''}>
                      <option value="0">-- Seleccionar --</option>
                      <option value="Visita">Visita</option>
                      <option value="Salida de Campo">Salida de Campo</option>
                      <option value="Asistencia a eventos académicos">Asistencia a eventos académicos</option>
                    </CSelect>
                    <span style={{color: "red"}}>{this.state.error["tipoSalida"]}</span>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Número de Estudiantes</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput name="noEstudiantes" className="form-control my-2" onChange={this.handleChange} value={form?form.noEstudiantes: ''}/>
                    <span style={{color: "red"}}>{this.state.error["noEstudiantes"]}</span>
                  </CCol>
                </CFormGroup>

                <CFormGroup row>
                  <CCol md="3">
                    <CLabel htmlFor="text-input">Temática</CLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    <CInput name="tematica" className="form-control my-2" onChange={this.handleChange} value={form?form.tematica: ''}/>
                    <span style={{color: "red"}}>{this.state.error["tematica"]}</span>
                  </CCol>
                </CFormGroup>
               
                <CButton color="success" onClick={()=>this.peticionPost()} type="reset"><CIcon name="cil-scrubber" /> Solicitar</CButton>
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
export default SolicitudSA