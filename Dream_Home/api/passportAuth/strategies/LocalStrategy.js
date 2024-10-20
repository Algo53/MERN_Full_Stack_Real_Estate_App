require('dotenv').config();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const User = require('../../database/models/User');

//Extract jwt token form the cookie
const cookieExtracter = (req) => {
    let token = null;
    if (req && req.cookies){
        token = req.cookies.token;
    }
    return token;
}

// JWT strategy for protecting routes
passport.use(new JWTStrategy(
    {
        secretOrKey: process.env.JWT_SECRET, 
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtracter])
    },
    async (token, cb) => {
        //Finding the user form the database 
        const user = await User.findById(token.id);
        if (user){
            return cb(null, user);
        }
        else{
            return cb(null, false);
        }
    }
))


// Local strategy for login with username and password
passport.use(new LocalStrategy(
    {
        usernameField: 'email' // Assuming you're using email for login
    },
    async (username, password, cb) => {
        try {
            const user = await User.findOne({email : username});    //Finding the user in the database 

            if (user)
            {
                const userPass = user.password;
                bcrypt.compare(password, userPass, (err, result) => {
                    if (err){
                        return cb(err, null);
                    }
                    else {
                        if (result) {
                            cb(null, user);
                        }
                        else{
                            cb(null, false, {message : "Invalid Credentials"});
                        }
                    }
                })
            }   
            else {
                cb(null, false, {message : "No User Found!"})
            }
        } catch (error) {   
            cb(error)
        }
    }))




