"use client"
import React, { useEffect } from 'react';
import { setProducts } from '@/app/StoreComponents/slice';
import Link from 'next/link';
import './Mainpage.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const Page = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products);

    console.log('Main Products are ', products)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let result = await axios.get('http://localhost:5000/user/AllProduct');
                const productData = result.data;
                console.log('Before dispatch:', products);
                dispatch(setProducts(productData));

                console.log('After dispatch:', products);

            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, [dispatch]);


    return (
        <div className='MainList'>
            {products.map((product) => (
                <div key={product._id} className='productdata'>
                    <Link href={`/pages/ProductDetails/${product._id}`}>
                        <img src={product.image} alt={product.name} />
                        <div className='productName'>{product.name}</div>
                        <div className='productPrice'>${product.price}</div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Page;
