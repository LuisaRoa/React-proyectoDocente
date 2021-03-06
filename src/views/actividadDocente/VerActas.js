import React, { Component } from 'react'
import { BsFileEarmarkText, BsSearch } from 'react-icons/bs';
import { FcOpenedFolder } from "react-icons/fc";
import {
    CButton,
    CDataTable,
    CCardBody,
    CCard,
    CCardHeader,
    CForm,
} from '@coreui/react'
import UserProfile from '../usuarios/UserProfile';
import axios from 'axios';


const fields = ['', 'nombre', 'fecha', 'lugar', 'tamaño', 'tipoArchivo', 'ver']
class VerActas extends Component {

    state = {
        data: [],
        tablaData: []
    }

    peticionGet = (id) => { //Función para traer todas las actas de acuerdo al comité
        axios.get('http://ec2-3-136-234-55.us-east-2.compute.amazonaws.com:8080/actas/listarComite/' + id, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ tablaData: response.data });
            this.setState({ data: response.data });

        }).catch(error => {
            console.log(error.message);
        })
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        this.peticionGet(id);
    }
    render() {
        return (
            <div>
                <CCard style={{ width: '100%', textAlign: 'center' }}>
                    <CCardHeader>
                        <CForm className="form-inline" >
                            <h2 >< FcOpenedFolder size="50px" /> Actas</h2>
                        </CForm>
                    </CCardHeader>
                    <CCardBody>
                        <CDataTable
                            items={this.state.data}
                            fields={fields}
                            hover
                            striped
                            bordered
                            size="sm"
                            itemsPerPage={5}
                            pagination
                            scopedSlots={{
                                'ver':
                                    (item) => (
                                        <tr>
                                            <td>
                                                <a
                                                    href={item.actaUrl} target="_blank">
                                                    <CButton >
                                                        <BsSearch />
                                                    </CButton>
                                                </a>
                                            </td>
                                        </tr>
                                    ),
                                '':
                                    (item) => (
                                        <td>
                                            <BsFileEarmarkText size="40px" />
                                        </td>
                                    )
                            }}

                        />
                    </CCardBody>
                </CCard>
            </div >
        );
    }
}
export default VerActas
