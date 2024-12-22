import { initApp } from "./server";
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"

const port = process.env.PORT;

initApp().then((app) => {
    if (process.env.NODE_ENV == "development") {
        const options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "REST API - Sagi&Yael Backend",
                    version: "1.0.0",
                    description: "REST server including authentication using JWT",
                },
                servers: [{ url: `http://localhost:${port}`, },],
            },
            apis: ["./src/docs/*.ts"],
        };
        const specs = swaggerJsDoc(options);
        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
    }

    app.listen(port, () => {
        console.log(`Server listening at http://localhost:${port}`);
    });
});