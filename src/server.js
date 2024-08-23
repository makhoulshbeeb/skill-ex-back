import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`);
});