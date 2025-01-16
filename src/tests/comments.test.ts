import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { commentModel } from "../models/comments_model";
import { Express } from "express";
import commentsMock from "./commentsMock.json";
import postsMock from "./postsMock.json";
import { userModel } from "../models/users_model";
import { User } from "./common";
import { postModel } from "../models/posts_model";
import { Post } from "./common";

var app: Express;

const testUser: User = {
    userName: "testUser",
    email: "test@user.com",
    password: "testpassword",
}

const testUser2: User = {
    userName: "testUser2",
    email: "test@user2.com",
    password: "testpassword2",
}

const testPost: Post = {
    title: postsMock[0].title,
    _id: "",
    ownerId: "",
    content: postsMock[0].content
}

const BadCommentId = 5
const NonExsistcommentId = "67891771c1dedc3f3f11e04d"

beforeAll(async () => {
    console.log("beforeAll");
    app = await initApp();
    await postModel.deleteMany();
    await commentModel.deleteMany();
    await userModel.deleteMany();
    
    // create testUser
    await request(app).post("/auth/register").send(testUser);
    const loginRes = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = loginRes.body.accessToken;
    testUser.refreshToken = loginRes.body.refreshToken;
    testUser._id = loginRes.body._id;

    // create testUser2
    await request(app).post("/auth/register").send(testUser2);
    const loginRes2 = await request(app).post("/auth/login").send(testUser2);
    testUser2.accessToken = loginRes2.body.accessToken;
    testUser2.refreshToken = loginRes2.body.refreshToken;
    testUser2._id = loginRes2.body._id;

    // Create a post required for the comment
    const portResponse = await request(app).post("/posts").send({
        title: postsMock[0].title,
        content: postsMock[0].content
    }).set(
        { authorization: "JWT " + testUser.accessToken }
    );

    testPost.ownerId = portResponse.body.ownerId
    testPost._id = portResponse.body._id
});

afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
});

let commentId = "";

