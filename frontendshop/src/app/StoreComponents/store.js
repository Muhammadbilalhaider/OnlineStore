import { configureStore } from "@reduxjs/toolkit";
import productReducer from './slice';
import cartReducer from './cartSlice'
import shippingReducer from './shippingcart'
const store = configureStore({
    reducer: {
        products: productReducer,
        cart: cartReducer,
        cartShipping: shippingReducer
    }
});

export default store;
