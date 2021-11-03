import React from 'react'
import CIcon from '@coreui/icons-react'

const _nav =  [
  
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Usuarios'],
    rol: 'Administrador'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Docentes',
    to: '/usuarios/docentes',
    icon: 'cil-people',
    rol: 'Administrador'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Administrativos',
    to: '/usuarios/administrativos',
    icon: 'cil-user',
    rol: 'Administrador'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Formatos'],
    rol: 'Administrador'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Formatos',
    to: '/formatos/formatos',
    icon: 'cil-file',
    rol: 'Administrador'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Asesorias'],
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Asesorias',
    to: '/asesorias/Asesorias',
    icon: 'cil-file',
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Comités'],
    rol: 'Docente',
    contrato: 'Hora Cátedra'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Ver Comités',
    to: '/comites/comite',
    icon: 'cil-file',
    rol: 'Docente',
    contrato: 'Hora Cátedra'
  }
  ,
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Educación Virtual'],
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Solicitar Aula Virtual',
    to: '/aulasVirtuales/SolicitudAV',
    icon: 'cil-laptop',
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Adjuntar Evidencias',
    to: '/aulasVirtuales/EvidenciasAV',
    icon: 'cil-task',
    rol: 'Docente',
    contrato: 'General'
  },
  
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Formación Estudiante'],
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Syllabus',
    to: '/formacionEstudiante/Syllabus',
    icon: 'cil-file',
    rol: 'Docente',
    contrato: 'General'
  }
  ,
  {
    _tag: 'CSidebarNavItem',
    name: 'Acuerdo Formación y Apre...',
    to: '/formacionEstudiante/AcuerdoPedagogico',
    icon: 'cil-notes',
    rol: 'Docente',
    contrato: 'General'
  }
  ,
  {
    _tag: 'CSidebarNavItem',
    name: 'Recuperación Clase',
    to: '/formacionEstudiante/RecuperacionClase',
    icon: 'cil-calendar',
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Informes'],
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Semestral',
    to: '/informes/InformeSemestral',
    icon: 'cil-file',
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Mensual',
    to: '/informes/InformeMensual',
    icon: 'cil-file',
    rol: 'Docente',
    contrato: 'Hora Cátedra'
  },
  
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Salidas Academicas'],
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Solicitar',
    to: '/salidasAcademicas/SolicitudSA',
    icon: 'cil-map',
    rol: 'Docente',
    contrato: 'General'
  }
  ,
  {
    _tag: 'CSidebarNavItem',
    name: 'Ver Estado Solicitudes',
    to: '/salidasAcademicas/EstadoSA',
    icon: 'cil-check',
    rol: 'Docente',
    contrato: 'General'
  }
  ,
  {
    _tag: 'CSidebarNavItem',
    name: 'Informes',
    to: '/salidasAcademicas/InformesSA',
    icon: 'cil-file',
    rol: 'Docente',
    contrato: 'General'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Informes'],
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Cierre Académico',
    to: '/informes/CierreAcademico',
    icon: 'cil-file',
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Desempeño Docentes',
    to: '/informes/DesempeñoDocentes',
    icon: 'cil-file',
    rol: 'Administrativo'
  },
  
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Docentes'],
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Ver Docentes',
    to: '/actividadDocente/ActividadDocente',
    icon: 'cil-people',
    rol: 'Administrativo'
  }
  ,
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Solicitudes'],
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Ver Solicitudes',
    to: '/solicitudes/Solicitudes',
    icon: 'cil-task',
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Comités'],
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Ver Comités',
    to: '/actividadDocente/VerComites',
    icon: 'cil-file',
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Reportes'],
    rol: 'Administrativo'
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Ver Reportes',
    to: '/reportes',
    icon: 'cil-chart-pie',
    rol: 'Administrativo'
  }
]

export default _nav
