const productModel = require("../Model/ProductModel");
const cartModel = require("../Model/CartModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Model/UserModel");
require("dotenv").config();
const SECRET_N = process.env.SECRET_KEY;
const stripe = require('stripe')(process.env.StripeKey)
const AddProducts = async (req, resp) => {
  try {
    const {
      name,
      image,
      category,
      brand,
      price,
      rating,
      numReview,
      countInStock,
      description,
    } = req.body;

    const result = await productModel.create({
      name: name,
      image: image,
      category: category,
      brand: brand,
      price: price,
      rating: rating,
      numReview: numReview,
      countInStock: countInStock,
      description: description,
    });

    await resp.status(200).json(result);
  } catch (error) {
    resp.status(400).json({ message: error.message });
  }
};

const GetAllProducts = async (req, resp) => {
  const result = await productModel.find();
  await resp.status(200).json(result);
};
const GetdetailsProduct = async (req, resp) => {
  const { id } = req.params;
  const result = await productModel.findById(id);
  await resp.status(200).json(result);
};
const updateProducts = async (req, resp) => {
  try {
    const { id } = req.params;

    const {
      name,
      image,
      category,
      brand,
      price,
      rating,
      numReview,
      countInStock,
      description,
    } = req.body;

    if (!id) {
      return resp
        .status(400)
        .json({ message: "Product ID is required for update" });
    }

    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        image,
        category,
        brand,
        price,
        rating,
        countInStock,
        description,
        numReview,
      },
      { new: true }
    );

    if (!result) {
      return resp.status(404).json({ message: "Product not found" });
    }
    resp.status(200).json(result);
  } catch (error) {
    resp.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, resp) => {
  const { id } = req.params;
  const result = await productModel.findByIdAndDelete(id);
  let delItem = await resp.status(200).json(result);
  if (delItem) {
    await resp.status(200).json({ message: "Deleted" });
  }
};

const AddCartProducts = async (req, resp) => {
  try {
    const {
      name, image, category, brand, qty, price, rating, numReview, countInStock, description,
    } = req.body;

    const { id } = req.params;
    const userId = req.user.id;
    const result = await cartModel.create({
      productID: id,
      userId: userId,
      name: name,
      image: image,
      category: category,
      brand: brand,
      price: price,
      rating: rating,
      numReview: numReview,
      countInStock: countInStock,
      description: description,
      qty: qty,
    });
    await resp.status(200).json(result);
  } catch (error) {
    resp.status(400).json({ message: error.message });
  }
};

const GetCartProducts = async (req, resp) => {
  // const { id } = req.params;
  const userId = req.user.id;

  const cartProducts = await cartModel.find({ userId: userId });
  await resp.status(200).json(cartProducts)
}

const UpdateCartProducts = async (req, resp) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { numberProducts, price } = req.body;

    if (!id || !userId) {
      return resp
        .status(400)
        .json({ message: "Both id and userId are required for update" });
    }

    const cartProduct = await cartModel.findById(id);
    if (!cartProduct) {
      return resp.status(404).json({ message: "Cart product not found" });
    }

    // Check if there are enough items in stock
    if (cartProduct.countInStock < Math.abs(qty)) {
      return resp.status(400).json({ message: "Not enough items in stock" });
    }

    const updatedCartProduct = await cartModel.findByIdAndUpdate(
      id,
      { price, numberProducts },
      { new: true }
    );
    const updatedProduct = await productModel.findByIdAndUpdate(
      cartProduct.productID,
      { $inc: { countInStock: -numberProducts } },
      { new: true }
    );

    resp.status(200).json({ updatedCartProduct, updatedProduct });
  } catch (error) {
    resp.status(400).json({ message: error.message });
  }
};

const deleteCartProducts = (req, resp) => { };



const shippingProducts = async (req, resp) => {
  const userId = req.user.id;
  console.log('ID IS ', userId);
  try {
    const productDetails = await cartModel.find({ userId: userId });
    console.log('Products are ', productDetails);
    if (!productDetails) {
      resp.status(404).json({ error: 'Cart not found for the user' });
      return;
    }
    // const lineItems = productDetails.map(product => ({
    //   price_data: {
    //     currency: 'pkr',
    //     product_data: {
    //       name: product.name
    //     },
    //     unit_amount: product.price * 100,
    //   },
    //   quantity: product.qty
    // }));
    const lineItems = productDetails.map(product => ({
      price_data: {
        currency: 'pkr',

        product_data: {
          name: product.name
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qty
    }))
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://localhost:3000/success',
      cancel_url: 'https://localhost:3000/cancel',
      customer_email: req.user.email,
    })
    resp.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    resp.status(500).json({ error: 'Unable to create checkout session' });
  }
};




module.exports = {
  AddProducts,
  GetAllProducts,
  AddCartProducts,
  UpdateCartProducts,
  deleteCartProducts,
  updateProducts,
  deleteProduct,
  GetdetailsProduct,
  GetCartProducts,
  shippingProducts
};
