require('dotenv').config();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");


const loginController = async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send({ success: false, message: info.message || 'Login failed' });

        //If everthing right then generate the jwt token
        const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 * 24 * 7 });

        //Generate the cookie token
        res.cookie("token", authToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }).status(200).json({ success: true, message: "Login sucessfully" });
    })(req, res, next);
}

const loginSucess = async(req, res) => {
    try {
        const user = req.user
        
        if(user) res.status(200).json({ success: true, message: "Login sucessfully" });
        else res.status(400).json({success: false, message: "Login failed"})
    } catch (error) {
        res.status(500).json({success: false, message:"error" || "Internal server error try after some time"})
    }
}

const googleLogin = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login' }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send({ success: false, message: info.message || 'Login failed' });

        //Creating a token using the jsonwebtoken and send it back to the user
        const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 * 24 * 7 });

        //Generate the cookie token
        res.cookie('token', authToken, {
            httpOnly: true,
            secure: true.valueOf,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }).status(200).redirect(`${process.env.FRONTEND_URL}`);
    })(req, res, next);
}

const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //Checking in the database if any user already exist with this email address
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist. Please try with another email address" });
        }

        //Hashing the password and store the user information in the database
        const salt = await bcrypt.genSalt(10);
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                res.status(400).json(err);
            }
            else {
                const result = await User.create({
                    name,
                    email,
                    password: hash
                })
                const user = await result.save();

                //Creating a token using the jsonwebtoken and send it back to the user
                const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: 1000 * 60 * 60 * 24 * 7 });

                //Generate the cookie token
                return res.cookie('token', authToken, {
                    httpOnly: true,
                    secure: true.valueOf,
                    maxAge: 1000 * 60 * 60 * 24 * 7
                }).status(200).json({ success: true, message: "Register sucessfully" });
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

const logoutController = async (req, res) => {
    try {
        //Destroying the cookie
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "Logout successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

module.exports = { loginController, loginSucess, googleLogin, registerController, logoutController };