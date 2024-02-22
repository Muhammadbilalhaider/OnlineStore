"use client"

import React, { useState } from 'react';
import './signup.css';
import axios from 'axios';

const Page = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);

  const handleSignUp = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profilePic', profile);


    try {
      const result = await axios.post(
        'http://localhost:5000/user/SignUp',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const userInfo = result.data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      if (userInfo) {
        window.location.href = '/';
      }
      console.log('result is', userInfo);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };



  return (
    <div className='MainSignUP'>
      <h2>Sign Up</h2>
      <div className='container'>
        <form type='multipart/form-data'>
          <input type='text' placeholder='Name' onChange={(e) => setName(e.target.value)} />
          <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
          <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />

          <input type='file' onChange={(e) => setProfile(e.target.files[0])} />

        </form>
      </div>
      <button type='button' onClick={handleSignUp}>
        Sign Up
      </button>
    </div>
  );
};

export default Page;
