"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './ProductDetail.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';


const ProductDetails = () => {
    const [product, setProduct] = useState({});
    const [qty, setQty] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const { id } = useParams();
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [rating, setRating] = useState('');
    const [price, setPrice] = useState();

    const [brand, setBrand] = useState('');
    const [numReview, setnumReview] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('')

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProductDetails = async () => {

            const result = await axios.get(`http://localhost:5000/user/detailProduct/${id}`);
            const details = result.data;

            setName(details.name);
            setImage(details.image);
            setRating(details.rating);
            setPrice(details.price);
            setBrand(details.brand)
            setnumReview(details.numReview)
            setCountInStock(details.countInStock)
            setDescription(details.description)
            setCategory(details.category)

            setProduct(details);

        };

        fetchProductDetails();
    }, [id]);

    useEffect(() => {
        setTotalPrice(qty * price);
    }, [qty, price]);


    const handleCart = async () => {

        const userData = await JSON.parse(localStorage.getItem('userInfo'));
        try {
            let result = await axios.post(
                `http://localhost:5000/user/AddCartProduct/${id}`,
                {
                    name, price: totalPrice, image, rating,
                    qty, brand, numReview, countInStock, description, category
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    }
                }
            );
            // result ?
            //     toast.success('Product added to cart successfully!') : '';
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const generateQuantityOptions = () => {
        const options = [];
        for (let i = 1; i <= 10; i++) {
            options.push(i);
        }
        return options;
    };

    return (
        <div className='detailProduct'>
            {product && (
                <div className='entireDetails'>
                    <div className='detailImage'>
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className='productInfo'>
                        <p className='productName'>{product.name}</p>

                        <select className='quantity' value={qty} onChange={(e) => setQty(e.target.value)}>
                            {generateQuantityOptions().map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <p className='price'>{`Price: $${totalPrice}`}</p>

                        <p className='rating'>{`Rating: ${product.rating}`}</p>
                        <p className='numReview'>{`Reviews: ${product.numReview}`}</p>
                    </div>
                    <div className='button' onClick={handleCart}><button>Add to cart</button></div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;

