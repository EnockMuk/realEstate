import mongoose from "mongoose";

const {Schema,model}=mongoose
const PropertiesSchema= new Schema({
    currentOwner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
        min:6
    },
    type:{
        type:String,
        enum:["beach","mountain","village"],
        required:true
    },
    desc:{
        type:String,
        required:true,
        min:50
    },
    img:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:1
    },
    featured:{
        type:Boolean,
        default:false

    },
    bookmarkedUsers:{
        type: [String],
        default: []
    },
    
},{timestamps: true})
const Properties = model("Property", PropertiesSchema)

export default Properties;