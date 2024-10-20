require('dotenv').config();
const Conversation = require('../database/models/Conversation');
const Message = require('../database/models/Message');


let onlineUser = [];

const addUser = (userId, socketId) => {
    const userExits = onlineUser.find((user) => user.userId === userId);
    if (!userExits) {
        onlineUser.push({ userId, socketId });
    }
}

const getUser = (userId) => {
    const user = onlineUser.find(user => user.userId === userId);
    return user ? user.socketId : null;
};

// const cookieExtracter = (req) => {
//     let token = null;
//     if (req && req.cookies) {
//         token = req.cookies.token;
//     }
//     return token;
// }

// //Middleware : authentication
// const authenticateSocketJwt = (socket, next) => {
//     //Selecting value of token from the socket connection
//     const token = cookieExtracter;
//     //Now if the connection does not contain any token return an error

//     if (!token) {
//         return next(new Error("Authenticate with a valid token"));
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
//         if (err) {
//             return next(new Error(err));
//         }

//         socket.user = decode;
//         next();
//     })
// }


//Socket request handler
const SocketHandler = (io) => {

    io.on('connection', (socket) => {
        console.log('Connected to socket');
        console.log('User Connected using socket', socket.id);

        socket.on('newUser', (userId) => {
            console.log("new user added : ", socket.id);
            addUser(userId, socket.id);
        })
        io.emit('getOnlineUsers', Object.keys(onlineUser));

        socket.on('sendMessage', async (data) => {
            const { newChat, propertyId } = data;

            const newData = new Message({
                sender: newChat?.sender,
                receiver: newChat?.receiver,
                chat: newChat?.chat,
                audio: newChat?.audio,
                file: newChat?.file
            })
            const newMessage = await newData.save();

            let conversation = await Conversation.findOne(
                {
                    property: propertyId,
                    participants: {
                        $all: [newChat?.sender, newChat?.receiver]
                    }
                }
            )

            if (!conversation) {
                conversation = new Conversation(
                    {
                        participants: [newChat?.sender, newChat?.receiver],
                        property: propertyId,
                        messages: []
                    }
                )
            }

            conversation.messages.push(newMessage._id);
            await conversation.save();

            const receiverSocket = getUser(newChat?.receiver);
            if (receiverSocket) {
                io.to(receiverSocket).emit("receiveMessage", {newMessage, propertyId});
            }
        })

        socket.on('disconnect', () => {
            console.log('User dissconnected', socket.id);
            onlineUser = onlineUser.filter(user => user.socketId !== socket.id);
            io.emit('getOnlineUsers', Object.keys(onlineUser));
        })
    })
}

module.exports = SocketHandler;