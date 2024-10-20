const Conversation = require("../database/models/Conversation");
const Property = require("../database/models/Property");

const getSingleUserMessages = async (req, res) => {
    try {
        const id = req.user._id;
        const { friendId } = req.body;
        const chats = await Conversation.find({
            participants: {
                $all: [id, friendId]
            }
        }).populate('property', 'title id').populate('messages', 'sender receiver chat audio file createdAt');
        res.status(200).json({ success: true, messages: chats});
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Internal Server Error!" });
    }
}

const singlePropertyMessages = async (req, res) => {
    try {
        const id = req.user._id;
        const { friendId, propertyId } = req.body;

        console.log(req.body);
        const chats = await Conversation.findOne({
            participants: {
                $all: [id, friendId]
            }
        }).populate('messages', 'sender receiver chat audio file createdAt');

        const singlePropertyMessages = chats.filter( (item) => item.Property._id === propertyId);
        console.log("Last final messages are ", singlePropertyMessages);
        res.status(200).json({ success: true, messages: singlePropertyMessages });
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Internal Server Error!" });
    }
}

const getAllMessages = async (req, res) => {
    try {
        const id = req.user._id;

        const chats = await Conversation.find({
            participants: {
                $in: [id]
            }
        });
        let friendIds = [];

        // Initialize friendIds as an empty array
        friendIds.push(...chats.map(chat => {
            const otherParticipants = chat.participants.filter(participant => participant.toString() !== id);
            return (otherParticipants.toString())
        }));

        // Flatten the array of arrays
        friendIds = friendIds.flat();

        // Remove duplicates using a Set
        const uniqueFriendIds = [...new Set(friendIds)];

        res.status(200).json({ success: true, messages: uniqueFriendIds });
    } catch (error) {
        res.status(500).json({ success: false, message: error || "Internal Server Error!" });
    }
}

module.exports = { getAllMessages, singlePropertyMessages, getSingleUserMessages };