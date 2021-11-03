import React, { Component } from 'react'
import {
    CCardGroup,
    CCard,
    CCardBody,
    CCardHeader
} from '@coreui/react'
import {
    CChartBar,
    CChartPie
} from '@coreui/react-chartjs'
import UserProfile from '../usuarios/UserProfile';
import axios from 'axios';

class Grafica extends Component {

    state = {
        data: [],
        tablaData: [],
        labels: [],
        labels2: [],
        valores: [],
        valores2: [],
        url: '',
        titulo: '',
        titulo2: ''
    }
    peticionGet = () => { //Petición para traer los datos por año
        let encabezados = []
        var valores = []
        axios.get('http://localhost:8080/' + this.props.actividad + '/reporteanual/' + this.props.año, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ data: response.data })
            this.setState({ titulo: 'Número de ' + this.props.titulo + ' por mes' })
            encabezados = ["-01-", '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']
            this.setState({ labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] });
            if (this.props.actividad === 'informeHoras') {
                encabezados.map((item) => (
                    valores.push(this.state.data.filter(eachData => eachData.fechaElaboración.search(item) != -1).length)
                ))
            } else {
                if(this.props.actividad === 'evidencia'){
                    encabezados.map((item) => (
                        valores.push(this.state.data.filter(eachData => eachData.fechaModificacion.search(item) != -1).length)
                    ))
                }else{
                    encabezados.map((item) => (
                        valores.push(this.state.data.filter(eachData => eachData.fecha.search(item) != -1).length)
                    ))
                }
            }

            this.setState({ valores: valores });
        }).catch(error => {
            console.log(error);
        })
    }

    peticionGetComite = () => { //Petición para traer los datos del comité por año
        let encabezados = []
        var valores = []
        var valores2 = []
        axios.get('http://localhost:8080/actas/reporteanual/' + this.props.año, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ data: response.data })
            this.setState({ titulo: 'Número de actas por mes' })
            encabezados = ["-01-", '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']
            this.setState({ labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] });
            encabezados.map((item) => (
                valores.push(this.state.data.filter(eachData => eachData.fecha.search(item) != -1).length)
            ))
            this.setState({ valores: valores });
        }).catch(error => {
            console.log(error);
        })
        axios.get('http://localhost:8080/producto/reporteanual/' + this.props.año, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ data: response.data })
            this.setState({ titulo2: 'Número de productos por mes' })
            encabezados = ["-01-", '-02-', '-03-', '-04-', '-05-', '-06-', '-07-', '-08-', '-09-', '-10-', '-11-', '-12-']
            this.setState({ labels2: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] });
            encabezados.map((item) => (
                valores2.push(this.state.data.filter(eachData => eachData.fechaElaboración.search(item) != -1).length)
            ))
            this.setState({ valores2: valores2 });
        }).catch(error => {
            console.log(error);
        })
    }

    peticionGetSemestre = () => { //Petición para traer los datos por semestre
        let encabezados = [];
        let encabezados2 = [];
        var valores = [];
        var valores2 = [];
        var i;
        axios.get('http://localhost:8080/' + this.props.actividad + '/reporteperiodo/' + this.props.año + '/' + this.props.periodo, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ data: response.data })
            if (this.props.actividad === 'asesoria') {
                this.setState({ titulo: 'Número de ' + this.props.titulo + ' por docente' })
                this.setState({ titulo2: 'Número de ' + this.props.titulo + ' por núcleo temático' })
                for (i = 0; i < this.state.data.length; i++) {
                    encabezados.push(this.state.data[i].docente.nombre);
                    encabezados2.push(this.state.data[i].nucleoTemático);
                }
                let result = encabezados.filter((item, index) => {
                    return encabezados.indexOf(item) === index;
                });
                this.setState({ labels: result });
                let result2 = encabezados2.filter((item, index) => {
                    return encabezados2.indexOf(item) === index;
                });
                this.setState({ labels2: result2 });
                this.state.labels.map((item) => (
                    valores.push(this.state.data.filter(eachData => eachData.docente.nombre === item).length)
                ))
                this.setState({ valores: valores });
                this.state.labels2.map((item) => (
                    valores2.push(this.state.data.filter(eachData => eachData.nucleoTemático === item).length)
                ))
                this.setState({ valores2: valores2 });
            }
            if ((this.props.actividad === 'acuerdopedagogico') || (this.props.actividad === 'syllabus') || (this.props.actividad === 'informeSemestral') || (this.props.actividad === 'recuperacionclase')) {
                this.setState({ titulo: 'Número de ' + this.props.titulo + ' por docente' })
                this.setState({ titulo2: 'Número de ' + this.props.titulo + ' por núcleo temático' })
                for (i = 0; i < this.state.data.length; i++) {
                    encabezados.push(this.state.data[i].docente.nombre);
                    encabezados2.push(this.state.data[i].nucleoTemático.nombre);
                }
                let result = encabezados.filter((item, index) => {
                    return encabezados.indexOf(item) === index;
                });
                this.setState({ labels: result });
                let result2 = encabezados2.filter((item, index) => {
                    return encabezados2.indexOf(item) === index;
                });
                this.setState({ labels2: result2 });
                this.state.labels.map((item) => (
                    valores.push(this.state.data.filter(eachData => eachData.docente.nombre === item).length)
                ))
                this.setState({ valores: valores });
                this.state.labels2.map((item) => (
                    valores2.push(this.state.data.filter(eachData => eachData.nucleoTemático.nombre === item).length)
                ))
                this.setState({ valores2: valores2 });
            }
            if ((this.props.actividad === 'informeHoras') || (this.props.actividad === 'informeSalidas')) {
                this.setState({ titulo: 'Número de ' + this.props.titulo + ' por docente' })
                for (i = 0; i < this.state.data.length; i++) {
                    encabezados.push(this.state.data[i].docente.nombre);
                }
                let result = encabezados.filter((item, index) => {
                    return encabezados.indexOf(item) === index;
                });
                this.setState({ labels: result });
                this.state.labels.map((item) => (
                    valores.push(this.state.data.filter(eachData => eachData.docente.nombre === item).length)
                ))
                this.setState({ valores: valores });
            }
            if (this.props.actividad === 'evidencia') {
                this.setState({ titulo: 'Número de ' + this.props.titulo + ' por docente' })
                this.setState({ titulo2: 'Número de ' + this.props.titulo + ' por aula virtual' })
                for (i = 0; i < this.state.data.length; i++) {
                    encabezados.push(this.state.data[i].aulaVirtual.docente.nombre);
                    encabezados2.push(this.state.data[i].aulaVirtual.nombre);
                }
                let result = encabezados.filter((item, index) => {
                    return encabezados.indexOf(item) === index;
                });
                this.setState({ labels: result });
                let result2 = encabezados2.filter((item, index) => {
                    return encabezados2.indexOf(item) === index;
                });
                this.setState({ labels2: result2 });
                this.state.labels.map((item) => (
                    valores.push(this.state.data.filter(eachData => eachData.aulaVirtual.docente.nombre === item).length)
                ))
                this.setState({ valores: valores });
                this.state.labels2.map((item) => (
                    valores2.push(this.state.data.filter(eachData => eachData.aulaVirtual.nombre === item).length)
                ))
                this.setState({ valores2: valores2 });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    peticionGetSemestreComite = () => { //Petición para traer los datos del comité por semestre
        let encabezados = []
        var valores = []
        var valores2 = []
        var i;
        axios.get('http://localhost:8080/actas/reporteperiodo/' + this.props.año + '/' + this.props.periodo, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ data: response.data })
            this.setState({ titulo: 'Número de actas por comité' })
            for (i = 0; i < this.state.data.length; i++) {
                encabezados.push(this.state.data[i].comite.nombre);
            }
            let result = encabezados.filter((item, index) => {
                return encabezados.indexOf(item) === index;
            });
            this.setState({ labels: result });
            this.state.labels.map((item) => (
                valores.push(this.state.data.filter(eachData => eachData.comite.nombre === item).length)
            ))
            this.setState({ valores: valores });
        }).catch(error => {
            console.log(error);
        })
        axios.get('http://localhost:8080/producto/reporteperiodo/' + this.props.año + '/' + this.props.periodo, { headers: { Authorization: `Bearer ${sessionStorage.getItem(UserProfile.getToken().TOKEN_NAME)}` } }).then(response => {
            this.setState({ data: response.data })
            this.setState({ titulo2: 'Número de productos por comité' })
            for (i = 0; i < this.state.data.length; i++) {
                encabezados.push(this.state.data[i].comite.nombre);
            }
            let result = encabezados.filter((item, index) => {
                return encabezados.indexOf(item) === index;
            });
            this.setState({ labels2: result });
            this.state.labels2.map((item) => (
                valores2.push(this.state.data.filter(eachData => eachData.comite.nombre === item).length)
            ))
            this.setState({ valores2: valores2 });
        }).catch(error => {
            console.log(error);
        })
    }

    componentDidMount() {
        if (this.props.periodo === 'Mensual') {
            if (this.props.actividad === 'comité') {
                this.peticionGetComite();
            } else {
                this.peticionGet();
            }
        } else {
            if (this.props.actividad === 'comité') {
                this.peticionGetSemestreComite();
            } else {
                this.peticionGetSemestre();
            }

        }

    }

    render() {
        if (this.props.actividad != this.state.url) {
            this.setState({ url: this.props.actividad });
            this.componentDidMount();
        } else {

        }
        return (
            <>
                {(this.state.data.length != 0) ?
                    <CCardGroup columns className="cols-2" >
                        <CCard>
                            <CCardHeader>
                                {this.state.titulo}
                            </CCardHeader>
                            <CCardBody>
                                <CChartBar
                                    datasets={[
                                        {
                                            label: this.props.titulo,
                                            backgroundColor: '#f87979',
                                            data: this.state.valores,

                                        }
                                    ]}
                                    labels={this.state.labels}
                                    options={{
                                        tooltips: {
                                            enabled: true
                                        }
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader>
                                {this.state.titulo}
                            </CCardHeader>
                            <CCardBody>
                                <CChartPie
                                    datasets={[
                                        {
                                            backgroundColor: [
                                                '#41B883',
                                                '#E46651',
                                                '#00D8FF',
                                                '#DD1B16',
                                                '#F8E469',
                                                '#8B9068',
                                                '#2D7AC0',
                                                '#BD87BB',
                                                '#58C3BB',
                                                '#F29A86',
                                                '#D6234A',
                                                "#800000"
                                            ],
                                            data: this.state.valores
                                        }
                                    ]}
                                    labels={this.state.labels}
                                    options={{
                                        tooltips: {
                                            enabled: true
                                        }
                                    }}
                                />
                            </CCardBody>
                        </CCard>

                    </CCardGroup>
                    : <h2>No se encontraron resultados</h2>}
                {((this.props.periodo != 'Mensual') || (this.props.actividad === 'comité')) && (this.state.data.length != 0) && (this.props.actividad != 'informeHoras') && (this.props.actividad != 'informeSalidas') ?
                    <CCardGroup columns className="cols-2" >
                        <CCard>
                            <CCardHeader>
                                {this.state.titulo2}
                            </CCardHeader>
                            <CCardBody>
                                <CChartBar
                                    datasets={[
                                        {
                                            label: this.props.titulo,
                                            backgroundColor: '#f87979',
                                            data: this.state.valores2,

                                        }
                                    ]}
                                    labels={this.state.labels2}
                                    options={{
                                        tooltips: {
                                            enabled: true
                                        }
                                    }}
                                />
                            </CCardBody>
                        </CCard>
                        <CCard>
                            <CCardHeader>
                                {this.state.titulo2}
                            </CCardHeader>
                            <CCardBody>
                                <CChartPie
                                    datasets={[
                                        {
                                            backgroundColor: [
                                                '#41B883',
                                                '#E46651',
                                                '#00D8FF',
                                                '#DD1B16',
                                                '#F8E469',
                                                '#8B9068',
                                                '#2D7AC0',
                                                '#BD87BB',
                                                '#58C3BB',
                                                '#F29A86',
                                                '#D6234A',
                                                "#800000"
                                            ],
                                            data: this.state.valores2
                                        }
                                    ]}
                                    labels={this.state.labels2}
                                    options={{
                                        tooltips: {
                                            enabled: true
                                        }
                                    }}
                                />
                            </CCardBody>
                        </CCard>

                    </CCardGroup>
                    : null}
            </>
        );
    }
}

export default Grafica;