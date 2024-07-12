import React from 'react';
import { MdOutlineMovie } from "react-icons/md";
import { GoPeople, GoPerson } from "react-icons/go";
import { NavLink, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="navbar">

<NavLink to="/moviepage" className={`nav-link ${location.pathname === '/' || location.pathname === '/moviepage' ? 'active' : ''}`}>
        <div className='nav-item'>
          <MdOutlineMovie className={`nav-icon ${location.pathname === '/' || location.pathname === '/moviepage' ? 'active' : ''}`} />
          <span>Filmes</span>
        </div>
      </NavLink>

      <NavLink to="/grouppage" className={`nav-link ${location.pathname === '/grouppage' || location.pathname === '/groupdetail' ? 'active' : ''}`}>
        <div className='nav-item'>
          <GoPeople className={`nav-icon ${location.pathname === '/grouppage' || location.pathname === '/groupdetail' ? 'active' : ''}`} />
          <span>Grupos</span>
        </div>
      </NavLink>

      <NavLink to="/profilepage" className={`nav-link ${location.pathname === '/profilepage' ? 'active' : ''}`}>
        <div className='nav-item'>
          <GoPerson className={`nav-icon ${location.pathname === '/profilepage' ? 'active' : ''}`} />
          <span>Perfil</span>
        </div>
      </NavLink>
    </div>
  );
};

export default Navbar;
