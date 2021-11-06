import React, { Component } from 'react'
import Card from './Card'
import axios from 'axios';

import {
  CCol,
  CRow
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';

class EstadoSA extends Component {

  state = {
    data: []
  }

  peticionGet = () => {
    axios.get("http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/solicitudsalida/retornarDocente/" + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  logo(estado) {
    if (estado === 'No aprobado') {
      return false;
    } else {
      return true;
    }
  }

  componentDidMount() {
    this.peticionGet();
  }

  render() {

    return (
      <>
        <CRow>


          {
            this.state.data.map((card) => (

              <CCol xs="12" sm="6" md="4" key={card.sosa_id}>
                <Card id={card.sosa_id} nombre={card.nombre} semestre={card.semestre} tipo={card.tipoSalida} fechaSolicitud={card.fechaSolicitud} estado={card.estado} logo={this.logo(card.estado)} />
              </CCol>

            ))
          }



        </CRow>
      </>
    );
  }
}
export default EstadoSA