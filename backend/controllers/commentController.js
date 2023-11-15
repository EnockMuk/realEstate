
import express from 'express'
import { verifyToken } from '../midleware/verifyToken.js';
import { Comment } from '../models/Comment.js';

export const commentController= express.Router();

commentController.get('comment/:listing',async(req,res)=>{
    try {
        const comments= await Comment.find({comment:req.params.listing}).populate("author","-password");
        return res.status(200).json(comments)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


commentController.post('/comment',verifyToken,async(req,res)=>{
    try {
        const  createComment= await Comment.create({...req.body,author:req.user.id}).populate("author","-password");
        return res.status(200).json(createComment)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

commentController.delete('/delete/:id',verifyToken,async(req,res)=>{
    try {
        const idToDelete= await Comment.findById(req.params.id)
        if(idToDelete.author.toString() === req.user.id){
            await Comment.findByIdAndDelete(req.params.id)
            return res.status(200).json({ msg: "Comment has been successfully deleted" })
        } else {
            return res.status(403).json({ msg: "You are not allowed to delete this comment" })
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})