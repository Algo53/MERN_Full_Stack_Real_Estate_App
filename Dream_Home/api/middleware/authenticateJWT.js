require('dotenv').config();
const jwt = require('jsonwebtoken');

//Extract jwt token form the cookie
const cookieExtracter = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.token;
    }
    return token;
}

//Creating a middleware for accessing the protected routes
const authenticateJWT = (req, res, next) => {
    try {
        const token = cookieExtracter(req);
        if (!token) {
            res.status(401).send({ error: "Please authenticate using a valid token" })
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        //Storing the user in the req.user and call callback function
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error || "Server Error" });
    }
}

module.exports = authenticateJWT;