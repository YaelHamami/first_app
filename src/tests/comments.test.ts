import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { commentModel } from "../models/comments_model";
import { Express } from "express";
import testComments from "./commentsMock.json";
import userModel from "../models/users_model";
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
        ).send(testComments[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe(testComments[0].content);
        expect(response.body.postId).toBe(testComments[0].postId);
        expect(response.body.owner).toBe(testComments[0].owner);
        commentId = response.body._id;
    });
    test("Comments get by id", async () => {
        const response = await request(app).get("/comments/" + commentId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(testComments[0].content);
        expect(response.body.postId).toBe(testComments[0].postId);
        expect(response.body.owner).toBe(testComments[0].owner);
    });

    test("Test get comments by postId", async () => {
        const response = await request(app).get("/comments?postId=" + testComments[0].postId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe(testComments[0].content);
        expect(response.body[0].postId).toBe(testComments[0].postId);
        expect(response.body[0].owner).toBe(testComments[0].owner);
    });

    test("Test Update Comment", async () => {
        const response = await request(app).put("/comments/" + commentId).send(testComments[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        // such postId does not exist
        expect(response.statusCode).toBe(404);
    });


    test("Test Delete Comment", async () => {
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