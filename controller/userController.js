import { User } from "../models/userModel.js";
import { generateToken } from "../config/jwtTokens.js";
import { validateId } from "../utils/validateMongoDbId.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const existedUser = await User.findOne({
      $or: [{ name }, { email }],
    });

    if (existedUser) {
      res.json({ error1: "error already registerd user " });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
    });

    if (user) res.json({ user: user });
  } catch (error) {
    console.log("error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPassWordMatched(password))) {
    const refreshToken =await generateRefreshToken(findUser?._id);
     const updateuser =await User.findOneAndUpdate(findUser?._id,{
      refreshToken:refreshToken,
     },
     {
      new :true
     }
     );
     res.cookie('refreshToken', refreshToken,{
      httpOnly:true,
      maxAge :72*60*60*1000,
     })

    res.json({
      _id: findUser?._id,
      name: findUser?.name,
      phone: findUser?.phone,
      email: findUser?.email,
      token: generateToken(findUser?._id),
    });
  } else {
    res.json({ error: "credentials error" });
  }
};

const logout = async (req, res) => {

  const cookie =req.cookies;
  if(!cookie?.refreshToken)
{
res.json({"error":"no refresh token"})
}
const refreshToken=cookie.refreshToken;
const user =await User.findOne({
  refreshToken
});
if(!user)
{
  res.clearCookie('refreshToken', {
    httpOnly:true,
    secure:true,
  });
  return res.sendStatus(204); //forbidden

}


await User.findOneAndUpdate({refreshToken}, {
  refreshToken : "",
},{
  new :true
});

res.clearCookie('refreshToken', {
  httpOnly:true,
  secure:true,
});
return res.sendStatus(204);

};


const handleRefreshToken =async(req, res)=>{

const cookie =req.cookies;
if(!cookie?.refreshToken)
{
res.json({"error":"no refresh token"})
}
const refreshToken=cookie.refreshToken;

const user =await User.findOne({
  refreshToken
});

if(!user)
{res.json({'error':"no refresh token presnet in DB or not matched "});
}
jwt.verify(refreshToken, "mysecret",(err, decoded) =>{
  if(err || user.id !== decoded.id)
  {
    res.json({"error":"there is something wrong with refresh token"})

  }
  const accessToken =generateToken(user?._id);
  res.json({accessToken});
   
}
)



}


const getAllUsers = async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    res.json("error of getAllUser");
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const aUser = await User.findById(id);
    res.json({
      aUser,
    });
  } catch (error) {
    res.json("error of getuser");
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  validateId(id);
  try {
    const aUser = await User.findByIdAndDelete(id);
    res.json({
      aUser,
    });
  } catch (error) {
    res.json("error of deleteUser");
  }
};

const updateUser = async (req, res) => {
  const { id } = req.user;
  validateId(id);
  try {
    const aUser = await User.findByIdAndUpdate(
      id,
      {
        name: req.body?.name,
        email: req.body?.email,
        phone: req.body?.phone,
      },
      {
        new: true,
      }
    );

    res.json({
      aUser,
    });
  } catch (error) {
    res.json("error of deleteUser");
  }
};

export { createUser, login, logout, getAllUsers, getUser, deleteUser, updateUser , handleRefreshToken};
