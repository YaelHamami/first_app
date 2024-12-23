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

var app: Express;

const testUser: User = {
    userName: "sagiezra",
    email: "test@user.com",
    password: "testpassword",
}

beforeAll(async () => {
    console.log("beforeAll");
    app = await initApp();
    await postModel.deleteMany();
    await commentModel.deleteMany();
    await userModel.deleteMany();
    await request(app).post("/auth/register").send(testUser);
    const loginRes = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = loginRes.body.accessToken;
    testUser.refreshToken = loginRes.body.refreshToken;
    testUser._id = loginRes.body._id;
    commentsMock[0].ownerId = testUser._id;
    postsMock[0].ownerId = testUser._id;
});

afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
});

let commentId = "";

describe("Comments Tests", () => {
    test("Comments test get all", async () => {
        const response = await request(app).get("/comments").set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });
    test("Test Create Comment", async () => {
        const response = await request(app).post("/comments").set(
            { authorization: "JWT " + testUser.accessToken }
        ).send(commentsMock[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe(commentsMock[0].content);
        expect(response.body.postId).toBe(commentsMock[0].postId);
        expect(response.body.ownerId).toBe(commentsMock[0].ownerId);
        commentId = response.body._id;
    });
    test("Comments get by id", async () => {
        const response = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(commentsMock[0].content);
        expect(response.body.postId).toBe(commentsMock[0].postId);
        expect(response.body.ownerId).toBe(commentsMock[0].ownerId);
    });

    test("Test get comments by postId", async () => {
        const response = await request(app).get("/comments?postId=" + commentsMock[0].postId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe(commentsMock[0].content);
        expect(response.body[0].postId).toBe(commentsMock[0].postId);
        expect(response.body[0].ownerId).toBe(commentsMock[0].ownerId);
    });

    test("Test get comment by postID- bad Request", async () => {
        const response = await request(app).get("/comments?postId=" + commentsMock[0].content).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(500);
    });

    const BadCommentId = 5
    test("Test fail Update Comment - Internal Server Error", async () => {
        const response = await request(app).put("/comments/" + BadCommentId ).send(commentsMock[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        // No such postId
        expect(response.statusCode).toBe(500);
    });

    test("Test fail Update Comment", async () => {
        const response = await request(app).put("/comments/" + commentId).send(commentsMock[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        // such postId does not exist
        expect(response.statusCode).toBe(404);
    });

    test("Test success Update Comment", async () => {
        const response1 = await request(app).post("/posts").send(postsMock[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response1.statusCode).toBe(201);
        const postId = response1.body._id;
        const response2 = await request(app).put("/comments/" + commentId).send({...commentsMock[0], postId}).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
    });

    test("Test fail Delete Comment", async () => {
        const response = await request(app).delete("/comments/" + commentId).set(
            { authorization: "JWT " + "eyJhbGciOiJIUzI1NaIsInR5cCI6IkpXVCJ1.eyJfaWQiOiI2NzY4MjkwMTFhYzI0ZGIzYmZlM2ZiNWMiLCJyYW5kb20iOiIwLjYyNTM4MzM4OTA1MTI3MDgiLCJpYXQiOjE3MzQ4Nzk0OTEsImV4cCI6MTczNDg5MDI5MX0.aRqcIk088ub-vIxq84T_YaGrMijdpxK_Kdfm7Wf4OuI" }
        );
        expect(response.statusCode).toBe(401);
        const response2 = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
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