describe("Comments Tests", () => {
    test("Comments test get all - when no postId is provided", async () => {
        const response = await request(app).get("/comments").set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });
    test("Test Success Create Comment", async () => {
        const response = await request(app).post("/comments").set(
            { authorization: "JWT " + testUser.accessToken }
        ).send({
            content: commentsMock[0].content,
            postId: testPost._id
        },);

        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe(commentsMock[0].content);
        expect(response.body.postId).toBe(testPost._id);
        expect(response.body.ownerId).toBe(testUser._id);
        commentId = response.body._id;
    });

    test("Test Fail Create Comment - Non Exsisting Post", async () => {
        const response = await request(app).post("/comments").set(
            { authorization: "JWT " + testUser.accessToken }
        ).send(commentsMock[0]);

        expect(response.statusCode).toBe(404);
    });

    test("Test Fail Create Comment - Bad Token", async () => {
        const response = await request(app).post("/comments").set(
            { authorization: "JWT " + badToken }
        ).send(commentsMock[0]);

        expect(response.statusCode).toBe(401);
    });

    test("Test Fail Create Comment - One or more Required fields are missing.", async () => {
        const response = await request(app).post("/comments").set(
            { authorization: "JWT " + testUser.accessToken }
        ).send({postId: testPost._id});

        expect(response.statusCode).toBe(400);
    });

    test("Test Comments get by id", async () => {
        const response = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(commentsMock[0].content);
        expect(response.body.postId).toBe(testPost._id);
        expect(response.body.ownerId).toBe(testUser._id);
    });

    test("Test get comments by postId", async () => {
        const response = await request(app).get("/comments?postId=" + testPost._id).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe(commentsMock[0].content);
        expect(response.body[0].postId).toBe(testPost._id);
        expect(response.body[0].ownerId).toBe(testUser._id);
    });

    test("Test get comment by postID- bad Request", async () => {
        const response = await request(app).get("/comments?postId=" + commentsMock[0].content).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(500);
    });

    test("Test fail Update Comment - Non Exsisting Id", async () => {
        const response = await request(app).put("/comments/" + NonExsistcommentId ).send(commentsMock[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );

        // No such commentId
        expect(response.statusCode).toBe(404);
    });

    test("Test fail Update Comment - Internal Server Error - Bab Formatted Id", async () => {
        const response = await request(app).put("/comments/" + BadCommentId ).send(commentsMock[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        // Mal Formatted commentId
        expect(response.statusCode).toBe(500);

        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
    });

    test("Test fail Update Comment - Post does Not exist", async () => {
        const response = await request(app).put("/comments/" + commentId).send(commentsMock[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        // such PostId does not exist
        expect(response.statusCode).toBe(404);

        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
        expect(response2.body.content).toBe(commentsMock[0].content);
        expect(response2.body.postId).toBe(testPost._id);
        expect(response2.body.ownerId).toBe(testUser._id);
    });

    //TODO: Move to auth tests
    const badToken = "eyJ77GciOiJIUzI1NaIsInR5cCI6IkpXVCJ1.eyJfaWQiOiI2NzY4MjkwMTFhYzI0ZGIzYmZlM2ZiNWMiLCJyYW5kb20iOiIwLjYyNTM4MzM4OTA1MTI3MDgiLCJpYXQiOjE3MzQ4Nzk0OTEsImV4cCI6MTczNDg5MDI5MX0.aRqcIk088ub-vIxq84T_YaGrMijdpxK_Kdfm7Wf4OuI"
    
    test("Test fail Update Comment - Bad Token", async () => {
        const response = await request(app).put("/comments/" + commentId).send(commentsMock[1]).set(
            { authorization: "JWT " + badToken }
        );
        // Forbbiden.
        expect(response.statusCode).toBe(401);
        
        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
        expect(response2.body.content).toBe(commentsMock[0].content);
        expect(response2.body.postId).toBe(testPost._id);
        expect(response2.body.ownerId).toBe(testUser._id);
    });

    test("Test fail Update Comment - User Doesnt ownes the comment", async () => {
        const response = await request(app).put("/comments/" + commentId).send({content: commentsMock[1].content}).set(
            { authorization: "JWT " + testUser2.accessToken }
        );
        // Forbbiden.
        expect(response.statusCode).toBe(403);
        
        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
        expect(response2.body.content).toBe(commentsMock[0].content);
        expect(response2.body.postId).toBe(testPost._id);
        expect(response2.body.ownerId).toBe(testUser._id);
    });

    test("Test success Update Comment", async () => {
        const response1 = await request(app).post("/posts").send(postsMock[1]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response1.statusCode).toBe(201);
        const postId = response1.body._id;
        const response2 = await request(app).put("/comments/" + commentId).send({...commentsMock[1], postId}).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
        expect(response2.body.content).toBe(commentsMock[1].content);
        expect(response2.body.postId).toBe(postId);
        expect(response2.body.ownerId).toBe(testUser._id);
    });

    test("Test fail Delete Comment - Bad Token", async () => {
        const response = await request(app).delete("/comments/" + commentId).set(
            { authorization: "JWT " + badToken }
        );
        expect(response.statusCode).toBe(401);

        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
    });

    test("Test fail Delete Comment - User Doesnt ownes the comment", async () => {
        const response = await request(app).delete("/comments/" + commentId).set(
            { authorization: "JWT " + testUser2.accessToken }
        );
        expect(response.statusCode).toBe(403);

        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
    });

    test("Test fail Delete Comment - Non Exsisting Id", async () => {
        const response = await request(app).delete("/comments/" + NonExsistcommentId ).set(
            { authorization: "JWT " + testUser.accessToken }
        );

        // No such commentId
        expect(response.statusCode).toBe(404);
    });

    test("Test fail Delete Comment - Internal Server Error - Bab comment Id", async () => {
        const response = await request(app).delete("/comments/" + BadCommentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );

        // Mal Formmated commentId
        expect(response.statusCode).toBe(500);
    });

    test("Test success Delete Comment", async () => {
        const response = await request(app).delete("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(404);
    });
});