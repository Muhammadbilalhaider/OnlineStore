"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './cart.css';
import { setCartItems } from '@/app/StoreComponents/shippingcart';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const Page = () => {
    const [cartProducts, setCartProducts] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const dispatch = useDispatch();
    const userToken = userInfo?.token;
    const userId = userToken ? jwtDecode(userToken).id : ' ';


    useEffect(() => {
        const fetchCartProducts = async () => {
            try {
                const result = await axios.get(`http://localhost:5000/user/GetCartProducts/${userId}`, {
                    headers: {
                        Authorization: userToken ? `Bearer ${userToken}` : '',
                        'Content-Type': 'application/json',
                    },
                });
                if (result) {
                    const data = result.data;
                    setCartProducts(data);
                    dispatch(setCartItems(data));
                }


            } catch (error) {
                console.error('Error fetching cart products:', error);
            }
        };

        if (userId) {
            fetchCartProducts();
        }
    }, [userId, userToken]);

    const totalAmount = cartProducts.reduce((sum, product) => sum + product.price, 0);


    const handleEditProduct = () => {

    }
    const handleDeleteProduct = () => {

    }


    return (

        <div className='mainCart'>
            <div className='shipping'>
                {cartProducts.length > 0 && (
                    <div className='total-amount'>Total: ${totalAmount.toFixed(2)}</div>
                )}
                {cartProducts.length > 0 && (
                    <div className='shippingCart'>
                        <Link href='/pages/shipping' >Shipping
                        </Link>
                    </div>
                )}
            </div>
            {cartProducts.length > 0 ? (
                <div className='entireList'>
                    <ul>
                        {cartProducts.map(product => (
                            <div key={product._id} className='listCart'>
                                <div className='img'>
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className='product-info'>
                                    <div className='product-name'>
                                        <p>Name:</p>
                                        <p>{product.name}</p>
                                    </div>
                                    <div className='product-price'>
                                        <p>Price:</p>
                                        <p>${product.price}</p>
                                    </div>
                                    <div className='product-quantity'>
                                        <p>Quantity:</p>
                                        <p>{product.qty}</p>
                                    </div>
                                    <div className='product-actions'>

                                        <FontAwesomeIcon icon={faEdit} className='edit-icon' onClick={() => handleEditProduct(product)} />

                                        <FontAwesomeIcon icon={faTrash} className='delete-icon' onClick={() => handleDeleteProduct(product._id)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>


    );
};

export default Page;

