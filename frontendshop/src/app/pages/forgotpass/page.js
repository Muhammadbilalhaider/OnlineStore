"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import './forgotpass.css'

const page = () => {
    const [email, setEmail] = useState('')


    const handleSignUp = async () => {
        try {
            const result = await axios.post(
                'http://localhost:5000/user/forgotPassword',
                { email: email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (result) {
                console.log('Success');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };




    return (
        <div className='container'>
            <div >
                <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type='button' onClick={handleSignUp}>
                Send
            </button>
        </div>
    )
}

export default page