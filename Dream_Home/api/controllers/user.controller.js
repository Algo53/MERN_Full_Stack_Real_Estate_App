const User = require("../database/models/User");

const findUser = async(req, res) => {
    try {
        const {id} = req.body;
        const response = await User.findById({_id : id}).select("-password -email -phoneNumber -savedProperties:");

        res.status(200).json({success : true, user: response});
    } catch (error) {
        return res.status(500).json({success : false, message : error.message})
    }
}

const getUserDetails = async(req, res) => {
    try {
        const id = req.user._id;
        const response = await User.findById(id).select('-password');

        res.status(200).json({success : true, user: response});
    } catch (error) {
        return res.status(500).json({success : false, message : error.message})
    }
}

const updateUserDetails = async(req, res) => {
    try {
        const id = req.user._id;
        if(id !== req.params.id){
            return res.status(401).json({success : false, message : "Unauthorized Access!"})
        }
        
        const {name, email, avatar, phoneNumber, role} = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {name, email, avatar, phoneNumber, role},
            {new : true, runValidators: true} // runValidators used to enable/run the schema validation before saving the data in database 
        );

        if (!updatedUser){
            return res.status(404).json({ success: false, message: "User not found!"});
        }

        return res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        return res.status(500).json({success : false, message : error.message})
    }
}


module.exports = {findUser, getUserDetails, updateUserDetails};