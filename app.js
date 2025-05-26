const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const router = require("./src/module/auth/authApi");
const todoRouter = require("./src/module/todo/todoApi");
require("dotenv").config()
const app = new express();


// ✅ CORS configuration
// ✅ CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", // allow frontend Vite app
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed HTTP methods
    credentials: true, // if you're using cookies or auth headers
};

app.use(cors(corsOptions)); // ✅ apply CORS middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const dbPort = process.env.DB_URL

mongoose.connect(dbPort).then((res) => {
    console.log(`Database connection successfully`)
}).catch((err) => {
    console.log(`Database connection fail`)
})



app.get("/", async (req, res) => {
    res.json({
        status: "success",
        msg: "Server run successfully"
    })
});

app.get("/api/v1/route2",async(req,res)=>{
    res.status(200).json({
        status:"success",
        msg : "Home router"
    })
})


// auth routes 
app.use("/api/v1/auth", router);
// todo api
app.use("/api/v1/todo", todoRouter )










module.exports = app