import React, { Component} from 'react'
import axios from 'axios';

import {
    CCol,
    CRow
  } from  '@coreui/react'
import UserProfile from '../usuarios/UserProfile';
import Cards from './Cards';

class VerComite extends Component {

    state={
        data:[],
        admin: {}
    }

    peticionGet=()=>{
        axios.get("http://localhost:8080/comite/retornarAdministrativo/"+UserProfile.getId(),{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response=>{
          this.setState({data: response.data});
          this.setState({tablaData: response.data});
        }).catch(error=>{
          console.log(error.message);
        })
      }

      peticionGetId=()=>{
        axios.get("http://localhost:8080/administrativo/retornarId/"+UserProfile.getId(),{headers:{Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}`}}).then(response=>{
          this.setState({admin: response.data});
        }).catch(error=>{
          console.log(error.message);
        })
      }

      componentDidMount(){
        this.peticionGet();
        this.peticionGetId();
      }
      render(){

        return (
            <>
            <CRow>
         

                    {
                        this.state.data.map((card)=>(
                            
                            <CCol xs="12" sm="6" md="4" key={card.comi_id}>
                                <Cards id={card.comi_id} nombre={card.nombre} programaacademico={this.state.admin.programaacademico.nombre} sede={this.state.admin.sede}/>
                                </CCol>
                            
                        ))
                    }

            

            </CRow>
            </>
        );
    }
}

export default VerComite