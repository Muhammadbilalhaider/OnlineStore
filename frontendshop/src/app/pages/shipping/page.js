"use client"

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import './shipping.css';


const stripePromise = loadStripe('pk_test_51OjmBPBQtJZfHvLbVRRYX8NQTs430qOYtykSZ7nCRraeOo52nKzKpqjbh4gP1jp7Ix8yveXZdLQVeH3Qk4StoQP300fXXn3nnt');

const ShippingForm = () => {
    const products = useSelector((state) => state.cartShipping.cartShipping) || '';
    const [paymentResult, setPaymentResult] = useState(null);
    const stripe = useStripe();
    const elements = useElements();
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const totalPrice = products.reduce((accumulator, product) => accumulator + product.price, 0);
        setTotalAmount(totalPrice)
    }, [totalAmount])

    const handlePayment = async () => {
        const userInfo = await JSON.parse(localStorage.getItem('userInfo'));
        let userToken;

        if (userInfo) {
            userToken = userInfo.token;
            console.log('Tokennnn is ', userToken);
        } else {
            console.error('Invalid or missing token in localStorage');
        }

        try {

            const { token, error } = await stripe.createToken(elements.getElement(CardElement));
            if (error) {
                console.error('Error creating token:', error);
                setPaymentResult({ success: false, message: 'Error creating token' });
                return;
            }

            const res = await axios.post('http://localhost:5000/user/shipping', {
                token: token.id,
                totalAmount: totalAmount,
            }, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            console.log('Frontend Response:', res);
            if (res.status === 200 && res.data && res.data.sessionId) {
                // Payment succeeded
                setPaymentResult({ success: true, message: 'Payment successful' });
            } else {
                // Payment failed
                setPaymentResult({ success: false, message: 'Payment failed' });
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setPaymentResult({ success: false, message: 'Error processing payment' });
        }
    };




    return (
        <div>
            <h2>Shipping</h2>

            {paymentResult && (
                <div className={paymentResult.success ? 'success' : 'fail'}>
                    {paymentResult.message}
                </div>
            )}

            {products.length > 0 ? (
                <div className="mainContainer">
                    <ul>
                        {products.map((product) => (
                            <li key={product._id}>
                                {product.name} - ${product.price}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <CardElement />
                        <button onClick={handlePayment}>pay : {totalAmount}</button>
                    </div>
                </div>
            ) : (
                <p>No items for shipping.</p>
            )}
        </div>
    );
};

const ShippingPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <ShippingForm />
        </Elements>
    );
};

export default ShippingPage;
