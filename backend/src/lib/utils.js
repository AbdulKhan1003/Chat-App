import jwt from "jsonwebtoken"

export const generateToken = (userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:'7d'
    } )
    res.cookie("JWT",token,{
        maxAge:7 * 24 * 60 * 60 * 1000, //7days in MS
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"  //dev phase me i think http hoga is liye secure work ni krega. CHATGPT or 39.40min in video
    })

    return token
}