const User = require("../models/user-model")
const Contact = require("../models/contact-model")

const getAllUsers = async (req,res)=>{
  try {

     const users = await User.find(
      { deleted: false },       
      { password: 0 }            
    );
    if(!users || users.lenth === 0) {
     return  res.status(404).json({msg:"user not found"})
    }
    return res.status(200).json(users)
    
  } catch (error) {
    console.log(error);
    
  }
}

// singal user data ===>

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await User.findOne({ _id: id }, { password: 0 }).sort({ createdAt: -1 });
    return res.status(200).json({ data });
  } catch (error) {
    next(error); // ✅ Now it's defined
  }
};



    
// user delete ===>

const deleteUserById = async (req,res)=>{

  try {
    const { id } = req.params;

    const updated = await User.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User member not found" });
    }

    res.status(200).json({ message: "User member soft deleted successfully" });
  } catch (error) {
      next(error);
    res
      .status(500)
      .json({ message: "Failed to soft delete User member", error: error.message });
  }
}
// delete multi usr ==>
const deleteMultipleUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No user IDs provided for deletion" });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      message: `${result.modifiedCount} users soft deleted successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error soft deleting users", error: error.message });
  }
};
// singal user update ===>
const updateUserById = async (req,res) =>{
  try {
    const id = req.params.id;
    const updateUserData = req.body ;
    const updateData = await  User.updateOne({_id:id},{$set:updateUserData});
    return res.status(200).json(updateData)
  } catch (error) {
    console.log(error);
    next()
    
  }
}





module.exports={getAllUsers,deleteUserById,getUserById,updateUserById,deleteMultipleUsers};
