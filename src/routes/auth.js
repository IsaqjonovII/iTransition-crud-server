const { createUser, loginUser, deleteUser } = require("../controllers/user.controller");

async function routes(fastify) {
    fastify.post("/auth/register", createUser);
    fastify.post("/auth", loginUser);
    fastify.delete("/", deleteUser);
}

module.exports = routes;