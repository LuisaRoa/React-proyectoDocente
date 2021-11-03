import React, { Component } from 'react'
import axios from 'axios';

import {
  CCol,
  CRow
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';
import Cards from './Cards';

class Comite extends Component {

  state = {
    data: [],
    docente: {}
  }

  peticionGet = () => {//Petición para traer todos los comités a los que pertenece el docente
    axios.get("http://localhost:8080/comite/retornarDocente/" + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ data: response.data });
      this.setState({ tablaData: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionGetId = () => { //Petición para traer un docente por id
    axios.get("http://localhost:8080/docente/retornarId/" + UserProfile.getId(), { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
      this.setState({ docente: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  componentDidMount() {
    this.peticionGet();
    this.peticionGetId();
  }

  render() {

    return (
      <>
        <CRow>


          {
            this.state.data.map((card) => (

              <CCol xs="12" sm="6" md="4" key={card.comi_id}>
                <Cards id={card.comi_id} nombre={card.nombre} programaacademico={this.state.docente.administrativo.programaacademico.nombre} sede={this.state.docente.administrativo.sede} />
              </CCol>

            ))
          }



        </CRow>
      </>
    );
  }
}
export default Comite