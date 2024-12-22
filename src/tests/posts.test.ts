import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { Express } from "express";
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
    await userModel.deleteMany();
    await request(app).post("/auth/register").send(testUser);
    const loginRes = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = loginRes.body.accessToken;
    testUser.refreshToken = loginRes.body.refreshToken;
    testUser._id = loginRes.body._id;
    // commentsMock[0].ownerId = testUser._id;
    postsMock[0].ownerId = testUser._id;
});

afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
});

let postId = "";

describe("Posts Tests", () => {
    test("Posts test get all", async () => {
        const response = await request(app).get("/posts").set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(0);
    });
    test("Test Create Post", async () => {
        const response = await request(app).post("/posts").set(
            { authorization: "JWT " + testUser.accessToken }
        ).send(postsMock[0]);
        expect(response.statusCode).toBe(201);
        expect(response.body.content).toBe(postsMock[0].content);
        expect(response.body.title).toBe(postsMock[0].title);
        expect(response.body.ownerId).toBe(postsMock[0].ownerId);
        postId = response.body._id;
    });
    test("Posts get by id", async () => {
        const response = await request(app).get("/posts/" + postId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(postsMock[0].content);
        expect(response.body.title).toBe(postsMock[0].title);
        expect(response.body.ownerId).toBe(postsMock[0].ownerId);
    });

    test("Test get post by senderId", async () => {
        const response = await request(app).get("/posts?sender=" + postsMock[0].ownerId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].content).toBe(postsMock[0].content);
        expect(response.body[0].title).toBe(postsMock[0].title);
        expect(response.body[0].ownerId).toBe(postsMock[0].ownerId);
    });

    test("Test get post by senderId- bad Request", async () => {
        const response = await request(app).get("/posts?sender=" + postsMock[0].title).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(400);
    });

    const expiredToken = "eyJhbGciOiJIUzI1NaIsInR5cCI6IkpXVCJ1.eyJfaWQiOiI2NzY4MjkwMTFhYzI0ZGIzYmZlM2ZiNWMiLCJyYW5kb20iOiIwLjYyNTM4MzM4OTA1MTI3MDgiLCJpYXQiOjE3MzQ4Nzk0OTEsImV4cCI6MTczNDg5MDI5MX0.aRqcIk088ub-vIxq84T_YaGrMijdpxK_Kdfm7Wf4OuI"
    
    test("Test fail Update Post", async () => {
        const response = await request(app).put("/posts/" + postId).send(postsMock[0]).set(
            { authorization: "JWT " + expiredToken }
        );
        // No such postId
        expect(response.statusCode).not.toBe(200);
    });

    const BadPostId = 5
    test("Test fail Update Post - Internal Server Error", async () => {
        const response = await request(app).put("/posts/" + BadPostId ).send(postsMock[0]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        // No such postId
        expect(response.statusCode).toBe(500);
    });

    test("Test success Update Post", async () => {
        const response = await request(app).put("/posts/" + postId).send({...postModel[0]}).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
    });
});