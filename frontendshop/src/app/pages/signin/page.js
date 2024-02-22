"use client"
import React, { useState } from 'react';
import './signin.css';
import axios from 'axios';
import Link from 'next/link';

const Signin = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const data = { email, password };

    try {
      const result = await axios.post(
        'http://localhost:5000/user/SignIn',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { user, token, message } = result.data;

      if (user && token) {
        localStorage.setItem('userInfo', JSON.stringify({ user, token }));
        window.location.href = '/'
        console.log('Sign in successful', user);
      } else {
        console.log('Error signing in:', message);
      }
    } catch (error) {
      console.error('Error signing in:', error.message);
    }
  };

  return (
    <div className='MainSignUP'>
      <h2>Sign In</h2>
      <div className='container'>
        <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
        <div className='forgotPass'>
          <Link href='/pages/forgotpass'> Forget Password</Link>
        </div>
        <button type='button' onClick={handleSignIn}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Signin;
