const User = require('../Models/userModel')

exports.signup = async (req,res,next)=>{
  try{
    const newUser = await User.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  }catch(error){
    console.log("Error in creating new User: => ",error)
    res.status(404).json({
      status:"failed",
      message:error
    })
  }
}