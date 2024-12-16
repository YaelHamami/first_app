import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import { postsRouter } from './routes/posts_route';
import { commentsRouter } from './routes/comments_route';
import local_mongoose from "mongoose";
import { authRouter } from './routes/auth_route';

const app = express();
dotenv.config();
const port = process.env.PORT;

local_mongoose.connect(process.env.DB_CONNECTION);
const db = mongoose.connection;
db.on("error", (error: Error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.get('/', (req, res) => {
    res.send("hello world")
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});