const userModel = require('../Model/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const SECRET_N = process.env.SECRET_KEY;
const AdminMail = process.env.AdminMail;
const nodemailer = require('nodemailer');
console.log("AdminMail:", AdminMail);

const SignUp = async (req, resp) => {
    const { name, email, password } = req.body;
    const profilePic = req.file.buffer.toString('base64');
    const existUser = await userModel.findOne({ email: email });

    const isAdmin = email === AdminMail;

    if (existUser) {
        resp.status(400).json({ message: "Already Registered" });
    } else {
        const hashPass = await bcrypt.hash(password, 10);
        const result = await userModel.create({
            isAdmin: isAdmin,
            name: name,
            email: email,
            profilePic: profilePic,
            password: hashPass,
        });

        const token = await jwt.sign({ isAdmin: result.isAdmin, name: result.name, email: result.email, profilePic: result.profilePic, id: result._id }, SECRET_N);
        resp.status(200).json({ user: result, token });
    }
};


const updateUser = async (req, resp) => {
    try {
        const { name, email } = req.body;
        const { id } = req.params;

        // Check if a new profile picture is provided
        let profilePic;
        if (req.file) {
            profilePic = req.file.buffer.toString('base64');
        }

        // Build the update object with only provided fields
        const updateObject = {};
        if (name) {
            updateObject.name = name;
        }
        if (email) {
            updateObject.email = email;
        }
        if (profilePic) {
            updateObject.profilePic = profilePic;
        }

        // Use the $set operator to only update provided fields
        const result = await userModel.findByIdAndUpdate(id, { $set: updateObject }, { new: true });

        resp.status(201).json(result);
    } catch (error) {
        resp.status(400).json({ message: error.message });
    }
};




const SignIn = async (req, resp) => {
    const { email, password } = req.body;
    try {
        const currentUser = await userModel.findOne({ email: email });
        const isAdmin = email === AdminMail;
        if (!currentUser) {
            resp.status(400).json({ message: 'Not Registered' })
        }
        else {
            const checkPass = await bcrypt.compare(password, currentUser.password);
            if (!checkPass) {
                resp.status(400).json({ message: 'Password Not Matched' })
            } else {
                const token = await jwt.sign({ isAdmin: currentUser.isAdmin, name: currentUser.name, email: currentUser.email, profilePic: currentUser.profilePic, id: currentUser._id }, SECRET_N);
                await resp.status(200).json({ user: currentUser, token });
            }
        }
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }



};


const GetForgot_Password = async (req, resp) => {
    const { email } = req.body;
    const { token } = req.params;

    try {
        const secret = SECRET_N;
        const payload = await jwt.verify(token, secret);
        const userEmail = payload.email;

        resp.status(200).json({ email: userEmail });
    } catch (error) {
        resp.status(400).json({ message: 'Invalid or expired token' });
    }
};



const PostForgot_Password = async (req, resp) => {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'haiderb894@gmail.com',
            pass: 'aqox qphq zhgy xwia',
        },
    });

    try {
        const existUser = await userModel.findOne({ email: email });

        if (!existUser) {
            resp.status(400).json({ message: 'User Not registered' });
        } else {

            const secretKey = SECRET_N;


            const token = await jwt.sign({ email: email }, secretKey, { expiresIn: '15m' });


            const link = `http://localhost:3000/pages/resetpassword/${token}`;
            const mailOptions = {
                from: 'muhammadbilalhaider91@gmail.com',
                to: email,
                subject: 'Password Reset Link',
                text: `Click on the following link to reset your password: ${link}`,
            };

            await transporter.sendMail(mailOptions);

            resp.status(200).json({ message: 'Password reset link sent to the email' });
        }
    } catch (error) {
        resp.status(400).json({ message: error.message });
    }
};



const getResetPass = async (req, resp) => {

}


const postResetPass = async (req, resp) => {
    const { token, password } = req.body;
    const decodedPayload = jwt.decode(token);
    console.log('Decoded Payload:', decodedPayload);

    console.log('Tokennn ', token)
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);


        const email = payload.email;
        const existUser = await userModel.findOne({ email: email });

        if (!existUser) {
            resp.status(400).json({ message: 'User not found' });
            return;
        }
        existUser.password = await bcrypt.hash(password, 10);
        await existUser.save();

        await resp.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        resp.status(400).json({ message: error.message });
    }
};






module.exports = { SignUp, SignIn, updateUser, GetForgot_Password, PostForgot_Password, postResetPass };
