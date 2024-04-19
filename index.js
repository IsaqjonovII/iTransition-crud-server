const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");
const authRoutes = require("./src/routes/auth");
const mongoose = require("mongoose");
require("dotenv/config");

fastify.register(cors);
fastify.register(authRoutes, { prefix: "/api/v0/user" });
fastify.get("/", (_, reply) => {
    reply.send("Hello dude!")
});

mongoose
    .connect(process.env.DB_URI)
    .then(() => console.log("Connected to DB"))
    .catch((error) => console.error(`This happened: ${error}`));


(() => {
    try {
        //  , host: "0.0.0.0"
        fastify.listen({ port: process.env.PORT || 8000 }, function (err, address) {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            fastify.log.info(`Server is now listening on ${address}`);
        }
        );
    } catch (error) {
        fastify.log.error(error);
    }
})();