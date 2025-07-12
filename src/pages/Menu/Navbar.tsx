import { Link } from 'react-router-dom';
import { MdFileOpen } from "react-icons/md";
import { LuSwords } from "react-icons/lu";
import { IoIosCreate } from "react-icons/io";
import { FaList } from "react-icons/fa";
import { SaveFileControl } from './SaveFileControl';
import { PlayerListControl } from './PlayerListControls';
import './Navbar.css';

export function Navbar () {
  return <>
    <div className='fixed left-0 w-screen h-16 md:w-16 md:h-screen m-0 text-white-shadow-lg flex flex-row justify-evenly md:justify-start md:flex-col z-50' style={{backgroundColor: '#050505'}}>
        <div className='navbar-icon group'>
      <Link to='/file'>
          <MdFileOpen size="32" />
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>File</p></span>
      </Link>
        </div>
        <div className='navbar-icon group'>
      <Link to='/create'>
          <IoIosCreate size="32"/>
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Create Character</p></span>
      </Link>
        </div>
      <div className='navbar-icon group'>
        <Link to='/list'>
          <FaList size="32"/>
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Character List</p></span>
        </Link>
      </div>
      <div className='navbar-icon group'>
        <Link to='/fight'>
          <LuSwords size="32"/>
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Combat</p></span>
        </Link>
      </div>
      <PlayerListControl />
      <SaveFileControl />
    </div>
  </>
}