import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import { postsRouter } from './routes/posts_route';
import { commentsRouter } from './routes/comments_route';

const app = express();
dotenv.config();
const port = process.env.PORT;

const local_mongoose = require("mongoose");
local_mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;
db.on("error", (error: any) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

// app.use('/comments', commentRoutes);
app.get('/', (req, res) => {
    res.send("hello world")
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});