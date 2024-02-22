// Navbar.js
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Conditionally get userInfo based on client or server
  const userInfo =
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userInfo')) : null;

  const userToken = userInfo ? userInfo.token : null;
  const profilePic = userToken ? jwtDecode(userToken).profilePic : ' ';
  const name = userToken ? jwtDecode(userToken).name : ' ';

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isSidebarOpen && !event.target.closest('.sidebar')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const logout = () => {
    setSidebarOpen(false);
    localStorage.clear();
  };

  return (
    <div>
      <div className='MainNav'>
        <ul className='NavList'>
          <div>
            <li>
              <Link href='/'>Online Shop</Link>
            </li>
          </div>
          <div className='signCart'>
            {!userInfo && (
              <div className='SignUser'>
                <li>
                  <Link href='/pages/signup'>Sign Up</Link>
                </li>
                <li>
                  <Link href='/pages/signin'>Sign In</Link>
                </li>
              </div>
            )}
            {userInfo && (
              <div className='cartProfile'>
                <li className='profile-dropdown-container'>
                  <img
                    src={`data:image/png;base64,${profilePic}`}
                    alt='Profile'
                    onClick={toggleSidebar}
                  />
                  {isSidebarOpen && (
                    <div className='sidebar animated'>
                      <ul className='profileLogout'>
                        <li onClick={closeSidebar}>
                          <Link href='/pages/profile'>Profile</Link>
                        </li>
                        <li className='line'></li>
                        <li onClick={logout}>
                          <Link href='/'>Logout</Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
                <li>
                  <Link href='/pages/cart'>Cart</Link>
                </li>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
