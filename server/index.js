const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes")
const messageRoute = require("./routes/messagesRoute")
const app = express();
// const socket = require("socket.io");
const port = 5000;
require("dotenv").config();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://chat-vibe-sigma.vercel.app');
  // Add other headers as needed
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// app.use(cors({
//     origin: 'https://chat-vibe-sigma.vercel.app',
//     method: ["POST", "GET"],
//     credentials: true
// }));

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

const server = app.listen(port, () => {    
        console.log(`Server started on port ${port}`);
});

const io = socket(server,{
    cors:{
        origin: "https://chat-vibe-sigma.vercel.app",
        credentials: true,
    },
});

const socket = io("ws://chat-vibe-sigma.vercel.app", {
  transports: ["websocket"]
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
