import request from "supertest";
import { initApp } from "../server";
import mongoose from "mongoose";
import { userModel } from "../models/users_model";
import { Express } from "express";
import { User } from "./common";
import { postModel } from "../models/posts_model";
import usersMock from "./usersMock.json";


var app: Express;

const testUser: User = {
    userName: usersMock[0].userName,
    email: usersMock[0].email,
    password: usersMock[0].password,
}

const unAuthorizedToken = "eyJhbGciOiJIUzI1NaIsInR5cCI6IkpXVCJ1.eyJfaWQiOiI2NzY4MjkwMTFhYzI0ZGIzYmZlM2ZiNWMiLCJyYW5kb20iOiIwLjYyNTM4MzM4OTA1MTI3MDgiLCJpYXQiOjE3MzQ4Nzk0OTEsImV4cCI6MTczNDg5MDI5MX0.aRqcIk088ub-vIxq84T_YaGrMijdpxK_Kdfm7Wf4OuI"

beforeAll(async () => {
    console.log("beforeAll");
    app = await initApp();
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

describe("Users Tests", () => {
    test("Users test get all", async () => {
        const response = await request(app).get("/users").set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
    });
    
    test("Succses Users get by id", async () => {
        const response = await request(app).get("/users/" + testUser._id).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        console.log(response.body)
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(usersMock[0].email);
        expect(response.body.userName).toBe(usersMock[0].userName);
    });

    const nonExistingId = "674df5c81b3fe9863591b29a"
    test("Users get by non existing id", async () => {
        const response = await request(app).get("/users/" + nonExistingId).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).not.toBe(200);
    });

    test("Test fail Update User", async () => {
        const response = await request(app).put("/users/" + testUser._id).send(usersMock[0]).set(
            { authorization: "JWT " + unAuthorizedToken }
        );
        // not authorized token
        expect(response.statusCode).toBe(401);
    });

    test("Test success Update User", async () => {
        const response = await request(app).put("/users/" + testUser._id).send(usersMock[1]).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
    });

    test("Test fail Delete User", async () => {
        const response = await request(app).delete("/users/" + testUser._id).set(
            { authorization: "JWT " + unAuthorizedToken }
        );
        expect(response.statusCode).toBe(401);
        const response2 = await request(app).get("/users/" + testUser._id).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(200);
    });


    test("Test Delete User", async () => {
        const response = await request(app).delete("/users/" + testUser._id).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response.statusCode).toBe(200);
        const response2 = await request(app).get("/users/" + testUser._id).set(
            { authorization: "JWT " + testUser.accessToken }
        );
        expect(response2.statusCode).toBe(404);
    });
});