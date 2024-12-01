import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;

const local_mongoose = require("mongoose");
local_mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;
db.on("error", (error: any) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use('/comments', commentRoutes);
app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});