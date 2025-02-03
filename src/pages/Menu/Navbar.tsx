import React from 'react';
import { Link } from 'react-router-dom';
import { MdFileOpen } from "react-icons/md";
import { LuSwords } from "react-icons/lu";
import { IoIosCreate } from "react-icons/io";
import './Navbar.css'

export default function Navbar () {
  return (
    <div className='fixed top-0 left-0 w-screen h-16 md:w-16 md:h-screen m-0 bg-gray-900 text-white-shadow-lg flex flex-row md:flex-col z-50'>
        <div className='navbar-icon group'>
          <Link to='/file' className='p-2'><MdFileOpen size="32"/></Link>
          <span className='navbar-tooltip group-hover:scale-100 z-50'><p>File</p></span>
        </div>
        <div className='navbar-icon group'>
          <Link to='/create' className='p-2'><IoIosCreate size="28"/></Link>
          <span className='navbar-tooltip group-hover:scale-100 z-50'><p>Create Character</p></span>
        </div>
        <div className='navbar-icon group'>
          <Link to='/fight' className='p-2'><LuSwords size="30"/></Link>
          <span className='navbar-tooltip group-hover:scale-100 z-50'><p>Combat</p></span>
        </div>
    </div>
  )
}