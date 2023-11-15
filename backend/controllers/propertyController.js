import express from 'express';
import Properties from '../models/Properties.js';
import { verifyToken } from '../midleware/verifyToken.js';

export const propertyController=express.Router();

propertyController.get('/',async(req,res)=>{

    try {
        const properties= await Properties.find({}).populate("currentOwner","-password")
        return res.status(200).json(properties)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

propertyController.get('/find/featured',async(req,res)=>{
    try {
        const featuredProperties= await Properties.find({featured:true}).populate("currentOwner","-password");
        return res.status(200).json({featuredProperties})
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

//get all types
propertyController.get('/find', async(req,res)=>{
    const type= req.query;
    let properties=[];
    try {

        if(type) {
            properties= await Properties.find(type).populate("currentOwner","-password");
        }
        else{
            properties= await Properties.find({})
        }
      
       return res.status(200).json(properties)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// FETCH TYPE OF PROPERTIES

propertyController.get('/find/types',async(req,res)=>{

    try {
        const typeBeach= await Properties.countDocuments({type:'beach'});
        const typeMountain= await Properties.countDocuments({type:'mountain'});
        const typeVillage= await Properties.countDocuments({type:'village'});
        return res.status(200).json({beach:typeBeach, mountain:typeMountain, village:typeVillage})
        
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// fetch my properties

propertyController.get('/find/myProperties',verifyToken, async (req,res)=>{

    try {
        const myProperties= await Properties.find({currentOwner:req.user.id});
        return res.status(200).json(Properties)
        
    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

// fetch my bookmarked properties

propertyController.get('/find/bookmarkedProperties',verifyToken,async(req,res)=>{
    try {
        const myBookmarkedProperties= await Properties.findOne({bookmarkedUsers:{$in:[req.user.id]}});
        return res.status(200).json({myBookmarkedProperties})
    } catch (error) {
        res.status(500).json({message:error.message})
    }

})

// fetch a particular property

propertyController.get('/find/:id',async(req,res)=>{
    try {
        const property= await Properties.findById(req.params.id).populate('currentOwner','-password');
        if(!property){
            throw new Error('There is no property with this id')
        }
        else {
            return res.status(200).json({property})
        }
        
        
    } catch (error) {
        res.status(500).json({message:error.message}) 
    }
})

// create a property or estate

propertyController.post('/createEstate',verifyToken,async(req,res)=>{
    try {
        const estateCreated= await Properties.create({...req.body, currentOwner:req.user.id});
        return res.status(200).json({estateCreated})
    } catch (error) {
        res.status(500).json({message:error.message}) 
    }
})

// update estate

propertyController.put('/updateEstate/:id',verifyToken,async(req,res)=>{
    try {
        const updateProperty= await Properties.findById(req.params.id);
        if(updateProperty.currentOwner.toString()!==req.user.id){
            throw new Error('you are not allowed to update this property')
        }
        const newProperty= await Properties.findByIdAndUpdate(req.user.id,{$set:req.body,},{new:true})

        return res.status.json({newProperty})
    } catch (error) {
        return res.status(500).json(error)
    }

})

// delete estate
propertyController.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const property = await Properties.findById(req.params.id)
        if (property.currentOwner.toString() !== req.user.id) {
            throw new Error("You are not allowed to delete this property")
        }

        await property.delete()

        return res.status(200).json({ msg: "Successfully deleted property" })
    } catch (error) {
        return res.status(500).json(error)
    }
})
// bookmark/unBookmark estate

propertyController.put('/updateBookmark/:id',verifyToken,async(req,res)=>{

    try {
        let property = await Properties.findById(req.params.id)
        if (property.currentOwner.toString() === req.user.id) {
            throw new Error("You are not allowed to bookmark your project")
        }


        if (property.bookmarkedUsers.includes(req.user.id)) {
            property.bookmarkedUsers = property.bookmarkedUsers.filter(id => id !== req.user.id)
            await property.save()
        } else {
            property.bookmarkedUsers.push(req.user.id)

            await property.save()
        }

        return res.status(200).json(property)
        
    } catch (error) {
        return res.status(500).json(error)
    }
})