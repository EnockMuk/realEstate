import mongoose from "mongoose";
import 'dotenv/config';
import cors from 'cors'
import express, { urlencoded } from 'express'
import { authController } from "./controllers/authController.js";
import { propertyController } from "./controllers/propertyController.js";
import { yachtController } from "./controllers/YachtController.js";
import { commentController } from "./controllers/commentController.js";
import { userController } from "./controllers/userController.js";
import { uploadController } from "./controllers/uploadController.js";

const app= express();
mongoose.connect(process.env.LINK)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())



app.use('/auth',authController)
app.use('/property',propertyController)
app.use('/comment',commentController)
app.use('/user',userController)
app.use('/yacht',yachtController)
app.use('/upload',uploadController)



app.listen(process.env.PORT ,()=>console.log(`We are connected to ${process.env.PORT }`))