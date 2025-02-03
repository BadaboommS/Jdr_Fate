import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './pages/Menu/Navbar';

export default function Layout () {

  return (
    <div className='fixed w-screen h-screen top-0 left-0 overflow-y-scroll no-scrollbar'>
        <Navbar />
        <div className="flex flex-col pl-0 md:pl-16 pt-16 md:pt-0 w-screen min-h-full bg-gray-700 text-white">
          <Outlet />
        </div>
    </div>
  )
}