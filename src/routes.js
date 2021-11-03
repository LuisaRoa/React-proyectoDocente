import React from 'react';
import UserProfile from './views/usuarios/UserProfile';

const Docentes = React.lazy(() => (UserProfile.getRol()==='Administrador') ? import('./views/usuarios/docentes/Docentes'): import('./views/pages/page401/Page401'));
const Administrativos = React.lazy(() => (UserProfile.getRol()==='Administrador') ? import('./views/usuarios/administrativos/Administrativos'): import('./views/pages/page401/Page401'));
const Formatos = React.lazy(() => (UserProfile.getRol()==='Administrador') ? import('./views/formatos/Formatos'): import('./views/pages/page401/Page401'));
const SolicitudAV = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/aulasVirtuales/SolicitudAV'): import('./views/pages/page401/Page401'));
const EvidenciasAV = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/aulasVirtuales/EvidenciasAV'): import('./views/pages/page401/Page401'));
const Archivos = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/aulasVirtuales/Archivos'): import('./views/pages/page401/Page401'));
const Asesorias = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/asesorias/Asesorias'): import('./views/pages/page401/Page401'));
const EstadoSA = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/salidasAcademicas/EstadoSA'): import('./views/pages/page401/Page401'));
const InformesSA = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/salidasAcademicas/InformesSA'): import('./views/pages/page401/Page401'));
const SolicitudSA = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/salidasAcademicas/SolicitudSA'): import('./views/pages/page401/Page401'));
const InformeSemestral = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/informes/InformeSemestral'): import('./views/pages/page401/Page401'));
const InformeMensual = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/informes/InformeMensual'): import('./views/pages/page401/Page401'));
const Syllabus = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/formacionEstudiante/Syllabus'): import('./views/pages/page401/Page401'));
const AcuerdoPedagogico = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/formacionEstudiante/AcuerdoPedagogico'): import('./views/pages/page401/Page401'));
const RecuperacionClase = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/formacionEstudiante/RecuperacionClase'): import('./views/pages/page401/Page401'));
const Comite = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/comites/Comite'): import('./views/pages/page401/Page401'));
const Acciones = React.lazy(() => (UserProfile.getRol()==='Docente') ? import('./views/comites/Acciones'): import('./views/pages/page401/Page401'));
const CierreAcademico = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/informes/CierreAcademico'): import('./views/pages/page401/Page401'));
const DesempeñoDocentes = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/informes/DesempeñoDocentes'): import('./views/pages/page401/Page401'));
const ActividadDocentes = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/actividadDocente/Docentes'): import('./views/pages/page401/Page401'));
const Actividades = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/actividadDocente/Actividades'): import('./views/pages/page401/Page401'));
const Comites = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/actividadDocente/VerComites'): import('./views/pages/page401/Page401'));
const Actas = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/actividadDocente/VerActas'): import('./views/pages/page401/Page401'));
const Productos = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/actividadDocente/VerProductos'): import('./views/pages/page401/Page401'));
const Solicitudes = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/solicitudes/Solicitudes'): import('./views/pages/page401/Page401'));
const Reportes = React.lazy(() => (UserProfile.getRol()==='Administrativo') ? import('./views/reportes/Reportes'): import('./views/pages/page401/Page401'));
const Perfil = React.lazy(() => import('./views/usuarios/Perfil'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/usuarios/docentes', name: 'Docentes', component: Docentes },
  { path: '/usuarios/administrativos', name: 'Administrativos', component: Administrativos },
  { path: '/formatos/Formatos', name: 'Formatos', component: Formatos },
  { path: '/aulasVirtuales/EvidenciasAV', name: 'EvidenciasAV', component: EvidenciasAV },
  { path: '/aulasVirtuales/SolicitudAV', name: 'SolicitudAV', component: SolicitudAV },
  { path: '/aulasVirtuales/Archivos/:id', name: 'Archivos', component: Archivos },
  { path: '/asesorias/asesorias', name: 'Asesorias', component: Asesorias },
  { path: '/salidasAcademicas/SolicitudSA', name: 'SolicitudSA', component: SolicitudSA },
  { path: '/salidasAcademicas/EstadoSA', name: 'EstadoSA', component: EstadoSA },
  { path: '/salidasAcademicas/InformesSA', name: 'InformesSA', component: InformesSA },
  { path: '/informes/InformeSemestral', name: 'InformeSemestral', component: InformeSemestral },
  { path: '/informes/InformeMensual', name: 'InformeMensual', component: InformeMensual },
  { path: '/formacionEstudiante/Syllabus', name: 'Syllabus', component: Syllabus },
  { path: '/formacionEstudiante/AcuerdoPedagogico', name: 'AcuerdoPedagogico', component: AcuerdoPedagogico },
  { path: '/formacionEstudiante/RecuperacionClase', name: 'RecuperacionClase', component: RecuperacionClase },
  { path: '/informes/CierreAcademico', name: 'CierreAcademico', component: CierreAcademico },
  { path: '/informes/DesempeñoDocentes', name: 'DesempeñoDocentes', component: DesempeñoDocentes },
  { path: '/actividadDocente/ActividadDocente', name: 'ActividadDocentes', component: ActividadDocentes },
  { path: '/actividadDocente/VerComites', name: 'VerComites', component: Comites },
  { path: '/actividadDocente/VerActas/:id', name: 'Actas', component: Actas },
  { path: '/actividadDocente/VerProductos/:id', name: 'Productos', component: Productos },
  { path: '/actividadDocente/Actividades/:id', name: 'Actividades', component: Actividades },
  { path: '/solicitudes/Solicitudes', name: 'Solicitudes', component: Solicitudes },
  { path: '/reportes', name: 'Reportes', component: Reportes },
  { path: '/usuarios/perfil', name: 'Perfil', component: Perfil },
  { path: '/comites/comite', name: 'Comite', component: Comite },
  { path: '/comites/vistas/:id', name: 'Acciones', component: Acciones },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User }
];

export default routes;
