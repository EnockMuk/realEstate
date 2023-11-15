
import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next) =>{

    if(!req.headers.authorization) return res.status(403).json({message:"You are not authorized"})

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,process.env.PRIVATE_KEY,(error,data)=>{

            if(error) res.status(403).json({message:error})
            else {
                req.user=data;
                next()
        }
        })
    }
}