const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
    cartShipping: [],
};

const cartSlice = createSlice({
    name: 'cartShipping',
    initialState,
    reducers: {
        setCartItems: (state, action) => {
            state.cartShipping = action.payload;
        },
    },
});

export const { setCartItems } = cartSlice.actions;
export default cartSlice.reducer;
