"use client";

import { useEffect, useState } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  ElementsConsumer,
} from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { getCart } from "@/api/cart";

const Payment = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cart = await getCart();
                setCart(cart);
                console.log('Cart data:', cart);
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchData(); // Call the asynchronous function
    }, []);

    const makePayment = async () => {
        console.log('Payment made');
        const stripe = await loadStripe("pk_test_51OievMLRvvHordzTxBgFBNvqlLyx8Wylru1ghOmsfMUBn71u1ADBg0MZyPW3W2ns5kcY07v0UHlfLuA5m76pGGpj001k7i85fY");

        const body = {
            cart,
        }

        const headers = {
            'Content-Type': 'application/json'
        }

        const response = await fetch(`${apiUrl}/payment`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        console.log('Response:', response);

        const data = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: data.id
        });

        if (result.error) {
            console.log('Error:', result.error.message);
        }
    }

    return ( <div>
        <h1>Payment</h1>
        <Button
            onClick={makePayment}
        >Pay</Button>
    </div> );
}
 
export default Payment;