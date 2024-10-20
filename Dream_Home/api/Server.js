require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const ConnectToMongoDB = require('./database/db');
const SocketHandler = require('./socketHandle/Socket');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const conversationRoutes = require('./routes/conversation.routes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: process.env.FRONTEND_URL,  // Allow requests from this origin
        methods: ["GET,POST"],  // Allowed methods
        credentials: true  // Allow cookies to be sent
    }
});

//Connect to database
ConnectToMongoDB();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,  // Allow requests from this origin
        methods: ["GET,PUT,POST,DELETE"],  // Allowed methods
        credentials: true  // Allow cookies to be sent
    })
)

//Middlewares
app.use(express.json());
//Adding cookieParser middleware for storing our authtoken in the cookie
app.use(cookieParser());

// Initialize Passport without sessions
app.use(passport.initialize());
require('./passportAuth/Passport');

//ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/conversation', conversationRoutes);

//socketHandler
SocketHandler(io);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
