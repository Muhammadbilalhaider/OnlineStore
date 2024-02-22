"use client"


import React, { useEffect, useState } from 'react';
import './profile.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Page = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profile, setProfile] = useState(null);
    const [previousProfilePic, setPreviousProfilePic] = useState();
    const [userData, setUserData] = useState(null);
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;
        const data = token ? jwtDecode(token) : null;
        setUserData(data);
        setUserToken(token);

        if (userInfo) {
            setName(data.name || '');
            setEmail(data.email || '');

        }
    }, []);


    const handleUpdateUser = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (profile) {
            formData.append('profilePic', profile);
        }

        try {
            const result = await axios.put(
                `http://localhost:5000/user/UpdateUser/${userData.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            const userInfo = result.data;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setName(userInfo.name);
            setEmail(userInfo.email);

            // Update the entire user data state
            setUserData(userInfo);

            if (profile) {
                setPreviousProfilePic(URL.createObjectURL(profile)); // Update the image preview
                setProfile(null); // Clear the file state after successful upload
            }
        } catch (error) {
            console.error('Error updating:', error.message);
        }
    };





    return (
        <div className='MainSignUP'>
            <h2>Update Profile</h2>
            <div className='container'>
                <form encType='multipart/form-data'>
                    <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                    <input type='email' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                    <input type='file' onChange={(e) => setProfile(e.target.files[0])} />
                    {previousProfilePic && (
                        <img src={`data:image/png;base64,${previousProfilePic}`} alt='Previous Profile Pic' style={{ maxWidth: '40px', maxHeight: '40px' }} />
                    )}
                </form>
            </div>
            <button type='button' onClick={handleUpdateUser}>
                Update
            </button>
        </div>
    );
};

export default Page;

