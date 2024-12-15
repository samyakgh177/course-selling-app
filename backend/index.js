require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')

const { userRouter } = require("./routes/user")
const { courseRouter } = require("./routes/course")
const { adminRouter } = require("./routes/admin")
const app = express();
//if user send data with json then use 
app.use(express.json());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);



async function main() {
    await mongoose.connect(process.env.DB_URL);
    app.listen(3000);
    console.log("listing on  port 3000")
}

main()