import mongoose from "mongoose";

const {Schema,model}=mongoose
const CommentSchema = new Schema({
    listing: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const Comment = model("Comment", CommentSchema)