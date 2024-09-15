import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("callUser", (data) => {
        io.to(userSocketMap[data.userToCall._id]).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    });

    socket.on("answerCall", (data) => {
        io.to(userSocketMap[data.to._id]).emit("callAccepted", data.signal)
    });

    socket.on("videoChat", (newMessage) => {
        io.to(userSocketMap[newMessage.receiverId]).emit("videoChat", newMessage)
    });

    socket.on("callEnded", (data) => {
        io.to(userSocketMap[data.to._id]).emit("callEnded")
    });
});

export { app, io, server };