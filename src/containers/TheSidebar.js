import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import logo from './ESCUDO-NEGRO-H.png';
import {
  CCreateElement,
  CSidebar,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem
} from '@coreui/react'
import sidebar from './../css/sidebar.css';

// sidebar nav config
import navigation from './_nav'
import UserProfile from 'src/views/usuarios/UserProfile';


const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  console.log(UserProfile.getRol());
  let items;
  items = navigation.filter(item => item.rol===UserProfile.getRol());
  if((UserProfile.getContrato()==="Hora Cátedra")||(UserProfile.getContrato()==="")){
  }else{
    items = items.filter(item => item.contrato=='General');
  }
  return (
    <CSidebar className="sidebar"
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
     <div class="img">
      <img width={160} height={90} alt="160x90" src={logo} />
     </div>
        
      <CSidebarNav >
     
        <CCreateElement 
         items={items}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
