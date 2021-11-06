import React, { Component } from 'react'
import Card from './Card'
import axios from 'axios';
import {
  CCol,
  CRow
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';

class EvidenciasAV extends Component {

  state = {
    showCard: true,
    collapsed: true,
    data: []
  }

  peticionGet = () => { //Petición para traer las aulas virtuales pertenecientes a un docente
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/aulasvirtuales/listarDocente/" + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {

    return (
      <CRow>


        {
          this.state.data.map((card) => (

            <CCol xs="12" sm="6" md="4" key={card.auvi_id}>
              <Card id={card.auvi_id} tittle={card.nombre} codigo={card.materia.codigo} grupo={card.grupo} sede={card.sede} semestre={card.materia.semestre} />
            </CCol>

          ))
        }



      </CRow>


    );
  }
}
export default EvidenciasAV