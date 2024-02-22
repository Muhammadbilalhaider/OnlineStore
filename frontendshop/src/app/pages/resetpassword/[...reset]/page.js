"use client"

import React, { useState, useEffect } from 'react';
import './resetPass.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const page = () => {
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState();

    useEffect(() => {
        const token = window.location.pathname.split('/').pop();
        setToken(token);

        try {
            const decodedUserData = jwtDecode(token);
            setUserData(decodedUserData);
        } catch (error) {
            console.error('Error decoding token:', error.message);
        }
    }, []);


    const handleReset = async () => {
        if (password !== confirmPass) {
            console.log('Passwords do not match');
            return;
        }

        try {
            const result = await axios.post(
                "http://localhost:5000/user/resetPassword",
                { token, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );


            console.log('Result from server:', result.data);

            if (result.data.message === 'Password reset successful') {
                console.log('Password reset successful');
                window.location.href = "/pages/signin"
            } else {
                console.log('Password reset failed');
            }
        } catch (error) {
            console.error('Error resetting password:', error.message);
            console.error('Server Response:', error.response.data);
        }
    };


    return (
        <div>
            <div className='container'>
                Reset Password
                <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                <input type='password' placeholder='Confirm Password' onChange={(e) => setConfirmPass(e.target.value)} />
                <button type='button' onClick={handleReset}>Done</button>
            </div>
        </div>
    );
};

export default page;
