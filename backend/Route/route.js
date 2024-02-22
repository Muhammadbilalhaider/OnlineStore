const multer = require('multer');
const express = require('express');
const { SignUp, SignIn, updateUser, GetForgot_Password, PostForgot_Password, postResetPass } = require('../RouteControl/UserControl');
const { AddProducts, GetAllProducts, updateProducts,
    deleteProduct, AddCartProducts, UpdateCartProducts, GetdetailsProduct, GetCartProducts, shippingProducts } = require('../RouteControl/ProductControl');
const auth = require('../Middleware/auth');
const authUser = require('../Middleware/authUser');
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
router.post('/SignUp', upload.single('profilePic'), SignUp);
router.post('/SignIn', SignIn);

router.put('/UpdateUser/:id', authUser, updateUser);
router.post('/forgotpassword', PostForgot_Password);
router.get('/forgotPassword/:id/:token', GetForgot_Password);
router.post('/resetPassword', postResetPass);

router.get('/AllProduct', GetAllProducts);
router.post('/AddProduct', AddProducts);
router.get('/detailProduct/:id', GetdetailsProduct);
router.post('/updateProduct/:id', auth, updateProducts);
router.delete('/deleteProduct/:id', auth, deleteProduct);

router.post('/AddCartProduct/:id', authUser, AddCartProducts);
router.put('/UpdateCartProduct/:id', authUser, UpdateCartProducts);
router.get('/GetCartProducts/:id', authUser, GetCartProducts);


router.post('/shipping', authUser, shippingProducts)

module.exports = router;