const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messageRoute = require("./routes/messagesRoute")
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors({

        origin: ["https://chat-vibe-front-end.vercel.app/"],
        methods: ["POST", "GET"],
        credentials: true,
   
}));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose.connect("mongodb+srv://asim119913:AsimS119913@chatapp.jbwoqag.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log("DB Connection Success")
}).catch((err) =>{
    console.log(err.message);
});

// connectDB();

const server = app.listen( () => {
  console.log("Server started on port 5000");
});

const io = socket(server,{
    cors:{
        origin: "https://chat-vibe-front-end.vercel.app/",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) =>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    })
});
