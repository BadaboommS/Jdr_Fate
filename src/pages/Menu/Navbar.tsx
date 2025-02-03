import { Link } from 'react-router-dom';
import { MdFileOpen } from "react-icons/md";
import { LuSwords } from "react-icons/lu";
import { IoIosCreate } from "react-icons/io";
import { FaList } from "react-icons/fa";

import './Navbar.css';

export default function Navbar () {
  return (
    <div className='fixed top-0 left-0 w-screen h-16 md:w-16 md:h-screen m-0 bg-gray-900 text-white-shadow-lg flex flex-row justify-evenly md:justify-start md:flex-col z-50'>
      <Link to='/file'>
        <div className='navbar-icon group'>
          <MdFileOpen size="32" />
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>File</p></span>
        </div>
      </Link>
      <Link to='/create'>
        <div className='navbar-icon group'>
          <IoIosCreate size="32"/>
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Create Character</p></span>
        </div>
      </Link>
      <Link to='/list'>
        <div className='navbar-icon group'>
          <FaList size="32"/>
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Character List</p></span>
        </div>
      </Link>
      <Link to='/fight'>
        <div className='navbar-icon group'>
          <LuSwords size="32"/>
          <span className='navbar-tooltip group-hover:scale-100 scale-0'><p>Combat</p></span>
        </div>
      </Link>
    </div>
  )
}