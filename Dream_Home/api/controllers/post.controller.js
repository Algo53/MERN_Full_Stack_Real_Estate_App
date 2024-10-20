const Favorite = require("../database/models/Favorite");
const Property = require("../database/models/Property");
const User = require("../database/models/User");


const singlePost = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await Property.findById(id).populate("owner", { "avatar": 1, "name": 1 });
        res.status(200).json({ success: true, post: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

const allPost = async (req, res) => {
    try {
        // const { city, minPrice, maxPrice, bedRoom } = req.body;
        let query = {};

        // // Add city filter if it's provided
        // if (city) {
        //     query.address.city = city;
        // }

        // // Add price filter if minPrice or maxPrice is provided
        // if (minPrice || maxPrice) {
        //     query.price = {};
        //     if (minPrice) {
        //         query.price.$gte = Number(minPrice); // Greater than or equal to minPrice
        //     }
        //     if (maxPrice) {
        //         query.price.$lte = Number(maxPrice); // Less than or equal to maxPrice
        //     }
        // }

        // // Add bedRooms filter if it's provided
        // if (bedRoom) {
        //     query.bedrooms = Number(bedRoom);
        // }
        const response = await Property.find();
        res.status(200).json({ success: true, post: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

const allUserPost = async (req, res) => {
    try {
        const id = req.user._id;
        if (id !== req.params.id) {
            res.status(401).json({ success: false, message: "Unauthorized Access!" });
        }
        const response = await Property.find({ owner: id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, post: response });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

const addPost = async (req, res) => {
    try {
        const id = req.user._id;
        if (id !== req.params.id) {
            res.status(401).json({ success: false, message: "Unauthorized Access!" });
        }

        const { title, description, price, address, type, size, bedrooms, bathrooms, images, contactOwner, features } = req.body;

        const post = await Property.create({
            owner: id,
            title,
            description,
            price,
            address,
            type,
            size,
            bedrooms,
            bathrooms,
            images,
            contactOwner,
            features
        })
        const newPost = await post.save();
        const alluserpost = await Property.find({ owner: id });
        return res.status(200).json({ success: true, post: alluserpost });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

const updatePost = async (req, res) => {
    try {
        const id = req.user._id;
        if (id !== req.params.id) {
            res.status(401).json({ success: false, message: "Unauthorized Access!" });
        }

        const { post_id, title, description, price, address, type, size, bedrooms, bathrooms, images, contactOwner, features } = req.body;
        const post = await Property.findByIdAndUpdate(
            {_id : post_id},
            {
                owner: id,
                title,
                description,
                price,
                address,
                type,
                size,
                bedrooms,
                bathrooms,
                images,
                contactOwner,
                features
            }, 
            {new: true, runValidators: true}
        );
        
        const alluserpost = await Property.find({ owner: id });
        return res.status(200).json({ success: true, post: alluserpost });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}

const bookmarkPost = async (req, res) => {
    try {
        const id = req.user._id;
        if (id !== req.params.id) {
            res.status(401).json({ success: false, message: "Unauthorized Access!" });
        }
        const { postId } = req.body;

        const updateProperty = await Property.findByIdAndUpdate(
            { _id: postId },
            { $setOnInsert: { savedByUser: id } },  // Create if not found
            { new: true, upsert: true } // Return the updated or created doc
        )

        let savedList = await User.findByIdAndUpdate(
            { _id: id },
            { $push: { savedProperties: postId } }, // Create if not found
            { new: true, upsert: true, }, // Return the updated or created doc
        ).populate('savedProperties').exec();

        return res.status(200).json({ success: true, savedList: savedList.savedProperties });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })

    }
}

const removeSavedPost = async (req, res) => {
    try {
        const id = req.user._id;
        if (id !== req.params.id) {
            res.status(401).json({ success: false, message: "Unauthorized Access!" });
        }
        const { postId } = req.body;

        const updatedProperty = await Property.findByIdAndUpdate(
            { _id: postId },
            { $pull: { savedByUser: id } },
            { new: true }
        );

        let savedList = await User.findByIdAndUpdate(
            { _id: id },
            { $pull: { savedProperties: postId } },
            { new: true, upsert: true, },
        ).populate('savedProperties').exec();

        return res.status(200).json({ success: true, savedList: savedList.savedProperties });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })

    }
}

const getSavedPost = async (req, res) => {
    try {
        const id = req.user._id;
        if (id !== req.params.id) {
            res.status(401).json({ success: false, message: "Unauthorized Access!" });
        }
        let list = await User.findById({ _id: id }).populate('savedProperties').exec();
        return res.status(200).json({ success: true, savedList: list.savedProperties });
    } catch (error) {
        return res.status(500).json({ success: false, message: error })

    }
}

module.exports = { singlePost, allUserPost, allPost, updatePost, addPost, bookmarkPost, removeSavedPost, getSavedPost };