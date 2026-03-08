import React from 'react'
import Footer from './../Footer/Footer';
import { Outlet } from 'react-router-dom';
import MyNavbar from '../Navbar/Navbar';
export default function Layout() {
  return (
    <>
    <MyNavbar/>
    
    <div className="container w-[90%] mx-auto p-4 min-h-screen">

      <Outlet />

    </div>
    
    </>
  )
}

