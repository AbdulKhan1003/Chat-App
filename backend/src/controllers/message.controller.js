import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/message.model.js"
import User from "../models/user.model.js"

export const getUserForSidebar = async (req,res) =>{
    try {
        const loggedInUserId = req.user._id //protected route haii only authorized users can use
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password") //mtlb login user ke ilawa saray users ajain aur password k ilawa saari fields
        return res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("error in getUserForSidebar controller", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id
    
        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("error in getMessages controller", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }

}

export const sendMessages = async (req,res) =>{
    try {
        const {text,image} = req.body
        const senderId = req.user._id
        const {id:receiverId} = req.params
        
        let imageUrl;
        if(image){
            const uploadResponce = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponce.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        const recieverSocketId= getReceiverSocketId(receiverId)
        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }
        
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("error in sendMessages controller", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}