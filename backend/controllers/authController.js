import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt' 
import jwt from 'jsonwebtoken'

export const authController= express.Router();

authController.post('/register', async (req,res)=>{
    try {
        
        const oldUser=  await User.findOne({email:req.body.email});
        if(oldUser) {
            throw new Error (" This email is already in our database");
        }
        const hashedPassword= await bcrypt.hash(req.body.password,10)

       const newUser= await User.create({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword

       })
        
        const {password, ...others}=newUser._doc;

       // const token= jwt.sign({id:newUser._id},process.env.PRIVATE_KEY,{expiresIn:'1h'});
        return res.status(201).json({others})
    } catch (error) {
        res.status(500).json(error.message)
    }
})

.post('/login', async (req,res)=>{

    try {
        const user = await User.findOne({email:req.body.email})
        
    if(!user) {
         throw new Error ('you are not a member ')

    }

    const comparedPassword= await bcrypt.compare(req.body.password,user.password);
    if(!comparedPassword){
        throw new Error (" invalid password or email")
    }

    const {password, ...others}=user._doc;
    
    const token=  jwt.sign({id:user._id},process.env.PRIVATE_KEY,);

    return res.status(200).json({others,token})
    
    } catch (error) {
        res.status(500).json({message:error.message})
    }
    

})

